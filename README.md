# VeAdmin

[点击在线预览](https://penndev.github.io/veadmin) _未验证账号密码可以随便输入_

> 基于Vue Element 开发的更易与独立全栈开发者使用的后端管理框架。
之前开发项目大量使用了 [PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)  很好用，但是Vue3加入了大量的优化，目前暂无看到作者的更新计划。使用golang开发发现了 [gin-vue-admin](https://github.com/flipped-aurora/gin-vue-admin) 功能全面，但是比较绑定自己的功能。所以选用较新(2022.11)的 `vue3`,`element-plus`,`vite`,`pinia` 等库来开发自己的v(vue)e(element)admin 。



## 功能优点

> 开箱即用 【仅在登录接口绑定token与menu 即可】

- 整体布局简单轻量。

- 使用的接口仅需要实现login即可。

- 极少进行接口绑定，可完全轻松开发自己的接口（美滋滋）。

> 生态完整

- 基于vue3的element-plus生态

- 拥有管理端界面的的常见功能，二开简单。

- 使用 Vite 放弃 webpack

- 使用 pinia 来进行全局状态管理。


## 计划功能

- 增加i18n国际化支持?


## 接口支持

预览接口： 免费托管在了 [apifox](https://www.apifox.com)

真实接口： 参阅本人另外一个`nodejs koajs`项目 [vod (一个视频转码系统) ](https://github.com/penndev/vod)

自己实现： 自己开发一个后台程序，并联系我（给你添加一个链接）。