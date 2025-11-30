const models = require('./http/models');
const client = require('./http/client');

module.exports = {
  ...models,
  ...client
};
