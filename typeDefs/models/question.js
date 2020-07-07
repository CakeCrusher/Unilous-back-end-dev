module.exports = `
type Question {
    _id: ID!
    date: String!
    user_from: ID!
    post: ID!
    question: String!
    accepted: Boolean
    response: String
}
`