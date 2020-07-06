const db = require('../db')
const DataClass = require('./DataClass')
const User = require('./User')
const SkillBucket = require('./SkillBucket')
const Post = require('./Post')

class JoinRequest extends DataClass{
    constructor(id){
        super(id)

        return this.promiseDecorator(async () => {
            const query = `SELECT * FROM join_request WHERE _id=$1`
            const values = [id]
            const db_join_request = (await db.query(query, values)).rows[0]

            this._user_from_id = db_join_request.user_from_id
            this._post_id = db_join_request.post_id
            this._skill_id = db_join_request.skill_id

            this.date = db_join_request.date
            this.message = db_join_request.message
            this.accepted = db_join_request.accepted
            this.reason = db_join_request.reason

            this.defineProperties()
        });
    }

    defineProperties(){
        Object.defineProperty(this, 'user_from', {
            get: async function () {
                return await new User(this._user_from_id)
            }
        });

        Object.defineProperty(this, 'post', {
            get: async function () {
                return await new Post(this._post_id)
            }
        });

        Object.defineProperty(this, 'skill_joining', {
            get: async function () {
                return await new SkillBucket(this._skill_id)
            }
        });
    }
}

module.exports = JoinRequest