<template>
    <el-container class="ea-layout">
      <el-aside class="ea-aside">
          <div class="logo" >
            <img class="logoimg" src="@/assets/logo.svg">
            <h2 v-if="!collapse" class="logotitle" > {{ $env.VITE_NAME }} </h2>
          </div>
          <AsideBar :routes="routelist" :collapse="collapse" />
      </el-aside>

      <el-main class="ea-main">
        <router-view></router-view>
      </el-main>

    </el-container>
</template>

<script setup>

import { resolve } from 'path'
import { ref } from 'vue'
import router from '@/route'
import AsideBar from './AsideBar/index.vue'
// 收起状态
const collapse = ref(false)

// 格式化路由数据
const routerAll = (routes) => {
  const routelist = []
  const formatRouteChildren = (children, basePath) => {
    children.path = resolve(basePath, children.path)
    if (children.children) {
      for (const item of children.children) { formatRouteChildren(item, children.path) }
    }
  }
  for (const item of routes) {
    formatRouteChildren(item, '/')
    routelist.push(item)
  }
  return routelist
}

const routelist = routerAll(router.options.routes)

</script>

<style lang="scss" scoped>
@import '@/styles/variables.module.scss';

.ea-layout{
    display: flex;
    justify-content:space-between;
    // background-color: var(--ve-backgound-color);
    .ea-aside{
      width: 220px;
      text-align: center;
      background-color: $sidebarBgcolor;

        height: 100vh;
        .logo {
          .logoimg {
            width: 30px;
            height: 30px;
            vertical-align: middle;
            background: #fff;
            border-radius: 50%;
            padding: 3px;
          }
          .logotitle {
            display: inline-block;
            color: #fff;
            font-weight: 600;
            font-size: 20px;
            vertical-align: middle;
            padding-left: 10px;
        }
        }

    }
    .ea-main{
      width: auto !important;
    }
}

</style>
