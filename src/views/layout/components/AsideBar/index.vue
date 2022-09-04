<template>
  <el-scrollbar style="height: calc(100vh - 60px)">
      <el-menu
        unique-opened
        :collapse="collapse"
        :collapse-transition="false"
        :background-color="variables.sidebarBgcolor"
        :text-color="variables.sidebarColor"
        :router="true"
        :default-active="active"
      >
        <MenuItem v-for="(item, index) in routes" :key="index" :item="item" />
      </el-menu>
  </el-scrollbar>
</template>

<script setup>
import MenuItem from './MenuItem.vue'
import variables from '@/styles/variables.module.scss'
defineProps(['routes', 'collapse', 'active'])

</script>

<style scoped>
.el-menu {
  border: 0;
}
</style>
