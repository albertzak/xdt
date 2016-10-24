'use strict'

var fs = require('fs')
var fsAccess = require('fs-access')
var iconv = require('iconv-lite')

var Xdt = function (options) {
  var RX = new RegExp(
    '^\\r?\\n?' +   // ignore leading newlines
    '(\\d{3})' +   // line length
    '(\\d{4})' +   // field id
    '(.*?)' +      // field data
    '\\r?\\n?$',  // match data until end of line or EOF
    'mg')         // match each line

  var FIELDS = {
    id: '3000',
    lastName: '3101',
    firstName: '3102',
    birthday: '3103',
    gender: '3110'
  }

  if (typeof options === 'undefined') {
    options = {}
  } if (!options.encoding) {
    options.encoding = 'ISO-8859-15'
  }

  this.options = options
  this.watcher = null

  this.open = function (path, callback) {
    var _this = this

    fsAccess(path, function (err) {
      if (err) { return callback(err, _this) }
      fs.readFile(path, function (err, buffer) {
        if (err) { return callback(err, _this) }

        _this.raw = iconv.decode(buffer, options.encoding)
        _this.fields = _this.parse()
        _this.patient = _this.patient()
        return callback(null, _this)
      })
    })

    return this
  }

  this.parse = function () {
    var match
    var matches = []
    while ((match = RX.exec(this.raw)) !== null) {
      match = {
        length: parseInt(match[1]),
        field: match[2],
        value: match[3]
      }

      matches.push(match)
    }

    return matches
  }

  this.patient = function () {
    return {
      id: this.first(FIELDS.id),
      firstName: this.first(FIELDS.firstName),
      lastName: this.first(FIELDS.lastName),
      birthday: this.first(FIELDS.birthday),
      gender: this.first(FIELDS.gender)
    }
  }

  this.first = function (searchField) {
    for (var i = 0; i < this.fields.length; i++) {
      if (this.fields[i].field === searchField) {
        return this.fields[i].value
      }
    }
  }

  this.find = function (searchField) {
    var results = []

    for (var i = 0; i < this.fields.length; i++) {
      if (this.fields[i].field === searchField) {
        results.push(this.fields[i].value)
      }
    }

    return results
  }

  return this
}

module.exports = Xdt
