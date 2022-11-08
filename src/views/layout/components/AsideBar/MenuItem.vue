<template>
  <li v-if="item.meta && item.meta.path" class="el-menu-item" role="menuitem" tabindex="-1" @click="handleOpen(item.meta.path)">
    <el-icon v-if="item.meta.icon">
      <component :is="item.meta.icon" />
    </el-icon>
    <span>{{item.meta.title}}</span>
  </li>
  <el-menu-item v-else-if="item.meta && !item.children && item.meta.hidden != true" :index="item.path">
    <el-icon v-if="item.meta.icon">
      <component :is="item.meta.icon" />
    </el-icon>
    <template #title>
      <span>{{ item.meta.title }}</span>
    </template>
  </el-menu-item>
  <el-menu-item v-else-if="item.children && item.children.length == 1" :index="item.children[0].path">
    <el-icon v-if="item.children[0].meta.icon">
      <component :is="item.children[0].meta.icon" />
    </el-icon>
    <template #title>
      <span>{{ item.children[0].meta.title }}</span>
    </template>
  </el-menu-item>
  <!-- 多组 -->
  <el-sub-menu v-else-if="item.meta && item.children && item.children.length > 1" :index="item.path">

    <template #title>
      <el-icon v-if="item.meta.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </template>
    <MenuItem v-for="(item, index) in item.children" :key="index" :item="item" />
  </el-sub-menu>

</template>
<script setup>
defineProps(['item'])
const handleOpen = (url) => {
  window.open(url, '_bank')
}
</script>
