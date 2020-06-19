const db = require("./db");

async function populateUserById(id) {
    const query = `SELECT * FROM user_account WHERE _id=$1`
    const values = [id]
    const user = (await db.query(query, values)).rows[0]

    //PostgreSQL column names are case-sensitive:
    user.referenceLink = user.referencelink;

    Object.defineProperty(user, 'primarySkills', {
        get: async function () {
            const primarySkillsQuery = `SELECT s.name, up.uses FROM skills s INNER JOIN user_primary_skills up ON s._id = up.skill_id WHERE up.user_id=$1;`
            const primarySkillsValues = [user._id]
            const primarySkillsResult = await db.query(primarySkillsQuery, primarySkillsValues)
            return [...(primarySkillsResult.rows)];
        }
    });


    Object.defineProperty(user, 'secondarySkills', {
        get: async function () {
            const secondarySkillsQuery = `SELECT s.name, up.uses FROM skills s INNER JOIN user_secondary_skills up ON s._id = up.skill_id WHERE up.user_id=$1;`
            const secondarySkillsValues = [user._id]
            const secondarySkillsResult = await db.query(secondarySkillsQuery, secondarySkillsValues)
            return [...(secondarySkillsResult.rows)];
        }
    });

    Object.defineProperty(user, 'posts', {
        get: async function () {
            const userPostsQuery = `SELECT _id FROM user_posts WHERE user_id=$1;`
            const userPostsValues = [user._id]
            const userPostsResult = await db.query(userPostsQuery, userPostsValues)
            let result = await Promise.all(userPostsResult.rows.map(async post => populatePostById(post._id)));
            return [...(result)];
        }
    });

    Object.defineProperty(user, 'savedPosts', {
        get: async function () {
            const userSavedPostsQuery = `SELECT _id FROM user_saved_posts WHERE user_id=$1;`
            const userSavedPostsValues = [user._id]
            const userSavedPostsResult = await db.query(userSavedPostsQuery, userSavedPostsValues)
            let result = await Promise.all(userSavedPostsResult.rows.map(async post => populatePostById(post._id)));
            return [...(result)];
        }
    });

    Object.defineProperty(user, 'notifications', {
        get: async function () {
            const notificationsQuery = `SELECT _id FROM notification WHERE userto_id=$1;`
            const notificationsValues = [user._id]
            const notificationsResult = await db.query(notificationsQuery, notificationsValues)
            let result = await Promise.all(notificationsResult.rows.map(async notification => populateNotificationById(notification._id)));
            return [...(result)];
        }
    });
    return user
}

async function populatePostById(id){
    const query = `SELECT * FROM user_posts WHERE _id=$1`
    const values = [id]
    const post = (await db.query(query, values)).rows[0]

    const skillQuery = `SELECT * FROM post_skills P INNER JOIN skills C ON C._id = P.skill_id WHERE P.post_id=$1;`
    const skillValues = [post._id]
    const skillsResult = (await db.query(skillQuery, skillValues)).rows

    post.skillNames = []
    post.skillCapacities = []
    post.skillFills = []
    for(var i = 0; i < skillsResult.length; i++){
        post.skillNames.push(skillsResult[i].name)
        post.skillCapacities.push(skillsResult[i].needed)
        post.skillFills.push(skillsResult[i].filled)
    }
    post.user = await populateUserById(post.user_id)

    Object.defineProperty(post, 'team', {
        get: async function () {
            // TODO requires fix
            const teamQuery = `SELECT _id FROM teams WHERE post_id=$1;`
            const teamValues = [post._id]
            const team = (await db.query(teamQuery, teamValues)).rows
            return [...(team.map(user => populateUserById(user).username))]
        }
    });

    Object.defineProperty(post, 'content', {
        get: async function () {
            const teamQuery = `SELECT _id FROM post_content WHERE post_id=$1;`
            const teamValues = [post._id]
            const contentResult = (await db.query(teamQuery, teamValues)).rows
            const content = await Promise.all(contentResult.map(content => populateContentById(content._id)))
            return [...content]
        }
    });

    return post
}

async function populateContentById(id){
    const query = `SELECT * FROM post_content WHERE _id=$1`
    const values = [id]
    const content = (await db.query(query, values)).rows[0]

    Object.defineProperty(content, 'post', {
        get: async function () {
            return populatePostById(content.post_id);
        }
    });

    if (content.type === 'text'){
        content.text = content.content
    }
    else if (content.type === 'image'){
        content.image = content.content
    }
    delete content.content
    delete content.type
    delete content.post_id
    return content
}

async function populateSkillById(id){
    const query = `SELECT * FROM skills WHERE _id=$1`
    const values = [id]
    const skill = (await db.query(query, values)).rows[0]
    return skill
}

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

module.exports.populateUserById = populateUserById;
module.exports.populateNotificationById = populateNotificationById
module.exports.populatePostById = populatePostById
module.exports.populateSkillById = populateSkillById