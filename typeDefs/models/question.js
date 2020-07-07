module.exports = `
type Question {
    _id: ID!
    date: String!
    user_from: User!
    post: Post!
    question: String!
    accepted: Boolean
    response: String
}
`