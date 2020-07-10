const express = require('express');
const middlewares = require('../middlewares');
const controllers = require('./controllers/index');

const router = express.Router();

const checkSession = controllers.sessions.check;
const { busboy } = middlewares;

// Actions
router.post('/actions/:id', controllers.actions.submit);

// Sessions
router.post('/sessions', controllers.sessions.create);

// Users
router.post('/users', controllers.users.create);
router.post('/users/resetPassword', controllers.users.resetPassword);
router.get('/users/:id', checkSession, controllers.users.show);
router.get('/users', checkSession, controllers.users.list);
router.put('/users/:id', checkSession, controllers.users.update);
router.delete('/users/:id', checkSession, controllers.users.delete);

// Files
router.post('/files/:type/', checkSession, busboy, controllers.files.create);

module.exports = router;
