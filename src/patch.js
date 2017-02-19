import { REPLACE, PROPS, TEXT, REORDER } from './util'

let index = 0
let patches = null

export default function patch(node, _patches) {
  patches = _patches
  index = 0

  dfsWalk(node)
}

function dfsWalk(node) {
  const currentPatch = patches[index]
  const childNodes = Array.from(node.childNodes)

  childNodes.forEach((child, i) => {
    index++
    dfsWalk(child)
  })

  applyPatches(node, currentPatch)
}

function applyPatches(node, currentPatches) {
  currentPatches.forEach((patch, i) => {
    switch(patch.type) {
      case REPLACE:
        let newNode = typeof patch.node === 'string'?
          document.createTextNode(patch.node) :
          patch.node.render()
        break
      case PROPS:
        setProps(node, patch.props)
        break
      case TEXT:
        node.textContent = patch.node
        break
      case REORDER:
        reorderChildren(node, patch.moves)
        break
      default:
       throw new TypeError('Unknown patch type ' + patch.type)
    }
  })
}

function reorderChildren(node, moves) {
  let childNodes = Array.from(node.childNodes)
  let maps = {}

  childNodes.filter(c => c.nodeType === 1 && c.getAttribute('key'))
    .forEach((c, i) => maps[key] = c.getAttribute('key'))

  moves.forEach((move, i) => {
    let _index = move.index
    
    // remove item
    if (move.type === 0) {
      if (childNodes[_index] === node.childNodes[_index]) {
        node.removeChild(node.childNodes[_index])
      }
      childNodes.splice(_index, 1)
    } else if (move.type === 1) {
      let tmp = maps[move.item.key]
      let insertedNode = tmp? tmp : 
        (typeof move.item === 'object')?
          move.item.render() : document.createTextNode(move.item)
      childNodes.splice(_index, 0, insertedNode)
      node.insertBefore(insertedNode, node.childNodes[_index] || null)
    }
  })
}

function setProps(node, props) {
  for (let propName in props) {
    if (propName) {
      node.setAttribute(propName, props[propName])
    } else {
      node.removeAttribute(propName)
    }
  }  
}