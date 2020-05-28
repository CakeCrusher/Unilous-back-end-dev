// const User = require('../models/user')
// const Notification = require('../models/notification')
// const Post = require('../models/post')
// const Skill = require('../models/skill')
const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const JWT_SECRET = process.env.JWT_SECRET
const { UserInputError, AuthenticationError } = require('apollo-server-express')
const db = require("../db")

const { populateUserById } = require('../models/user')
const { populatePostById } = require('../models/post')
const { populateNotificationById } = require('../models/notification')

module.exports = {
    Mutation: {
        askQuestion: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }

            const query = `INSERT INTO notification (userfrom_id, userto_id, post_id, question) VALUES ($1, $2, $3, $4) RETURNING *;`
            const values = [args.userFromId, args.userToId, args.postId, args.question]

            const notification = (await db.query(query, values)).rows[0];
            return await populateNotificationById(notification._id)
        },
        answerQuestion: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }

            const query = `UPDATE notification SET answer=$1, accepted=$2 WHERE id=$3 RETURNING *;`
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
                const createNotificationQuery = `INSERT INTO notification (userfrom_id, userto_id, post_id, question) VALUES ($1, $2, $3, $4) RETURNING *;`
                const createNotificationValues = [args.userFromId, args.userToId, args.postId, args.message]
                newNotification = (await db.query(createNotificationQuery, createNotificationValues)).rows[0]
            }
            else
            {
                const createNotificationQuery = `INSERT INTO notification (userfrom_id, userto_id, question) VALUES ($1, $2, $3) RETURNING *;`
                const createNotificationValues = [args.userFromId, args.userToId, args.message]
                newNotification = (await db.query(createNotificationQuery, createNotificationValues)).rows[0]
            }
            return await populateNotificationById(newNotification._id)
        },
        acceptNotification: async (root, args, context) => {
            // if (!context.currentUser) {
            //     throw new AuthenticationError('not authenticated')
            // }

            try {
                await db.query('BEGIN')
                const notificationJoinQuery = `SELECT * FROM notification P INNER JOIN proposedcontribution C ON C.notification_id = P._id WHERE P._id=$1`
                const notificationJoinValues = [args.notificationId]
                const notification = (await db.query(notificationJoinQuery, notificationJoinValues)).rows;
                if (true || notification.proposedContribution.length) {
                    const postQuery = `SELECT * FROM user_posts P INNER JOIN post_skills C ON C.post_id = P._id WHERE P._id=$1;`
                    const values = [notification.post_id]
                    const post = (await db.query(postQuery, values)).rows;
                    const newFill = []
                    // TODO switch to new fill model
                    for (const i in post) {
                        const updateSkillQuery = `UPDATE post_skills SET filled=$1 WHERE _id=$2;`
                        const updateSkillValues = []
                        newFill.push(post[i].filled + notification[i].type)
                    }

                    const teamUpdateQuery = `INSERT INTO team (user_id) VALUES ($1) RETURNING *;`
                    const teamUpdateValues = [notification[0].userfrom_id]
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
                var skill = (await db.query(skillQuery, skillValues)).args
                if (skill.rowCount == 0) {
                    const insertSkillQuery = `INSERT INTO skills (name) VALUES ($1) RETURNING *;`
                    const insertSkillValues = [args.skill.toLowerCase()]
                    skill = (await db.query(insertSkillQuery, insertSkillValues)).args[0]
                } else {
                    skill = skill.args[0]
                    const updateSkillQuery = `UPDATE skills SET uses = uses + 1 WHERE _id=$1;`
                    const updateSkillValues = [skill._id]
                    await db.query(updateSkillQuery, updateSkillValues)
                }

                const primarySkillsQuery =  `INSERT INTO user_primary_skills (user_id, skill_id) VALUES ($1, $2);`
                const primarySkillsValues = [args.user, skill._id]
                await db.query(primarySkillsQuery, primarySkillsValues)
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
            const userQuery = `SELECT * FROM user_account WHERE _id = $1;`
            const userValues = [args.user]
            const user = (await db.query(userQuery, userValues)).args[0]

            const skillQuery = `SELECT * FROM skills WHERE name=$1`
            const skillValues = [args.skill.toLowerCase()]
            var skill = (await db.query(skillQuery, skillValues)).args
            if (skill.args.length == 0) {
                const insertSkillQuery = `INSERT INTO skills (name) VALUES ($1) RETURNING *;`
                const insertSkillValues = [args.skill.toLowerCase()]
                skill = (await db.query(insertSkillQuery, insertSkillValues)).args[0]
            } else {
                skill = skill.args[0]
                const updateSkillQuery = `UPDATE skills SET uses = uses + 1 WHERE _id=$1;`
                const updateSkillValues = [skill._id]
                await db.query(updateSkillQuery, updateSkillValues)
            }

            const primarySkillsQuery =  `INSERT INTO user_secondary_skills (user_id, skill_id) VALUES ($1, $2);`
            const primarySkillsValues = [args.user, skill._id]
            await db.query(primarySkillsQuery, primarySkillsValues)
            return await populateUserById(user._id)
        },
        savePostToUser: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const addSavedPostQuery =  `INSERT INTO user_saved_posts (user_id, post_id) VALUES ($1, $2) RETURNING *;`
            const addSavedPostValues = [args.user, args.postId]
            await db.query(addSavedPostQuery, addSavedPostValues)
            return await populateUserById(args.user)
         },
        removeSavedPost: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }

            const query = `DELETE FROM user_posts WHERE _id=$1, is_saved=true RETURNING *;`
            const values = [args.postId]
            const result = await db.query(query, values)
            return result.args.length > 0 ? 'post removed from saved posts' : 'post was not removed'
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

            const postQuery = `INSERT INTO user_posts (user_id, title, contact_link, time, description, color) VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *;`
            const postValues = [args.user, args.title, args.contactLink, args.description, args.color]
            const post = (await db.query(postQuery, postValues)).rows[0]
            
            for (let imagelink of args.imageLinks) {
                await db.query(`INSERT INTO imageLinks (type, user_id, post_image_link_id )  VALUES($1, $2, $3)`,[imagelink,args.user,post._id]);
            };

            for (let referncelink of args.referenceLinks) {
                await db.query(`INSERT INTO referenceLinks (type, user_id, post_reference_link_id )  VALUES($1, $2, $3)`,[referncelink,args.user,post._id]);
            };
            
            for(var i = 0; i < args.skillNames.length; i++) {
                // Get skill if it exists
                const skillQuery = `SELECT * FROM skills WHERE name=$1;`
                const skillValues = [args.skillNames[i].toLowerCase()]
                var foundSkill = await db.query(skillQuery, skillValues)

                // If skill does not exist, add skill
                if(foundSkill.rowCount == 0){
                    const insertSkillQuery = `INSERT INTO skills (name) VALUES ($1) RETURNING *;`
                    const insertSkillValues = [skill.toLowerCase()]
                    foundSkill = await db.query(insertSkillQuery, insertSkillValues)
                }

                // Increment uses
                const updateUsesQuery = `UPDATE skills SET uses = uses + 1 WHERE _id = $1;`
                const updateUsesValues = [foundSkill.rows[0]._id]
                await db.query(updateUsesQuery, updateUsesValues)

                const insertPostSkillQuery = `INSERT INTO post_skills (skill_id, post_id, needed, filled) VALUES ($1, $2, $3, $4) RETURNING *;`
                const insertPostSkillValues = [foundSkill.rows[0]._id, post._id, args.neededSkills[i], args.filledSkills[i]];
                await db.query(insertPostSkillQuery, insertPostSkillValues)
            }

            return await populatePostById(post._id)
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