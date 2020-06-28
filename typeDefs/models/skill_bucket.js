module.exports = `
type SkillBucket {
    _id: ID!
    skill: Skill!
    skill_help_needed: String!
    collaborators: [User!]!
}`