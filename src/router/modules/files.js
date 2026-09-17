import Layout from "@/views/layout/index.vue";

export const files = {
  path: "/files",
  component: Layout,
  redirect: "/files/index",
  children: [
    {
      path: "index",
      component: () => import("@/views/files/index.vue"),
      name: "FilesIndex",
      meta: { title: "系统文件", icon: "Folder" },
    },
  ],
};
