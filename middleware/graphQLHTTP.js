const { graphqlHTTP } = require("express-graphql");

const graphQLSchema = require("../graphql/schema");
const graphQLResolver = require("../graphql/resolvers");

module.exports = graphqlHTTP({
  schema: graphQLSchema,
  rootValue: graphQLResolver,
  graphiql: true,
  customFormatErrorFn(error) {
    if (!error.originalError) {
      return { message: error.message };
    }

    const { statusCode = 500 } = error.originalError;
    return { message: error.message, statusCode };
  },
});
