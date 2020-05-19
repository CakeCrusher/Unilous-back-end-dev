const db = require("../db");
const { populateUserById } = require('./user')
const { populatePostById } = require('./post')

async function populateNotificationById(id){
    const query = `SELECT * FROM notification WHERE _id=$1`
    const values = [id]
    const notification = (await db.query(query, values)).rows[0]

    notification.userFrom = await populateUserById(notification.userfrom_id)
    notification.userTo = await populateUserById(notification.userto_id)
    notification.post = null
    if(notification.post_id) {
        notification.post = await populatePostById(notification.post_id)
    }    
    return notification
}

module.exports.populateNotificationById = populateNotificationById