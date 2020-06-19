module.exports = `
type User {
    _id: ID!
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
}
`;
