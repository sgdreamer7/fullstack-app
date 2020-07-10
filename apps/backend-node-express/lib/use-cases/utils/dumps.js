const { generateImagesURL } = require('./imagesURLGeneration');

const dumpUser = (user) => {
  const dump = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    secondName: user.secondName,
    avatarUrl: user.avatar ? generateImagesURL(user.avatar) : '',
    lang: user.lang,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };

  return dump;
};

const dumpAdmin = (admin) => {
  const dump = {
    id: admin.id,
    email: admin.email,
    createdAt: admin.createdAt.toISOString(),
    updatedAt: admin.updatedAt.toISOString()
  };

  return dump;
};

module.exports = {
  dumpUser,
  dumpAdmin
};
