'use strict';

var fs = require('fs');
var fsAccess = require('fs-access');
var iconv = require('iconv-lite');

var Xdt = function(options) {

    if (typeof options === 'undefined')
      options = {}
    if ( ! options.encoding)
      options.encoding = 'ISO-8859-1';

    this.open = function(path, callback) {
      var _this = this;

      fsAccess(path, function(err) {
        if (err) return callback(err, _this);
        
      });
    };


  return this;

};

module.exports = Xdt;
