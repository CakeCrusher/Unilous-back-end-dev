require("dotenv").config({ path: ".env-dev-pg" });
const express = require("express");

const modelTypeDefs = require("./typeDefs/models");
const mutationTypeDefs = require("./typeDefs/mutations");
const queryTypeDefs = require("./typeDefs/queries");

const mutationResolvers = require("./resolvers/mutations");
const queryResolvers = require("./resolvers/queries");

const { gql, ApolloServer } = require("apollo-server-express");
const { populateUserById } = require('./data_models')
const jwt = require("jsonwebtoken");
const cors = require("cors");
const JWT_SECRET = process.env.JWT_SECRET;
//const MONGODB_URI = process.env.MONGODB_URI;
const port = process.env.PORT || 4000;

// mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
//     .then(console.log('Connected to MongoDB'))
//     .catch(error => console.log(`Failed to establish connection: ${error}`))

const typeDefs = gql`
  ${modelTypeDefs}
  ${mutationTypeDefs}
  ${queryTypeDefs}
`;

const resolvers = {
  ...mutationResolvers,
  ...queryResolvers,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;

    if (auth && auth.startsWith(`${JWT_SECRET} `)) {
      const token = jwt.verify(
        auth.substring(JWT_SECRET.length + 1),
        JWT_SECRET
      );
      const currentUser = await populateUserById(token._id);
      return { currentUser };
    } else {
      return { currentUser: null };
    }
  },
});

const app = express();
server.applyMiddleware({ app });

app.use(cors());

  // Exprees will serve up production assets
  app.use(express.static("temp_build/static"));

  // Express serve up index.html file if it doesn't recognize route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "temp_build", "static", "index.html"));
  });


app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});
