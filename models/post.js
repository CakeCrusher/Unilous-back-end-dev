const db = require("../db");
const { populateUserById } = require('./user')

async function populatePostById(id){
    const query = `SELECT * FROM user_posts WHERE _id=$1`
    const values = [id]
    const post = (await db.query(query, values)).rows[0]

    const skillQuery = `SELECT * FROM skills P INNER JOIN post_skills C ON C.skill_id = P._id WHERE C.post_id=$1;`
    const skillValues = [post._id]
    const skillsResult = (await db.query(skillQuery, skillValues)).rows

    post.skillNames = []
    post.skillCapacities = []
    post.skillFills = []
    for(var i = 0; i < skillsResult.rows.length; i++){
        const skill = skillsResult.rows[i]
        post.skillFills.append(skill.name)
        post.skillCapacities.append(skill.needed)
        post.skillFills.append(skill.filled)
    }
    post.user = await populateUserById(post.user_id)
    return post
}

module.exports.populatePostById = populatePostById