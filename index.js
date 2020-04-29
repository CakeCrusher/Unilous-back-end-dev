require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/user')

const modelTypeDefs = require('./typeDefs/models')
const mutationTypeDefs = require('./typeDefs/mutations')
const queryTypeDefs = require('./typeDefs/queries')

const mutationResolvers = require('./resolvers/mutations')
const queryResolvers = require('./resolvers/queries')

// const resolvers = require('./resolvers')
const { gql, ApolloServer } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const JWT_SECRET = process.env.JWT_SECRET
const MONGODB_URI = process.env.MONGODB_URI
const port = process.env.PORT || 4000

mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
    .then(console.log('Connected to MongoDB'))
    .catch(error => console.log(`Failed to establish connection: ${error}`))

const typeDefs = gql`
    ${modelTypeDefs}
    ${mutationTypeDefs}
    ${queryTypeDefs}
`

const resolvers = {
    ...mutationResolvers,
    ...queryResolvers
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        const auth = req ? req.headers.authorization : null

        if (auth && auth.startsWith(`${JWT_SECRET} `)) {
            const token = jwt.verify(
                auth.substring(JWT_SECRET.length + 1), JWT_SECRET)
            const currentUser = await User.findById(token._id).populate(['primarySkills', 'secondarySkills', 'posts', 'notifications', 'savedPosts'])
            return { currentUser }
        } else {
            return { currentUser: null }
        }
    }
})

const app = express()
server.applyMiddleware({ app })

app.use(cors())

// server.listen().then(({ url }) => {
//     console.log(`Server ready at ${url}`)
// })
app.listen(port, () => {
    console.log(`Starting server at ${port}`);
})