import { update } from './render'

class Element {
  constructor(tagName, props, children) {
    if (typeof tagName !== 'string')
      throw new TypeError('Tag name must be a string')
    
    this._tagName = tagName
    this._props = props
    this._children = children
  }

  set props(newProps) {
    if (this._props) {
      this._props = newProps
      update()
    }
  }

  get props() { return this._props }
  

  set children(newChildren) {
    if (newChildren.length) {
      this._children = newChildren
      update()
    }
  }
  render() {
    const element = document.createElement(this._tagName)

    for(let propName in this._props) {
      element.setAttribute(propName, this._props[propName])
    }

    this._children.forEach((child, index) => {
      const _child = child instanceof Element? 
        child.render() : document.createTextNode(child)
      
      element.appendChild(_child)
    })

    return element
  }
}

export default function (tagName, props = {}, children = []) {
  return new Element(tagName, props, children)
}