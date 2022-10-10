<template>
<el-main class="ea-nav">
  <div class="ea-collapse" @click="$emit('update:collapse', !layout.collapse)" >
    <el-icon v-if="layout.collapse" ><Expand /></el-icon>
    <el-icon v-else ><Fold /></el-icon>
  </div>

  <el-breadcrumb class="ea-breadcrumb" separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/' }"><strong>首页</strong></el-breadcrumb-item>
    <template v-for="(item,index) in breadcrumb" :key="index">
      <el-breadcrumb-item v-if="item.meta.title">{{item.meta.title}}</el-breadcrumb-item>
    </template>

  </el-breadcrumb>

  <el-dropdown class="ea-avatar">
      <div>
          <strong>管理员 </strong>
          <el-icon><arrow-down /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item> 当前角色: Admin </el-dropdown-item>
          <el-dropdown-item icon="avatar" > 个人信息 </el-dropdown-item>
          <el-dropdown-item icon="reading-lamp"> 登出 </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
</el-main>

</template>

<script setup>
import { layoutStoe } from '@/stores'
import { useRoute } from 'vue-router'
import { watch, ref } from 'vue'

const layout = layoutStoe()
const route = useRoute()

const breadcrumb = ref(route.matched)

watch(route, () => {
  breadcrumb.value = route.matched
})

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
  .ea-avatar{
    margin-left: auto;
  }
  .ea-breadcrumb {
    margin-left: 25px;
  }

}

</style>
