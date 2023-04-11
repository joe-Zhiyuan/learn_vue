<template>
  <div class="header">
    <input type="text" v-model="value" placeholder="请输入待办事项" @keyup.enter="postValue">
  </div>
</template>

<script>
  // uuid 生成全球唯一字符串
  // 引入生成id插件 nanoid随机Id
  // 使用了分别暴漏 必须使用{}
  import {nanoid} from 'nanoid'

  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'MyHeader',
    props: ['getHeaderData'],
    data () {
      return {
        value: '',
      }
    },
    methods: {
      // getHeaderData postValue不能同名，会出错，props&自定义事件都是vc身上的事件，导致冲突
      // postValue () {
      //   console.log('header')
      //   if (this.value.trim()) {
      //     let obj = {
      //       id: nanoid(),
      //       content: this.value,
      //       checked: false
      //     }
      //     // 通过App传过来的函数进行参数传递，App需要提前设置函数，MyHeader调用才能传递参数
      //     this.getHeaderData(obj)
      //     this.value = ''
      //   }
      // }

      // 自定义事件
      postValue () {
        if (this.value.trim()) {
          let obj = {
            id: nanoid(),
            content: this.value,
            checked: false
          }
          this.$emit('getHeader', obj)
          this.value = ''
        }

      }
    }
  }
</script>

<style scoped>
  .header {
    width: 100%;
    height: 30px;
  }
  .header input {
    width: 100%;
    height: 30px;
    line-height: 30px;
    border: 1px solid #ccc;
  }
  .bag {
    background: orange;
  }
</style>