const db = require('../db')
const DataClass = require('./DataClass')
const SkillBucket = require('./SkillBucket')
const Content = require('./Content')

class Post extends DataClass{
    constructor(id){
        super(id)
        
        return this.promiseDecorator(async () => {
            const query = `SELECT * FROM user_posts WHERE _id=$1`
            const values = [id]

            const db_post = (await db.query(query, values)).rows[0]

            if(db_post === undefined){
                throw new Error(`Could not find post with id:${id}`)
            }

            this.title = db_post.title
            this.color = db_post.color
            this.time = db_post.time
            this._user_id = db_post.user_id
            
            this.defineProperties()
        });
    }

    defineProperties(){
        Object.defineProperty(this, 'user', {
            get: async function () {
                const User = require('./User')
                return await new User(this._user_id)
            }
        });

        Object.defineProperty(this, 'skills', {
            get: async function () {
                const skillBucketQuery = `SELECT _id FROM skill_bucket WHERE post_id=$1;`
                const skillBucketValues = [this._id]
                const skillBucket = (await db.query(skillBucketQuery, skillBucketValues)).rows
                const skillBuckets = await Promise.all(await skillBucket.map(skillBucket => new SkillBucket(skillBucket._id)))
                return [...skillBuckets]
            }
        });
    
        Object.defineProperty(this, 'team', {
            get: async function () {
                const User = require('./User')
                const teamQuery = `SELECT _id FROM teams WHERE post_id=$1;`
                const teamValues = [this._id]
                let team = (await db.query(teamQuery, teamValues)).rows
                team = await Promise.all(team.map(user => new User(user._id)).username)
                return [...team]
            }
        });
    
        Object.defineProperty(this, 'content', {
            get: async function () {
                const teamQuery = `SELECT _id FROM post_content WHERE post_id=$1;`
                const teamValues = [this._id]
                const contentResult = (await db.query(teamQuery, teamValues)).rows
                const content = await Promise.all(contentResult.map(content => new Content(content._id)))
                return [...content]
            }
        });
    }
}

module.exports = Post