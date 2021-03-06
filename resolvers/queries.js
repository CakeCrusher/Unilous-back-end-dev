// const User = require('../models/user')
// const Notification = require('../models/notification')
// const Post = require('../models/post')
// const Skill = require('../models/skill')
const { AuthenticationError } = require('apollo-server-express')
const db = require("../db");
const User = require('../data_models/User')
const Post = require('../data_models/Post')
const Notification = require('../data_models/Notification')
const JoinRequest = require('../data_models/JoinRequest')
const Question = require('../data_models/Question')

module.exports = {
    Query: {
        me: (root, args, context) => {
            return context.currentUser
        },
        userNotifications: async (root, args, context) => {
            const user = await new User(args.user)
            return user.notifications
        },
        getUserPostJoinRequests: async (root, args, context) => {
            const query = `SELECT _id FROM join_request WHERE post_id=$1 AND user_from_id=$2;`
            const values = [args.post_id, args.user_id]
            let joinRequests = (await db.query(query, values)).rows.map(async joinRequest => await new JoinRequest(joinRequest._id))
            joinRequests = await Promise.all(joinRequests);

            const post = await new Post(args.post_id)
            const user = await post.user

            if(user._id == args.user_id){
                const query = `SELECT _id FROM join_request WHERE post_id=$1;`
                const values = [args.post_id]
                joinRequests = (await db.query(query, values)).rows.map(async joinRequest => await new JoinRequest(joinRequest._id))
                return await Promise.all(joinRequests);
            }

            return joinRequests

        },
        getUserPostQuestions: async (root, args, context) => {
            const query = `SELECT _id FROM question WHERE post_id=$1 AND user_from_id=$2;`
            const values = [args.post_id, args.user_id]
            let questions = (await db.query(query, values)).rows.map(async question => await new Question(question._id))
            questions = await Promise.all(questions);

            const post = await new Post(args.post_id)
            const user = await post.user

            if(user._id == args.user_id){
                const query = `SELECT _id FROM question WHERE post_id=$1;`
                const values = [args.post_id]
                questions = (await db.query(query, values)).rows.map(async question => await new Question(question._id))
                return await Promise.all(questions);
            }
            return questions;
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

            // NOTE will become very expensive after a large number of posts exist
            // currently limited to 100
            const query = `SELECT _id FROM user_posts ORDER BY time ASC LIMIT 100;`
            let allPosts = await Promise.all((await db.query(query)).rows.map(async post => await new Post(post._id)))
            // Resolve all posts
            allPosts = await Promise.all(allPosts);
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
                if (args.postIds != undefined && args.postIds.includes(post._id.toString())) return false
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
            targetPosts.map(async post => await new Post(post._id))
            if (targetPosts.length > 6) { targetPosts = targetPosts.slice(0,6) }
            if (targetPosts.length > 1) return targetPosts
            if (targetPosts.length === 1) return targetPosts
            return null
        },
        getListOfPosts: async (root, args) => {
            const params = []
            for(var i = 1; i <= args.idList.length; i++) {
                params.push('$' + i);
            }

            const query = 'SELECT _id FROM user_posts WHERE _id IN (' + params.join(',') + ')'
            const result = await db.query(query, args.idList)
            return result.rows.map(async post => await new Post(post._id))
        },
        findPost: async (root, args) => {
            const query = `SELECT _id FROM user_posts WHERE title=$1`
            const values = [args.title]
    
            const post = (await db.query(query, values)).rows[0]
            return await new Post(post._id)
        },
        findUser: async (root, args) => {
            const query = `SELECT _id FROM user_account WHERE username=$1`
            const values = [args.username]
            const user = (await db.query(query, values)).rows[0]
            return await new User(user._id)
        },
        allUsers: async (root, args) => {
            const userQuery = `SELECT _id FROM user_account;`
    
            const result = await db.query(userQuery)
            return result.rows.map(async user => new User(user._id))
        },
        someUsers: async (root, args) => {
            const userQuery = `SELECT _id FROM user_account;`

            const result = await db.query(userQuery)
            const allUsers =  await Promise.all(result.rows.map(async user => new User(user._id)))
            return allUsers.slice(args.skip, args.skip + args.first)
        },
        allPosts: async (root, args) => {
            const query = `SELECT _id FROM user_posts;`
    
            const result = await db.query(query)
            return result.rows.map(async post => await new Post(post._id))
        },
        allSkills: async (root, args) => {
            const query = `SELECT * FROM skills;`
    
            const result = await db.query(query)
            return result.rows
        },
        skillSearch: async (root, args) => {
            const query = `SELECT * FROM skills WHERE POSITION($1 in name)>0;`
            const values = [args.filter]
            const result = await db.query(query, values)
            return result.rows.sort((s1, s2) => (s1.uses > s2.uses) ? -1 : 1)
        },
        allNotifications: async (root, args) => {
            const query = `SELECT _id FROM notification;`
    
            const result = await db.query(query)
            const resolved = await Promise.all(await result.rows.map(async notification => await new Notification(notification._id)))
            return resolved
        },
    }
}