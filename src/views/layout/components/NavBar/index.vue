<template>
<el-main class="ea-nav">
  <div class="ea-collapse" @click="handleCollapse" >
    <el-icon v-if="layout.collapse" ><Expand /></el-icon>
    <el-icon v-else ><Fold /></el-icon>
  </div>

  <el-breadcrumb class="ea-breadcrumb" separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }"><strong>首页</strong></el-breadcrumb-item>
    <template v-for="(item,index) in breadcrumb" :key="index">
      <el-breadcrumb-item v-if="item.meta.title">{{item.meta.title}}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
  <div class="ea-icon" @click="handleFullScreen">
      <el-icon  v-if="!fullScreen"  title="打开全屏"><FullScreen/></el-icon>
      <el-icon  v-else  title="关闭全屏"><Rank /></el-icon>
  </div>
  <el-dropdown>
      <div>
          <strong>管理员 </strong>
          <el-icon><arrow-down /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item> 当前角色: Admin </el-dropdown-item>
          <el-dropdown-item icon="avatar" > 个人信息 </el-dropdown-item>
          <el-dropdown-item icon="reading-lamp" @click="handleLoginOut"> 登出 </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
</el-main>

</template>

<script setup>
import { permissionStoe, layoutStoe } from '@/stores'
import { useRouter, useRoute } from 'vue-router'

import { watch, ref } from 'vue'

const layout = layoutStoe()
const router = useRouter()
const route = useRoute()
const permission = permissionStoe()

const breadcrumb = ref(route.matched)

watch(route, () => {
  breadcrumb.value = route.matched
})

const handleLoginOut = () => {
  permission.token = null
  router.push({ name: 'login' })
}

const handleCollapse = () => {
  layout.collapse = !layout.collapse
}

const fullScreen = ref(false)
const handleFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
    fullScreen.value = false
  } else {
    fullScreen.value = true
    document.documentElement.requestFullscreen()
  }
}

</script>

<style lang="scss" scoped>

.ea-nav {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0;

  .ea-collapse{
    font-size: 28px;
    line-height: 0;
  }
  .ea-icon{
    margin-left: auto;
    font-size: 20px;
    line-height: 0;
    margin-right: 20px;
  }
  .ea-breadcrumb {
    margin-left: 25px;
  }

}

</style>
