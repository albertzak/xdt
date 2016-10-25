/* eslint-env mocha */
var Xdt = require('../main.js')
var assert = require('assert')
var path = require('path')

var fixture = path.resolve('test/fixtures/gdt2_1-1.txt')
var fixture2 = path.resolve('test/fixtures/gdt2_1-2.txt')

describe('Xdt', function () {
  describe('.open', function () {
    var xdt = null

    beforeEach(function () {
      xdt = new Xdt()
    })

    it('should check for file permissions', function (done) {
      assert.doesNotThrow(function () {
        xdt.open('file-which-does-not-exist', function (err) {
          assert.equal(err.code, 'ENOENT')
          done()
          return
        })
      })
    })

    it('should read file', function (done) {
      xdt.open(fixture, function (err) {
        assert.equal(err, null)
        done()
        return
      })
    })
  })

  describe('.fromString', function () {
    var xdt = null

    beforeEach(function () {
      xdt = new Xdt()
    })

    it('should parse patient', function () {
      assert.equal(xdt.fromString('0193101Mustermann\r\n0143102Frank').patient.firstName, 'Frank')
    })
  })

  describe('.parse', function () {
    var xdt = null
    var fields = null

    beforeEach(function (done) {
      xdt = new Xdt()
      xdt.open(fixture, function (err, xdt) {
        assert.equal(err, null)
        fields = xdt.parse(xdt.raw)
        done()
        return
      })
    })

    it('should parse raw fields', function () {
      assert.equal(fields.length, 12)
      assert.equal(fields[0].field, '8000')
    })
  })

  describe('.patient', function () {
    var xdt = null

    beforeEach(function (done) {
      xdt = new Xdt()
      xdt.open(fixture, function (err, obj) {
        assert.equal(err, null)
        xdt = obj
        done()
        return
      })
    })

    it('should parse patient record', function () {
      assert.equal(xdt.patient.id, '02345')
      assert.equal(xdt.patient.firstName, 'Franz')
      assert.equal(xdt.patient.lastName, 'Mustermann')
      assert.equal(xdt.patient.gender, '1')
      assert.equal(xdt.patient.birthday, '01101945')
    })
  })

  describe('.first', function () {
    var xdt = null

    beforeEach(function (done) {
      xdt = new Xdt()
      xdt.open(fixture, function (err, obj) {
        assert.equal(err, null)
        xdt = obj
        done()
        return
      })
    })

    it('should find the first by id', function () {
      assert.equal(xdt.first('8316'), 'PRAX_EDV')
    })
  })

  describe('.find', function () {
    var xdt = null

    beforeEach(function (done) {
      xdt = new Xdt()
      xdt.open(fixture2, function (err, obj) {
        assert.equal(err, null)
        xdt = obj
        done()
        return
      })
    })

    it('should find all fields with the same id', function () {
      assert.deepEqual(xdt.find('6220'), [
        'Dies ist ein zweizeiliger',
        'Befund zur 24h-Blutdruckmessung.'
      ])
    })
  })
})
