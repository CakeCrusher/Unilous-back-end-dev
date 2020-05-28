module.exports = `
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
        skill: String!
        user: ID!
        skill: ID!
    ): User
    addSecondarySkill(
        skill: String!
        user: ID!
        skill: ID!
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
        neededSkills: [Int!]!
        filledSkills: [Int!]!
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