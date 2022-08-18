var _ = require('lodash');
var moment = require('moment');
// var debug = require('debug')('mgenerate:age');

/**
 * $age operator returns the year difference between the given date of birth and the current date.
 *
 * @example returns the year difference between 21st November 2000 and the current date.
 *
 * {"ageInYears": {"$age": {"dob": "2000-11-21"}}}
 *
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {object} body          the object to be stored/evaluated
 * @param  {object} context       the context map for the template
 * @return {any}                  the specified passed-in value
 */
module.exports = function(evaluator, body, context) {
  return evaluator(moment().diff(new Date(body.dob), 'years'), true);
};
