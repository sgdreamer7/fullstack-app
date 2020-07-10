/* eslint-disable class-methods-use-this */
/* istanbul ignore file */
const path = require('path');
const uuid = require('uuid');
const Base = require('../../Base');
const s3 = require('../../../infrastructure/s3');
const { Exception: X } = require('../../../packages');

const { BucketName } = s3;

const MIME_TYPE_RULES = {
  images: { one_of: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'] },
  chat: {
    one_of: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/svg+xml',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .doc + .docx
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xls + .xlsx
      'application/x-rar-compressed',
      'application/octet-stream', // .rar
      'application/zip',
      'application/octet-stream',
      'application/x-zip-compressed',
      'application/x-zip', // .zip
      'application/pdf',
      'text/plain',
      'text/csv'
    ]
  }
};

class FileCreate extends Base {
  async validate(data) {
    const rules = {
      type: ['required', { one_of: ['images', 'chat'] }],
      file: ['required'],
      filename: ['required'],
      mimetype: ['required', MIME_TYPE_RULES[data.type] || 'not_empty']
    };

    return this.doValidation(data, rules);
  }

  async execute({ type, file, filename, mimetype }) {
    const extension = path.extname(filename);
    const remoteFileName = `${uuid.v4()}${extension}`;
    const params = {
      Bucket: BucketName,
      Key: `${type}/${remoteFileName}`,
      Body: file,
      ContentType: mimetype
    };

    try {
      const data = await s3.uploadAsync(params);
      const storedFile = {
        name: remoteFileName,
        originalName: filename,
        key: data.Key,
        location: BucketName,
        extension,
        type
      };

      return { data: storedFile };
    } catch (error) {
      throw new X({
        code: 'FAILED_TO_DOWNLOAD',
        fields: {
          file: 'BAD_FILE'
        }
      });
    }
  }
}

module.exports = FileCreate;
