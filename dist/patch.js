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