module.exports = `
type User {
    username: String!
    password: String!
    email: String
    referenceLink: String!
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
    proposedContribution: [ProposedCondition!]
    question: String
    answer: String
    accepted: Boolean
    _id: ID
}

type Post {
    title: String!
    user: User!
    contactLink: String
    team: [Team!]
    time: String!
    description: String!
    color: String!
    imageLinks: [ImageLinks!]
    referenceLinks: [ReferenceLinks!],
    isSavedPost: Int!,
    _id: ID
}

type Skill {
    name: String!
    uses: Int!
    _id: ID
}

type PostSkills{
    filled: Int!,
    needed: Int!,
    skill: Skill,
    _id: ID
}

type Team {
    type: String!,
    _id: ID
}

type ImageLinks {
    type: String!,
    _id: ID
}

type ReferenceLinks {
    type: String!,
    _id: ID
}

type ProposedCondition {
    type: Int!,
    _id: ID
}

type Token {
    value: String!
}

`;
