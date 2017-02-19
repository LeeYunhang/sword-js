'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (tagName) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  return new Element(tagName, props, children);
};

var _render = require('./render');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Element = function () {
  function Element(tagName, props, children) {
    _classCallCheck(this, Element);

    if (typeof tagName !== 'string') throw new TypeError('Tag name must be a string');

    this._tagName = tagName;
    this._props = props;
    this._children = children;
  }

  _createClass(Element, [{
    key: 'render',
    value: function render() {
      var element = document.createElement(this._tagName);

      for (var propName in this._props) {
        element.setAttribute(propName, this._props[propName]);
      }

      this._children.forEach(function (child, index) {
        var _child = child instanceof Element ? child.render() : document.createTextNode(child);

        element.appendChild(_child);
      });

      return element;
    }
  }, {
    key: 'props',
    set: function set(newProps) {
      if (this._props) {
        this._props = newProps;
        (0, _render.update)();
      }
    },
    get: function get() {
      return this._props;
    }
  }, {
    key: 'children',
    set: function set(newChildren) {
      if (newChildren.length) {
        this._children = newChildren;
        (0, _render.update)();
      }
    }
  }]);

  return Element;
}();