<template>
  <div v-if="total">
    <!-- <input type="checkbox" :checked="isAll" @click="postC"> -->
    <input type="checkbox" v-model="isAll">
    <span>已完成{{ checkLength }}/全部{{ total }}项</span>
    <button @click="removeType">删除选中项目</button>
  </div>
</template>

<script>
  import pubsub from 'pubsub-js'

  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'MyFooter',
    props: ['somesting'],
    methods: {
      removeType () {
        pubsub.publish('removeType', 'checked')
      },
    },
    computed: {
      checkLength () {
        // return this.somesting.filter(item => item.checked).length;
        // 使用数组统计方法 reduce pre上一个返回结果（第一次是 0 开始统计时的值） item 数组的元素 index 下表 arr 数组本体
        return this.somesting.reduce((pre, item)  => {
          return pre + (item.checked ? 1 : 0)
        }, 0)
      },
      total () {
        return this.somesting.length
      },
      isAll: {
        get () {
          return this.checkLength === this.total && this.total > 0
        },
        set (val) {
          // val 本身返回时boolean值，而且 input checkBox也是boolean值
          // this.getStatus(val);
          this.$emit('getStatus', val);
        }
      }
    },
  }
</script>

<style scoped>
  div {
    margin-top: 20px;
  }
</style>