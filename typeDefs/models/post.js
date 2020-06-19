module.exports = `
type Post
{
  _id: ID!
  title: String!
  user: User!
  skillNames: [String!]!
  skillCapacities: [Int!]!
  skillFills: [Int!]!
  team: [String!]
  time: String!
  content: [Content!]!
  color: String!
}

interface Content
{
  _id:ID!
  post:Post!
}

type ContentText implements Content
{
  _id:ID!
  post:Post!
  text:String!
}

type ContentImage implements Content
{
  _id:ID!
  post:Post!
  image: String!
}
`