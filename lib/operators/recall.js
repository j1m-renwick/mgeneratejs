var _ = require('lodash');
// var debug = require('debug')('mgenerate:recall');

/**
 * $recall operator reads a key:value in the supplied context object.
 *
 * @example assuming the variable of "myColor" had been previously stored as "red", returns {"color": "red"}
 *
 * {"color": {"$recall": {"variable": "myColor"}}}
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {object} body          the object to be stored/evaluated
 * @param  {object} context       the context map for the template
 * @return {any}                  the specified passed-in value
 */
module.exports = function(evaluator, body, context) {
  if (_.isObject(body) && Object.keys(body).length === 1) {
    return evaluator(context[body.variable], true);
  } else {
    return evaluator('$missing', true);
  }
};
