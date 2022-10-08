<template>
  <div class="ve-history">
    <el-tabs type="card" closable
      v-model="selected"
      @tab-click="handleClicked"
    >
      <template v-for="(item,key,index) in layout.history" :key="index" >

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
import { useRoute, useRouter } from 'vue-router'
import { layoutStoe } from '@/stores'

const layout = layoutStoe() // 通用组件布局
const router = useRouter()
const route = useRoute()

watch(route, () => {
  layout.history[route.path] = {
    path: route.path,
    name: route.name,
    meta: route.meta
  }
  selected.value = route.path
})

// 判断当前页面是否存在历史list里面 不存在则添加
if (!(route.path in layout.history)) {
  layout.history[route.path] = {
    path: route.path,
    name: route.name,
    meta: route.meta
  }
}

// 当前活动的plan
const selected = ref(route.path)

// 变更历史标签页。
const handleClicked = (plan) => {
  router.push(plan.paneName)
}

</script>

<style lang="scss">

@import '@/styles/variables.module.scss';

.ve-history {
  border-top: 1px solid $mainBgcolor;

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
