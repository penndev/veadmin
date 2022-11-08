<template>
  <el-container class="ea-layout">
    <el-aside class="ea-aside" :class="{'ea-aside-collapse': layout.collapse }">
      <div class="logo ">
        <img class="logoimg" src="@/assets/logo.svg">
        <h2 v-if="!layout.collapse" class="logotitle"> {{$env.VE_NAME}} </h2>
      </div>
      <AsideBar />
    </el-aside>
    <el-container class="ea-select">
      <el-header>
        <NavBar />
      </el-header>
      <HistoryBar />

        <router-view
          v-slot="{ Component }"
        >
          <el-main
            class="ea-main"
            v-loading="viewLoading.viewLoadingStatus"
            :element-loading-text="viewLoading.viewLoadingText"
          >
            <component :is="Component" />
          </el-main>
        </router-view>
    </el-container>

  </el-container>
</template>

<script setup>
import { AsideBar, NavBar, HistoryBar } from './components'
import { layoutStoe } from '@/stores'
// 加载网络请求时要打开loading dialog 防止多操作
import { viewLoading } from '@/stores/reactive'

// 通用组件布局
const layout = layoutStoe()

</script>

<style lang="scss" scoped>
@import '@/styles/variables.module.scss';

.ea-layout {
  display: flex;
  justify-content: space-between;

  .ea-aside {
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

  }

  .ea-aside-collapse {
    width: auto !important;
  }

  .ea-select {
    height: 100vh;

    .ea-main {
      width: auto !important;
      background-color: $mainBgcolor;
    }
  }

}
</style>
