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