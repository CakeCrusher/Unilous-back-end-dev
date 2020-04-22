const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type:String,
        required: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    referenceLink: {
        type: String,
        require: true,
        unique: true,
    },
    primarySkills: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
        }
    ],
    secondarySkills: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
        }
    ],
    interests: [
        {
            type: String,
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }
    ],
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification',
        }
    ],
    savedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }
    ]
})

module.exports = mongoose.model('User', schema)