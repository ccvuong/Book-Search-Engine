const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookID: ID!
    authors: [String]
    description: String!
    image: String!
    link: String!
    title: String!
  }

  type Auth {
    token: token
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login: Auth
    addUser: Auth
    saveBook: User
    removeBook: User
  }
`;

module.exports = typeDefs;
