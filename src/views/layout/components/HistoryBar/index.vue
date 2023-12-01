<template>
  <div class="ve-history">
    <el-tabs
      v-model="selected"
      type="card"
      closable
      @tab-click="handleClicked"
      @tab-remove="handleRemove"
    >
      <template
        v-for="(item, key, index) in layoutHistory"
        :key="index"
      >
        <el-tab-pane
          v-if="item.meta"
          :name="key"
        >
          <template #label>
            <span @contextmenu.prevent="openMenu(key, $event)"><i class="hot" />{{ item.meta.title }}</span>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
    <div
      ref="veContextMenu"
      class="ve-contextmenu"
      @mouseleave="closeMenu"
    >
      <li
        class="el-menu-item"
        @click="closeOther"
      >
        关闭其他
      </li>
      <li
        class="el-menu-item"
        @click="closeAll"
      >
        关闭全部
      </li>
      <li
        class="el-menu-item"
        @click="closeLeft"
      >
        关闭左侧
      </li>
      <li
        class="el-menu-item"
        @click="closeRight"
      >
        关闭右侧
      </li>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const selected = ref(route.path) // 当前活动的plan select 会被watch捕获
const layoutHistory = ref({})
layoutHistory.value[route.path] = {
  path: route.path,
  name: route.name,
  meta: route.meta
}

watch(route, () => {
  layoutHistory.value[route.path] = {
    path: route.path,
    name: route.name,
    meta: route.meta
  }
  selected.value = route.path
})

// 点击跳转路由，
const handleClicked = (plan) => {
  router.push(plan.paneName)
}

// 点击移除某个历史
const handleRemove = (TabPanelName) => {
  if (TabPanelName === route.path) {
    ElMessage.warning('当前的菜单不可关闭！')
    return
  }
  delete layoutHistory.value[TabPanelName]
}

// 处理右键关闭按钮
const veContextMenu = ref(null)
const veContextMenuSelect = ref('')
const openMenu = (item, event) => {
  veContextMenuSelect.value = item
  veContextMenu.value.style.display = 'block'
  veContextMenu.value.style.top = event.y + 'px'
  veContextMenu.value.style.left = event.x + 'px'
}
const closeMenu = () => {
  veContextMenu.value.style.display = 'none'
}
const closeOther = () => {
  for (const item in layoutHistory.value) {
    if (item !== veContextMenuSelect.value) {
      delete layoutHistory.value[item]
    }
  }
  closeMenu()
}
const closeAll = () => {
  layoutHistory.value = {}
  layoutHistory.value[route.path] = {
    path: route.path,
    name: route.name,
    meta: route.meta
  }
  closeMenu()
}
const closeRight = () => {
  let d = false
  for (const item in layoutHistory.value) {
    if (d && item !== selected.value) delete layoutHistory.value[item]
    if (item === veContextMenuSelect.value) d = true
  }
  closeMenu()
}
const closeLeft = () => {
  let d = false
  for (const item in layoutHistory.value) {
    if (item === veContextMenuSelect.value) d = true
    if (d === false && item !== selected.value) delete layoutHistory.value[item]
  }
  closeMenu()
}
</script>

<style lang="scss">
.ve-history {
  border-top: 1px solid var(--el-color-white);

  .el-tabs__header {
    margin: 0;

    .el-tabs__item.is-active {
      background-color: rgba(64, 158, 255, .08);
      border-bottom: 0;
    }
  }

  .hot {
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

  .ve-contextmenu {
    z-index: 9;
    width: 120px;
    margin: 0;
    padding: 0;
    position: absolute;
    display: none;
    background-color: var(--el-menu-bg-color);
    border: 1px solid var(--el-border-color-light);

    .el-menu-item {
      height: 36px;
    }
  }
}
</style>
