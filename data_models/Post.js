const db = require('../db')
const DataClass = require('./DataClass')
const Skill = require('./Skill')

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
                return await new User(this._user_id)
            }
        });

        Object.defineProperty(this, 'skills', {
            get: async function () {
                const skillBucketQuery = `SELECT _id FROM skill_bucket WHERE post_id=$1;`
                const skillBucketValues = [post._id]
                const skillBucket = (await db.query(skillBucketQuery, skillBucketValues)).rows
                const skillBuckets = Promise.all(await skillBucket.map(skillBucket => new SkillBucket(skillBucket._id)))
                return [...skillBuckets]
            }
        });
    
        Object.defineProperty(this, 'team', {
            get: async function () {
                // TODO requires fix
                const teamQuery = `SELECT _id FROM teams WHERE post_id=$1;`
                const teamValues = [post._id]
                let team = (await db.query(teamQuery, teamValues)).rows
                team = await Promise.all(team.map(user => new User(user).username))
                return [...team]
            }
        });
    
        Object.defineProperty(this, 'content', {
            get: async function () {
                const teamQuery = `SELECT _id FROM post_content WHERE post_id=$1;`
                const teamValues = [post._id]
                const contentResult = (await db.query(teamQuery, teamValues)).rows
                const content = await Promise.all(contentResult.map(content => new Content(content._id)))
                return [...content]
            }
        });
    }
}


class Content extends DataClass {
    constructor(id){
        super(id)

        return new Promise( async (resolve, reject) => {
            try{
                const query = `SELECT * FROM post_content WHERE _id=$1`
                const values = [id]
                const db_content = (await db.query(query, values)).rows[0]
                
                if (db_content.type === 'text'){
                    content.text = content.content
                }
                else if (db_content.type === 'image'){
                    content.image = content.content
                }

                defineProperties()
                
                resolve(this)
            } catch(ex) {
                reject(ex)
            }
        });

    }

    defineProperties(){
        Object.defineProperty(content, 'post', {
            get: async function () {
                return await new Post(content.post_id);
            }
        });
    }
}

class SkillBucket extends DataClass {
    constructor(id){
        super(id)

        return new Promise( async (resolve, reject) => {
            try{
                const query = `SELECT * FROM skill_bucket WHERE _id=$1`
                const values = [id]
                const db_skillBucket = (await db.query(query, values)).rows[0]

                this.skill_help_needed = db_skillBucket.skill_help_needed

                defineProperties()
                
                resolve(this)
            } catch(ex) {
                reject(ex)
            }
        });

    }

    defineProperties(){
        Object.defineProperty(skillBucket, 'skill', {
            get: async function () {
                return await new Skill(skillBucket.skill_id)
            }
        });
    
        Object.defineProperty(skillBucket, 'collaborators', {
            get: async function () {
                const skillQuery = `SELECT user_id FROM post_collaborators WHERE skill_bucket_id=$1;`
                const skillValues = [skillBucket._id]
                const collaboratorsResult = (await db.query(skillQuery, skillValues)).rows
                const collaborators = await Promise.all(collaboratorsResult.map(collaborators => new User(collaborators.user_id)))
                return [...collaborators]
            }
        });
    }
}

module.exports = Post