var _ = require('lodash');
// var debug = require('debug')('mgenerate:store');

/**
 * $store operator adds a key:value to the supplied context object, so that it can be referenced later in the template via
 * the $recall operator.
 *
 * @example returns {"color": "red"} and stores the string "red" under the variable name of "myColor"
 *
 * {"color": {"$store": {"myColor": "red"}}}
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {object} key           the key of the context item to be stored
 * @param  {object} val           the value of the context item to be stored
 * @param  {object} context       the context map for the template
 * @return {any}                  the resolved passed-in value
 */
module.exports = function(evaluator, key, val, context) {
  var value = _.isObject(val) ? Object.values(val)[0] : val;
  context[key] = evaluator(value, true);
  return value;
};
