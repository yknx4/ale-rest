import { mapKeys, memoize } from 'lodash';
import { camel } from 'case';

const instanceToResult = memoize(instance =>
  mapKeys(instance.attributes, (_, key) => camel(key))
);

function getOutputFromInstance(data, _, __, meta) {
  const transformedData = instanceToResult(data);
  return transformedData[meta.fieldName];
}

export default getOutputFromInstance;
