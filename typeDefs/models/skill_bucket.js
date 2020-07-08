module.exports = `
type SkillBucket {
    _id: ID!
    skill: Skill!
    skill_help_needed: Int!
    collaborators: [User!]!
}`