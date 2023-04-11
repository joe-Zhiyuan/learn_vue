<template>
  <div class="bag">
      <ul>
        <transition-group name="todo" appear>
          <li v-for="(item, index) in somesting" :key="item.id">
            <input type="checkbox" :checked="item.checked" @change="postCheckedStatus(item.id)">
            <!-- 不建议这么写，因为会修改somesting的值，修改props传入的值，违背了vue的原则 -->
            <!-- <input type="checkbox" v-model="item.checked"> -->
            <span v-show="!item.edit">{{item.content}}</span>
            <input 
              v-show="item.edit" 
              type="text" 
              :value="item.content" 
              @blur.capture="editLi(item, $event)"
              ref="inputChange"
            />
            <button v-show="!item.edit" @click="editBtn(item, index)">编辑</button>
            <button @click="removeLi(item.content, item.id)">删除</button>
          </li>
        </transition-group>
      </ul>
  </div>
</template>

<script>

  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'MyList',
    // 如果有子，孙组件使用，要逐层传递
    props: ['somesting', 'removeListId', 'postLiStatus'],
    data () {
      return {
      }
    },
    methods: {
      // 不能使用 delete 因为js已经占用了（delete obj.a）
      removeLi (content, id) {
        if (confirm(`确定删除 ${content} 吗？`)) {
          // this.removeListId(id)
          this.$bus.$emit('removeListId', id)
        }
      },
      // 数据在哪里，操作数据的方法（操作）就在那里，使用App的postLiStatus方法
      postCheckedStatus (id) {
        this.postLiStatus(id)
      },
      editBtn (item, index) {
        // 是否编辑过（有edit）
        if (!Object.prototype.hasOwnProperty.call(item, 'edit')) {
          this.$set(item, 'edit', true)
        } else {
          item.edit = true;
        }
        // $nextTick 一个回调函数，会在所有模板解析完毕后再执行回调函数
        this.$nextTick(function () {
          // this.$refs.inputChange 是数组 使用index来解决问题
          this.$refs.inputChange[index].focus();
        })
      },
      // 修改事件
      editLi (item, e) {
        if (e.target.value == '') {
          console.log("输入不能为空！")
          return false;
        } else {
          this.$bus.$emit('updateContent', item.id, e.target.value);
        }
        item.edit = false;
      }
    },
  }
</script>

<style scoped>
  li {
    width: 100%;
    height: 30px;
    line-height: 30px;
    margin-top: 16px;
  }
  li span {
    font-size: 16px;
    margin-left: 16px;
  }
  input[type="text"] {
    height: 30px;
    text-indent: 10px;
    margin-left: 16px;
    border: 1px solid #ccc;
  }
  input[type="checkbox"] {
    display:  inline-block;
    width: 18px;
    height: 18px;
    vertical-align: sub;
  }
  button {
    margin-left: 30px;
  }

  .todo-enter-active {
    animation: todoAnimate 1s ease-in-out;
  }
  .todo-leave-active {
    animation: todoAnimate 1s ease-in-out reverse;
  }
  @keyframes todoAnimate {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0); 
    }
  }
</style>