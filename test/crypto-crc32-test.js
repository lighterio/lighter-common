var crc32 = require('../common/crypto/crc32');
var crc32b = require('../common/crypto/crc32b');

ddescribe('CRC32', function () {

  var i = 0;
  this.passCount = 1e6;

  bench('benchmark', function () {

    it('crc32', function () {
      crc32('advertiser' + (++i));
      if (i == 1e6) {
        i = 0;
      }
    });

    it('crc32b', function () {
      crc32b('advertiser' + (++i));
      if (i == 1e6) {
        i = 0;
      }
    });

    /*it('xxhash', function () {
      var b = new Buffer('advertiser' + (++i));
      xxhash(b, 0xCAFEBABE);
      if (i == 1e6) {
        i = 0;
      }
    });*/

  });

});
