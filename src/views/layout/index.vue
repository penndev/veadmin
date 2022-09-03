<template>
    <el-container class="ea-layout">
      <el-aside class="ea-aside" :class="{'ea-aside--collapse': layout.collapse }" >
          <div class="logo "    >
            <img class="logoimg" src="@/assets/logo.svg">
            <h2 v-if="!layout.collapse" class="logotitle" > {{ $env.VITE_NAME }} </h2>
          </div>
          <AsideBar :routes="routelist" :collapse="layout.collapse" />
      </el-aside>
      <el-container>
        <el-header class="ea-header">
          <NavBar  v-model:collapse="layout.collapse" />
        </el-header>
        <el-main class="ea-main">
          <router-view></router-view>
        </el-main>
      </el-container>

    </el-container>
</template>

<script setup>
import { AsideBar, NavBar } from './components'

import { resolve } from 'path'
import router from '@/router'

import layoutStoe from '@/stores/layout'

const layout = layoutStoe()

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

    .ea-aside{
      width: 200px;
      text-align: center;
      background-color: $sidebarBgcolor;
      height: 100vh;
      .logo {
        background: $sidebarBgcolor;
        height: 60px;
        align-items: center;
        justify-content: center;
        display: flex;
        color: #fff;
        .logoimg {
          width: 30px;
          height: 30px;
          background: #fff;
          border-radius: 50%;
        }
        .logotitle {
          width: auto;
          display: inline-block;
          font-weight: 600;
          font-size: 20px;
          padding-left: 10px;
        }
      }
      .el-menu {
        border: 0;
      }
    }
    .ea-aside--collapse {
      width: auto !important;
    }
    .ea-header {
      height: 60px;
      margin-bottom: 1px;
    }

    .ea-main{
      width: auto !important;
      background-color: $mainBgcolor;
    }
}

</style>
