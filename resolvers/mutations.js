const User = require('../models/user')
const Notification = require('../models/notification')
const Post = require('../models/post')
const Skill = require('../models/skill')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError } = require('apollo-server-express')

module.exports = {
    Mutation: {
        askQuestion: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const userFrom = await User.findById(args.userFromId)
            const userTo = await User.findById(args.userToId)
            const post = await Post.findById(args.postId)

            const newNotification = new Notification ({
                    userFrom,
                    userTo,
                    post,
                    question: args.question
                })
            await newNotification.save()
                .catch(error => {
                    throw new UserInputError(error)  
                })
            await User.update({_id: args.userFromId}, {notifications: userFrom.notifications.concat(newNotification)}, {upsert: true})
            await User.update({_id: args.userToId}, {notifications: userTo.notifications.concat(newNotification)}, {upsert: true})
            
            return newNotification.populate(['userFrom', 'userTo', 'post'])
        },
        answerQuestion: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            await Notification.updateOne({_id: args.notificationId}, {answer: args.response, accepted: true}, {upsert: true})
            const notification = await Notification.findById(args.notificationId).populate(['userFrom', 'userTo', 'post'])
            return notification
        },
        makeNotification: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const userFrom = await User.findById(args.userFromId)
            const userTo = await User.findById(args.userToId)
            const post = args.postId ? await Post.findById(args.postId) : null

            const newNotification = post ?
                new Notification({
                    userFrom,
                    userTo,
                    message: args.message,
                    post,
                    proposedContribution: args.proposedContribution
                })
                :
                new Notification({
                    userFrom,
                    userTo,
                    message: args.message,
                    accepted: true,
                })

            await newNotification.save()
                .catch(error => {
                    throw new UserInputError(error)    
                })
            await User.update({_id: args.userFromId}, {notifications: userFrom.notifications.concat(newNotification)}, {upsert: true})
            await User.update({_id: args.userToId}, {notifications: userTo.notifications.concat(newNotification)}, {upsert: true})
            
            return newNotification.populate(['userFrom', 'userTo', 'post'])
        },
        acceptNotification: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            await Notification.updateOne({_id: args.notificationId}, {accepted: true}, {upsert: true})
            const notification = await Notification.findById(args.notificationId).populate(['userFrom', 'userTo', 'post'])
            if (notification.proposedContribution.length) {
                const post = await Post.findById(notification.post._id)
                const newFill = []
                for (const i in post.skillFills) {
                    newFill.push(post.skillFills[i] + notification.proposedContribution[i])
                }
                await Post.updateOne({_id: notification.post._id}, {team: post.team.concat(notification.userFrom.username), skillFills: newFill}, {upsert: true})
            }
            return notification
        },
        declineNotification: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            await Notification.updateOne({_id: args.notificationId}, {accepted: false}, {upsert: true})
            const notification = await Notification.findById(args.notificationId).populate(['userFrom', 'userTo', 'post'])
            return notification
        },
        createUser: async (root, args) => {
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(args.password, saltRounds)
            const newUser = new User({
                username: args.username,
                password: hashedPassword,
                referenceLink: args.referenceLink
            })
            
            await newUser.save()
                .catch(error => {
                    throw new UserInputError(error)
                })
            return newUser.populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
        },
        addPrimarySkill: async (root, args) => {
            const user = await User.findById(args.user)
            let isSkill = await Skill.findOne({name: args.skill.toLowerCase()})
            if (!isSkill) {
                const newSkill = new Skill({
                    name: args.skill.toLowerCase(),
                    uses: 1
                })
                await newSkill.save()
                    .catch(error => console.log(error))
                isSkill = await Skill.findOne({name: args.skill.toLowerCase()})
            } else {
                await Skill.update({name: args.skill.toLowerCase()}, {uses: isSkill.uses + 1}, {upsert: true})
            }
            await User.update({_id: args.user}, {primarySkills: user.primarySkills.concat(isSkill)}, {upsert: true})
            const updatedUser = await User.findById(args.user).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
            return updatedUser
        },
        addSecondarySkill: async (root, args) => {
            const user = await User.findById(args.user)
            let isSkill = await Skill.findOne({name: args.skill.toLowerCase()})
            if (!isSkill) {
                const newSkill = new Skill({
                    name: args.skill.toLowerCase(),
                    uses: 1
                })
                await newSkill.save()
                    .catch(error => console.log(error))
                isSkill = await Skill.findOne({name: args.skill.toLowerCase()})
            } else {
                await Skill.update({name: args.skill.toLowerCase()}, {uses: isSkill.uses + 1}, {upsert: true})
            }
            await User.update({_id: args.user}, {secondarySkills: user.secondarySkills.concat(isSkill)}, {upsert: true})
            const updatedUser = await User.findById(args.user).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
            return updatedUser
        },
        addInterest: async (root, args) => {
            const user = await User.findById(args.user)
            await User.update({_id: args.user}, {interests: user.interests.concat(args.interest)}, {upsert: true})
            const updatedUser = await User.findById(args.user).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
            return updatedUser
        },
        savePostToUser: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const user = await User.findById(args.user)
            const postToAdd = await Post.findById(args.postId)
            await User.updateOne({_id: args.user}, {savedPosts: user.savedPosts.concat(postToAdd)}, {upsert: true})
            const updatedUser = await User.findById(args.user)
            return updatedUser.populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
        },
        removeSavedPost: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const user = await User.findById(args.user)
            const newSavedPosts = user.savedPosts.filter(pid => pid.toString() !== args.postId)
            
            await User.updateOne({_id: user._id}, {savedPosts: newSavedPosts}, {upsert: true})
            return 'post removed from saved posts'
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
            
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
            let allSkills = []
            for (const skill of args.skillNames) {
                const isSkill = await Skill.findOne({name: skill.toLowerCase()})
                if (!isSkill) {
                    const newSkill = new Skill({
                        name: skill.toLowerCase(),
                        uses: 1
                    })
                    await newSkill.save()
                        .catch(error => {
                            console.log('TEENY ERROR')
                            throw new UserInputError(error)  
                        })
                    allSkills.push(newSkill.name)
                } else {
                    await Skill.update({name: skill.toLowerCase()}, {uses: isSkill.uses + 1}, {upsert: true})
                    allSkills.push(isSkill.name)
                }
            }

            const user = await User.findById(args.user)
            const newPost = new Post({
                title: args.title,
                user: user,
                contactLink: args.contactLink,
                skillNames: allSkills,
                skillCapacities: args.skillCapacities,
                skillFills: args.skillFills,
                team: [],
                time: new Date(),
                description: args.description,
                color: args.color,
                imageLinks: args.imageLinks,
                referenceLinks: args.referenceLinks
            })
            // And again testing new skillAnd again testing new skillAnd again testing new skillAnd again testing new skillAnd again testing new skillAnd again testing new skillAnd again testing new skillAnd again testing new skillAnd again testing new skillAnd again testing new skillAnd again testing new skillAnd again testing new skillAnd again testing new skillAnd again testing new skill
            await User.updateOne({_id: args.user}, {posts: user.posts.concat(newPost)}, {upsert: true})
            const dupCL = await Post.find({contactLink: args.contactLink})
            const dupDescription = await Post.find({description: args.description})
            if (dupCL.length) {
                throw new UserInputError('duplicate contactLink')  
            }
            if (dupDescription.length) {
                throw new UserInputError('duplicate description')  
            }
            await newPost.save()
                .catch(error => {
                    throw new UserInputError(error)  
                })
            
            return newPost.populate(['user'])
        },
        deletePost: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const postToRemove = await Post.findById(args.postId).populate(['user'])
            const postMaker = await User.findById(postToRemove.user._id)
            const updatedPosts = postMaker.posts.filter(id => id.toString() !== args.postId)
            await User.updateOne({_id: postMaker._id}, {posts: updatedPosts}, {upsert: true})

            await Post.deleteOne({_id: args.postId})
            return 'post successfully deleted'
        },
        addSkill: async (root, args) => {
            const newSkill = new Skill({
                name: args.name.toLowerCase(),
                uses: 1
            })

            await newSkill.save()
                .catch(error => console.log(error))

            return newSkill
        }

    }
}