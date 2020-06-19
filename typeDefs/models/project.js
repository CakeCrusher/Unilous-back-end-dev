module.exports = `
type Project {
    _id: ID!
    title: String!
    user: ID!
    contactLink: String!
    skillNames: [String!]!
    skillCapacities: [Int!]!
    skillFills: [Int!]!
    content: [Content!]!
    color: String!
}`