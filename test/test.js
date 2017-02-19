'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = diff;

var _util = require('./util');

var _listDiff = require('list-diff2');

var _listDiff2 = _interopRequireDefault(_listDiff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var patches = {};
var externalCount = 0;

function diff(oldTree, newTree) {
  var index = 0;
  externalCount = 0;
  patches = {};
  dfsWalk(oldTree, newTree, index);

  return patches;
}

function dfsWalk(oldNode, newNode, index) {
  var currentPatches = patches[index] = [];

  if (!newNode) {} else if (typeof newNode === 'string' && typeof oldNode === 'string') {
    if (newNode !== oldNode) {
      currentPatches.push({ type: _util.TEXT, node: newNode });
    }
  } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
    var diffPatches = diffProps(oldNode, newNode);

    if (diffPatches) {
      currentPatches.push({ type: _util.PROPS, props: diffPatches });
    }

    if (!isIgnoreChildren(newNode)) {
      diffChildren(oldNode.children, newNode.children, currentPatches, index);
    }
  } else {
    currentPatches.push({ type: _util.REPLACE, node: newNode });
  }

  patches[index] = currentPatches.length ? currentPatches : [];
}

function diffChildren(oldChildren, newChildren, currentPatches, index) {
  var moves = (0, _listDiff2.default)(oldChildren, newChildren, 'key');

  if (moves.length) {
    currentPatches.push({ type: _util.REORDER, moves: moves });
  }

  oldChildren.forEach(function (oldChild, i) {
    var newChild = newChildren[i];
    index = ++externalCount;
    dfsWalk(oldChild, newChild, index);
  });
}

function diffProps(oldNode, newNode) {
  var isDiff = false;
  var propsPatches = {};
  var oldProps = oldNode.props,
      newProps = newNode.props;
  var total = Object.assign({}, oldProps, newProps);

  for (var key in total) {
    if (total[key] !== oldNode.props[key]) {
      propsPatches[key] = total[key];
      isDiff = true;
    }
  }

  return isDiff ? propsPatches : null;
}

function isIgnoreChildren(node) {
  return node.props && node.props.hasOwnProperty('ignore');
}
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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = patch;

var _util = require('./util');

var index = 0;
var patches = null;

function patch(node, _patches) {
  patches = _patches;
  index = 0;

  dfsWalk(node);
}

function dfsWalk(node) {
  var currentPatch = patches[index];
  var childNodes = Array.from(node.childNodes);

  childNodes.forEach(function (child, i) {
    index++;
    dfsWalk(child);
  });

  applyPatches(node, currentPatch);
}

function applyPatches(node, currentPatches) {
  currentPatches.forEach(function (patch, i) {
    switch (patch.type) {
      case _util.REPLACE:
        var newNode = typeof patch.node === 'string' ? document.createTextNode(patch.node) : patch.node.render();
        break;
      case _util.PROPS:
        setProps(node, patch.props);
        break;
      case _util.TEXT:
        node.textContent = patch.node;
        break;
      case _util.REORDER:
        reorderChildren(node, patch.moves);
        break;
      default:
        throw new TypeError('Unknown patch type ' + patch.type);
    }
  });
}

function reorderChildren(node, moves) {
  var childNodes = Array.from(node.childNodes);
  var maps = {};

  childNodes.filter(function (c) {
    return c.nodeType === 1 && c.getAttribute('key');
  }).forEach(function (c, i) {
    return maps[key] = c.getAttribute('key');
  });

  moves.forEach(function (move, i) {
    var _index = move.index;

    // remove item
    if (move.type === 0) {
      if (childNodes[_index] === node.childNodes[_index]) {
        node.removeChild(node.childNodes[_index]);
      }
      childNodes.splice(_index, 1);
    } else if (move.type === 1) {
      var tmp = maps[move.item.key];
      var insertedNode = tmp ? tmp : _typeof(move.item) === 'object' ? move.item.render() : document.createTextNode(move.item);
      childNodes.splice(_index, 0, insertedNode);
      node.insertBefore(insertedNode, node.childNodes[_index] || null);
    }
  });
}

function setProps(node, props) {
  for (var propName in props) {
    if (propName) {
      node.setAttribute(propName, props[propName]);
    } else {
      node.removeAttribute(propName);
    }
  }
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachToDOM = attachToDOM;
exports.update = update;

var _patch = require('./patch');

var _patch2 = _interopRequireDefault(_patch);

var _element = require('./element');

var _element2 = _interopRequireDefault(_element);

var _diff = require('./diff');

var _diff2 = _interopRequireDefault(_diff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var copyedTree = void 0,
    tree = void 0;
var root = void 0;
var timeoutId = void 0;

function attachToDOM(_root, _tree) {
  if (element.nodeType !== '1') {
    throw new 'first argument must be a element.'();
  }

  root = _root;
  tree = _tree;
  copyedTree = copyTree(tree);
  var nodes = copyedTree.render();
  root.appendChild(nodes);
}

function update() {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(function () {
    var patches = (0, _diff2.default)(copyedTree, tree);
    (0, _patch2.default)(root, patches);
    copyedTree = copyTree(tree);
  });
}

function copyTree(tree) {
  var children = tree.children.map(function (child) {
    return copyTree(child);
  });
  var tagName = tree.tagName;
  var props = props;

  return (0, _element2.default)(tagName, props, children);
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var REPLACE = exports.REPLACE = Symbol('replace');
var PROPS = exports.PROPS = Symbol('props');
var TEXT = exports.TEXT = Symbol('text');
var REORDER = exports.REORDER = Symbol('reorder');