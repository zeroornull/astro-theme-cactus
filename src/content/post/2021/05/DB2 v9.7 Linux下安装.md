---
title: "DB2 v9.7 Linux下安装"
description: "DB2 v9.7 Linux下安装"
publishDate: 2021-05-13T14:30:00+08:00
updatedDate: "2025-03-09T14:30:00+08:00"
tags: ["db2"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---
# 前言

  DB2v9.7Express-CLinux下安装

<!-- more -->

## 1.解压db2安装包

```
tar -zxvf v9.7_linuxx64_server.tar.gz
```

## 2.进入server目录下，执行安装检查

```
cd server
./db2prereqcheck
```

## 3.运行安装程序

```
[root@server]./db2_install

要选择另一个目录用于安装吗？[yes/no]

--输入no默认安装opt下，选择yes自己输入安装目录

指定下列其中一个关键字以安装 DB2 产品

--输入ESE

ESE

正在初始化 DB2 安装。

要执行的任务总数为：47

要执行的所有任务的总估计时间为：2070

任务 #1 启动

描述：正在检查许可协议的接受情况

估计时间 1 秒

任务 #1 结束

…

任务 #47 启动

描述：正在注册 DB2 更新服务

估计时间 30 秒

任务 #47 结束

任务 #48 启动

描述：正在更新全局概要文件注册表

估计时间 3 秒

任务 #48 结束

已成功完成执行。
```

## 4.安装license(这一步可以在创建好用户后在db2inst1用户下进行)

db2licm -l命令可以查看到db2的license信息。可以找一个永久的license添加到db2数据库即可,把db2ese_c.lic放到一目录下：

/opt/ibm/db2/V9.7/license/db2ese_c.lic,在/opt/ibm/db2/V9.7/adm/目录下执行:

```
db2licm -a /opt/ibm/db2/V9.7/license/db2ese_c.lic
```

执行后显示：LIC1402I License added successfully.再用db2licm -l查看，你会发现你的db2变为永久了,大功告成，以后就不怕db2数据库过期了

## 5.创建DB2运行所需要的用户组和用户

```
groupadd -g 901 db2iadm1
groupadd -g 902 db2fadm1
groupadd -g 903 dasadm1
useradd -g db2iadm1 -u 801 -d /home/db2inst1 -m  db2inst1
useradd -g db2fadm1 -u 802 -d /home/db2fenc1 -m  db2fenc1
useradd -g dasadm1 -u 803 -d /home/dasadm1 -m  dasusr1
```

## 6.为db2inst1创建密码 

```
passwd db2inst1
```

## 7.创建实例

```
[root@server]#cd /opt/ibm/db2/V9.7/instance

[root@instance]#./dascrt -u dasusr1

SQL4406W  The DB2 Administration Server was started successfully.

DBI1070I  Program dascrt completed successfully.


[root@instance]#./db2icrt -u db2inst1 db2inst1

DBI1070I  Program db2icrt completed successfully.
```

## 8.启动db2实例

```
[root@instance]#su - dasusr1

[dasusr1@db2]$. das/dasprofile

[dasusr1@db2]$db2admin start


[dasusr1@db2]$su - db2inst1

[db2inst1@db2]$. sqllib/db2profile

[db2inst1@db2]$db2start
```

## 9.关闭、启动数据库

```
[db2inst1@db2]$db2stop

[db2inst1@db2]$db2 force applications all

[db2inst1@db2]$db2start
```

## 10.创建样本库

```
[db2inst1@db2]$cd /opt/ibm/db2/V9.7/bin

[db2inst1@db2]$./db2sampl
```

## 11.设置DB2自启动

```
[root@db2]#cd /opt/ibm/db2/V9.7/instance

[root@instance]#./db2iauto -on db2inst1
```

## 12.配置TCPIP(这一步更改/etc/service建议在root用户下执行)

```
[root@instance]#su - db2inst1

[db2inst1@db2]$db2set DB2COMM=TCPIP

[db2inst1@db2]$db2 get dbm cfg |grep SVCENAME

TCP/IP Service name                          (SVCENAME) =

SSL service name                         (SSL_SVCENAME) =


[db2inst1@db2]$tail /etc/services

DB2_db2inst1    60000/tcp

DB2_db2inst1_1  60001/tcp

DB2_db2inst1_2  60002/tcp

DB2_db2inst1_END        60003/tcp


[db2inst1@db2]$vim /etc/services

修改成如下

DB2_db2inst1    50000/tcp

DB2_db2inst1_1  50001/tcp

DB2_db2inst1_2  50002/tcp

DB2_db2inst1_END        50003/tcp


[db2inst1@db2]$db2 update dbm cfg using SVCENAME 50000

[db2inst1@db2]$db2stop

[db2inst1@db2]$db2start
```

附：如果系统为CENTOS7，可能会因为防火墙问题导致50000端口被禁用

解决方法：

su - root

systemctl stop firewalld.service

或者将50000端口加入防火墙信任：

firewall-cmd --permanent --zone=public --add-port=50000/tcp

重启防火墙:

```
systemctl stop firewalld.service

systemctl start firewalld.service
```

**注**

阿里云需要在安全组添加