var dive = require('./common/fs/dive-paths');

dive('./common', function (list) {
  console.log(list);
});