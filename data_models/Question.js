const db = require('../db')
const DataClass = require('./DataClass')
const User = require('./User')
const Post = require('./Post')

class JoinRequest extends DataClass{
    constructor(id){
        super(id)

        return this.promiseDecorator(async () => {
            const query = `SELECT * FROM question WHERE _id=$1`
            const values = [id]
            const db_question = (await db.query(query, values)).rows[0]

            this._user_from_id = db_question.user_from_id
            this._post_id = db_question.post_id

            this.date = db_question.date
            this.question = db_question.message
            this.accepted = db_question.accepted
            this.response = db_question.reason

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
    }
}

module.exports = JoinRequest