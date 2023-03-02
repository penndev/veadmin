# VeAdmin
基于Vue Element 开发的更易与独立全栈开发者使用的后端管理框架

之前开发项目大量使用了 https://github.com/PanJiaChen/vue-element-admin  很好用，但是Vue3加入了大量的优化，目前暂无看到作者的更新计划。

使用golang开发发现了 https://github.com/flipped-aurora/gin-vue-admin  功能全面，但是比较绑定自己的功能。

目前是想参考上面的项目来开发自己的后台管理框架有以下的构建目标

1. 基于vue3的element生态

2. 拥有管理端界面的的基本功能

3. 是代码尽量简单与分离，适合个人开发者快速使用，减少繁重的配置。

## 使用功能

> 开箱即用

- 整体布局简单轻量。

- 使用的接口仅需要实现login即可。

## 计划功能

- 增加i18n国际化支持?


## 发布到githu page

```
git subtree push --prefix=dist origin gh-pages
git push origin "$(git subtree split --prefix=dist gh-pages)":gh-pages --force
```