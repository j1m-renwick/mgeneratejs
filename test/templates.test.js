var mgenerate = require('../');
var assert = require('assert');
var _ = require('lodash');

// var debug = require('debug')('mgenerate:test:templates');

context('Templates', function() {
  it('should have `chance` available inside a template', function() {
    var template = { twitter_user: '{{ chance.twitter() }}' };
    var res = mgenerate(template, '{}');
    assert.ok(_.isString(res.twitter_user));
    assert.ok(_.startsWith(res.twitter_user, '@'));
  });
  it('should have `faker` available inside a template', function() {
    var template = { slogan: '{{ faker.company.catchPhrase() }}' };
    var res = mgenerate(template, '{}');
    assert.ok(_.isString(res.slogan));
  });
  it('should evaluate javascript', function() {
    var template = { result: '{{ 1+1+1 }}' };
    var res = mgenerate(template, '{}');
    assert.ok(_.isString(res.result));
    assert.equal(res.result, '3');
  });
  it('should evaluate faker.js/choose.js contextual mapping', function() {
    var template = {
      name: 'bob',
      slogan: { $recall: { variable: 'mySlogan' } },
      same: { slogan: { $recall: { variable: 'mySlogan' } } }
    };
    var res = mgenerate(template, {
      mySlogan: '{{ faker.company.catchPhrase()}}'
    });
    assert.ok(_.isString(res.slogan));
    assert.notEqual(res.slogan, '{{ faker.company.catchPhrase()}}');
    assert.equal(res.slogan, res.same.slogan);
    assert.equal(res.name, 'bob');
    assert.equal(Object.keys(res).length, 3);
  });
  it('should evaluate object-based operator contextual mapping', function() {
    var template = {
      name: 'bob',
      choice: { $recall: { variable: 'myChoice' } },
      same: { choice: { $recall: { variable: 'myChoice' } } }
    };
    var res = mgenerate(template, {
      myChoice: { $choose: { from: ['ONE', 'TWO', 'THREE'] } }
    });
    assert.ok(_.isString(res.choice));
    assert.ok(['ONE', 'TWO', 'THREE'].includes(res.choice));
    assert.equal(res.choice, res.same.choice);
    assert.equal(res.name, 'bob');
    assert.equal(Object.keys(res).length, 3);
  });
  it('should gracefully fail bad contextual mapping', function() {
    var template = {
      name: 'bob',
      invalid: { $recall: { variable: 'someUnsetVariable' } },
      slogan: { $recall: { variable: 'mySlogan' } }
    };
    var res = mgenerate(template, {
      mySlogan: '{{ faker.company.catchPhrase()}}'
    });
    assert.equal(res.name, 'bob');
    assert.equal(res.invalid, null);
    assert.ok(_.isString(res.slogan));
    assert.notEqual(res.slogan, '{{ faker.company.catchPhrase()}}');
    assert.equal(Object.keys(res).length, 2);
  });
});
