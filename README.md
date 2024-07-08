<div align="center">
    <h1>VEAdmin 微后台</h1>
    <img src="https://img.shields.io/github/stars/penndev/veadmin" />
    <img src="https://img.shields.io/github/languages/code-size/penndev/veadmin" />
    <img src="https://img.shields.io/github/license/penndev/veadmin" />
</div>

## 🎉 预览

[⚡️ VEAdmin 微后台 GitHub Pages 预览地址 ](https://penndev.github.io/veadmin) 免费商用，支持 PC、平板、手机。 (🔑mock api未验证账号密码例:admin 123456)

## 快速上手

> 使用`vue3`与`element-plus`作为基础框架。`vite`做打包工具，`pinia`做数据持久化，`axios`做api交互，功能齐全，容易上手。

- **页面路由：** 在文件`src/router/index.js`中添加相应的菜单，和页面内容。参考example添加新的。 移除老的不需要的模块，删除menu中的菜单和views中的vue文件即可。

- **用户认证：** 用户登录`src/views/login/index.vue`中处理用户登录接口。当`permission`对象被赋值，则用户登录完成。在`src/utils/request.js`行中进行jwt api后端认证。

- **菜单鉴权：** 在用户登录接口 `permission.routes` 对象中设置所有放行的菜单（直接='*'则全放行），菜单权限根据`路由`中的`path`鉴权。 具体实现验证代码位于`src/router/auth.js`中进行菜单校验。


如果有疑问或者建议欢迎随时与我[交流](https://github.com/penndev/veadmin/issues/new)（24小时内回复）。

## 接口支持

- mock接口： 免费托管在了 [postman](https://www.postman.com/)。

- Golang：参阅作者的`golang`项目 [wga](https://github.com/penndev/wga) (golang web后台管理脚手架 基于 gin gorm zap 开发开箱即用)

- Node： 参阅作者的`nodejs`的项目 [vod](https://github.com/penndev/vod) （媒体转码后台管理系统系统，ffmpeg的web封装）

*以上均实现了本项目的api需求可做开发参考*

## 🙏致谢

- [vue-element-admin ](https://github.com/PanJiaChen/vue-element-admin) 曾节约我大量的开发时间成本。

- [gin-vue-admin](https://github.com/flipped-aurora/gin-vue-admin) 给予我UI与配色的启发。
