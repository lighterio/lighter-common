var Emitter = require('../common/event/emitter');
var Flagger = require('../common/event/flagger');

describe('Events', function () {

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

    it('.prototype.on adds a single listener', function (done) {
      var o = new Emitter();
      o.on('e', done);
      o.emit('e');
    });

    it('.prototype.on adds 2 listeners', function (done) {
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

    it('.prototype.on adds 3 listeners', function (done) {
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

    it('.prototype.once only fires once', function (done) {
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

    it('.prototype.emit emits data arguments', function () {
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

    it('.prototype.listeners returns an empty array if there are no listeners', function () {
      var o = new Emitter();
      is.same(o.listeners(), []);
    });

    it('.prototype.listeners returns an empty array if there are no listeners for that event type', function () {
      var o = new Emitter();
      o.on('a', function () {});
      is.same(o.listeners('b'), []);
    });

    it('.prototype.listeners returns a singleton array if there is one matching listener', function () {
      var o = new Emitter();
      o.on('a', function () {});
      is.same(o.listeners('a'), [function () {}]);
    });

    it('.prototype.listeners returns an array if there are many matching listeners', function () {
      var o = new Emitter();
      o.on('a', function () {});
      o.on('a', function () {});
      is.same(o.listeners('a'), [function () {}, function () {}]);
    });

    it('.prototype.removeListener removes a listener', function () {
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

    it('.prototype.once fires an event once', function () {
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

  describe('Flagger', function () {

    it('has all expected methods', function () {
      var o = {};
      Flagger.decorate(o);
      is.function(o.on);
      is.function(o.emit);
      is.function(o.removeListener);
      is.function(o.removeAllListeners);
      is.function(o.once);
      is.function(o.getFlag);
      is.function(o.setFlag);
      is.function(o.when);
    });

    it('.prototype.setFlag sets a flag', function () {
      var o = {};
      Flagger.decorate(o);
      o.setFlag('ready');
      is(o._flags.ready, true);
      o.setFlag('mode', 'server');
      is(o._flags.mode, 'server');
    });

    it('.prototype.getFlag gets the value of a flag', function () {
      var o = {};
      Flagger.decorate(o);
      o.setFlag('phase', 1);
      is(o.getFlag('phase'), 1);
    });

    it('.prototype.when runs when a flag is true', function () {
      var o = {c: ''};
      Flagger.decorate(o);
      o.when('ready', function () {
        o.c += 'a';
      });
      is(o.c, '');
      o.setFlag('ready');
      is(o.c, 'a');
      o.when('ready', function () {
        o.c += 'b';
      });
      is(o.c, 'ab');
    });

    it('.prototype.when runs when a flag has a value', function () {
      var o = {c: ''};
      Flagger.decorate(o);
      o.when('ready', function () {
        o.c += 'a';
      });
      is(o.c, '');
      o.setFlag('ready');
      is(o.c, 'a');
      o.when('ready', function () {
        o.c += 'b';
      });
      is(o.c, 'ab');
    });

  });

});