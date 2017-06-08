import stringify from 'json-stringify-safe';
import logger from '~/logger'; // eslint-disable-line

const { info } = logger();

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

export { validateWithSchema, validateSaveSchema };
