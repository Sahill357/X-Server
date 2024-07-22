// apollo-server-vercel/api/index.js
const { ApolloServer, gql } = require('apollo-server-vercel');

// Define your type definitions and resolvers
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

// Create the Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Export the handler for Vercel
module.exports = server.createHandler();
