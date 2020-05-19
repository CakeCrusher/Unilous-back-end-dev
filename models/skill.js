const db = require("../db");

async function populateSkillById(id){
    const query = `SELECT * FROM skills WHERE _id=$1`
    const values = [id]
    const skill = (await db.query(query, values)).rows[0]
    return skill
}

module.exports.populateSkillById = populateSkillById