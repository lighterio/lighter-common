var LruCache = require('../common/object/lru-cache');

ddescribe('LruCache', function () {

  describe('.init', function () {

    it('works without options', function () {
      var cache = new LruCache();
      is.object(cache);
    });

    it('works with a maxSize option', function () {
      var cache = new LruCache({maxSize: 2});
      is.object(cache);
      is(cache.maxSize, 2);
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      var a = cache.get('a');
      var b = cache.get('b');
      var c = cache.get('c');
      is.undefined(a);
      is(b, 2);
      is(c, 3);
    });

  });

  describe('.clear', function () {

    it('removes cached items', function () {
      var cache = new LruCache();
      cache.set('a', 1);
      var a = cache.get('a');
      cache.clear();
      a = cache.get('a');
      is.undefined(a);
      is(cache.size, 0);
    });

  });

  describe('.getMap', function () {

    it('returns a key-value map', function () {
      var cache = new LruCache();
      cache.set('a', 1);
      var map = cache.getMap();
      is.same(map, {a: 1});
    });

    it('is ordered by last used', function () {
      var cache = new LruCache({maxSize: 2});
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      var map = cache.getMap();
      is.same(map, {c: 3, b: 2});
    });

  });

  describe('.getKeys', function () {

    it('returns an array of keys', function () {
      var cache = new LruCache();
      cache.set('a', 1);
      var keys = cache.getKeys();
      is.same(keys, ['a']);
    });

    it('is ordered by last used', function () {
      var cache = new LruCache({maxSize: 2});
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      var keys = cache.getKeys();
      is.same(keys, ['c', 'b']);
    });

  });

  describe('.getValues', function () {

    it('returns an array of values', function () {
      var cache = new LruCache();
      cache.set('a', 1);
      var keys = cache.getValues();
      is.same(keys, [1]);
    });

    it('is ordered by last used', function () {
      var cache = new LruCache({maxSize: 2});
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      var keys = cache.getValues();
      is.same(keys, [3, 2]);
    });

  });

  describe('.getItems', function () {

    it('returns an array of values', function () {
      var cache = new LruCache();
      cache.set('a', 1);
      var items = cache.getItems();
      is.same(items[0].value, 1);
    });

    it('is ordered by last used', function () {
      var cache = new LruCache({maxSize: 2});
      cache.set('a', 1);
      cache.set('b', 2);
      cache.set('c', 3);
      var items = cache.getItems();
      is.same(items[0].value, 3);
      is.same(items[1].value, 2);
    });

  });

});