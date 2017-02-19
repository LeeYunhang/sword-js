import patch from './patch'
import el from './element'
import diff from './diff'

let copyedTree, tree
let root
let timeoutId

export function attachToDOM(_root, _tree) {
  if (element.nodeType !== '1') {
    throw new 'first argument must be a element.'
  }

  root = _root
  tree = _tree
  copyedTree = copyTree(tree)
  let nodes = copyedTree.render()
  root.appendChild(nodes)
}

export function update() {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  
  timeoutId = setTimeout(() => {
    const patches = diff(copyedTree, tree)
    patch(root, patches)
    copyedTree = copyTree(tree)
  })

}


function copyTree(tree) {
  let children = tree.children.map((child) => copyTree(child))
  let tagName = tree.tagName
  let props = props

  return el(tagName, props, children)
}