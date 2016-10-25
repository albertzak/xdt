/* eslint-env mocha */
var Xdt = require('../main.js')
var fs = require('fs')
var assert = require('assert')
var path = require('path')

var fixture = fs.readFileSync(path.resolve('test/fixtures/gdt2_1-1.txt'))
var fixture2 = fs.readFileSync(path.resolve('test/fixtures/gdt2_1-2.txt'))

describe('Xdt', function () {
  describe('constructor', function () {
    it('should parse patient', function () {
      assert.equal(new Xdt('0193101Mustermann\r\n0143102Frank').patient.firstName, 'Frank')
    })

    it('should parse raw fields', function () {
      assert.equal(new Xdt(fixture).fields.length, 12)
      assert.equal(new Xdt(fixture).fields[0].field, '8000')
    })
  })

  describe('patient', function () {
    it('should parse patient record', function () {
      assert.equal(new Xdt(fixture).patient.id, '02345')
      assert.equal(new Xdt(fixture).patient.firstName, 'Franz')
      assert.equal(new Xdt(fixture).patient.lastName, 'Mustermann')
      assert.equal(new Xdt(fixture).patient.gender, '1')
      assert.equal(new Xdt(fixture).patient.birthday, '01101945')
    })
  })

  describe('first', function () {
    it('should find the first by id', function () {
      assert.equal(new Xdt(fixture).first('8316'), 'PRAX_EDV')
    })
  })

  describe('find', function () {
    it('should find all fields with the same id', function () {
      assert.deepEqual(new Xdt(fixture2).find('6220'), [
        'Dies ist ein zweizeiliger',
        'Befund zur 24h-Blutdruckmessung.'
      ])
    })
  })
})
