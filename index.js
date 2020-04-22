require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/user')
const Notification = require('./models/notification')
const Post = require('./models/post')
const Skill = require('./models/skill')
// const { UserInputError, AuthenticationError, ApolloServer, gql } = require('apollo-server')
const { UserInputError, AuthenticationError, ApolloServer, gql } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const cors = require('cors')

const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
    .then(console.log('Connected to MongoDB'))
    .catch(error => console.log(`Failed to establish connection: ${error}`))

const typeDefs = gql`
    type User {
        username: String!
        password: String!
        email: String!
        referenceLink: String!
        primarySkills: [Skill!]
        secondarySkills: [Skill!]
        interests: [String!]
        posts: [Post!]
        notifications: [Notification!]
        savedPosts: [Post!]
        _id: ID
    }

    type Notification {
        userFrom: User!
        userTo: User!
        message: String
        post: Post
        proposedContribution: [Int!]
        question: String
        answer: String
        accepted: Boolean
        _id: ID
    }

    type Post {
        title: String!
        user: User!
        contactLink: String
        skillNames: [String!]!
        skillCapacities: [Int!]!
        skillFills: [Int!]!
        team: [String!]
        time: String!
        description: String!
        color: String!
        imageLinks: [String!]
        referenceLinks: [String!]
        _id: ID
    }

    type Skill {
        name: String!
        uses: Int!
        _id: ID
    }

    type Token {
        value: String!
    }

    type Query {
        me: User
        searchAwaitingNotifs(
            userId: ID!
        ): Int!
        searchAnsweredQToPost(
            title: String!
        ): [Notification!]
        searchPosts(
            filterString: String!
            postIds: [String!]
            eventQuery: String
        ): [Post!]
        getListOfPosts(
            idList: [String]
        ): [Post]
        findPost(
            title: String!
        ): Post!
        findUser(
            username: String!
        ): User!
        allUsers: [User!]
        allPosts: [Post!]
        allSkills: [Skill!]
        skillSearch(
            filter: String!
        ): [Skill!]
        allNotifications: [Notification!]
        listOfNotifications(
            notifications: [String!]
        ): [Notification!]
    }

    type Mutation {
        askQuestion(
            userFromId: ID!
            userToId: ID!
            postId: ID!
            question: String!
        ): Notification
        answerQuestion(
            notificationId: ID!
            response: String!
        ): Notification
        makeNotification(
            userFromId: ID!
            userToId: ID!
            message: String!
            postId: ID
            proposedContribution: [Int!]
        ): Notification
        acceptNotification(
            notificationId: ID!
        ): Notification
        declineNotification(
            notificationId: ID!
        ): Notification
        createUser(
            username: String!
            password: String!
            email: String!
            referenceLink: String!
        ): User
        addPrimarySkill(
            user: ID!
            skill: String!
        ): User
        addSecondarySkill(
            user: ID!
            skill: String!
        ):User
        addInterest(
            user: ID!
            interest: String!
        ):User
        addNotificationToUser(
            user: ID!
            notification: ID!
        ):User
        savePostToUser(
            user: ID!
            postId: ID!
        ): User!
        removeSavedPost(
            user: ID!
            postId: ID!
        ): String!
        login(
            username: String!
            password: String!
        ): Token
        addPost(
            title: String!
            user: ID!
            contactLink: String!
            skillNames: [String!]!
            skillCapacities: [Int!]!
            skillFills: [Int!]!
            description: String!
            color: String!
            imageLinks: [String!]
            referenceLinks: [String!]
        ): Post!
        deletePost(
            postId: ID!
        ): String!
        addSkill(
            name: String!
        ): Skill!
        updateSkillUse(
            name: String!
        ): Skill!

    }
`


