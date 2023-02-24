# VeAdmin
基于Vue Element 开发的更易与独立全栈开发者使用的后端管理框架

之前开发项目大量使用了 https://github.com/PanJiaChen/vue-element-admin  很好用，但是Vue3加入了大量的优化，目前暂无看到作者的更新计划。

使用golang开发发现了 https://github.com/flipped-aurora/gin-vue-admin  功能全面，但是比较绑定自己的功能。

目前是想参考上面的项目来开发自己的后台管理框架有以下的构建目标

1. 使用 基于vue3的element 的大框架

2. 拥有后台管理的的基本功能

3. 是代码尽量简单与分离，适合个人开发者快速使用，减少繁重的配置

## 发布到githu page

```
git subtree push --prefix=dist origin gh-pages
git push origin "$(git subtree split --prefix=dist gh-pages)":gh-pages --force
```

### 计划任务

- 增加文件批量上传 × - 完成但是上传状态会漏，待检查。
- 顶部Tab框可以关闭左侧，右侧，其他选项 ×
- 增加搜索功能框 ×
- 增加全局事件功能，更换路由后台任务可以继续执行如监控后台任务进度，下载上传文件不中断等功能  ×
- 增加权限菜单控制某个角色展示什么菜单 ×

### 开发过程感悟

- 组件的功能回归于组件，组件方面的事情尽量组件内部完成，不要在父组件做太多事情。造成父组件文件过大，内容繁杂。


