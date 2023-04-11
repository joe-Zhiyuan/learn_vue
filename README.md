# learn_vue

## 笔记

## 不同版本Vue

vue.js（完整版：核心+模板解析器）与vue.runtime.xxx.js（没有模板解析器[没有模板解析器
不能使用template配置项，需使用render函数接收createElement函数指定返回具体内容（元素）]）

## 修改vue默认配置(main.js等)

vue inspect > output.js 输出vue配置文件
vue.config.js进行配置，vue-cli网站API查看配置项，webpack替换

## ref属性

用来给元素或子组件注册引用信息[打标识]（代替id）
在html标签上获取是真实的dom元素，在组件标签上的是组件实例对象（vc）
ref="h1" this.$refs.h1

## props配置项

让组件接收外部传进来的数据
<Student name="Joe"></Student>
简写 props:['name'] 限制类型 props: {'name': String} 
完整写法 props: {
  'name': {
    type: String, // 类型
    required: true, // 是否必传
    default: 'qiao' // 默认值
  }
}

## mixin混入[混合]

把多个组件共用配置提取混成一个对象
1.定义混合 const a = {...} 导出 export
2.在使用处引入 import 全局使用 main.js Vue.mixin(xxx) 局部使用 mixins: [xxx]

## 插件（自定义，使用其他）

用于增强Vue
包含install方法的一个对象，install是必须的，第一个参数是Vue,第二个以后的参数是使用时传递的数据
定义：对象.install = function (Vue, option) {
  ...可以添加 全局过滤器、指令、混入、在 prototype 上添加实例方法
}
使用：Vue.use()

## scoped样式

防止css文件冲突，只在自己组件内生效
通过type可以指定css类型 less/sess/stulys等，默认css

## todo案例

1.组件化编码流程：
  1.拆分静态页面：按功能点拆分，命名不要与html元素冲突
  2.实现动态组件：考虑好数据存放位置，数据是一个还是多个组件使用
    一个组件使用：放在组件自身
    多个组件使用：放在共同父组件上（状态提升）
  3.实现交互：从绑定事件开始
2.props适用于：
  1.父组件==>子组件 通信
  2.子组件==>父组件 通信（要去父组件先定义一个函数，通过函数参数传值）
3.使用v-model时：v-model绑定的值不能是props传过来的值，因为props是不可以修改的
4.props传过来的对象修改其中属性是不会报错（不是基础类型），不推荐这样做

## webStorage存储

1.存储内容大小一般在5MB(浏览器不同)
2.浏览器通过window.localStorage&window.sessionStorage来实现本地存储
3.API
  xxxStorage.setItem('key', 'value')
  xxxStorage.getItem('key')
  xxxStorage.removeItem('key')
  xxxStorage.clear()
4.备注
  sessionStorage会话随窗口关闭清除
  localStorage需要手动清除
  获取getItem('key')获取不到会返回null,JSON.parse(null)结果依然是null

## 组件自定义事件 $emit $on $off

一种组件间的通信方式，适用于子组件--->父组件
A父B子 B--->A A中给B绑定自定义事件（事件回调在A中）
绑定自定义事件
  1.在父组件 <children @getName="demo"/>
  2.在父组件 mounted(){ this.$ref.$on('getName', this.name) }
  3.若只想事件执行一次，可以使用事件修饰符 once 等 ($once)
触发自定义事件
  this.$emit('getName', this.name)
解绑自定义事件
  this.$off('getName')
组件上也可以使用原生事件，需使用事件修饰符（native）
通过mounted绑定的自定义事件，回调函数(demo)，需要在methods中，或者使用箭头函数，不然this指向出现问题

## 全局事件总线 $bus

1.一种组件间通信的方式，适用于任意组件间的通信
2.安装全局事件总线
  new Vue({
    ...something,
    beforeCreate() {
      Vue.prototype.$bus = this // 安装全局事件总线，$bus就是当前应用的vm
    },
    ...something
  })
3.使用事件总线
  1.接收数据:A组件想接收数据，则在A组件中定义给$bus绑定自定义事件，事件回调在A组件自身上
    methods: {
      demo(data){...something}
    }
    mounted() {
      this.$bus.$on('xxx', this.demo)
    }
  2.提供数据:在B组件身上触发$bus身上自定义方法
    this.$bus.$emit('xxx', this.name)
4.最后最好在beforeDestroy钩子中使用$off('xxx')去解绑当前组件(A组件)所使用的事件，防止占用冲突等

## 消息订阅&发布(pubsub)

1.一种组件间通信的方式，适用于任意组件间通信
2.安装pubsub: npm install pubsub-js
    引入 import pubsub from 'pubsub-js'
    接收数据
      this.pid = pubsub.subscribe('xxx', (msgName, data) => {
        ...something
      })
    发布数据
      pubsub.publish('xxx', data)
3.最好在beforeDestroy钩子，使用pubsub.unsubscribe(pid)去解除订阅

## $nextTick

1.this.nextTick(回调函数)
2.在下一次DOM更新结束后执行其指定的回调
3.当改变数据后，要基于更新后的数据进行一些操作时，要在nextTick所指定的回调函数中执行

## 过渡&动画

作用：在插入、更新或移除DOM元素时，在合适的时候给元素添加样式类名
写法：1.准备好样式
        元素进入的样式：
          v-enter:进入的起点
          v-enter-active:进入的过程中
          v-enter-to:进入的终点
        元素离开的样式：
          v-leave:离开的起点
          v-leave-active:离开的过程中
          v-leave-to:离开的终点
      2.使用<transition></transition>包裹需要过度的元素，并配置name[类名替换v]（是否初始使用appear）
      3.多个元素使用需<transition-group></transition-group>,并子元素需要key值