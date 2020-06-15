const confme = require('confme');

const config = confme(`${__dirname}/../application/config/config.json`);

module.exports = config;
