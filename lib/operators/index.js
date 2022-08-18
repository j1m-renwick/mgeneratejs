module.exports = {
  /*
   * Utility operators
   */
  array: require('./array'),
  age: require('./age'),
  choose: require('./choose'),
  pick: require('./pick'),
  pickset: require('./pickset'),
  join: require('./join'),
  regex: require('./regex'),
  inc: require('./inc'),
  date: require('./date'),
  now: require('./now'),
  resolve: require('./resolve'),
  substitute: require('./substitute'),
  indexOf: require('./indexOf'),

  /*
   * Geospatial data
   */
  address: require('./address'),
  coordinates: require('./coordinates'),
  point: require('./point'),
  linestring: require('./linestring'),
  polygon: require('./polygon'),
  geometries: require('./geometries'),

  /*
   * MongoDB native types
   */
  objectid: require('./objectid'),
  binary: require('./binary'),
  integer: require('./integer'),
  long: require('./long'),
  decimal: require('./decimal'),
  maxkey: require('./maxkey'),
  minkey: require('./minkey'),
  timestamp: require('./timestamp')
};
