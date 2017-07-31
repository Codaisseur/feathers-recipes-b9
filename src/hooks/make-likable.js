// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('feathers-errors');

const likeRecipe = (like, recipe, user) => {
  const action = like ? '$addToSet' : '$pull';
  return {
    [action]: {
      likedBy: user._id
    }
  };
}

module.exports = function (hook) {
  // Hooks can either return nothing or a promise
  // that resolves with the `hook` object for asynchronous operations
  const { user } = hook.params;
  const { data } = hook.data;

  return hook.app.service('recipes').get(hook.id)
    .then((recipe) => {
      if (recipe.authorId.toString() === user._id.toString()) {
        // make sure the author does not alter likedBy
        hook.data.likedBy = recipe.likedBy;
      } else {
        const keys = Object.keys(hook.data).filter((key) => (key !== 'like'))
        if (keys.length > 0) { // user tries to update something else than their like!
          throw new errors.Forbidden('You are not allowed to do this!');
        }
      }

      if (hook.data.like !== undefined) {
        hook.data = likeRecipe(hook.data.like, recipe, user);
      }

      debugger;
    });
};
