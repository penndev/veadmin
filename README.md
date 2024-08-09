<div align="center">
    <h1>VEAdmin 微后台</h1>
    <img src="https://img.shields.io/github/stars/penndev/veadmin" />
    <img src="https://img.shields.io/github/languages/code-size/penndev/veadmin" />
    <img src="https://img.shields.io/github/license/penndev/veadmin" />
</div>

## 🎉 预览

[⚡️ VEAdmin 微后台 GitHub Pages 预览地址 ](https://penndev.github.io/veadmin) 免费商用，支持 PC、平板、手机。 (🔑mock api未验证账号密码例:admin 123456)

## 快速上手

> 使用`vue3`与`element-plus`作为基础框架，`vite`做打包工具，`pinia`做数据持久化，`axios`做api交互。

- **页面路由:** 在[`此文件`](https://github.com/penndev/veadmin/blob/main/src/router/index.js#L56)中实现。添加页面路由可参考`example`的实现。移除不需要的页面路由可删除`routes`中的路由配置，和对应大目标页面vue文件。
- **用户登录:** 在[`此代码`](https://github.com/penndev/veadmin/blob/main/src/views/login.vue#L161)中处理用户登录接口，详细步骤请参考代码。
- **菜单鉴权:** 在[`此位置`](https://github.com/penndev/veadmin/blob/main/src/router/auth.js#L30) 验证菜单权限（直接`auth.routes === '*'`则全放行），菜单全部静态装载，根据权限判断是否放行。
- **后端权限:** [`API鉴权`](https://github.com/penndev/veadmin/blob/main/src/utils/request.js#L20) 根据token进行交付后端权限验证。

如有疑问或建议欢迎随时与我互相[交流](mailto:pennilessfor@gmail.com?subject=veadmin)学习。

## 接口支持
- mock接口： 免费托管在了 [postman](https://www.postman.com/)。
- Golang：参阅作者的`golang`项目 [wga](https://github.com/penndev/wga)(golang 后台管理脚手架 基于gin,gorm,zap开发开箱即用)
- Node：参阅作者的`nodejs`的`koajs`项目[vod](https://github.com/penndev/vod)(媒体转码后台管理系统系统，ffmpeg的web封装)

*以上均实现了本项目的api需求可做开发参考*

## 🙏致谢
- [vue-element-admin ](https://github.com/PanJiaChen/vue-element-admin) 曾节约我大量的开发时间成本。
- [gin-vue-admin](https://github.com/flipped-aurora/gin-vue-admin) 给予我UI与配色的启发。
