import { isString, mapKeys, memoize } from 'lodash';
import { trace } from 'logger';
import plural from 'pluralize';
import { camel } from 'case';
import { modelsProxy as models } from 'ale-persistence/models';
import getLoader from '../db/getLoader';

const instanceToResult = memoize(instance =>
  mapKeys(instance.attributes, (_, key) => camel(key))
);

function getOutputFromInstance(data: Object, _, __, meta: Object) {
  trace(`Getting ${meta.fieldName} from ${JSON.stringify(data)}`);
  const transformedData = instanceToResult(data);
  return transformedData[meta.fieldName];
}

const getDescription = (description: ?string): string =>
  isString(description) ? description : 'Missing Description';

const camelKey = (_, k: string): string => camel(k);
const pluralKey = (_, k: string): string => plural(k);

const resolveSingleElement = (name: string) => (root, { id }) =>
  models[name].loader().load(id);
const resolveCollection = (name: string) => (
  root,
  { query = {}, order, page = 1, pageSize = 10 }
) => {
  const model = models[name];
  const { primaryKey } = model.schema;
  const finalOrder = order || [primaryKey];
  return model
    .where(query)
    .orderBy(...finalOrder)
    .fetchPage({ page, pageSize })
    .then(r => getLoader(name).loadMany(r.models.map(e => e.id)));
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
