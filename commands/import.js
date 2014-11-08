/**
 * Usage:
 *   lighter-common import [options] <path1> <path2> ...
 *
 * Options:
 *   -d, --dry-run         Show what would be changed, but don't change anything.
 */

var fs = require('fs');
var mkdirp = require('../common/fs/mkdirp-sync.js');
var dirname = require('path').dirname;
var sourceDir = dirname(__dirname) + '/common/';
var destDir = process.cwd() + '/common/';
var options, keys;

module.exports = function (input) {
  options = input;
  keys = input.$;
  keys.forEach(function (key) {
    var path = key.replace(/(\/[^\.]+)$/, '$1.js');
    var source = sourceDir + path;
    var dest = destDir + path;
    if (fs.existsSync(source)) {
      if (!options.dryRun) {
        var content = fs.readFileSync(source);
        var dir = dirname(dest);
        mkdirp(dir, function (error) {
          if (error) throw error;
          fs.writeFileSync(dest, content);
        });
      }
      console.log('IMPORTED: '.green + shorten(source).cyan + ' > '.grey + dest);
    }
    else {
      console.error('File not found: "' + source + '".');
    }
  });
};

function shorten(path) {
  var dirs = [[process.cwd(), '.'], [process.env.HOME, '~']];
  for (var i = 0; i < 2; i++) {
    var dir = dirs[i];
    if (dir[0] && (path.indexOf(dir[0]) === 0)) {
      return dir[1] + path.substr(dir[0].length);
    }
  }
}
