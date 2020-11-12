const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// GraphQL schema
let schema = buildSchema(`
    type Query {
        message: String
    }
`);

// Root resolver
let root = {
    message: () => "Hello world"
};

// Create an express server and GraphQL endpoint
var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running on http://localhost:4000/graphql'))