var Flagger = require('../common/event/flagger');

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

  describe('.prototype.setFlag', function () {

    it('sets a flag', function () {
      var o = {};
      Flagger.decorate(o);
      o.setFlag('ready');
      is(o._flags.ready, true);
      o.setFlag('mode', 'server');
      is(o._flags.mode, 'server');
    });

  });

  describe('.prototype.getFlag', function () {

    it('gets the value of a flag', function () {
      var o = {};
      Flagger.decorate(o);
      o.setFlag('phase', 1);
      is(o.getFlag('phase'), 1);
    });

  });

  describe('.prototype.when', function () {

    it('runs when a flag is true', function () {
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

    it('runs when a flag has a value', function () {
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
