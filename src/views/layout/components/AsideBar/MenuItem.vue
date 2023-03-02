<template>
  <!-- 首先处理存在 meta数据的菜单。 -->
  <template v-if="item.meta && item.meta.hidden != true">
    <!-- 1,优先处理外链 如果存在 item.meta.path 则直接打开 -->
    <template v-if="item.meta.path">
      <li v-if="allow && (allow == '*' || allow.indexOf(item.name) != -1)" class="el-menu-item" role="menuitem"
        tabindex="-1" @click="handleOpen(item.meta.path)">
        <el-icon v-if="item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.title }}{{ allow }}</span>
      </li>
    </template>

    <!-- 2,优先处理单菜单，不存在children 则属于单菜单 -->
    <template v-else-if="!item.children">
      <el-menu-item v-if="allow && (allow == '*' || allow.indexOf(item.name) != -1)" :index="item.path">
        <el-icon v-if="item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <!-- 菜单组，需要嵌套循环 -->
    <template v-else-if="item.children">
      <el-sub-menu v-if="allow && (allow == '*' || allow.indexOf(item.name) != -1)" :index="item.path">
        <template #title>
          <el-icon v-if="item.meta.icon">
            <component :is="item.meta.icon" />
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <MenuItem v-for="(item, index) in item.children" :key="index" :item="item" :allow="allow" />
      </el-sub-menu>
      <template v-else>
        <MenuItem v-for="(item, index) in item.children" :key="index" :item="item" :allow="allow" />
      </template>
    </template>

  </template>
  <!-- 处理特殊layout单路由 -->
  <template
    v-else-if="item.children && item.children.length == 1 && allow && (allow == '*' || allow.indexOf(item.children[0].name) != -1)">
    <el-menu-item :index="item.children[0].path">
      <el-icon v-if="item.children[0].meta.icon">
        <component :is="item.children[0].meta.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.children[0].meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>
<script setup>
defineProps(['item', 'allow'])

const handleOpen = (url) => {
  window.open(url, '_bank')
}
</script>
