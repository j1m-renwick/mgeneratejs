#!/usr/bin/env node

var es = require('event-stream');
var mgenerate = require('../');
var _ = require('lodash');

/* eslint no-sync: 0 */
var read = require('fs').readFileSync;
var eJSONStringifyStream = require('mongodb-extended-json')
  .createStringifyStream;

// var debug = require('debug')('mgenerate:bin');

/**
 * applies a regex to quote all unquoted keys, then uses JSON.parse to
 * convert template to a regular javascript object.
 *
 * @param  {String} template   JSON (or JS-style) template
 * @return {Object}            template object
 */
function parseTemplate(template) {
  // quote all unquoted keys first to make it valid JSON
  template = template.replace(
    /([{,])\s*([^,{\s\'"]+)\s*:(?=([^"\\]*(\\.|"([^"\\]*\\.)*[^"\\]*"))*[^"]*$)/g,
    '$1"$2":'
  );
  return JSON.parse(template);
}

var yargs = require('yargs')
  .option('number', {
    alias: 'n',
    describe: 'number of documents to return',
    type: 'number',
    default: 1
  })
  .option('jsonArray', {
    describe: 'return a JSON array with comma-separated documents',
    type: 'boolean',
    default: false
  })
  .option('dataContext', {
    alias: 'c',
    describe: 'json string to be reused in template generation',
    type: 'string'
  })
  .example(
    'mgeneratejs -n 5 template.json',
    'generates 5 documents based on the' + ' given template file.\n'
  )
  .example(
    'mgeneratejs template.json -c context.json -n 5 ',
    'generates 5 documents based on the' +
      ' given template and context files.\n'
  )
  .example(
    'mgeneratejs \'{"templateName": {"$resolve":{"variable":"myTemplateName"}}}\' -c \'{"myTemplateName": "my great template"}\' -n 1 ',
    'generates 1 document based on the given template and context files, replacing variable placeholder with context-calculated values.\n\n' +
      'The context json is resolved using the same operators as the template json.\n'
  )
  .example(
    'mgeneratejs \'{"name": "$name", "emails": {"$array": {"of": "$email", ' +
      '"number": 3}}}\'',
    'generates 1 document based on the given' + ' JSON template.\n'
  )
  .example(
    'cat template.json | mgeneratejs --number 20',
    'pipe template file to mgenerate' + ' and generate 20 documents.\n'
  )
  .example(
    'mgeneratejs -n3 --jsonArray < template.json',
    'pipe template file to mgenerate' +
      ' and generate 3 documents as a JSON array.'
  )
  .help()
  .epilogue(
    'Most operators from https://chancejs.com are available. For information' +
      ' on the template format, check the documentation at' +
      ' https://github.com/j1m-renwick/mgeneratejs.\n\n' +
      'With great thanks to rueckstiess (https://github.com/rueckstiess), who wrote the vast majority of this library' +
      ' and is probably an all-round good egg.'
  )
  .version()
  .strict()
  .wrap(100);

if (process.stdin.isTTY) {
  // running in TTY mode, get template from non-positional argument
  yargs
    .usage('Usage: mgeneratejs <options> [template]')
    .demand(1, 'must provide a template file or string');
} else {
  yargs.usage('Usage: mgeneratejs <options> < [template]');
}

var argv = yargs.argv;
var template;
var templateContext;
var stringifyStream = argv.jsonArray
  ? eJSONStringifyStream('[\n  ', ',\n  ', '\n]\n')
  : eJSONStringifyStream('', '\n', '\n');

function generate() {
  es.readable(function(count, callback) {
    if (count >= argv.number) {
      return this.emit('end');
    }
    this.emit('data', mgenerate(count, template, templateContext));
    callback();
  })
    .pipe(stringifyStream)
    .pipe(process.stdout);
}

if (process.stdin.isTTY) {
  var str = argv._[0];
  template = _.startsWith(str, '{')
    ? parseTemplate(str)
    : parseTemplate(read(str, 'utf8'));
  str = argv.dataContext || '{}';
  templateContext = _.startsWith(str, '{')
    ? parseTemplate(str)
    : parseTemplate(read(str, 'utf8'));
  generate();
} else {
  template = '';
  process.stdin.setEncoding('utf-8');
  process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      template += chunk;
    }
  });
  process.stdin.on('end', function() {
    template = JSON.parse(template);
    templateContext = JSON.parse(templateContext);
    generate();
  });
}
