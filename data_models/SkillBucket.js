const db = require('../db')
const DataClass = require('./DataClass')
const Post = require('./Post')
const Skill = require('./Skill')

class SkillBucket extends DataClass{
    constructor(id){
        super(id)

        return this.promiseDecorator(async () => {
            const query = `SELECT * FROM skill_bucket WHERE _id=$1`
            const values = [id]
            const db_skill_bucket = (await db.query(query, values)).rows[0]

            this.skill_help_needed = db_skill_bucket.skill_help_needed
            this._skill_id = db_skill_bucket.skill_id
            this._post_id = db_skill_bucket.post_id

            this.defineProperties()
        });
    }

    defineProperties(){
        Object.defineProperty(this, 'skill', {
            get: async function () {
                return await new Skill(this._skill_id)
            }
        });

        Object.defineProperty(this, 'post', {
            get: async function () {
                return await new Post(this._post_id)
            }
        });

        Object.defineProperty(this, 'collaborators', {
            get: async function () {
                const User = require('./User')
                const query = `SELECT user_id FROM post_collaborators WHERE skill_bucket_id=$1;`
                const values = [this._id]
                const collaborators = (await db.query(query, values)).rows.map(async collaborator => await new User(collaborator.user_id))
                return await Promise.all(collaborators);
            }
        });
    }
}

module.exports = SkillBucket