const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('give password as argument')
}

const password = process.argv[2]

const url = `mongodb+srv://SebastianSosa:${password}@cluster0-dlwek.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true})

const postsSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3
    },
    description: {
        type: String
    }
})

const Posts = mongoose.model('Posts', postsSchema)

const posts = new Posts({
    title: 'This is title',
    description: 'Description this is'
})

posts.save().then(response => {
    console.log('note saved!')
    mongoose.connection.close()
})

module.exports = mongoose.model('Posts', postsSchema)