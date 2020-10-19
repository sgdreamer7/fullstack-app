const pathModule = require('path');
const fse = require('fs-extra');
const Handlebars = require('handlebars');
const { getDirName } = require('../../../utils/index');

const dirname = getDirName(`file://${__dirname}`);

const TEMPLATES_BY_TYPE = {
  ACTIVATE_USER: 'activateUser',
  RESET_PASSWORD: 'resetPassword',
  CONTACT: 'contact'
};

const TEMPLATES_LIST = {};

module.exports = {
  getTemplate: async (type) => {
    const templateName = TEMPLATES_BY_TYPE[type];

    if (TEMPLATES_LIST[templateName]) {
      return TEMPLATES_LIST[templateName];
    }

    const templatesDir = pathModule.join(dirname, '/../../../templates');
    // eslint-disable-next-line compat/compat
    const [bodyTemplate, subjectTemplate] = await Promise.all([
      fse.readFile(pathModule.join(templatesDir, templateName, 'body.html')),
      fse.readFile(pathModule.join(templatesDir, templateName, 'subject.html'))
    ]);

    const template = {
      body: Handlebars.compile(bodyTemplate.toString()),
      subject: Handlebars.compile(subjectTemplate.toString())
    };

    // eslint-disable-next-line require-atomic-updates
    TEMPLATES_LIST[templateName] = template;

    return template;
  }
};
