module.exports = `
interface Notification {
    _id: ID!
    user_from: User!
    link: String!
    date: String!
    read: Boolean!
    post: Post!
}

type QuestionNotification implements Notification {
    _id: ID!
    user_from: User!
    link: String!
    date: String!
    read: Boolean!
    post: Post!
    question: String!
}
type JoinRequestNotification implements Notification {
    _id: ID!
    user_from: User!
    link: String!
    date: String!
    read: Boolean!
    post: Post!
    skill_joining: Skill!
    message: String!
}
`