'use strict'

var Xdt = function (content) {
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

  this.parsePatient = function () {
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

  var match
  var matches = []
  while ((match = RX.exec(content)) !== null) {
    match = {
      length: parseInt(match[1]),
      field: match[2],
      value: match[3]
    }

    matches.push(match)
  }

  this.fields = matches
  this.patient = this.parsePatient()

  return this
}

module.exports = Xdt
