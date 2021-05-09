class Vue {
  constructor(options) {
    // 获取传入参数，并且创建 dom 根节点，供后面方法使用
    this.$options = options
    this.$el =
      typeof options.el === 'string'
        ? document.querySelector(options.el)
        : options.el
    this.$data = options.data || {}
    this._proxyData(this.$data)
    this.Observer = new Observer(this.$data)
    new Compiler(this)
  }
  _proxyData(data) {
    Object.keys(data).forEach(key => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (newValue === data[key]) {
            return
          }
          data[key] = newValue
        },
      })
    })
  }
  set(target,key,value){
    this.Observer.defineReactive(this.$data[target],key,value)
  }
}
