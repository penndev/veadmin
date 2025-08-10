<template>
  <el-scrollbar style="height: calc(100vh - 110px)">
    <el-menu
      unique-opened
      :collapse="layout.collapse"
      :collapse-transition="false"
      :router="true"
      :default-active="active"
    >
      <MenuItem
        v-for="(item, index) in routes"
        :key="index"
        :item="item"
        :allow="auth.routes"
      />
    </el-menu>
  </el-scrollbar>
  <div
    v-if="!layout.collapse"
    style="height: 50px; display: flex; flex-direction: column"
  >
    <el-link href="https://github.com/penndev/veadmin" target="_blank">
      Mode: {{ mode }}
    </el-link>
    <el-text>Build: {{ build }}</el-text>
  </div>
</template>

<script setup>
import MenuItem from "./MenuItem.vue";
import { watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { layoutStore, authStore } from "@/stores";

const router = useRouter();
const route = useRoute();

// 通用组件布局
const layout = layoutStore();

// 菜单权限
const auth = authStore();

// 菜单列表
const routes = router.options.routes;

const mode = import.meta.env.MODE;
const build = import.meta.env.BUILD;

// 当前活动的菜单
const active = ref(route.path);
watch(route, () => {
  active.value = route.path;
  // 如果小于720px则菜单变动关闭侧边栏
  if (document.body.scrollWidth <= 720) {
    layout.collapse = true;
  }
});
</script>
