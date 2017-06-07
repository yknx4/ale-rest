import { mapKeys, memoize, isString } from 'lodash';
import { camel } from 'case';
import plural from 'pluralize';

const instanceToResult = memoize(instance =>
  mapKeys(instance.attributes, (_, key) => camel(key))
);

function getOutputFromInstance(data, _, __, meta) {
  const transformedData = instanceToResult(data);
  return transformedData[meta.fieldName];
}

const getDescription = description =>
  isString(description) ? description : 'Missing Description';

const camelKey = (_, k) => camel(k);
const pluralKey = (_, k) => plural(k);

const resolveSingleElement = (models, name) => (root, { id }) =>
  models[name].findById(id);
const resolveCollection = (models, name) => (
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

export {
  getOutputFromInstance,
  getDescription,
  camelKey,
  pluralKey,
  resolveSingleElement,
  resolveCollection,
};
