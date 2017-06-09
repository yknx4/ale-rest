import stringify from 'json-stringify-safe';
import { info } from 'logger';

function validateWithSchema() {
  info(
    `Validating ${stringify(this.attributes)} against ${this.schema
      .title} schema.`
  );
  const validSchema = this.schemaValidator(this.attributes);
  info(`Result: ${validSchema}`);
  this.schemaErrors = this.schemaValidator.errors;
  return Promise.resolve(validSchema);
}

function rejectIfInvalid(valid: boolean): Promise<any> {
  if (!valid) {
    return Promise.reject(new Error('Invalid Object'));
  }
  return Promise.resolve();
}

function validateSaveSchema() {
  return this.validateWithSchema().then(rejectIfInvalid);
}

async function fromDbResult(result) {
  const data = await result;
  const collection = this.collection();
  collection._handleResponse(data); // eslint-disable-line no-underscore-dangle
  return collection;
}

export { validateWithSchema, validateSaveSchema, fromDbResult };
