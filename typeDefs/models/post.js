module.exports = `
type Post
{
  _id: ID!
  title: String!
  user: ID!
  skillNames: [String!]!
  skillCapacities: [Int!]!
  skillFills: [Int!]!
  content: [Content!]!
  color: String!
}

interface Content
{
  _id:ID!
  postId:ID!
}

type ContentText implements Content
{
  _id:ID!
  postId:ID!
  text: String!
}

type ContentImage implements Content
{
  _id:ID!
  postId:ID!
  image: String!
}
`