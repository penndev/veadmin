<template>
    <el-container class="ea-layout">
      <el-aside class="ea-aside" :class="{'ea-aside--collapse': layout.collapse }" >
          <div class="logo "    >
            <img class="logoimg" src="@/assets/logo.svg">
            <h2 v-if="!layout.collapse" class="logotitle" > {{$env.VE_NAME}} </h2>
          </div>
          <AsideBar
            :routes="routelist"
            :collapse="layout.collapse"
            :active="routerActive"
           />
      </el-aside>
      <el-container>
        <el-header class="ea-header">
          <NavBar  v-model:collapse="layout.collapse" :breadcrumb="breadcrumb" />
        </el-header>
        <!-- <HistoryBar class="ea-history" :active="routerActive" :history="history" :handleClicked="handleClicked" /> -->
        <HistoryBar />
        <el-main class="ea-main">
          <router-view></router-view>
        </el-main>
      </el-container>

    </el-container>
</template>

<script setup>
import { AsideBar, NavBar, HistoryBar } from './components'
import { layoutStoe } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

import { watch, ref } from 'vue'

const router = useRouter()
const route = useRoute()
watch(route, () => {
  breadcrumb.value = route.matched
  routerActive.value = route.path
  history.value[route.path] = routeInfo(route)
})

// 处理历史标签页 解引用
const routeInfo = (route) => {
  return {
    path: route.path,
    name: route.name,
    meta: route.meta
  }
}

// 通用组件布局
const layout = layoutStoe()

// 处理监听路由的面包屑
const breadcrumb = ref(route.matched)

// 处理侧边栏路由列表
const routelist = router.options.routes
const routerActive = ref(route.path)

// 历史标签栏
const history = ref({})
history.value[route.path] = routeInfo(route)
// const handleClicked = (plan) => {
//   router.push(plan.paneName)
// }
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
    // .ea-header {
    // }
    .ea-history{
      border-top: 1px solid $mainBgcolor;
    }

    .ea-main{
      width: auto !important;
      background-color: $mainBgcolor;
    }
    .ea-container {
      background-color: #fff;
    }
}

</style>
