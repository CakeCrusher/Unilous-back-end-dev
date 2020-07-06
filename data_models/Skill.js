const db = require('../db')
const DataClass = require('./DataClass')

class Skill extends DataClass{
    constructor(id){
        super(id)

        return this.promiseDecorator(async () => {
            const query = `SELECT * FROM skills WHERE _id=$1`
            const values = [id]
            const db_skill = (await db.query(query, values)).rows[0]

            this.name = db_skill.name
            this.uses = db_skill.uses

            this.defineProperties()
        });
    }

    defineProperties(){
        
    }
}

module.exports = Skill