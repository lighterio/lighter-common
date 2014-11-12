/**
 * Usage:
 *   lighter-common sync [options]
 *
 * Options:
 *   -d, --dry-run         Show what would be changed, but don't change anything.
 */

var fs = require('fs');
var dirname = require('path').dirname;
var mkdirp = require('../common/fs/mkdirp-sync.js');
var pattern = /\/common\/(.*?\.js)$/;
var map = {};
var wait = 0;
var commonDir = __dirname.replace(/commands$/, 'common');
var getDir = require('path').dirname;
var options;

module.exports = function (input) {
  options = input;
  wait++;
  find(commonDir, 1);
  find(process.cwd());
  unwait();
};

function find(path, isMaster) {
  wait++;
  fs.lstat(path, function (error, stat) {
    if (!error && !stat.isSymbolicLink()) {
      if (pattern.test(path)) {
        found(path, stat, isMaster);
        unwait();
        return;
      }
      wait++;
      fs.readdir(path, function (error, files) {
        if (files) {
          var ignore;
          try {
            ignore = '' + fs.readFileSync(path + '/.gitignore');
            ignore = ignore.split('\n');
            //console.log(ignore);
          }
          catch (e) {
            ignore = [];
          }
          files.forEach(function (file) {
            if (ignore.indexOf(file) < 0) {
              find(path + '/' + file, isMaster);
            }
          });
        }
        unwait();
      });
    }
    unwait();
  });
}

function found(path, stat, isMaster) {
  path.replace(pattern, function (match, key) {
    var file = {
      path: path,
      time: stat.mtime
    };
    var item = map[key] || (map[key] = {minions: []});
    if (isMaster) {
      item.master = file;
    }
    else {
      item.minions.push(file);
      item.minions.sort(function (a, b) {
        return b.time - a.time;
      });
    }
  });
}

function unwait() {
  if (!--wait) {
    finish();
  }
}

function finish() {
  var key, item, path, master, minions, minion;
  for (key in map) {
    item = map[key];
    master = item.master || 0;
    minions = item.minions;
    minion = minions[0] || 0;
    if (!master || (minion.time > master.time)) {
      item.master = copy('Merged'.yellow, minions[0].path, commonDir + '/' + key);
    }
  }
  for (key in map) {
    item = map[key];
    master = item.master;
    minions = item.minions;
    if (master) {
      item.minions.forEach(function (minion) {
        if (master.time > minion.time) {
          copy('Updated'.green, master.path, minion.path);
        }
      });
    }
  }
}

function copy(direction, source, dest) {
  function report() {
    console.log(direction + ': '.gray + shorten(source).cyan + ' > '.gray + shorten(dest));
  }
  var content = '' + fs.readFileSync(source);
  var original = '';
  if (!/@version/.test(content)) {
    var origin = source.replace(/^.*\/(lighter-common\/)/, '$1');
    content = '/**\n * @origin ' + origin + '\n * @version 0.0.1\n */\n\n' + content;
  }
  if (fs.existsSync(dest)) {
    original += fs.readFileSync(dest);
  }
  if (options.dryRun) {
    if (content != original) {
      direction = direction.replace(/ed/, 'e');
      report();
    }
  }
  else {
    if (content != original) {
      var dir = dirname(dest);
      mkdirp(dir, function () {
        fs.writeFileSync(dest, content);
      });
      report();
    }
  }
  return {
    path: dest,
    time: new Date()
  };
}

function shorten(path) {
  var dirs = [[process.cwd(), '.'], [process.env.HOME, '~']];
  for (var i = 0; i < 2; i++) {
    var dir = dirs[i];
    if (dir[0] && (path.indexOf(dir[0]) === 0)) {
      return dir[1] + path.substr(dir[0].length);
    }
  }
}