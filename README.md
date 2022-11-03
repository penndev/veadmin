# VeAdmin
基于Vue Element 开发的更易与独立全栈开发者使用的后端管理框架

之前开发项目大量使用了 https://github.com/PanJiaChen/vue-element-admin  很好用，但是Vue3加入了大量的优化，目前暂无看到作者的更新计划。

使用golang开发发现了 https://github.com/flipped-aurora/gin-vue-admin  功能全面，但是比较绑定自己的功能。

目前是想参考上面的项目来开发自己的后台管理框架有以下的构建目标

1. 使用 基于vue3的element 的大框架

2. 拥有后台管理的的基本功能
    - 路由功能，验证路由权限
    - 用户登录退出功能，结合路由验证
    - mock 功能，进行前后端开发适配

3. 是代码尽量简单与分离，适合个人开发者快速使用

## mock报错处理
node_modules\mockjs\dist\mock.js:1480
替换如下内容
```
var Canvas = require('canvas')
canvas = new Canvas.createCanvas()
```

## 发布到githu page


git checkout -b gh-pages
npm run build
git add -f dist
git commit -m 'update page'
git subtree push --prefix dist origin gh-pages

### 开发过程感悟

- 组件的功能回归于组件，组件方面的事情尽量组件内部完成，不要在父组件做太多事情。造成父组件文件过大，内容繁杂。


