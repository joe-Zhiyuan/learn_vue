// 整个项目的入口文件

// 引入vue文件 不包含模板解析器，打包时不要 ue核心 + 模板解析器 没有模板解析器参与打包 [esm: ES6 module] [common]
import Vue from 'vue'
// 引入App组件 所有组件的父组件
import App from './App.vue'

// 关闭vue生产提示
Vue.config.productionTip = false


new Vue({
  el: '#app',
  render: createElement => createElement(App),
  beforeCreate() {
    Vue.prototype.$bus = this
  }
})

