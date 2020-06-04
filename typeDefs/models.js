module.exports = `
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
    time: String!
    description: String!
    color: String!
    imageLinks: [String!]
    team: [String!]!
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
`;
