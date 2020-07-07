const db = require('../db')
const DataClass = require('./DataClass')
const Post = require('./Post')

class Content extends DataClass {
    constructor(id){
        super(id)

        return this.promiseDecorator(async () => {
            const query = `SELECT * FROM post_content WHERE _id=$1`
            const values = [id]
            const db_content = (await db.query(query, values)).rows[0]
            
            if (db_content.type === 'text'){
                this.text = db_content.content
            }
            else if (db_content.type === 'image'){
                this.image = db_content.content
            }
            
            this.defineProperties()
        });
    }

    defineProperties(){
        Object.defineProperty(this, 'post', {
            get: async function () {
                return await new Post(content.post_id);
            }
        });
    }
}

module.exports = Content