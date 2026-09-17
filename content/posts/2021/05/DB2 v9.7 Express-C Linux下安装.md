---
title: "DB2 v9.7 Express-C Linux下安装"
description: "DB2 v9.7 Express-C Linux下安装"
publishDate: 2021-05-13T14:30:00+08:00
updatedDate: "2025-03-09T14:30:00+08:00"
tags: ["db2"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---

```plain
下载地址：ftp://public.dhe.ibm.com/software/hk/cobra/db2exc_nlpack_970_LNX_x86.tar.gz
建议迅雷下载
安装环境：centos7
```

## DB2v9.7Express-C安装

**1.解压**

```
tar -zxvf db2exc_970_LNX_x86_64.tar.gz
```

**2.检查安装条件**

cd进入解压的后的文件中

```
./db2prereqcheck
WARNING:
      The 32 bit library file libstdc++.so.6 is not found on the system.
       32-bit applcations may be affected.
#出现warning 按照提示安装
yum install -y libstdc++.so.6
```

**3.安装**

```
./db2_install
```

**4.创建DB2运行所需要的用户组和用户**

```
groupadd -g 901 db2grp
groupadd -g 902 db2fgrp
groupadd -g 903 db2agrp
useradd -g db2grp -u 801 -d /home/db2inst1 -m -s /bin/sh db2inst1
useradd -g db2fgrp -u 802 -d /home/db2fenc -m -s /bin/sh db2fenc
useradd -g db2agrp -u 803 -d /home/db2das -m -s /bin/sh db2das
```

**5.添加密码**

```
passwd db2inst1 我设置的分别为zyksdb21 zyksdb22 zyksdb22
passwd db2fenc
passwd db2das
```

**6.进入/opt/ibm/db2/V9.7/instance目录**

```
cd /opt/ibm/db2/V9.7/instance
执行以下命令
./dascrt -u db2das
./db2icrt -u db2inst1 db2inst1
这里dascrt创建的是DB2 adminstration server，每台服务器只有一个这种server，为进行DB2管理（比如运行控制中心）所必须，同时指定其管理用户是db2das。db2icrt创建的是实例，其名字一般和管理用户名一样，这里均为db2inst1
```

**6.db2set -g DB2SYSTEM=localhost.localdomain**

db2 terminate

```
6.vi /home/db2inst1/.bash_profile
插入下面这句话：
# The following three lines have been added by IBM DB2 instance utilities.
if [ -f /home/db2inst1/sqllib/db2profile ]; then
        . /home/db2inst1/sqllib/db2profile
fi
```

db2 不起作用 如果配置了 还是不起作用那么就只有每次切换db2inst1用户后手动执行source /home/db2inst1/sqllib/db2profile 进行环境变量初始化

```
7.vi /home/db2inst1/.profile
export PATH=$PATH:/home/db2inst1/sqllib/adm:/home/db2inst1/bin

8.vi /home/db2das/.profile
export PATH=$PATH:/home/db2das/sqllib/adm:/home/db2das/bin
```

**9.切换到db2das用户，执行db2admin启动DB2管理服务器。**

```
cd /opt/ibm/db2/V9.7/bin
db2admin start
切换到db2inst1用户，执行db2start启动数据库实例。
db2start
```

**10. 配置DB2**

```
	1 设置DB2自启动。
		使用root用户执行以下命令：
			cd /opt/ibm/db2/V9.7/instance
			./db2iauto -on db2inst1
		设置对db2inst1在LINUX启动时自动启动。
	
	2 配置网络
		切换到db2inst1用户。
			su - db2inst1
		修改DB2的服务端口为50000，这里默认端口就是50000。
			db2 update dbm cfg using SVCENAME 50000
		修改DB2连接方式为TCPIP，然后可通过JDBC、ODBC等访问本DB2服务器上的数据库，安装了DB2客户端的其它机器也可访问数据库。
			db2set DB2COMM=TCPIP
	3 禁用防火墙
			vi /etc/selinux/config,修改为：
				SELINUX=disabled
	4 服务禁用防火墙 
```

显示状态： firewall-cmd --state
关闭：systemctl stop firewalld
开机禁用 ： systemctl disable firewalld

**11.Centos7提示" xxx 不在 sudoers 文件中。此事将被报告。"**

```
su
cd /etc
chmod 740 sudoers
vim sudoers
fendo ALL=(root) ALL, !/usr/bin/passwd [A-Za-z]*, !/usr/bin/passwd root
```

**五．批注**

备注： 创建和访问数据库，安装验证
1 启动与关闭数据库实例
su - db2ins1
db2start
db2 force applications all
db2stop
（在调用toad连接创建数据库时，先自己在命令行下随意创建一个表，用来初始化这个用户的schema）
db2 create database test1

2 DB2 for linux卸载
由于某种原因，要卸载DB2再重新安装，一定要完全卸载DB2，否则不能重新安装或安装后的DB2不可用。
因为卸载步骤比较复杂，我建议在虚拟机上安装该软件的朋友，应该先做一个快照，然后方可进行，出错就恢复快照，重新来过。在主机上卸载则最好先做一个备份，以防万一。
为了操作方便，可以同时打开几个Shell，分别属于不同用户，配合完成下面的操作。

```
1、在linux上卸载DB2的一般过程：
a.删除所有数据库。可以使用“控制中心”或drop database命令删除数据库。笔者卸载而未删除数据库，结果是重新安装后无法建立同名数据库。
b.停止DB2管理服务器。
c.停止DB2实例。
d.除去DB2管理服务器。
e.除去DB2实例。
f.除去DB2产品。

2、停止DB2管理服务器：
必须要停止DB2管理服务器才能在linux上卸载DB2。
a.作为DB2管理服务器所有者登陆。
b.用db2admin stop命令停止DB2管理服务器。

3、停止DB2实例：
必须要停止DB2实例才能在linux上卸载DB2。
a.作为具有root用户权限的用户登陆。
b.输入/opt/ibm/db2/V9.7/bin/db2ilist命令，获取系统上的所有DB2实例的名称。
c.注销。
d.作为想要停止的实例的所有者登陆。
e.进入该用户的主目录下，运行脚本：. sqllib/db2profile
d.输入db2 force application all命令来停止所有数据库应用程序。
e.输入db2stop命令来停止DB2数据库管理器。
f.输入db2 terminate来确认DB2数据库管理器已停止。
g.对每一个要删除的实例重复以上步骤。

4、删除DB2管理服务器：
必须删除DB2管理服务器才能卸载DB2。
a.作为DB2管理服务器所有者登陆。
b.进入该用户的主目录下，运行脚本：. das/dasprofile.
c.注销。
d.作为root登陆，通过输入命令/opt/ibm/db2/V9.7/instance/dasdrop除去DB2管理服务器。

5、删除DB2实例：
一旦删除系统上的实例，该实例下的所有DB2数据库都将不可用。
a.通过输入/opt/ibm/db2/V9.7/instance/db2idrop db2instname删除实例。

6、卸载DB2产品
以root身份登陆，到DB2版本产品CD-ROM上的根目录或DB2安装文件（通常就是tar解包文件）下找到db2_deinstall命令，
运行db2_deinstall －a命令可以删除所有DB2产品。
可能需要输入DB2安装路径，这里是/opt/ibm/db2/V9.7
然后也可以在LINUX中删除DB2用户，这并非必须，重新安装仍可使用它们。
```

运行时报错
-sh-3.1$ ./db2start
SQL10007N Message “-1390” could not be retrieved. Reason code: “3”.
sudo usermod -s /bin/bash db2inst1

sudo gedit /home/db2inst1/.profile

添加以下内容

export PATH=$PATH:/home/db2inst1/sqllib/adm:/home/db2inst1/bin

重新尝试以db2inst1用户登录，发现shell已经变了。try!:
./unload to extract and ./db2gen.sh