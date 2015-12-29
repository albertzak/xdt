var Xdt = require('../main.js');
var assert = require('assert');

describe('Xdt', function() {
  describe('.open', function () {
    var xdt = null;

    beforeEach(function() {
      xdt = new Xdt();
    });

    it('should check for file permissions', function(done) {
      assert.doesNotThrow(function() {
        xdt.open('file-which-does-not-exist', function(err, data) {
          assert(err.code === 'ENOENT');
          done();
          return;
        });
      });
    });
  });

});
