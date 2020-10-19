const { fileURLToPath } = require('url');
const { dirname } = require('path');

module.exports = {
  getDirName: (importMetaUrl) => dirname(fileURLToPath(importMetaUrl))
};
