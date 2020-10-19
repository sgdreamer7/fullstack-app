const chista = require('../../chista');
const Upload = require('../../../../use-cases/main/files/Create');

module.exports = {
  create: (req, res) => {
    try {
      req.busboy.on('file', (fieldName, file, filename, encoding, mimetype) => {
        const promise = chista.runUseCase(Upload, {
          params: {
            ...req.params,
            filename,
            encoding,
            file,
            mimetype
          }
        });

        chista.renderPromiseAsJson(req, res, promise);
      });

      req.pipe(req.busboy);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      res.send({
        status: 0,
        error: {
          code: 'UPLOAD_FAILED',
          message: error.message
        }
      });
    }
  }
};
