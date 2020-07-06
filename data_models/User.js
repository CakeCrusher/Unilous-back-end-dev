const db = require('../db')
const DataClass = require('./DataClass')
const Post = require('./Post')
const Notification = require('./Notification')

class User extends DataClass{
    constructor(id) {
        super(id)
        return this.promiseDecorator(async () => {
            const query = `SELECT * FROM user_account WHERE _id=$1`
            const values = [id]
            

            const db_user = (await db.query(query, values)).rows[0]

            this.username = db_user.username
            this.password = db_user.password
            this.email = db_user.email
            //PostgreSQL column names are case-sensitive:
            this.referenceLink = db_user.referencelink;

            this.defineProperties()
        });
    }

    defineProperties(){
        Object.defineProperty(this, 'interests', {
            get: async function () {
                return []
                throw new Error('Unimplemented')
            }
        });

        Object.defineProperty(this, 'primarySkills', {
            get: async function () {
                const primarySkillsQuery = `SELECT s.name, up.uses FROM skills s INNER JOIN user_primary_skills up ON s._id = up.skill_id WHERE up.user_id=$1;`
                const primarySkillsValues = [this._id]
                const primarySkillsResult = await db.query(primarySkillsQuery, primarySkillsValues)
                return [...(primarySkillsResult.rows)];
            }
        });


        Object.defineProperty(this, 'secondarySkills', {
            get: async function () {
                const secondarySkillsQuery = `SELECT s.name, up.uses FROM skills s INNER JOIN user_secondary_skills up ON s._id = up.skill_id WHERE up.user_id=$1;`
                const secondarySkillsValues = [this._id]
                const secondarySkillsResult = await db.query(secondarySkillsQuery, secondarySkillsValues)
                return [...(secondarySkillsResult.rows)];
            }
        });

        Object.defineProperty(this, 'posts', {
            get: async function () {
                const userPostsQuery = `SELECT _id FROM user_posts WHERE user_id=$1;`
                const userPostsValues = [this._id]
                const userPostsResult = await db.query(userPostsQuery, userPostsValues)
                let result = await Promise.all(userPostsResult.rows.map(async post => await new Post(post._id)));
                return [...(result)];
            }
        });

        Object.defineProperty(this, 'savedPosts', {
            get: async function () {
                const userSavedPostsQuery = `SELECT _id FROM user_saved_posts WHERE user_id=$1;`
                const userSavedPostsValues = [this._id]
                const userSavedPostsResult = await db.query(userSavedPostsQuery, userSavedPostsValues)
                let result = await Promise.all(userSavedPostsResult.rows.map(async post => await new Post(post._id)));
                return [...(result)];
            }
        });

        Object.defineProperty(this, 'notifications', {
            get: async function () {
                const notificationsQuery = `SELECT _id FROM notification WHERE userto_id=$1;`
                const notificationsValues = [this._id]
                const notificationsResult = await db.query(notificationsQuery, notificationsValues)
                let result = await Promise.all(notificationsResult.rows.map(async notification => await new Notification(notification._id)));
                return [...(result)];
            }
        });
    }
}

module.exports = User