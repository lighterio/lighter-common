var ArrayMap = require('../common/object/array-map');

ddescribe('ArrayMap', function () {

  it('works without constructor arguments', function () {
    var map = new ArrayMap();
    is.array(map);
  });

  it('works with constructor arguments', function () {
    var map = new ArrayMap(2);
    is.array(map);
  });

  describe('.set', function () {

    it('prevents duplicate push calls', function () {
      var map = new ArrayMap();
      is.array(map);
      map.set('a', 1);
      map.set('b', 2);
      map.set('b', 3);
      is.same(map, [1, 3]);
    });

  });

});
