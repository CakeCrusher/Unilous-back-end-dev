// const User = require('../models/user')
// const Notification = require('../models/notification')
// const Post = require('../models/post')
// const Skill = require('../models/skill')
require("dotenv").config({ path: ".env-dev-pg" });
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const { UserInputError, AuthenticationError } = require('apollo-server-express')
const db = require("../db")

const { populateUserById, populatePostById, populateNotificationById } = require('../data_models')

module.exports = {
    Mutation: {
        askQuestion: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }

            const query = `INSERT INTO notification (userfrom_id, userto_id, post_id, question) VALUES ($1, $2, $3, $4) RETURNING _id;`
            const values = [args.userFromId, args.userToId, args.postId, args.question]

            const notification = (await db.query(query, values)).rows[0];
            return await populateNotificationById(notification._id)
        },
        answerQuestion: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }

            const query = `UPDATE notification SET answer=$1, accepted=$2 WHERE _id=$3;`
            const values = [args.response, true, args.notificationId]
            await db.query(query, values);
            return await populateNotificationById(args.notificationId)
        },
        makeNotification: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }

            const postQuery = `SELECT * FROM user_posts WHERE _id = $1;`
            const postValues = [args.postId]
            const post = (await db.query(postQuery, postValues)).rows

            var newNotification;
            if(post.length > 0)
            {
                const createNotificationQuery = `INSERT INTO notification (userfrom_id, userto_id, post_id, message) VALUES ($1, $2, $3, $4) RETURNING _id;`
                const createNotificationValues = [args.userFromId, args.userToId, args.postId, args.message]
                newNotification = (await db.query(createNotificationQuery, createNotificationValues)).rows[0]
            }
            else
            {
                const createNotificationQuery = `INSERT INTO notification (userfrom_id, userto_id, message) VALUES ($1, $2, $3) RETURNING _id;`
                const createNotificationValues = [args.userFromId, args.userToId, args.message]
                newNotification = (await db.query(createNotificationQuery, createNotificationValues)).rows[0]
            }
            return await populateNotificationById(newNotification._id)
        },
        acceptNotification: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }

            try {
                await db.query('BEGIN')
                const acceptNotificationQuery = `UPDATE notification SET accepted=$1 WHERE _id=$2 RETURNING *;`
                const acceptNotificationValues = [true, args.notificationId]
                const notification = (await db.query(acceptNotificationQuery, acceptNotificationValues)).rows[0];

                // TODO remove true and use proper proposed contrib
                if (true || notification.proposedContribution.length) {
                    const postQuery = `SELECT _id FROM user_posts WHERE _id=$1;`
                    const values = [notification.post_id]
                    const posts = (await db.query(postQuery, values)).rows;
                    // TODO switch to new fill model
                    for (const post in posts) {
                        const updateSkillQuery = `UPDATE post_skills SET filled=filled + 1 WHERE post_id=$1;`
                        const updateSkillValues = [post._id]
                        await db.query(updateSkillQuery, updateSkillValues)
                    }

                    const teamUpdateQuery = `INSERT INTO team (user_id, post_id) VALUES ($1, $2) RETURNING *;`
                    const teamUpdateValues = [notification.userfrom_id, notification.post_id]
                    await db.query(teamUpdateQuery, teamUpdateValues)
                }
                await db.query('COMMIT')
                return await populateNotificationById(args.notificationId);
            }
            catch(e)
            {
                await db.query('ROLLBACK')
                throw e
            }
        },
        declineNotification: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }

            const query = `UPDATE notification SET accepted=$1 WHERE _id=$2 RETURNING *;`
            const values = [false, args.notificationId]
            const notification = (await db.query(query, values)).rows[0];
            return await populateNotificationById(notification._id);          
        },
        createUser: async (root, args) => {
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(args.password, saltRounds)
            const query =  `INSERT INTO user_account (username, password, referenceLink) VALUES ($1, $2, $3) RETURNING *;`;
            const values = [args.username, hashedPassword, args.referenceLink]
    
            const user = (await db.query(query, values)).rows[0];
            return populateUserById(user._id)
        },
        addPrimarySkill: async (root, args) => {
            try {
                await db.query('BEGIN')

                const skillQuery = `SELECT * FROM skills WHERE name=$1`
                const skillValues = [args.skill.toLowerCase()]
                var skill = (await db.query(skillQuery, skillValues))
                if (skill.rowCount == 0) {
                    const insertSkillQuery = `INSERT INTO skills (name) VALUES ($1) RETURNING *;`
                    const insertSkillValues = [args.skill.toLowerCase()]
                    skill = (await db.query(insertSkillQuery, insertSkillValues)).rows[0];
                    const primarySkillsQuery =  `INSERT INTO user_primary_skills (user_id, skill_id) VALUES ($1, $2);`
                    const primarySkillsValues = [args.user, skill._id]
                    await db.query(primarySkillsQuery, primarySkillsValues)
                } else {
                    skill = skill.rows[0];
                    const isSkillsExists = `SELECT s.name FROM skills s INNER JOIN user_primary_skills up ON s._id = up.skill_id WHERE up.user_id=$1 AND up.skill_id=$2;`
                    const insertSkillValues = [args.user, skill._id];
                    const isRowExists = await db.query(isSkillsExists, insertSkillValues);
                    if(isRowExists.rowCount == 0) {
                      const primarySkillsQuery =  `INSERT INTO user_primary_skills (user_id, skill_id) VALUES ($1, $2);`
                      const primarySkillsValues = [args.user, skill._id]
                      await db.query(primarySkillsQuery, primarySkillsValues)
                    }
                    const updateSkillQuery = `UPDATE user_primary_skills SET uses = uses + 1 WHERE user_id=$1 AND skill_id=$2;`
                    const updateSkillValues = [args.user,skill._id]
                    await db.query(updateSkillQuery, updateSkillValues)
                }
                
                await db.query('COMMIT')
                return await populateUserById(args.user)
            } 
            catch(e)
            {
                await db.query('ROLLBACK')
                throw e
            }
            
        },
        addSecondarySkill: async (root, args) => {
            try {
                await db.query('BEGIN')

                const skillQuery = `SELECT * FROM skills WHERE name=$1`
                const skillValues = [args.skill.toLowerCase()]
                var skill = (await db.query(skillQuery, skillValues))
                if (skill.rowCount == 0) {
                    const insertSkillQuery = `INSERT INTO skills (name) VALUES ($1) RETURNING *;`
                    const insertSkillValues = [args.skill.toLowerCase()]
                    skill = (await db.query(insertSkillQuery, insertSkillValues)).rows[0];
                    const primarySkillsQuery =  `INSERT INTO user_secondary_skills (user_id, skill_id) VALUES ($1, $2);`
                    const primarySkillsValues = [args.user, skill._id]
                    await db.query(primarySkillsQuery, primarySkillsValues)
                } else {
                    skill = skill.rows[0];
                    const isSkillsExists = `SELECT s.name FROM skills s INNER JOIN user_secondary_skills up ON s._id = up.skill_id WHERE up.user_id=$1 AND up.skill_id=$2;`
                    const insertSkillValues = [args.user, skill._id];
                    const isRowExists = await db.query(isSkillsExists, insertSkillValues);
                    if(isRowExists.rowCount == 0) {
                      const primarySkillsQuery =  `INSERT INTO user_secondary_skills (user_id, skill_id) VALUES ($1, $2);`
                      const primarySkillsValues = [args.user, skill._id]
                      await db.query(primarySkillsQuery, primarySkillsValues)
                    }
                    const updateSkillQuery = `UPDATE user_primary_skills SET uses = uses + 1 WHERE user_id=$1 AND skill_id=$2;`
                    const updateSkillValues = [args.user,skill._id]
                    await db.query(updateSkillQuery, updateSkillValues)
                }
                
                await db.query('COMMIT')
                return await populateUserById(args.user)
            } 
            catch(e)
            {
                await db.query('ROLLBACK')
                throw e
            }
        },
        savePostToUser: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const addSavedPostQuery =  `UPDATE user_posts SET is_saved = true WHERE _id=$1 AND user_id=$2;`
            const addSavedPostValues = [args.postId, args.user]
            await db.query(addSavedPostQuery, addSavedPostValues)
            return await populateUserById(args.user)
         },
        removeSavedPost: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }

            const query = `UPDATE user_posts SET is_saved = false WHERE _id=$1 AND user_id=$2 AND is_saved=true;`
            const values = [args.postId, args.user]
            const result = await db.query(query, values)
            return result.rowCount > 0 ? 'post removed from saved posts' : 'post was not removed'
        },
        login: async (root, args) => {
            const query = `SELECT * FROM user_account WHERE username=$1`
            const values = [args.username]
            const user = (await db.query(query, values)).rows[0]
            
            const correctPassword = user ? await bcrypt.compare(args.password, user.password) : false
            
            if (!user || !correctPassword) {
                throw new AuthenticationError('failed login: wrong username or password')
            }

            const userForToken = {
                username: user.username,
                _id: user._id
            }
            return { value: jwt.sign(userForToken, JWT_SECRET) }
        },
        addPost: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }

            try {

            await db.query('BEGIN')

            const postQuery = `INSERT INTO user_posts (user_id, title, contact_link, time, description, color) VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *;`
            const postValues = [args.user, args.title, args.contactLink, args.description, args.color]
            const post = (await db.query(postQuery, postValues)).rows[0]
            
            if(args.imageLinks != null){
                for (let imageLink of args.imageLinks) {
                    await db.query(`INSERT INTO imageLinks (type, user_id, post_image_link_id )  VALUES($1, $2, $3)`,
                    [imageLink, args.user, post._id]);
                }
            }

            if(args.referenceLinks != null){
                for (let referenceLink of args.referenceLinks) {
                    await db.query(`INSERT INTO referenceLinks (type, user_id, post_reference_link_id )  VALUES($1, $2, $3)`,
                    [referenceLink, args.user, post._id]);
                }
            }
            
            for(var i = 0; i < args.skillNames.length; i++) {
                // Get skill if it exists
                const skillQuery = `SELECT _id FROM skills WHERE name=$1;`
                const skillValues = [args.skillNames[i].toLowerCase()]
                var foundSkill = await db.query(skillQuery, skillValues)

                // If skill does not exist, add skill
                if(foundSkill.rowCount == 0){
                    const insertSkillQuery = `INSERT INTO skills (name) VALUES ($1) RETURNING *;`
                    const insertSkillValues = skillValues
                    foundSkill = await db.query(insertSkillQuery, insertSkillValues)
                }
                else
                {
                    // Increment uses
                    const updateUsesQuery = `UPDATE post_skills SET uses = uses + 1 WHERE _id = $1;`
                    const updateUsesValues = [foundSkill._id]
                    await db.query(updateUsesQuery, updateUsesValues)
                }

                

                const insertPostSkillQuery = `INSERT INTO post_skills (skill_id, post_id, needed, filled) VALUES ($1, $2, $3, $4) RETURNING *;`
                const insertPostSkillValues = [foundSkill.rows[0]._id, post._id, args.neededSkills[i], args.filledSkills[i]];
                await db.query(insertPostSkillQuery, insertPostSkillValues)
            }

            await db.query('COMMIT')
            return await populatePostById(post._id)
                
            } catch (error) {
                await db.query('ROLLBACK')
                throw error
            }

            
        },
        deletePost: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const query = `DELETE FROM user_posts WHERE _id=$1;`
            const values = [args.postId]
            await db.query(query, values)
            return 'post successfully deleted'
        },
        addSkill: async (root, args) => {
            const query =  `INSERT INTO skills (name) VALUES ($1) RETURNING *;`;
            const values = [args.name.toLowerCase()]
    
            const result = await db.query(query, values);
            return result.rows[0]
        }

    }
}