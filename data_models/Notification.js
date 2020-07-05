const db = require('../db')
const DataClass = require('./DataClass')
const SkillBucket = require('./Skill')
const User = require('./User')
const Post = require('./Post')

class Notification extends DataClass{
    static Types = {
        Question:    1,
        JoinRequest: 2,
    }

    constructor(id){
        super(id)

        return this.promiseDecorator(async () => {
            const query = `SELECT * FROM notification WHERE _id=$1`
            const values = [id]
            const db_notification = (await db.query(query, values)).rows[0]

            this._user_from_id = db_notification.userfrom_id
            this._post_id = db_notification.post_id
            this._type = db_notification.type

        
            switch(this._type)
            {
                case Notification.Types.Question:
                    const notificationQuestionQuery = `SELECT question FROM notification_question WHERE notification_id=$1;`
                    const notificationQuestionValues = [this._id]
                    this.question = (await db.query(notificationQuestionQuery, notificationQuestionValues)).rows[0].question
                    break;
                case Notification.Types.JoinRequest:
                    const notificationJoinRequestQuery = `SELECT skill_id, message FROM notification_join_request WHERE notification_id=$1;`
                    const notificationJoinRequestValues = [this._id]
                    const notificationJoinRequest = (await db.query(notificationJoinRequestQuery, notificationJoinRequestValues)).rows[0]
                    this.skill_joining = await new SkillBucket(notificationJoinRequest.skill_bucket_id)
                    this.message = notificationJoinRequest.message
                    break;
                default:
                    throw new Error('Invalid notification type.')
            }

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
                // Allowed null
                if(this._post_id){
                    return await new Post(this._post_id)
                }
                return null
                
            }
        });
    }
}

module.exports = Notification