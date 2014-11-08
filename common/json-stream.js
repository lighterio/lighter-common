/**
 * @lighter json-stream.js
 * @version 0.0.0
 */

// Get and create non-strict JSON, allowing us to
// re-create errors and other non-JSON-friendly objects
// After they are transported.
require('./scriptify');

/**
 * Get lines from a stream, and fire a "json" event
 * when a line is successfully parsed as JSON.
 */
JSON.readStream = function (stream) {
  var data = '';
  stream.on('data', function (chunk) {
    data += chunk;
    var end = data.indexOf('\n');
    while (end > 0) {
      chunk = data.substr(0, end);
      data = data.substr(end + 1);
      var object;
      try {
        object = JSON.eval(chunk);
      }
      catch (e) {
        object = e;
      }
      if (object) {
        stream.emit('json', object);
      }
      end = data.indexOf('\n');
    }
  });
  return stream;
};

/**
 * Write non-strict JSON objects to a stream.
 */
JSON.writeStream = function (stream) {
  var write = stream.write;
  stream.write = function (object) {
    var js = JSON.scriptify(object);
    write.call(stream, js + '\n');
  };
  return stream;
};
