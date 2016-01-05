'use strict';

var fs = require('fs');
var fsAccess = require('fs-access');
var iconv = require('iconv-lite');
var _ = require('lodash');
var moment = require('moment');
var chokidar = require('chokidar');

var Xdt = function(options) {

    var RX = new RegExp(
       '^\\r?\\n?'   // ignore leading newlines
     + '(\\d{3})'    // line length
     + '(\\d{4})'    // field id
     + '(.*?)'       // field data
     + '\\r?\\n?$',  // match data until end of line or EOF
       'mg');         // match each line


    var FIELDS = {
      id: '3000',
      lastName: '3101',
      firstName: '3102',
      birthday: '3103',
      gender: '3110'
    };

    if (typeof options === 'undefined')
      options = {}
    if ( ! options.encoding)
      options.encoding = 'ISO-8859-15';

    this.options = options;
    this.watcher = null;

    this.open = function(path, callback) {
      var _this = this;

      fsAccess(path, function(err) {
        if (err) return callback(err, _this);
        fs.readFile(path, function (err, buffer) {
          if (err) return callback(err, _this);

          _this.raw = iconv.decode(buffer, options.encoding);
          _this.fields = _this.parse();
          _this.patient = _this.patient();
          return callback(null, _this);
        });
      });

      return this;
    };

    this.watch = function(path, watchOptions, callback) {
      var _this = this;

      this.watcher = chokidar.watch(path, {
        ignored: /[\/\\]\./,
        ignoreInitial: true,
        persistent: true
      });

      this.watcher
        .on('error', function(err) { callback(err, _this); })
        .on('add', function(path) {
          _this.open(path, function(err, doc) {
            if (err) return callback(err, _this);

            if (watchOptions.delete) {
              fs.unlink(path, function(err) {
                if (err) return callback(err, _this);
                callback(null, doc);
              });
            } else {
              callback(null, doc);
            }
          });
        });

      return this;
    };

    this.parse = function() {
      var match;
      var matches = [];
      while ((match = RX.exec(this.raw)) !== null) {
        match = {
          length: parseInt(match[1]),
          field: match[2],
          value: match[3]
        };

        matches.push(match);
      }

      return matches;
    };

    this.patient = function() {
      return {
        id: this.first(FIELDS.id),
        firstName: this.first(FIELDS.firstName),
        lastName: this.first(FIELDS.lastName),
        birthday: moment(this.first(FIELDS.birthday), 'DDMMYYYY').toDate(),
        gender: this.first(FIELDS.gender)
      }
    };

    this.first = function(field) {
      var field;
      field = _.find(this.fields, function(p) {
        return p.field === field;
      });

      return field && field.value;
    };

    this.find = function(field) {
      var field;
      return _(this.fields)
        .filter(function(p) { return p.field === field; })
        .map(function(p) { return p.value; })
        .value();
    };


  return this;

};

module.exports = Xdt;
