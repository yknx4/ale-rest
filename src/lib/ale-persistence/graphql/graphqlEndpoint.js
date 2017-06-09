import graphqlHTTP from 'express-graphql';
import { reduce } from 'lodash';
import { error } from 'logger';
import createGraphQlSchema from './createGraphQlSchema';

function mirrorArray(input: Array<string>): { [string]: string } {
  return reduce(
    input,
    (a, v) => {
      a[v] = v; // eslint-disable-line no-param-reassign
      return a;
    },
    {}
  );
}

function graphqlEndpoint(
  models: Array<string>
): (req: Object, res: Object) => mixed {
  return graphqlHTTP({
    schema: createGraphQlSchema(mirrorArray(models)),
    graphiql: true,
    formatError: err => {
      error(err);
      return {
        message: err.message,
        locations: err.locations,
        stack: err.stack,
        path: err.path,
      };
    },
  });
}

export default graphqlEndpoint;
