<template>
  <div class="ve-history">
    <el-tabs type="card" closable>
      <el-tab-pane>
        <template #label>
          <span> <i class="hot"></i> 仪表盘</span>
        </template>
      </el-tab-pane>

      <el-tab-pane>
        <template #label>
          <span> <i class="hot hot-active"></i> 仪表盘</span>
        </template>
      </el-tab-pane>

    </el-tabs>

    <!--自定义右键菜单html代码-->
    <!-- <ul v-show="true" class="contextmenu" >
      <li> 关闭所有 </li>
      <li> 关闭左侧 </li>
      <li> 关闭右侧 </li>
      <li> 关闭其他 </li>
    </ul> -->
  </div>
</template>

<script setup>

</script>

<style lang="scss">

.ve-history {
  .el-tabs__header{
    margin: 0;
    .el-tabs__item.is-active {
      background-color: rgba(64, 158, 255, .08);
      border-bottom: 0;
    }
  }
  .hot{
    content: "";
    width: 9px;
    height: 9px;
    margin-right: 8px;
    display: inline-block;
    border-radius: 50%;
    background-color: #ccc;
  }
  .hot-active {
    background-color: var(--el-color-primary);
  }

}

</style>
