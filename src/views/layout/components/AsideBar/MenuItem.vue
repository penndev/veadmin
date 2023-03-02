<template>
  <!-- 首先处理存在 meta数据的菜单。 -->
  <template v-if="item.meta && item.meta.hidden != true && allow && (allow == '*' || allow.indexOf(item.name) != -1)">
    <!-- 1,优先处理外链 如果存在 item.meta.path 则直接打开 -->
    <li v-if="item.meta.path" class="el-menu-item" role="menuitem" tabindex="-1" @click="handleOpen(item.meta.path)">
      <el-icon v-if="item.meta.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </li>
    <!-- 2,优先处理单菜单，不存在children 则属于单菜单 -->
    <el-menu-item v-else-if="!item.children" :index="item.path">
      <el-icon v-if="item.meta.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 菜单组，需要嵌套循环 -->
    <el-sub-menu v-else-if="item.children" :index="item.path">
      <template #title>
        <el-icon v-if="item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <MenuItem v-for="(item, index) in item.children" :key="index" :item="item" :allow="allow" />
    </el-sub-menu>
  </template>
  <!-- 处理特殊layout单路由 -->
  <template v-else-if="item.children && item.children.length == 1 && allow  && (allow == '*' || allow.indexOf(item.children[0].name) != -1)">
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
