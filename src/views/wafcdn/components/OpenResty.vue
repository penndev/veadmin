<template>
  <el-card>
    <el-popover
      :content="statusData.versionInfo"
      class="box-item"
      placement="bottom"
    >
      <template #reference
        ><el-tag effect="dark" type="success"
          >{{ statusData.version }}
        </el-tag></template
      >
    </el-popover>
    <el-tag type="primary" link v-if="statusData.status"> 已启动 </el-tag>
    <el-tag type="error" link v-else>停止</el-tag>
    <el-button type="primary" @click="loadStart" link>启动</el-button>
    <el-button type="primary" @click="loadStop" link>停止</el-button>
    <el-button type="primary" @click="loadReload" link>重载</el-button>
  </el-card>
</template>

<style lang="css" scoped>
.el-tag {
  margin-right: 20px;
}
</style>

<script setup>
import { status, start, stop, reload } from "@/apis/wafcdn/openresty";
import { ElMessage } from "element-plus";
import { ref } from "vue";
const statusData = ref({
  version: "加载中...",
  versionInfo: "详细信息正在加载中...",
  status: false,
});

const loadStart = () => {
  start().then((result) => {
    ElMessage.warning(result);
  });
};

const loadStop = () => {
  stop().then((result) => {
    ElMessage.warning(result);
  });
};

const loadReload = () => {
  reload().then((result) => {
    ElMessage.warning(result);
  });
};

const loadStatus = () => {
  status({}).then((result) => {
    statusData.value.version = result.version;
    statusData.value.version = result.info;
    statusData.value.status = result.status;
  });
};

loadStatus();
</script>
