module.exports = `
type Post
{
  _id: ID!
  title: String!
  user: User!
  skills: [SkillBucket!]!
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