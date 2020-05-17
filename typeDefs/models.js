module.exports = `
type User {
    username: String!
    password: String!
    email: String
    referenceLink: String!
    primarySkills: [Skill!]
    secondarySkills: [Skill!]
    interests: [Interest!]
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
    skillNames: [SkillName!]!
    skillCapacities: [SkillCapacity!]!
    skillFills: [SkillFills!]!
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
type Interest {
    ineterst: String!,
    _id: ID
}

type SkillName {
    type: String!,
    _id: ID
}

type SkillFills {
    type: String!,
    _id: ID
}

type SkillCapacity {
    type: Int!,
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
