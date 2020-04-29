const User = require('../models/user')
const Notification = require('../models/notification')
const Post = require('../models/post')
const Skill = require('../models/skill')
const { AuthenticationError } = require('apollo-server-express')

module.exports = {
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
    }
}