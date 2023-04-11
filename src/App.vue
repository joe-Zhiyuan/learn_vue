<template>
  <div id="app">
    <!-- 进行静态html分割时，进行一段一段分割 -->
    <MyHeader @getHeader="getHeaderData"></MyHeader>
    <MyList
      :somesting="arr"
      :removeListId="removeListId"
      :postLiStatus="postLiStatus"
    ></MyList>
    <MyFooter
      :somesting="arr"
      @getStatus="getStatus"
      :removeType="removeType"
      ref="foot"
    ></MyFooter>
  </div>
</template>

<script>
  import pubsub from 'pubsub-js'

  // 这里引入的顺序，影响style样式（没有scoped），不是使用顺序而是这里
  import MyHeader from "./components/MyHeader.vue";
  import MyList from "./components/MyList.vue";
  import MyFooter from "./components/MyFooter.vue";

  export default {
    name: "App",
    components: {
      MyHeader,
      MyList,
      MyFooter,
    },
    data() {
      return {
        arr: JSON.parse(localStorage.getItem('todoList')) || []
      };
    },
    methods: {
      // 数据在哪里，操作数据的方法就在哪里
      getHeaderData(obj) {
        console.log("App");

        if (this.arr.length > 0) {
          let isHave = false;
          this.arr.map((item) => {
            if (item.content == obj.content && item.id === obj.id) {
              isHave = true;
            }
          });
          if (isHave) {
            alert("事项已记录到列表！");
          } else {
            this.arr.unshift(obj);
          }
        } else {
          this.arr.unshift(obj);
        }
      },
      removeListId(id) {
        if (this.arr.length > 0) {
          this.arr.map((item, index) => {
            item.id == id && this.arr.splice(index, 1);
          });
        }
      },
      removeType(_, type) {
        if (type == "all") {
          this.arr = [];
        } else if (type == "checked") {
          console.log(this.arr)
          if (this.arr.length > 0) {
            this.arr = this.arr.filter(item => {
              return !item.checked
            })
          }
        }
      },
      getStatus(status) {
        // this.all = status;
        console.log(status);
        if (this.arr.length > 0) {
          this.arr.map((item) => {
            item.checked = status;
          });
        }
      },
      postLiStatus(id) {
        if (this.arr.length > 0) {
          this.arr.map((item) => {
            if (item.id === id) {
              // 去除全选勾选
              if (item.checked) {
                this.$refs.foot.checked = false;
              }
              // 改变选中框状态
              item.checked = !item.checked;
            }
          });
        }
      },
      // 修改list事件
      updateListCont (id, value) {
        if (this.arr.length > 0) {
          this.arr.map((item) => {
            if (item.id == id) {
              item.content = value;
            }
          });
        }
      }
    },
    watch: {
      arr: {
        deep: true,
        handler(value) {
          localStorage.setItem('todoList', JSON.stringify(value))
        },
      },
    },
    mounted () {
      // 使用 全局事件总线
      this.$bus.$on('removeListId', this.removeListId)
      // 消息订阅&发布
      this.pId = pubsub.subscribe('removeType', this.removeType)
      // 修改事件
      this.$bus.$on('updateContent', this.updateListCont)
    },
    beforeDestroy () {
      // 解除事件总线
      this.$bus.$off('removeListId')
      this.$bus.$off('updateContent')
      // 解除订阅
      pubsub.subscribe(this.pId)
    }
  };
</script>

<style scoped>
  /* css时分别写入对应组件 */
  #app {
    padding: 80px;
  }
</style>
