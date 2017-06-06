import Ajv from 'ajv';

const ajv = new Ajv({
  useDefaults: 'shared',
  allErrors: true,
  $data: true,
  coerceTypes: true,
  ownProperties: true,
  verbose: true,
  removeAdditional: true,
});

export default ajv;
