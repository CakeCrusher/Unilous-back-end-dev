const { gql } = require('apollo-server-express')

const typeDefs = gql`
type User {
    username: String!
    password: String!
    email: String
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

module.exports = typeDefs