var Emitter = require('../common/event/emitter');
var doNothing = function () {};

describe('Emitter', function () {

  it('has all expected methods', function () {
    var o = {};
    Emitter.decorate(o);
    is.function(o.on);
    is.function(o.once);
    is.function(o.emit);
    is.function(o.removeListener);
    is.function(o.removeAllListeners);
    is.function(o.once);
  });

  describe('.prototype.on', function () {

    it('adds a single listener', function (done) {
      var o = new Emitter();
      o.on('e', done);
      o.emit('e');
    });

    it('adds 2 listeners', function (done) {
      var o = new Emitter();
      var f = function (d) { o.c += 'f' + d; };
      var g = function (d) { o.c += 'g' + d; };
      o.c = '';
      o.on('e', f);
      o.on('e', g);
      o.emit('e', 1);
      is(o.c, 'f1g1');
      done();
    });

    it('adds 3 listeners', function (done) {
      var o = {c: ''};
      Emitter.decorate(o);
      var f = function (d) { o.c += 'f' + d; };
      var g = function (d) { o.c += 'g' + d; };
      var h = function (d) { o.c += 'h' + d; };
      o.on('e', f);
      o.on('e', g);
      o.on('e', h);
      o.emit('e');
      is(o.c, 'fundefinedgundefinedhundefined');
      done();
    });

  });

  describe('.prototype.once', function () {

    it('only fires once', function (done) {
      var o = new Emitter();
      o.c = '';
      var f = function (d) { o.c += 'f' + d; };
      o.once('e', f);
      o.emit('e', 1);
      is(o.c, 'f1');
      o.emit('e', 2);
      is(o.c, 'f1');
      done();
    });

  });

  describe('.prototype.emit', function () {

    it('emits data arguments', function () {
      var o = {c: ''};
      Emitter.decorate(o);
      var f = function () {
        var a = Array.prototype.slice.call(arguments);
        o.c += '[' + a.join(',') + ']';
      };
      o.on('c', f);
      o.emit('c');
      o.emit('c', 1);
      o.emit('c', 1, 2);
      o.emit('c', 1, 2, 3);
      is(o.c, '[][1][1,2][1,2,3]');
    });

  });

  describe('.prototype.listeners', function () {

    it('returns an empty array if there are no listeners', function () {
      var o = new Emitter();
      is.same(o.listeners(), []);
    });

    it('returns an empty array if there are no listeners for that event type', function () {
      var o = new Emitter();
      o.on('a', function () {});
      is.same(o.listeners('b'), []);
    });

    it('returns a singleton array if there is one matching listener', function () {
      var o = new Emitter();
      o.on('a', function () {});
      is.same(o.listeners('a'), [function () {}]);
    });

    it('returns an array if there are many matching listeners', function () {
      var o = new Emitter();
      o.on('a', function () {});
      o.on('a', function () {});
      is.same(o.listeners('a'), [function () {}, function () {}]);
    });

  });

  describe('.prototype.removeListener', function () {

    it('removes a listener', function () {
      var o = {c: ''};
      Emitter.decorate(o);
      var f = function () {
        var a = Array.prototype.slice.call(arguments);
        o.c += '[' + a.join(',') + ']';
      };
      o.on('c', f);
      o.emit('c');
      o.emit('c', 1);
      o.removeListener('c', f);
      o.emit('c', 1, 2);
      o.on('c', f);
      o.emit('c', 1, 2, 3);
      is(o.c, '[][1][1,2,3]');
    });

  });

  describe('.prototype.once', function () {

    it('fires an event once', function () {
      var o = {c: ''};
      Emitter.decorate(o);
      var f = function () {
        var a = Array.prototype.slice.call(arguments);
        o.c += '[' + a.join(',') + ']';
      };
      o.emit('c');
      o.once('c', f);
      o.emit('c', 1);
      o.emit('c', 1, 2);
      is(o.c, '[1]');
    });

  });

  describe('.defaultMaxListeners', function () {

    it('is 10', function (done) {
      var o = new Emitter();
      for (var i = 0; i < 10; i++) {
        o.on('a', function () {});
      }
      try {
        o.on('a', function () {});
      }
      catch (e) {
        done();
      }
    });

  });

  describe('.prototype.setMaxListeners', function () {

    it('treats 0 as unlimited', function () {
      var o = new Emitter();
      o.setMaxListeners(0);
      is(o._maxListeners, Infinity);
      for (var i = 0; i < 1e4; i++) {
        o.on('a', doNothing);
      }
    });

    it('works with 1', function (done) {
      var o = new Emitter();
      o.setMaxListeners(1);
      o.on('a', doNothing);
      try {
        o.on('a', doNothing);
      }
      catch (e) {
        done();
      }
    });

    it('works with > 1', function (done) {
      var o = new Emitter();
      o.setMaxListeners(2);
      o.on('a', doNothing);
      o.on('a', doNothing);
      try {
        o.on('a', doNothing);
      }
      catch (e) {
        done();
      }
    });

  });

});
