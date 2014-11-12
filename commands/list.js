/**
 * Usage:
 *   lighter-common list [options] ...
 *
 * Options:
 *   -g, --grep        Only show the modules that match an expression.
 *   -i, --ignore      Ignore modules that match an expression.
 */

var fs = require('fs');
var commonDir = __dirname.replace(/commands$/, 'common');
var pattern = /\.js$/;
var list = [];
var wait = 0;
var grep;
var ignore;

module.exports = function (input) {
  grep = getRegExp(input.grep, /^.*$/);
  ignore = getRegExp(input.ignore, /^$/);
  wait++;
  find(commonDir, 1);
  unwait();
};

function getRegExp(string, value) {
  if (string) {
    try {
      value = new RegExp(string);
    }
    catch (e) {
      console.log('Invalid expression: ' + ('"' + string + '"').green);
    }
  }
  return value;
}

function find(path, isMaster) {
  wait++;
  fs.lstat(path, function (error, stat) {
    if (!error && !stat.isSymbolicLink()) {
      if (pattern.test(path)) {
        list.push(path);
        unwait();
        return;
      }
      wait++;
      fs.readdir(path, function (error, files) {
        if (files) {
          files.forEach(function (file) {
            find(path + '/' + file);
          });
        }
        unwait();
      });
    }
    unwait();
  });
}

function unwait() {
  if (!--wait) {
    finish();
  }
}

function finish() {
  list.sort();
  list.forEach(function (path) {
    var content = '' + fs.readFileSync(path);
    var version;
    content.replace(/@version (\S+)/, function (match, v) {
      version = v;
    });
    var name = path.substr(commonDir.length + 1).replace(pattern, '');
    if (grep.test(name) && !ignore.test(name)) {
      console.log(name + (' @' + version).green);
    }
  });
}
