<template>
<el-main class="ea-nav">
  <div class="ea-collapse" @click="$emit('update:collapse', !collapse)" >
    <el-icon v-if="collapse" ><Expand /></el-icon>
    <el-icon v-else ><Fold /></el-icon>
  </div>
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
defineProps(['collapse'])
defineEmits(['update:collapse'])
</script>

<style lang="scss" scoped>

.ea-nav {
  padding: 0;
  display: flex;
  align-items: center;
  height: 100%;
  .ea-collapse{
    font-size: 28px;
    line-height: 0;
  }
  .ea-avatar{
    margin-left: auto;
  }
}

</style>
