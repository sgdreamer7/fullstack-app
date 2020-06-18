const LIVR = require('livr');
const extraRules = require('livr-extra-rules');

const defaultRules = {
  ...extraRules
  // additional rules
  // read spec here: https://github.com/koorchik/js-validator-livr
};

LIVR.Validator.registerDefaultRules(defaultRules);
