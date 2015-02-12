/**
 * Add to an exception's stack.
 *
 * @origin https://github.com/lighterio/lighter-common/common/error/restack.js
 * @version 0.0.1
 */

var delimiter = '\n  ' + (new Array(21)).join('-') + '\n';

module.exports = Error.prototype.restack = restack;

function restack() {
  var self = this;
  var here = new Error();
  try {
    throw here;
  }
  catch (e) {
    here = here.stack.split('\n').slice(2).join('\n');
    self.stack = self.stack.replace(/\n/, function () {
      return '\n' + here + delimiter;
    });
  }
  return self.stack;
}