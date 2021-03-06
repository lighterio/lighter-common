/**
 * Evaluate a non-strict JSON string and return its value.
 *
 * @origin https://github.com/lighterio/lighter-common/common/json/evaluate.js
 * @version 0.0.1
 */

JSON.evaluate = function (js, fallback) {
  delete JSON.evaluate.error; // jshint ignore:line
  try {
    eval('JSON.evaluate.value=' + js); // jshint ignore:line
    return JSON.evaluate.value;
  }
  catch (error) {
    error.message += '\nJS: ' + js;
    JSON.evaluate.error = error;
    return fallback;
  }
};
