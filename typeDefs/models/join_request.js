module.exports = `
type JoinRequest {
    _id: ID!
    date: String!
    user_from: User!
    post: Post!
    skill_joining: SkillBucket!
    message: String!
    accepted: Boolean
    reason: String
}
`