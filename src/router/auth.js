import { authStore } from "@/stores";
import router from "@/router";
import { ElMessageBox } from "element-plus";

// 路由挂载比store挂载早。不能直接初始化
let auth = null;
const getToken = () => {
  if (auth === null) {
    auth = authStore();
  }
  return !!auth.token;
};
const getRole = (path) => {
  if (auth === null) {
    auth = authStore();
  }
  if (!auth.routes) return false;
  if (auth.routes === "*") return true;
  return auth.routes.includes(path);
};

router.beforeEach(async (to, from, next) => {
  if (to.meta && to.meta.white === true) {
    // 放行白名单
    document.title = import.meta.env.VE_NAME;
    next();
    return;
  }
  // 用户登陆过
  if (getToken()) {
    if (getRole(to.path)) {
      // 验证权限
      document.title = `${import.meta.env.VE_NAME}-${to.meta.title}`;
      next();
    } else {
      // 提示权限不足
      try {
        await ElMessageBox.confirm(
          `当前用户暂时无权访问，请联系管理员添加[${to.name}]权限。或尝试重新登录获取权限`,
          "访问失败",
          {
            confirmButtonText: "返回",
            cancelButtonText: "重新登录",
            type: "error",
          },
        );
        next(Error("没有访问权限"));
      } catch (error) {
        console.error(error);
        next({
          name: "login",
          query: {
            redirect: to.fullPath,
          },
        });
      }
    }
    return;
  }
  // 第一次登录的用户。
  next({
    name: "login",
  });
});

export default router;
