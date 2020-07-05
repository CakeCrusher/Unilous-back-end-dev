module.exports = `
type JoinRequest {
    _id: ID!
    date: String!
    user_from: ID!
    post: ID!
    skill_joining: ID!
    message: String!
    accepted: Boolean
    reason: String
}
`