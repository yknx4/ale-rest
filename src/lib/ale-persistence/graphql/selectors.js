import { mapKeys, memoize, isString } from 'lodash';
import { camel } from 'case';
import plural from 'pluralize';
import logger from '~/logger'; // eslint-disable-line

const { info } = logger();

const instanceToResult = memoize(instance =>
  mapKeys(instance.attributes, (_, key) => camel(key))
);

function getOutputFromInstance(data: Object, _, __, meta: Object) {
  info(`Getting ${meta.fieldName} from ${JSON.stringify(data)}`);
  const transformedData = instanceToResult(data);
  return transformedData[meta.fieldName];
}

const getDescription = (description: ?string): string =>
  isString(description) ? description : 'Missing Description';

const camelKey = (_, k: string): string => camel(k);
const pluralKey = (_, k: string): string => plural(k);

const resolveSingleElement = (models: Object, name: string) => (root, { id }) =>
  models[name].findById(id);
const resolveCollection = (models: Object, name: string) => (
  root,
  { query = {}, order, page = 1, pageSize = 10 }
) => {
  const model = models[name];
  const { primaryKey } = model.schema;
  const finalOrder = order || [primaryKey];
  return models[name]
    .where(query)
    .orderBy(...finalOrder)
    .fetchPage({ page, pageSize });
};

const asFn = memoize(input => () => input);

export {
  getOutputFromInstance,
  getDescription,
  camelKey,
  pluralKey,
  resolveSingleElement,
  resolveCollection,
  instanceToResult,
  asFn,
};
