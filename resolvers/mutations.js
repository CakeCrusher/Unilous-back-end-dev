// const User = require('../models/user')
// const Notification = require('../models/notification')
// const Post = require('../models/post')
// const Skill = require('../models/skill')
const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const JWT_SECRET = process.env.JWT_SECRET
const { UserInputError, AuthenticationError } = require('apollo-server-express')
const db = require("../db")

module.exports = {
    Mutation: {
        askQuestion: async (root, args, context) => {
            // if (!context.currentUser) {
            //     throw new AuthenticationError('not authenticated')
            // }

            const query = `INSERT INTO notification (userfrom_id, userto_id, post_id, question) VALUES ($1, $2, $3, $4) RETURNING *;`
            const values = [args.userFromId, args.userToId, args.postId, args.question]

            const result = await db.query(query, values);

            const updateUserFromQuery = `UPDATE user_account SET userfrom_id=$1 WHERE id=$1;`
            const updateUserFromValues = [args.userFromId]

            await db.query(updateUserFromQuery, updateUserFromValues);

            const updateUserToQuery = `UPDATE user_account SET userto_id=$1 WHERE id=$1;`
            const updateUserToValues = [args.userToId]

            await db.query(updateUserToQuery, updateUserToValues);

            return result.rows[0]
        },
//         answerQuestion: async (root, args, context) => {
//             if (!context.currentUser) {
//                 throw new AuthenticationError('not authenticated')
//             }
//             await Notification.updateOne({_id: args.notificationId}, {answer: args.response, accepted: true}, {upsert: true})
//             const notification = await Notification.findById(args.notificationId).populate(['userFrom', 'userTo', 'post'])
//             return notification
//         },
//         makeNotification: async (root, args, context) => {
//             if (!context.currentUser) {
//                 throw new AuthenticationError('not authenticated')
//             }
//             const userFrom = await User.findById(args.userFromId)
//             const userTo = await User.findById(args.userToId)
//             const post = args.postId ? await Post.findById(args.postId) : null

//             const newNotification = post ?
//                 new Notification({
//                     userFrom,
//                     userTo,
//                     message: args.message,
//                     post,
//                     proposedContribution: args.proposedContribution
//                 })
//                 :
//                 new Notification({
//                     userFrom,
//                     userTo,
//                     message: args.message,
//                     accepted: true,
//                 })

//             await newNotification.save()
//                 .catch(error => {
//                     throw new UserInputError(error)    
//                 })
//             await User.update({_id: args.userFromId}, {notifications: userFrom.notifications.concat(newNotification)}, {upsert: true})
//             await User.update({_id: args.userToId}, {notifications: userTo.notifications.concat(newNotification)}, {upsert: true})
            
//             return newNotification.populate(['userFrom', 'userTo', 'post'])
//         },
//         acceptNotification: async (root, args, context) => {
//             if (!context.currentUser) {
//                 throw new AuthenticationError('not authenticated')
//             }
//             await Notification.updateOne({_id: args.notificationId}, {accepted: true}, {upsert: true})
//             const notification = await Notification.findById(args.notificationId).populate(['userFrom', 'userTo', 'post'])
//             if (notification.proposedContribution.length) {
//                 const post = await Post.findById(notification.post._id)
//                 const newFill = []
//                 for (const i in post.skillFills) {
//                     newFill.push(post.skillFills[i] + notification.proposedContribution[i])
//                 }
//                 await Post.updateOne({_id: notification.post._id}, {team: post.team.concat(notification.userFrom.username), skillFills: newFill}, {upsert: true})
//             }
//             return notification
//         },
//         declineNotification: async (root, args, context) => {
//             if (!context.currentUser) {
//                 throw new AuthenticationError('not authenticated')
//             }
//             await Notification.updateOne({_id: args.notificationId}, {accepted: false}, {upsert: true})
//             const notification = await Notification.findById(args.notificationId).populate(['userFrom', 'userTo', 'post'])
//             return notification
//         },
        createUser: async (root, args) => {
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(args.password, saltRounds)
            const query =  `INSERT INTO user_account (username, password, referenceLink) VALUES ($1, $2, $3) RETURNING *;`;
            const values = [args.username, hashedPassword, args.referenceLink]
    
            const result = await db.query(query, values);
            return result.rows[0]
        },
        //TODO 
        addPrimarySkill: async (root, args) => {
            const user = await User.findById(args.user)
            const skillQuery = `SELECT * FROM skillnames WHERE name=$1`
            const skillValues = [args.skill.toLowerCase()]
            const isSkill = await db.query(query, values)
            if (!isSkill) {
                const query = `INSERT INTO skillnames (name, uses) VALUES ($1, $2) RETURNING *;`
                const values = [args.skill.toLowerCase(), 1]
                await db.query(query, values)
                const newSkill = new Skill({
                    name: args.skill.toLowerCase(),
                    uses: 1
                })
                await newSkill.save()
                    .catch(error => console.log(error))
                isSkill = await Skill.findOne({name: args.skill.toLowerCase()})
            } else {
                const updateSkillQuery = ``
                await Skill.update({name: args.skill.toLowerCase()}, {uses: isSkill.uses + 1}, {upsert: true})
            }

            const userUpdateQuery = `UPDATE user_account SET  array_append()`
            await User.update({_id: args.user}, {primarySkills: user.primarySkills.concat(isSkill)}, {upsert: true})
            const updatedUser = await User.findById(args.user).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
            return updatedUser
        },
//         addSecondarySkill: async (root, args) => {
//             const user = await User.findById(args.user)
//             let isSkill = await Skill.findOne({name: args.skill.toLowerCase()})
//             if (!isSkill) {
//                 const newSkill = new Skill({
//                     name: args.skill.toLowerCase(),
//                     uses: 1
//                 })
//                 await newSkill.save()
//                     .catch(error => console.log(error))
//                 isSkill = await Skill.findOne({name: args.skill.toLowerCase()})
//             } else {
//                 await Skill.update({name: args.skill.toLowerCase()}, {uses: isSkill.uses + 1}, {upsert: true})
//             }
//             await User.update({_id: args.user}, {secondarySkills: user.secondarySkills.concat(isSkill)}, {upsert: true})
//             const updatedUser = await User.findById(args.user).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
//             return updatedUser
//         },
//         addInterest: async (root, args) => {
//             const user = await User.findById(args.user)
//             await User.update({_id: args.user}, {interests: user.interests.concat(args.interest)}, {upsert: true})
//             const updatedUser = await User.findById(args.user).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
//             return updatedUser
//         },
//         savePostToUser: async (root, args, context) => {
//             if (!context.currentUser) {
//                 throw new AuthenticationError('not authenticated')
//             }
//             const user = await User.findById(args.user)
//             const postToAdd = await Post.findById(args.postId)
//             await User.updateOne({_id: args.user}, {savedPosts: user.savedPosts.concat(postToAdd)}, {upsert: true})
//             const updatedUser = await User.findById(args.user)
//             return updatedUser.populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
//         },
//         removeSavedPost: async (root, args, context) => {
//             if (!context.currentUser) {
//                 throw new AuthenticationError('not authenticated')
//             }
//             const user = await User.findById(args.user)
//             const newSavedPosts = user.savedPosts.filter(pid => pid.toString() !== args.postId)
            
//             await User.updateOne({_id: user._id}, {savedPosts: newSavedPosts}, {upsert: true})
//             return 'post removed from saved posts'
//         },
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
            // if (!context.currentUser) {
            //     throw new AuthenticationError('not authenticated')
            // }

            const postQuery = `INSERT INTO user_posts (user_id, title, contact_link, time, description, color, image_links, reference_links, is_saved) VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8) RETURNING *;`
            const postValues = [args.user, args.title, args.contactLink, args.description, args.color, args.imageLinks, args.referenceLinks, 0]
            const post = (await db.query(postQuery, postValues)).rows[0]

            for(var i = 0; i < args.skillNames.length; i++) {
                // Get skill if it exists
                const skillQuery = `SELECT * FROM skills WHERE name=$1;`
                const skillValues = [args.skillNames[i].toLowerCase()]
                var foundSkill = await db.query(skillQuery, skillValues)

                // If skill does not exist, add skill
                if(foundSkill.length == 0){
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

            return post;
        },
        deletePost: async (root, args, context) => {
            // if (!context.currentUser) {
            //     throw new AuthenticationError('not authenticated')
            // }
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