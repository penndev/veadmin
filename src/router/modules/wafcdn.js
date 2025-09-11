import Layout from "@/views/layout/index.vue";

export const wafcdn = {
  path: "/wafcdn",
  component: Layout,
  redirect: "/wafcdn/domain",
  meta: { title: "WAFCDN", icon: "Postcard" },
  children: [
    {
      path: "domain",
      component: () => import("@/views/wafcdn/domain.vue"),
      name: "WafCdnDomain",
      meta: { title: "域名管理", icon: "Grid" },
    },
    {
      path: "site",
      component: () => import("@/views/wafcdn/site.vue"),
      name: "WafCdnSite",
      meta: { title: "站点管理", icon: "Menu" },
    },
    {
      path: "cache",
      component: () => import("@/views/wafcdn/cache.vue"),
      name: "WafCdnCache",
      meta: { title: "缓存文件", icon: "Files" },
    },
    {
      path: "cache-delete",
      component: () => import("@/views/wafcdn/cacheDelete.vue"),
      name: "WafCdnCacheDelete",
      meta: { title: "缓存清理", icon: "FolderDelete" },
    },
    {
      path: "log",
      component: () => import("@/views/wafcdn/log.vue"),
      name: "WafCdnLog",
      meta: { title: "访问日志", icon: "TrendCharts" },
    },
  ],
};
