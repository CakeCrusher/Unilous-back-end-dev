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
    createNotification(
        user_to: ID!
        user_from: ID!
        link: String!
        question: String
        skill_joining: ID
        message: String
        post: ID
    ): Notification!
    readNotification(
        notification: ID!
    ): Notification!
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
        skill: ID!
    ): User
    addSecondarySkill(
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
        skillCapacities: [Int!]!
        skillFills: [Int!]!
        content_types: [String!]!,
        content_data: [String!]!,
        color: String!
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
    createJoinRequest(
        user_from: ID!
        post: ID!
        skill_joining: ID!
        message: String!
    ): JoinRequest!
    acceptJoinRequest(
        joinRequest_id: ID!
        reason: String!
    ): JoinRequest!
    declineJoinRequest(
        joinRequest_id: ID!
        reason: String!
    ): JoinRequest!
}
`