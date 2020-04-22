const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    userFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    userTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    message: {
        type: String,
        maxlength: 800,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    proposedContribution: [
        {
            type: Number,
        }
    ],
    question: {
        type: String,
        maxlength: 800,
    },
    answer: {
        type: String,
        maxlength: 800,
    },
    accepted: {
        type: Boolean,
    },
})

module.exports = mongoose.model('Notification', schema)