/* eslint new-cap: 0 */
// var debug = require('debug')('mgenerate:indexOf');

/**
 * $indexOf operator returns the index of where the given value appears in the given array. If no value is found, $missing is returned.
 *
 * @example Find the index of chocolate in the list - the value returned would be 1.
 *
 * {
 *   "flavor": {
 *     "$indexOf": {
 *       "from": ["vanilla", "chocolate", "lemon"],
 *       "value": "chocolate"
 *     }
 *   }
 * }
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {Object} options       options to configure the choose operator
 * @return {Any}                  chosen value, evaluated
 */
module.exports = function(evaluator, options) {
  var resolvedValue = evaluator(options.value, true);
  if (resolvedValue !== '$missing') {
    var index = options.from.indexOf(resolvedValue);
    if (index !== -1) {
      return evaluator(index, true);
    }
  }
  return '$missing';
};
