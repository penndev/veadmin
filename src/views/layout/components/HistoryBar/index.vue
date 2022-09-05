<template>
  <div class="ve-history">
    <el-tabs type="card" closable
      v-model="selected"
      @tab-click="handleClicked"
    >
      <template v-for="(item,key,index) in history" :key="index" >

        <el-tab-pane v-if="item.meta" :name="key">
          <template #label>
            <span> <i class="hot" /> {{item.meta.title}}</span>
          </template>
        </el-tab-pane>

      </template>
    </el-tabs>

    <!--自定义右键菜单html代码-->
    <!-- <ul v-show="true" class="contextmenu" >
      <li> 关闭所有 </li>
      <li> 关闭左侧 </li>
      <li> 关闭右侧 </li>
      <li> 关闭其他 </li>
    </ul> -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['active', 'history', 'handleClicked'])
watch(props, () => {
  selected.value = props.active
})
const selected = ref(props.active)

</script>

<style lang="scss">

.ve-history {
  .el-tabs__header{
    margin: 0;
    .el-tabs__item.is-active {
      background-color: rgba(64, 158, 255, .08);
      border-bottom: 0;
    }
  }
  .hot{
    content: "";
    width: 9px;
    height: 9px;
    margin-right: 8px;
    display: inline-block;
    border-radius: 50%;
    background-color: #ccc;
  }
  .hot-active {
    background-color: var(--el-color-primary);
  }

}

</style>
