const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  input UserInputPayload {
    name: String!
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    userId: ID!
  }

  type MessagePayload {
    messages: [Message!]!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
  }

  type Message {
    _id: ID!
    text: String!
    creator: User!
    createdAt: String!
  }

  type RootMutation {
    signUp(userInput: UserInputPayload): AuthPayload!
    addMessage(text: String!): Message
  }

  type RootQuery {
    logIn(email: String!, password: String!): AuthPayload!
    user: User!
    messages: [Message!]!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
