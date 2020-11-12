const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// GraphQL schema
let schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
        coursesLike(searchInTitle: String!): [Course]  
    }
    type Mutation {
        addCourse(title: String!, author: String!, description: String, topic: String, url: String) : [Course]
    }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

let getCoursesLike = function(args) {
    let searchInTitle = args.searchInTitle
    return coursesData.filter(course => course.title.includes(searchInTitle));
}

let addNewCourse = function({title, author, description, topic, url }) {
    let id = coursesData.length+1
    let newCourse = {
        id: id,
        title: title,
        author: author,
        description: description,
        topic: topic,
        url: url
    }
    coursesData.push(newCourse)
    return coursesData;
}

let getCourse = function(args) {
    let id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

let getCourses = function(args){
    if(args.topic) {
        let topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

// Root resolver
let root = {
    course: getCourse,
    courses: getCourses,
    coursesLike: getCoursesLike,
    addCourse: addNewCourse
};

// Create an express server and GraphQL endpoint
var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL Server Now Running on http://localhost:4000/graphql'))