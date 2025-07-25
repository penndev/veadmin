<template>
  <el-main class="ea-nav">
    <div class="ea-collapse" @click="handleCollapse">
      <el-icon v-if="layout.collapse">
        <Expand />
      </el-icon>
      <el-icon v-else>
        <Fold />
      </el-icon>
    </div>

    <el-breadcrumb class="ea-breadcrumb" separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/' }">
        <strong>首页</strong>
      </el-breadcrumb-item>
      <template v-for="(item, index) in breadcrumb" :key="index">
        <el-breadcrumb-item v-if="item.meta.title">
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
    <div style="flex: 1" />
    <!-- 夜晚模式 -->
    <div class="ea-icon">
      <el-switch
        v-model="darkMode"
        inline-prompt
        active-action-icon="Moon"
        inactive-action-icon="Sunny"
      />
    </div>
    <!-- fullscreen 模式。 -->
    <div class="ea-icon" @click="handleFullScreen">
      <el-icon title="全屏切换">
        <FullScreen />
      </el-icon>
    </div>
    <div class="ea-icon ea-icon-search">
      <MenuSelect filterable placeholder="搜索菜单" @change="selectMenu" />
    </div>
    <el-dropdown class="ea-dropdown">
      <div style="cursor: pointer; outline: none">
        <strong class="ea-dropdown-name">{{ auth.nickname }}</strong>
        <el-icon><arrow-down /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <ChangePasswd />
          <EditOTP />
          <el-dropdown-item icon="reading-lamp" @click="handleLoginOut">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-main>
</template>

<script setup>
import { authStore, layoutStore } from "@/stores";
import { useRouter, useRoute } from "vue-router";
import { watch, ref } from "vue";
import MenuSelect from "./MenuSelect.vue";
import ChangePasswd from "./ChangePasswd.vue";
import EditOTP from "./EditOTP.vue";

const layout = layoutStore();
const router = useRouter();
const route = useRoute();
const auth = authStore();

const breadcrumb = ref(route.matched);

watch(route, () => {
  breadcrumb.value = route.matched;
});

const handleLoginOut = () => {
  auth.token = null;
  router.push({ name: "login", query: { redirect: route.path } });
};

const handleCollapse = () => {
  layout.collapse = !layout.collapse;
};

const fullScreen = ref(false);
const handleFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    fullScreen.value = false;
  } else {
    fullScreen.value = true;
    document.documentElement.requestFullscreen();
  }
};

const darkMode = ref(false);
watch(darkMode, () => {
  if (darkMode.value) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});

// 菜单列表
const selectMenu = (value) => {
  // 验证是否是网址链接
  try {
    const url = new URL(value);
    if (url.protocol.startsWith("http")) {
      window.open(value, "_blank");
    }
  } catch (e) {
    console.error(e);
    router.push({ path: value });
  }
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .ea-icon {
    display: none;
  }

  .ea-dropdown {
    margin-left: auto;
  }

  .ea-dropdown-name {
    display: none;
  }
}

.ea-nav {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0;

  .ea-collapse {
    font-size: 28px;
    line-height: 0;
  }

  .ea-icon {
    margin-left: auto;
    font-size: 20px;
    line-height: 0;
    margin-right: 20px;
  }

  .ea-icon-search {
    width: 160px;
  }

  .ea-breadcrumb {
    margin-left: 15px;
  }
}
</style>
