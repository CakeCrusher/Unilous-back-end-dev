module.exports = `
type Notification {
    _id: ID!
    userFrom: User!
    userTo: User!
    message: String
    post: Post
    proposedContribution: [Int!]
    question: String
    answer: String
    accepted: Boolean
}`