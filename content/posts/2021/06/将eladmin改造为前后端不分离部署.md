---
title: "将eladmin改造为前后端不分离部署"
description: "将eladmin改造为前后端不分离部署"
publishDate: 2021-06-26T14:30:00+08:00
updatedDate: "2021-06-26T14:30:00+08:00"
tags: ["Java"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---


用了很多方法，不介绍失败的方法了，直接上成功的

## 首先改造前端

1.更改`.env.production`

![image-20210523224726030](https://b2files.173114.xyz/blogimg/20210523224726.png)

```
VUE_APP_BASE_API  = 'http://47.99.209.106:18061'
VUE_APP_WS_API = 'ws://47.99.209.106:18061'
```

改成对应的后端接口

2.更改vue.config.js

![image-20210523224805657](https://b2files.173114.xyz/blogimg/20210523224805.png)

```
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
```

3.更改router.js

![image-20210523224858317](https://b2files.173114.xyz/blogimg/20210523224858.png)

```
mode: 'hash',
```

## 然后就是后端

由这个地方可知

![image-20210802143417567](https://b2files.173114.xyz/blogimg/20210802143417.png)

1、添加META-INF/resources/

将前端打包好的dist放在下面

![image-20210523225108200](https://b2files.173114.xyz/blogimg/20210523225108.png)

2、给`SpringSecurityConfig`添加图上四个 暂不确定是否都必须

![image-20210523225245250](https://b2files.173114.xyz/blogimg/20210523225245.png)



## 注意

部署后的项目web加载很慢 很奇怪	

最后的入口为 `后端端口/dist/index.html`

