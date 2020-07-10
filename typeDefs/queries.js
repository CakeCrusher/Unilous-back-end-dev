module.exports = `
type Query {
    me: User
    searchAnsweredQToPost(
        title: String!
    ): [Notification!]
    searchPosts(
        filterString: String!
        postIds: [String!]
        eventQuery: String
    ): [Post!]
    getListOfPosts(
        idList: [ID!]
    ): [Post]
    findPost(
        title: String!
    ): Post!
    findUser(
        username: String!
    ): User!
    allUsers: [User!]
    someUsers(
        skip: Int!
        first: Int!
    ): [User!]
    allPosts: [Post!]
    allSkills: [Skill!]
    skillSearch(
        filter: String!
    ): [Skill!]
    allNotifications: [Notification!]
    userNotifications(
        user: ID!
    ): [Notification!]
    getUserPostJoinRequests(
        post_id: ID!
        user_id: ID!
    ): [JoinRequest!]
    getUserPostQuestions(
        post_id: ID!
        user_id: ID!
    ): [Question!]
}
`