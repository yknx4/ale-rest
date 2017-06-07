import graphqlHTTP from 'express-graphql';
import createGraphQlSchema from './createGraphQlSchema';

function graphqlEndpoint(models: Object): (req: Object, res: Object) => mixed {
  return graphqlHTTP({
    schema: createGraphQlSchema(models),
    graphiql: true,
  });
}

export default graphqlEndpoint;
