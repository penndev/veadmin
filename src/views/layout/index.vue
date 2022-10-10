<template>
    <el-container class="ea-layout">
      <el-aside class="ea-aside" :class="{'ea-aside--collapse': layout.collapse }" >
          <div class="logo "    >
            <img class="logoimg" src="@/assets/logo.svg">
            <h2 v-if="!layout.collapse" class="logotitle" > {{$env.VE_NAME}} </h2>
          </div>
          <AsideBar />
      </el-aside>
      <el-container>
        <el-header class="ea-header">
          <NavBar   />
        </el-header>
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

// 通用组件布局
const layout = layoutStoe()

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
