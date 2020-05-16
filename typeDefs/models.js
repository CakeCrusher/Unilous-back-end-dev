module.exports = `
type User {
    id: Int!,
    username: String!,
    email: String,
    joined: String!,
    last_logged_in: String!,
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
    team: [String!]
    time: String!
    description: String!
    color: String!
    imageLinks: [String!]
    referenceLinks: [String!],
    isSavedPost: Int!,
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
