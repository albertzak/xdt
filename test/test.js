var Xdt = require('../main.js');
var assert = require('assert');
var moment = require('moment');
var fs = require('fs');
var path = require('path');

var fixture = path.resolve('test/fixtures/gdt2_1-1.txt');
var fixture2 = path.resolve('test/fixtures/gdt2_1-2.txt');
var watchDir = path.resolve('test/fixtures/watch');
var watchFile = path.join(watchDir, 'watch.gdt');

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


  describe('.watch', function () {
    var xdt = null;

    beforeEach(function() {
      xdt = new Xdt();
    });

    it('parses added files', function(done) {
      if (fs.existsSync(watchFile)) fs.unlinkSync(watchFile);

      xdt.watch(watchDir, { delete: true }, function(err, doc) {
        assert.equal(doc.patient.lastName, 'Mustermann');
        doc.watcher.close();
        done();
        return;
      });

      setTimeout(function() {
        fs.createReadStream(fixture).pipe(fs.createWriteStream(watchFile));
      }, 100);
    });

    it('parses multiple added files', function(done) {
      if (fs.existsSync(watchFile + '.1')) fs.unlinkSync(watchFile + '.1');
      if (fs.existsSync(watchFile + '.2')) fs.unlinkSync(watchFile + '.2');

      var parsedFiles = [];

      xdt.watch(watchDir, { delete: true }, function(err, doc) {
        assert.equal(doc.patient.lastName, 'Mustermann');
        parsedFiles.push(doc);

        if (parsedFiles.length === 2) {
          doc.watcher.close();
          return done();
        }
      });

      setTimeout(function() {
        fs.createReadStream(fixture).pipe(fs.createWriteStream(watchFile + '.1'));
        fs.createReadStream(fixture2).pipe(fs.createWriteStream(watchFile + '.2'));
      }, 100);
    });

    it('optionally deletes file after parsing', function(done) {
      xdt.watch(watchDir, { delete: true }, function(err, doc) {
        assert.equal(doc.patient.lastName, 'Mustermann');
        assert.equal(fs.existsSync(watchFile), false);
        done();
        return;
      });

      setTimeout(function() {
        fs.createReadStream(fixture).pipe(fs.createWriteStream(watchFile));
      }, 100);
    });

    it('optionally keeps file after parsing', function(done) {
      xdt.watch(watchDir, { delete: false }, function(err, doc) {
        assert.equal(doc.patient.lastName, 'Mustermann');
        assert.equal(fs.existsSync(watchFile), true);
        fs.unlinkSync(watchFile);
        done();
        return;
      });

      setTimeout(function() {
        fs.createReadStream(fixture).pipe(fs.createWriteStream(watchFile));
      }, 100);
    });


    it('exposes function to close watcher', function() {
      assert.doesNotThrow(function() {
        var bdt = xdt.watch(watchDir, { delete: true }, function(err, doc) { });
        bdt.watcher.close();
      });
    });


  });

  describe('.parse', function () {
    var xdt = null;
    var fields = null;

    beforeEach(function(done) {
      xdt = new Xdt();
      xdt.open(fixture, function(err, xdt) {
        fields = xdt.parse(xdt.raw);
        done();
        return;
      });
    });

    it('should parse raw fields', function() {
      assert.equal(fields.length, 12);
      assert.equal(fields[0].field, '8000');
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

    it('should parse patient record', function() {
      assert.equal(xdt.patient.id, '02345');
      assert.equal(xdt.patient.firstName, 'Franz');
      assert.equal(xdt.patient.lastName, 'Mustermann');
      assert.equal(xdt.patient.gender, '1');
      assert.equal(xdt.patient.birthday.getTime(), moment('1945-10-01').toDate().getTime());
    });
  });

  describe('.first', function () {
    var xdt = null;

    beforeEach(function(done) {
      xdt = new Xdt();
      xdt.open(fixture, function(err, obj) {
        xdt = obj;
        done();
        return;
      });
    });

    it('should find the first by id', function() {
      assert.equal(xdt.first('8316'), 'PRAX_EDV')
    });
  });

  describe('.find', function () {
    var xdt = null;

    beforeEach(function(done) {
      xdt = new Xdt();
      xdt.open(fixture2, function(err, obj) {
        xdt = obj;
        done();
        return;
      });
    });

    it('should find all fields with the same id', function() {
      assert.deepEqual(xdt.find('6220'), [
        'Dies ist ein zweizeiliger',
        'Befund zur 24h-Blutdruckmessung.'
      ]);
    });
  });


});
