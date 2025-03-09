---
title: "DB2 windows下9.5安装教程"
description: "DB2 windows下9.5安装教程"
publishDate: 2021-05-11T14:30:00+08:00
updatedDate: "2025-03-09T14:30:00+08:00"
tags: ["db2"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---

# DB2 windows下9.5安装教程

## 1.下载安装包，解压。打开应用程序

## 2.如图，再次选择好解压路径，点击Unzip

![image-20210419105506480](https://b2files.173114.xyz/blogimg/2025/03/13b789a95cae9d7f0d2c5be0df4b1b61.png)

## 3.进入解压好的文件夹，点击setup.exe

![image-20210419105707942](https://b2files.173114.xyz/blogimg/2025/03/d01291b59d64b4ea4d39a15a1461de36.png)

## 4.进入安装页面，选择安装产品，然后根据你的需要选择版本，这里我选择的是企业版

![image-20210419105823550](https://b2files.173114.xyz/blogimg/2025/03/19f2820a01d87240dab7d9c2c4289066.png)

## 5.等待检测，选择下一步

![image-20210419105900192](https://b2files.173114.xyz/blogimg/2025/03/6d321c3ee65aa3cfcf0ae4f465d1248f.png)

## 6.接收许可，下一步

![image-20210419105919507](https://b2files.173114.xyz/blogimg/2025/03/8490d6f8a262fdab06f1e191a768cde0.png)

## 7.根据需求选择安装类型，这里我选择默认的典型安装。如果不熟悉DB2的功能组件和功能使用，不建议选择定制安装，一般选择典型安装即可。

![image-20210419105947392](https://b2files.173114.xyz/blogimg/2025/03/0b20946fed1a16678bd93bcfd3ded716.png)

## 8.选择响应文件安装目录，下一步。默认C盘,可以选择其他磁盘安装。

关于响应文件，查了下资料，
保存：在执行手动安装时，您可以让安装程序生成响应文件，其中记录您在安装过程中选择的选项，然后根据需要做出某些较小的修改。如果您要在大量的计算机上安装完全相同的组件，这是相当有用的。
编辑：在公共模板基础上修改响应文件。模板响应文件显示您可以指定的所有可能选项，但是这样更加困难，因为您必须是响应文件模板方面的专家。
在自动安装脚本中，已经提供了几个响应文件。您可以直接使用它们，做出某些修改，或者用户可以覆盖响应文件。清单 1 显示了 DB2 响应文件的示例。
简而言之，是用于批量安装DB2数据库，保存手动安装时的选项，也可以进行编辑，因为他实际上也是文本。

![image-20210419110043595](https://b2files.173114.xyz/blogimg/2025/03/fd67b0e5bff04d1d0798eec839c33e81.png)

## 9.选择数据库安装文件夹，默认C盘，建议安装在非系统盘。

![image-20210419110219821](https://b2files.173114.xyz/blogimg/2025/03/2a0c8f330cc4d5d4928967a2dc69bd3a.png)

## 10.设置用户信息。这里说明一下用户，DB2数据库的用户使用的是系统本地的用户。建议摄入你当前使用的本地用户和密码，如果输入一个新的而系统不存在的用户，DB2将为你的系统新建一个用户。

![image-20210419110508007](https://b2files.173114.xyz/blogimg/2025/03/2f56b448957eb8d37d40eac889f2824a.png)

## 11.配置实例，点击配置，可以查看当前实例的配置，一般不需要更改。默认下一步。

![image-20210419110624559](https://b2files.173114.xyz/blogimg/2025/03/d4a50d3875e260d899ed728c08934fdc.png)

## 12. 勾选“准备DB2工具目录”，点击“下一步”

![image-20210419110855609](https://b2files.173114.xyz/blogimg/2025/03/37788cf1d236b9fcb4069de50d44c24a.png)

## 13.设置通知，不需要设置通知，取消设置，下一步。

![image-20210419110924814](https://b2files.173114.xyz/blogimg/2025/03/b24a548319de1e7d704c1ff9432edcbd.png)

## 14.启用操作系统安全性，默认，下一步。如果取消启用，使用数据库将可能报错。

![image-20210419110949842](https://b2files.173114.xyz/blogimg/2025/03/3293bdee5ddb1f84e8f4bcccf91f5afd.png)

## 15.点击完成，等待完成安装。

![image-20210419111015051](https://b2files.173114.xyz/blogimg/2025/03/627946485b0fefdc753fd73e9f0e07b6.png)

## 16.安装完成后，重启系统，才可以正常使用DB2数据库。

## 17.重启后，搜索框输入“第一步”，点击打开。这是一个简单的DB2数据库使用帮助。

你可以根据上面的教程创建SAMPLE 基本数据库 或者选择创建您自己的数据库。如果想了解更多DB2的使用，可以仔细阅读上面的文档。

## 18.安装可视化工具DbVisualizer 9.0.7

![image-20210419112101172](https://b2files.173114.xyz/blogimg/2025/03/7f22ffbb808850ff32f514ecf7d77e2c.png)

## 19.一路下一步+同意协议+调整安装位置

可连接默认数据库

TOOLSDB

## 20.会出现许可过期 这时需要找一个永久的license添加到db2即可

db2licm -l命令可以查看到db2的license信息。

```
db2licm -l
```

如果license过期：

可以找一个永久的license添加到db2即可

把db2ese_c.lic放到目录下，一般都是：\db2\license下
然后cd到该目录下，执行：

```
db2licm -a db2ese_c.lic 
```

重启数据库连接工具，发现已经ok了

参考:https://blog.csdn.net/weixin_43835492/article/details/115858923

