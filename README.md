# VeAdmin
基于Vue Element 开发的更易与独立全栈开发者使用的后端管理框架

之前开发项目大量使用了 https://github.com/PanJiaChen/vue-element-admin  很优秀好用，但是Vue3加入了大量的优化，目前暂无看到作者的更新计划。

使用golang开发发现了 https://github.com/flipped-aurora/gin-vue-admin  优秀功能全面，但是比较绑定自己的功能。

目前是想基于上面的项目来开发自己的后台管理框架有以下的构建目标

1, 使用 基于vue3的element 的大框架

2, 路由功能，用户登录退出功能，tab切换功能，keepactive功能，




开发步骤

1，使用vscode开发工具构建项目

2，使用vite初始化项目名称为VeAdmin

3，安装EsLint代码插件

4，安装sass进行通用布局

5，安装vue-route并挂载

6，开发登录login-user页面

7, 开发layout布局views文件夹

8, 开发可开关侧边栏，并使用pania来管理状态

9, 开发顶部面包屑和全屏功能 - ing