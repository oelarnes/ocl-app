const joi = require("@hapi/joi");

const envVarsSchema = joi.object({
  PORT: joi.number()
    .default(8011),
  HOST: joi.string()
    .default("localhost"),
  DEFAULT_USERNAME: joi.string()
    .default("Mulldrifter")
}).unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
module.exports = envVars;
