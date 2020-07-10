const AWS = require('aws-sdk');
const { promisify } = require('../packages');
const config = require('../config');

const s3client = new AWS.S3(config.s3);

s3client.uploadAsync = promisify(s3client.upload);
// const s3Async = promisifyAll(s3client);

module.exports = { default: s3client, BucketName: config.s3.bucket };
