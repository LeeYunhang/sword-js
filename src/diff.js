import { PROPS, REPLACE, TEXT, REORDER } from './util'
import Diff from 'list-diff2'

let patches = {}
let externalCount = 0

export default function diff(oldTree, newTree) {
  let index = 0
  externalCount = 0
  patches = {}
  dfsWalk(oldTree, newTree, index)

  return patches
}

function dfsWalk(oldNode, newNode, index) {
  let currentPatches = patches[index] = []

  if (!newNode) { }
  else if (typeof newNode === 'string' && typeof oldNode === 'string') {
    if (newNode !== oldNode) {
      currentPatches.push({ type: TEXT, node: newNode })
    }
  } else if (oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
    const diffPatches = diffProps(oldNode, newNode)

    if (diffPatches) {
      currentPatches.push({ type: PROPS, props: diffPatches })
    }

    if (!isIgnoreChildren(newNode)) {
      diffChildren(oldNode.children, newNode.children, currentPatches, index)
    }
  } else {
    currentPatches.push({ type: REPLACE, node: newNode })
  }

  patches[index] = currentPatches.length? currentPatches : []
}

function diffChildren(oldChildren, newChildren, currentPatches, index) {
  let moves = Diff(oldChildren, newChildren, 'key')

  if (moves.length) {
    currentPatches.push({ type: REORDER, moves })
  }

  oldChildren.forEach((oldChild, i) => {
    const newChild = newChildren[i]
    index = ++externalCount
    dfsWalk(oldChild, newChild, index)
  })
}

function diffProps(oldNode, newNode) {
  let isDiff = false
  let propsPatches = {}
  let oldProps = oldNode.props, newProps = newNode.props
  let total = Object.assign({}, oldProps, newProps)

  for(let key in total) {
    if (total[key] !== oldNode.props[key]) {
      propsPatches[key] = total[key]
      isDiff = true
    }
  }

  return isDiff? propsPatches : null
}

function isIgnoreChildren (node) {
  return (node.props && node.props.hasOwnProperty('ignore'))
}