class Compiler {
  constructor(vm) {
    this.vm = vm
    this.el = vm.$el
    this.compile(this.el)
  }

  compile(el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        this.compileElement(node)
      }
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  compileText(node) {
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])
    }
  }
  compileElement(node) {
    // console.log(node.attributes)
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      }
    })
  }
  update(node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, key, this.vm[key])
  }
  textUpdater(node, key, value) {
    node.textContent = value
    new Wather(this.vm, key, newValue => {
      node.textContent = newValue
    })
  }
  moduleUpdater(node, key, value) {
    node.value = value
    new Wather(this.vm, key, newValue => {
      node.value = newValue
    })
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
}
