var Xdt = require('../main.js');
var assert = require('assert');
var moment = require('moment');

var fixture = 'test/fixtures/gdt2_1-1.txt';

describe('Xdt', function() {
  describe('.open', function () {
    var xdt = null;

    beforeEach(function() {
      xdt = new Xdt();
    });

    it('should check for file permissions', function(done) {
      assert.doesNotThrow(function() {
        xdt.open('file-which-does-not-exist', function(err) {
          assert.equal(err.code, 'ENOENT');
          done();
          return;
        });
      });
    });

    it('should read file', function(done) {
      xdt.open(fixture, function(err) {
        assert.equal(err, null);
        done();
        return;
      });
    });
  });

  describe('.parse', function () {
    var xdt = null;
    var parsed = null;

    beforeEach(function(done) {
      xdt = new Xdt();
      xdt.open(fixture, function(err, xdt) {
        parsed = xdt.parse(xdt.raw);
        done();
        return;
      });
    });

    it('should parse raw fields', function() {
      assert.equal(parsed.length, 12);
      assert.equal(parsed[0].field, '8000');
    });
  });

  describe('.patient', function () {
    var xdt = null;

    beforeEach(function(done) {
      xdt = new Xdt();
      xdt.open(fixture, function(err, obj) {
        xdt = obj;
        done();
        return;
      });
    });

    it('should parse raw fields', function() {
      assert.equal(xdt.patient.id, '02345');
      assert.equal(xdt.patient.firstName, 'Franz');
      assert.equal(xdt.patient.lastName, 'Mustermann');
      assert.equal(xdt.patient.gender, '1');
      assert.equal(xdt.patient.birthday.getTime(), moment('1945-10-01').toDate().getTime());
    });
  });

});
