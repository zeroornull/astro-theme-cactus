---
title: "使用cloudflare加速Github Page"
description: "使用cloudflare加速Github Page"
publishDate: 2021-07-26T14:00:16+08:00
updatedDate: "2021-07-26T14:00:16+08:00"
tags: ["cloudflare","Github"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---

# 使用cloudflare免费加速github page

## 前言

github page 在国内访问速度非常慢，而且近期 github.io 的域名经常被干扰解析成`127.0.0.1`，迫于无奈在网上找到了一个能白嫖加速 github page 的办法，就是套一层 cloudflare CDN，虽然它在国内没有 CDN 节点，但是整体效果是完爆 github.io，不过要注意的是免费版本是有请求次数限制的，每天 10W 次，当然这足够我的小博客使用了，这里记录一下操作步骤。

## 准备

### 准备域名

随便到哪买一个

国内好像得备案

### 设置 github page

### ![image-20210726134824948](https://b2files.173114.xyz/blogimg/g5yOSXAVPsU6QZi.png)

保存之后 github 会`自动`的在仓库根目录里生成一个`CNAME`文件，里面存储着域名配置信息

### 设置域名解析

可以使用这个

https://zijian.aliyun.com/?spm=a2c1d.8251892.content.11.7c5c5b76F5cVb1#/domainDetect

通过域名提供商，修改刚刚的域名解析，通过 A 记录分别解析到以下 4 个 IP：

添加到自己的 域名解析那里

当记录全部解析生效时，就可以通过`你自己的设置的域名`访问到博客了，这个时候再开启`HTTPS`，示例图：

![img](https://b2files.173114.xyz/blogimg/2020-08-20-18-24-13.png)

然后 github 会自动签发提供给`你自己的设置的域名`域名使用的 SSL 证书，等待一段时间后，就可以通过`HTTPS`访问博客了。

### 使用 cloudflare CDN

上面的步骤全部就绪之后，就可以开始白嫖之路了

1. 先通过https://dash.cloudflare.com/sign-up链接进行注册

   

2. 添加站点，把对应的域名填写进去：

   ![img](https://b2files.173114.xyz/blogimg/2020-08-20-18-31-57.png)

3. 提交之后会自动扫描域名对应的解析记录：

   ![img](https://b2files.173114.xyz/blogimg/2020-08-20-18-32-34.png)

4. 查看 cloudfalre 对应的 NS 记录

   ![img](https://b2files.173114.xyz/blogimg/2020-08-20-18-33-46.png)

5. 通过域名的运营商修改对应的 NS 记录，这里每个运营商的修改方式都不一样，我这里是用的阿里云的：

   ![img](https://b2files.173114.xyz/blogimg/2020-08-20-18-36-57.png)

   ![img](https://b2files.173114.xyz/blogimg/2020-08-20-18-37-25.png)

6. 这样就设置完毕了

可以看到 dns 解析的 ip 已经变了，已经被 cloudflare 接管了，
然后清除下浏览器 DNS 缓存，chrome 浏览器输入`chrome://net-internals/#dns`进入清除页：

再次访问`你自己的设置的域名`，F12 打开网络面板可以看到已经用上了 CDN 了：

![img](https://b2files.173114.xyz/blogimg/2020-08-20-18-43-05.png)

## 后记

一直白嫖一直爽，但是`cloudflare`不一定一直会提供免费版的，如果有一天它挂了，只需要把 DNS 的 NS 解析记录再还原回去就行了。