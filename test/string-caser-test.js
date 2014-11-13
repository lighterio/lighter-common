var caser = require('../common/string/caser');

describe('String Caser', function () {

  describe('.split', function () {

    it('splits camel-cased names into words', function () {
      var words = caser.split('theseAreWords');
      is.same(words, ['these', 'Are', 'Words']);
    });

    it('splits spaced names into words', function () {
      var words = caser.split('these Are Words');
      is.same(words, ['these', 'Are', 'Words']);
    });

    it('splits double-spaced names into words', function () {
      var words = caser.split('these  are  words');
      is.same(words, ['these', 'are', 'words']);
    });

    it('splits underscored names into words', function () {
      var words = caser.split('these_are_words');
      is.same(words, ['these', 'are', 'words']);
    });

    it('splits hyphenated names into words', function () {
      var words = caser.split('these-are-words');
      is.same(words, ['these', 'are', 'words']);
    });

  });



  describe('.camel', function () {

    it('outputs camel-cased names', function () {
      var name = caser.camel('Make this a name');
      is(name, 'makeThisAName');
    });

  });

  describe('.title', function () {

    it('outputs title-cased names', function () {
      var name = caser.title('Make this a name');
      is(name, 'MakeThisAName');
    });

  });

  describe('.snake', function () {

    it('outputs snake-cased names', function () {
      var name = caser.snake('Make this a name');
      is(name, 'make_this_a_name');
    });

  });

  describe('.scream', function () {

    it('outputs scream-cased names', function () {
      var name = caser.scream('Make this a name');
      is(name, 'MAKE_THIS_A_NAME');
    });

  });

  describe('.oxford', function () {

    it('outputs oxford-cased names', function () {
      var name = caser.oxford('Make this a name');
      is(name, 'Make_This_A_Name');
    });

  });

  describe('.spinal', function () {

    it('outputs spinal-cased names', function () {
      var name = caser.spinal('Make this a name');
      is(name, 'make-this-a-name');
    });

  });

  describe('.train', function () {

    it('outputs train-cased names', function () {
      var name = caser.train('Make this a name');
      is(name, 'MAKE-THIS-A-NAME');
    });

  });

});
