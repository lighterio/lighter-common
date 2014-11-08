/**
 * Decorate a given object with another object's prototype.
 *
 * @origin lighter-common/common/object/decorate.js
 * @version 0.0.1
 */

var proto = Object.prototype;

// When re-required, don't redefine.
if (proto.decorate) {
  return;
}

Object.defineProperty(proto, 'decorate', {

  // Don't expose the `decorate` method.
  enumerable: false,

  // Take an object and give it this object's prototype methods.
  value: function (object) {
    var proto = this.prototype;

    // If no object is passed, make one.
    object = object || {};

    // Only copy properties if they don't already exist.
    for (var key in proto) {
      if (typeof object[key] == 'undefined') {
        object[key] = proto[key];
      }
    }

    return object;
  }

});
