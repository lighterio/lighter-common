/**
 * Line Tree is a pythonic code parser which builds an array of nested lines.
 *
 * @origin https://github.com/lighterio/lighter-common/common/parse/line-tree.js
 * @version 0.0.1
 */

/**
 * Parse code with significant whitespace, generating an array of nested lines.
 *
 * @param  {string|Buffer} string  A string of code with significant whitespace.
 * @return {Array}                 An array of nested lines.
 */
var tree = module.exports = function (string) {

  // Number of spaces or tabs that equal an indent, based on the first indent found.
  var width = 0;

  // How many indents the current line is indented by.
  var indent = 0;

  // The current parent node.
  // Children will be of the form [line, column, content, children].
  var node = [];

  var stack = [node];
  var lines = string.split(/\r?\n/g);


  lines.replace(/\n(\s*)\S*/, function (match, space) {

  });
  for (var i = 0, l = lines.length; i < l; i++) {
    var line = lines[i];
    lines[i].replace(/^(\s*)(.*?)$/, function (match, spaces, content) {
      if (spaces &&)
    });
  }
};

function Line(parent, content) {

}