const resolvers = {
    Query: {
        searchAwaitingNotifs: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError('not authenticated')
            }
            const user = await User.findById(args.userId)
            const pendingNotifs = []
            for (const n of user.notifications) {
                const retrievedNotif = await Notification.findById(n).populate(['userFrom', 'userTo', 'post'])
                if (retrievedNotif && retrievedNotif.userFrom.username !== user.username && (retrievedNotif.proposedContribution.length || retrievedNotif.question) && retrievedNotif.accepted === undefined && !retrievedNotif.answer) {
                    pendingNotifs.push(retrievedNotif)
                }
            }
            return pendingNotifs.length

        },
        me: (root, args, context) => {
            return context.currentUser
        },
        searchAnsweredQToPost: async (root, args, context) => {
            const post = await Post.findOne({title: args.title}).populate(['user'])
            const correctNotifs = []
            for (const nid of post.user.notifications) {
                const notif = await Notification.findById(nid).populate(['userFrom', 'userTo', 'post'])
                if (notif && notif.answer && notif.post && notif.post.title === args.title) {
                    correctNotifs.push(notif)
                }
            }
            return correctNotifs
        },
        searchPosts: async (root, args) => {
            const eventQuery = args.eventQuery
            const eventKeys = () => {
                if (eventQuery === 'CODIV-19') {
                    return ['covid', 'coronavirus', 'outbreak', 'virus', 'emergency response']
                }
                if (eventQuery === '2020 Election') {
                    return ['election', 'democrat', 'republican', 'vote']
                }
                return null
            }
            let allPosts = await Post.find({}).populate(['user'])
            const filterString = args.filterString.toLowerCase()
            if (allPosts.length > 1) {
                const timeSortedTP = allPosts.sort((a, b) => a.time - b.time)
                const oldestTP = timeSortedTP[0]
                const newestTP = timeSortedTP[timeSortedTP.length - 1]
                const timeRange = newestTP.time - oldestTP.time
                const assignValue = (post) => {
                    if (post.skillFills.reduce((t, ins) => t = t + ins) === post.skillCapacities.reduce((t, ins) => t = t + ins)) return 0
                    let total = 0
                    if (post.title.toLowerCase().includes(filterString)) total = total + 10
                    for (const skill of post.skillNames) {
                        if (filterString.includes(skill)) total = total + 5
                    }
                    const fillValue = (post.skillFills.reduce((t, ins) => t = t + ins) - 1) * 3
                    total = total + fillValue
                    if (post.description.includes(filterString)) total = total + 4
                    const postRange = post.time - oldestTP.time
                    const postComparitiveTime = Math.abs((postRange / timeRange) - 1)
                    const timeFunction = 1 / (1 + Math.E ** (8 * postComparitiveTime - 5))
                    return total * timeFunction
                }
                allPosts = allPosts.map(p => [p, assignValue(p)])
                if (allPosts.length > 1) { allPosts = allPosts.sort((a, b) => b[1] - a[1]) }
                allPosts = allPosts.map(p => p[0])
            }
            let targetPosts = []
            const postConditions = (post, eventKeys) => {
                if (args.postIds.includes(post._id.toString())) return false
                if (eventKeys) {
                    for (const keyWord of eventKeys) {
                        if (post.description.toLowerCase().includes(keyWord) || post.title.toLowerCase().includes(keyWord)) {
                            if (post.title.toLowerCase().includes(filterString)) return true
                            for (const skill of post.skillNames) {
                                if (filterString.includes(skill)) return true
                            }
                        }
                    }
                    return false 
                }
                if (post.title.toLowerCase().includes(filterString)) return true
                for (const skill of post.skillNames) {
                    if (filterString.includes(skill)) return true
                }
                return false
            }
            for (const post of allPosts) {
                if (postConditions(post, eventKeys())) {
                    targetPosts.push(post)
                }
            }
            if (targetPosts.length > 6) { targetPosts = targetPosts.slice(0,6) }
            if (targetPosts.length > 1) return targetPosts
            if (targetPosts.length === 1) return targetPosts
            return null
        },
        getListOfPosts: async (root, args) => {
            let allPosts = []
            for (const ins of args.idList) {
                const retrievedPost = await Post.findById(ins).populate(['user'])
                allPosts.push(retrievedPost)
            }
            return allPosts
        },
        findPost: async (root, args) => {
            return Post.findOne({title: args.title}).populate(['user'])
        },
        findUser: (root, args) => {
            return User.findOne({username: args.username}).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
        },
        allUsers: (root, args) => {
            return User.find({}).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
        },
        allPosts: (root, args) => {
            return Post.find({}).populate(['user'])
        },
        allSkills: (root, args) => {
            return Skill.find({})
        },
        skillSearch: async(root, args) => {
            const allSkills = await Skill.find({})
            const filteredSkills = allSkills.filter(s => s.name.includes(args.filter))
            const sortedFS = filteredSkills.sort((s1, s2) => (s1.uses > s2.uses) ? -1 : 1)
            return sortedFS
        },
        allNotifications: (root, args) => {
            return Notification.find({}).populate(['userFrom', 'userTo', 'post'])
        },
        listOfNotifications: async (root, args) => {
            let allNotifications = []
            for (const i of args.notifications) {
                const retrievedNotification = await Notification.findById(i).populate(['userFrom', 'userTo', 'post'])
                allNotifications.push(retrievedNotification)
            }
            return allNotifications
        }
    },
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
                email: args.email,
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

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        const auth = req ? req.headers.authorization : null

        if (auth && auth.startsWith(`${JWT_SECRET} `)) {
            const token = jwt.verify(
                auth.substring(JWT_SECRET.length + 1), JWT_SECRET)
            const currentUser = await User.findById(token._id).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
            return { currentUser }
        } else {
            return { currentUser: null }
        }
    }
})

const app = express()
server.applyMiddleware({ app })

app.use(cors())

// server.listen().then(({ url }) => {
//     console.log(`Server ready at ${url}`)
// })
app.listen({ port: 4000 }, () => {
    console.log('Server running on http://localhost:4000' + server.graphqlPath);
})