<template>
  <el-scrollbar style="height: calc(100vh - 60px)">
    <!-- <transition :duration="{ enter: 800, leave: 100 }" mode="out-in" name="el-fade-in-linear"> -->
      <el-menu
        unique-opened
        :collapse="collapse"
        :background-color="variables.sidebarBgcolor"
        :text-color="variables.sidebarColor"
      >
      <!--  -->
        <MenuItem v-for="(item, index) in routes" :key="index" :item="item" />
      </el-menu>
    <!-- </transition> -->
  </el-scrollbar>
</template>

<script setup>
import MenuItem from './MenuItem.vue'
import variables from '@/styles/variables.module.scss'
defineProps(['routes', 'collapse'])
</script>
