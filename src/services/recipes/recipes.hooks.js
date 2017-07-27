// src/services/recipes/recipes.hooks.js

const { authenticate } = require('feathers-authentication').hooks;
const { restrictToOwner, associateCurrentUser, restrictToAuthenticated } = require('feathers-authentication-hooks');
const { populate } = require('feathers-hooks-common');

// Configure where we will get the author data from (the users service),
// how to fetch it (by authorId), and where to put it (author).
const authorSchema = {
  include: {
    service: 'users',
    nameAs: 'author',
    parentField: 'authorId',
    childField: '_id',
  }
};

const likerSchema = {
  include: {
    service: 'users',
    nameAs: 'likers',
    parentField: 'likedBy',
    childField: '_id'
  }
};

const restrict = [
  authenticate('jwt'),
  restrictToAuthenticated(),
];

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      ...restrict,
      associateCurrentUser({ as: 'authorId' }),
    ],
    update: [...restrict],
    patch: [...restrict],
    remove: [...restrict]
  },

  after: {
    all: [
      populate({ schema: authorSchema }),
      // populate({ schema: likerSchema }),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
