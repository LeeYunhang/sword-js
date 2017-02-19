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