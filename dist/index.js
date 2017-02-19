'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _render = require('./render');

Object.defineProperty(exports, 'attachToDOM', {
  enumerable: true,
  get: function get() {
    return _render.attachToDOM;
  }
});

var _el = require('./el');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_el).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }