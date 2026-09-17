---
title: "Nginx二级目录用法"
description: "Nginx二级目录用法"
publishDate: 2021-06-25T14:30:00+08:00
updatedDate: "2021-06-25T14:30:00+08:00"
tags: ["Nginx"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---



项目为eladmin 前端 vue

主要的问题是前端更改配置 及部分nginx修改

参考链接: https://blog.csdn.net/qq_38319289/article/details/111867185

### 1.修改 router/router.js

添加一行

```
base: 'xinfuwu',
```

![image-20210517001420375](https://b2files.173114.xyz/blogimg/20210517001420.png)

### 2、然后修改 vue.config.js

更改一行

```
publicPath: '/xinfuwu/',
```

![image-20210517001626470](https://b2files.173114.xyz/blogimg/20210517001626.png)

### 3、部署时，通过NGINX的反向代理

首先，给需要部署的项目定义一个 NGINX 的 server

```
server {
        listen 4071;
        location / {
             #vue h5 history mode 时配置
            try_files $uri $uri/ /xinfuwu_web/index.html;
    
             root html/xinfuwu_web;
             index index.html index.htm;
        }

    }
```

再到配置域名的主配置server上做反向代理

```
location /xinfuwu/api/ {
          client_max_body_size 40M;
          proxy_pass http://127.0.0.1:10088/;
          proxy_set_header   X-Forwarded-Proto $scheme;
           proxy_set_header   Host              $http_host;
          proxy_set_header   X-Real-IP         $remote_addr;
        }
	location ^~/xinfuwu/ {
          proxy_redirect off;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_pass http://127.0.0.1:4071/;
        }
```

### 4.env.production也需要修改

![image-20210517001821294](https://b2files.173114.xyz/blogimg/20210517001821.png)

baseapi修改为 '/xinfuwu/api'