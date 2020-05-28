const db = require("../db");

async function populateUserById(id){
    const query = `SELECT * FROM user_account WHERE _id=$1`
    const values = [id]
    const user = (await db.query(query, values)).rows[0]

    //PostgreSQL column names are case-sensitive:
    user.referenceLink = user.referencelink;

    const primarySkillsQuery = `SELECT s.name, s.uses FROM skills s INNER JOIN user_primary_skills up ON s._id = up.skill_id WHERE up.user_id=$1;`
    const primarySkillsValues = [user._id]
    const primarySkillsResult = await db.query(primarySkillsQuery, primarySkillsValues)
    user.primarySkills = [...(primarySkillsResult.rows)]
    console.log(user.primarySkills)

    const secondarySkillsQuery = `SELECT * FROM user_secondary_skills WHERE user_id=$1;`
    const secondarySkillsValues = [user._id]
    const secondarySkillsResult = await db.query(secondarySkillsQuery, secondarySkillsValues)
    user.secondarySkills = [...(secondarySkillsResult.rows)]

    const userPostsQuery = `SELECT * FROM user_posts WHERE user_id=$1;`
    const userPostsValues = [user._id]
    const userPostsResult = await db.query(userPostsQuery, userPostsValues)
    user.posts = [...(userPostsResult.rows)]

    for(var i = 0; i < user.posts.length; i++) {
        let post_id = user.posts[i]._id
        const imageLinks = await db.query(`SELECT type FROM imageLinks WHERE user_id=$1 AND post_image_link_id=$2`,[id,post_id]);
        user.posts[i].imageLinks = imageLinks.rows;

        const referenceLinks = await db.query(`SELECT type FROM referenceLinks WHERE user_id=$1 AND post_reference_link_id=$2`,[id,post_id]);
        user.posts[i].referenceLinks = imageLinks.rows;

    }

    

    const userSavedPostsQuery = `SELECT * FROM user_saved_posts WHERE user_id=$1;`
    const userSavedPostsValues = [user._id]
    const userSavedPostsResult = await db.query(userSavedPostsQuery, userSavedPostsValues)
    user.savedPosts = [...(userSavedPostsResult.rows)]

    const notificationsQuery = `SELECT * FROM notification WHERE userto_id=$1;`
    const notificationsValues = [user._id]
    const notificationsResult = await db.query(notificationsQuery, notificationsValues)
    user.notifications = [...(notificationsResult.rows)]
    return user
}



module.exports.populateUserById = populateUserById;