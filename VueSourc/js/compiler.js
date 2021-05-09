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

      // 创建 Wather 对象
      new Wather(this.vm, key, newValue => {
        node.textContent = newValue
      })
    }
  }
  compileElement(node) {
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      } else if (this.isHandeler(attrName)) {
        attrName = attrName.substr(2)
        let key = attr.value
        let handelName = attrName.split(':')[1]
        attrName = attrName.split(':')[0]
        this.update(node, key, attrName, handelName)
      }
    })
  }
  update(node, key, attrName, handelName) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn.call(this, node, key, this.vm[key], handelName)
  }
  textUpdater(node, key, value) {
    node.textContent = value
    new Wather(this.vm, key, newValue => {
      node.textContent = newValue
    })
  }
  modelUpdater(node, key, value) {
    node.value = value
    new Wather(this.vm, key, newValue => {
      node.value = newValue
    })
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }
  htmlUpdater(node, key, value) {
    node.innerHTML = value
    new Wather(this.vm, key, newValue => {
      node.textContent = newValue
    })
  }
  onUpdater(node, fun, name, handelName) {
    node.addEventListener(handelName, new Function(fun))
  }
  isTextNode(node) {
    return node.nodeType === 3
  }
  isElementNode(node) {
    return node.nodeType === 1
  }
  isDirective(attrName) {
    let reg = /^v-html|^v-model|^v-text/
    return reg.test(attrName)
  }
  isHandeler(attrName) {
    let reg = /^v-on/
    return reg.test(attrName)
  }
}
