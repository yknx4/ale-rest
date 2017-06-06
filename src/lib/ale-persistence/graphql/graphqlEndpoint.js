import graphqlHTTP from 'express-graphql';
import createGraphQlSchema from './createGraphQlSchema';

function graphqlEndpoint(schemas) {
  return graphqlHTTP({
    schema: createGraphQlSchema(schemas),
    graphiql: true,
  });
}

export default graphqlEndpoint;
