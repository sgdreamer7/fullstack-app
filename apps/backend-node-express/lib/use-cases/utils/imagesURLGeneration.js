const path = require('path');
const crypto = require('crypto');
const config = require('../../config');

const { imgproxy, imageSizes, imagesPath, staticUrl, cloudfrontStatic } = config;

function urlSafeBase64(string) {
  // eslint-disable-next-line new-cap
  return new Buffer.from(string)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function hexDecode(hex) {
  return Buffer.from(hex, 'hex');
}

function sign(salt, secret, target) {
  const hmac = crypto.createHmac('sha256', hexDecode(secret));

  hmac.update(hexDecode(salt));
  hmac.update(target);

  return urlSafeBase64(hmac.digest());
}

function signatureBuilding(image, size) {
  const encodedUrl = urlSafeBase64(`${staticUrl}${imagesPath}${image}`);
  const imagePath = `/fit/${size.width}/${size.height}/ce/0/${encodedUrl}`;

  const signature = sign(imgproxy.salt, imgproxy.key, imagePath);

  return `${imgproxy.domen}${signature}${imagePath}`;
}

const generateImagesURL = (image) => {
  const extension = path.extname(image);

  if (extension === '.svg') return `${cloudfrontStatic}${image}`;

  const imageURLCollection = {};

  const sizeArray = Object.entries(imageSizes);

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, size] of sizeArray) imageURLCollection[key] = signatureBuilding(image, size);

  imageURLCollection.fileName = image;

  return imageURLCollection;
};
module.exports = { generateImagesURL };
