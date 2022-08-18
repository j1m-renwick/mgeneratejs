var _ = require('lodash');
// var debug = require('debug')('mgenerate:substitute');

/**
 * $substitute operator replace values in the supplied expression and resolves it.
 *
 * @example returns the result of faker.name.fullName({ firstName: "Bob"})
 *
 * {"name": {"$substitute": {"overrides": {"someFirstName": "Bob"}, "expression": "{{faker.name.fullName({ firstName: \"__someFirstName__\" })}}"}}}
 *
 *
 * @example returns the result of faker.name.fullName({ firstName: "Tom"}),
 * assuming the variable of "contextFirstName" had been previously stored as "Tom"
 *
 * {"name": {"$substitute": {"expression": "{{faker.name.fullName({ firstName: \"__contextFirstName__\" })}}"}}}
 *
 *
 * @example returns {"ageInYears": 31}
 *
 * {"ageInYears": {"$substitute": {overrides: {"myDobValue": "1990-11-21"}, "expression": {"$age":{"dob":"__myDobValue__"}}}}}
 *
 *
 * the "overrides" object properties are applied first, and any remaining ones are substituted from the context object.
 *
 * @param  {Function} evaluator   evaluator function, passed in for every operator
 * @param  {object} body          the object to be stored/evaluated
 * @param  {object} context       the context map for the template
 * @return {any}                  the specified passed-in value
 */
module.exports = function(evaluator, body, context) {
  var updatedExpression;
  var isObjectExpression = false;

  if (!_.isString(body.expression)) {
    updatedExpression = JSON.stringify(body.expression);
    isObjectExpression = true;
  } else {
    updatedExpression = body.expression;
  }

  for (const [key, value] of Object.entries(body.overrides || {})) {
    updatedExpression = updatedExpression.replaceAll(`__${key}__`, `${value}`);
  }

  for (const [key, value] of Object.entries(context)) {
    updatedExpression = updatedExpression.replaceAll(`__${key}__`, `${value}`);
  }

  return evaluator(
    isObjectExpression ? JSON.parse(updatedExpression) : updatedExpression,
    true
  );
};
