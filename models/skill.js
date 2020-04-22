const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    uses: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Skill', schema)