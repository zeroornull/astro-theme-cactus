---
title: "B站 linux韩顺平2021 笔记"
description: "B站 linux韩顺平2021 笔记"
publishDate: 2021-04-09T14:30:00+08:00
updatedDate: "2025-03-09T14:30:00+08:00"
tags: ["Linux"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---

# linux韩顺平2021

## p1 课程内容

### 基础篇

Linux入门

vm和linux的安装

Linux目录结构

### 实际操作篇

远程登陆（Xshell XFtp）

实用指令

进程管理

用户管理

Vi和Vim管理

定时任务调度

RPM和YUM

开机，重启和用户登陆注销

磁盘分区，挂载

网络配置

### 2021高级篇

日志管理

Linux内核源码&内核升级

定制自己的Linux

Linux备份和恢复

Linux可视化管理webmin和bt运维工具

Linux入侵检测&权限划分&系统优化

Linux面试题（腾讯，百度，美团，滴滴 ）

## p2 应用领域

## p3 概述

## p4 Linux和Unix

## p5 vmware15.5安装

下载链接：https://www.nocmd.com/windows/740.html

## p6 centOS7.6安装

下载链接：http://mirrors.163.com/centos/7.6.1810/isos/x86_64/CentOS-7-x86_64-DVD-1810.iso

linux分区：3个区

boot 引导分区 1g

swap 交换分区 和内存大小一致2g 可以临时充当内存

根分区 17g

## p7 网络连接的三种方式

**桥接模式**

会直接占用网段，会造成256个不够用

虚拟系统可以和外部系统通讯，但是容易造成IP冲突

**NAT模式**

网络地址转换模式

虚拟系统可以和外部系统通讯，而且不造成IP冲突

**主机模式**

不和外部通讯

## p8 虚拟机克隆

用于快速构建集群

方式一 直接拷贝一份安装好的虚拟机文件

方式二 使用vmware的克隆操作（需要先关闭linux系统）

​	克隆方法

​		1.创建链接克隆（这只是引用）

​		2.创建完整克隆（这个是拷贝）

## p9 虚拟机快照

在进行一些不确定的操作时，用于恢复原先的某个状态，也叫快照管理

快照会占用一定空间

## p10 虚拟机迁移和删除

## p11 vmtools

安装后，在windows下更容易管理vm虚拟机，可以设置windows和centos的共享文件夹

1.进入centOS

2.点击vm菜单的->install vmware tools

3.centos会出现一个vm安装包，xx.tar.gz

4.拷贝到/opt

5.使用解压命令tar,得到一个安装文件

cd /opt

tar -zxvf

./ 进行安装

可能会出现一些问题

[参考链接](https://www.cnblogs.com/feiquan/p/9326870.html)

6.进入该vm解压的目录，/opt目录下

7.安装./vmware-install.pl

8.全部使用默认设置即可安装成功

9.注意：安装vmtools需要有gcc

主机的共享文件夹需要在vmware中设置

共享文件夹位置在/mnt/hgfs/

## p12 第4章 linux目录结构

linux采用层级树状结构，最上层根目录/

/root root用户的目录

/home 每创建一个用户都会出现一个用户的主目录

/bin 常用指令 环境设置 之类的文件 Binary

/sbin s代表Super user的意思

/etc 系统管理所需要的配置文件和子目录  比如安装了mysql数据库 my.conf 

/boot 系统启动相关 核心文件，包括一些连接文件以及镜像文件

/dev 设备管理器 linux会把所有的硬件映射成一个文件管理 一切皆文件

/media 自动识别设备挂载到这个目录下

/lib 系统开机所需要的最基本的动态连接共享库，作用类似Windows里的DDL文件。几乎所有的应用程序都需要用到这些共享库

/lost+found 一般是空的，当系统非法关机后，这里就存放了一些文件

/usr 用户很多应用程序和文件都放在这个目录下，类似windows下的program files 目录

/proc 这个目录是一个虚拟的目录，它是系统内存的映射，访问这个目录来获取系统信息

/srv service缩写，存放一些服务启动之后需要提取的数据

/sys linux2.6内核很大的一个变化 。安装了新出现的文件系统 sysfs

/tmp 存放临时文件

/mnt 为了让用户临时挂载别的文件系统，我们可以把外部存储挂载在/mnt/上，然后进入该目录就可以查看里面的内容了。d:/myshare

/opt 这是主机额外安装软件（约定俗成）所摆放的目录。如安装Oracle数据库就可摆放在该目录下

挂载：例如将myshare文件夹挂载在/mnt/hgfs目录下

/usr/local 额外安装软件所安装的目录，一般通过编译源码的方式安装的程序

/var 这个目录存放着不断扩充着的东西，习惯将经常被修改的目录放在这个目录下。包括各种日志文件

/selinux[security-enhanced linux]

SELinux是一种安全子系统，它能控制程序只能访问特定文件；三种工作模式，可以自行设置，需要启用

## p13 第5章 远程登录到Linux服务器

## p14 远程登录

xshell6

## p15 远程文件传输 

xftp6

## p16 vi和vim编辑器

### 常用三种模式

正常模式

插入模式 iIoOaArR

命令行模式 输入"esc" + ":" 或 "/" 再输入:wq "wq"代表写入并退出

## p17 vi和vim快捷键

命令行模式输入 

:wq(保存退出)

:q(退出)

:q!(强制退出，不保存)

拷贝当前行 yy	拷贝当前行向下五行 5yy 	粘贴 p

删除当前行 dd	删除当前行向下五行 5dd 

查找 / + 所需的字段 n键用来切换

:setnu 显示行号 :setnonu 关闭显示行号

文档最末行 G   最首行  gg 	这些快捷键在一般模式下使用即可

指定行数 输入行号 + shift +g

撤销操作 一般模式下 按 u

## p18 vi vim 内容整理

## p19 第七章 开机、重启和用户注销

shutdown -h now	立刻进行关机

shutdown -h 1	"hello,1分钟后会关机了"

shutdown -r now 现在重新启动计算机

halt	关机，作用和上面一样

reboot	现在重启

sync	内存同步到磁盘

不论重启还是关闭系统，首先要运行sync指令，同步内存至磁盘

目前的shutdown/reboot/halt命令均已经在关机前进行了sync	建议还是先运行sync命令

## p20 登录注销

su - 用户名 为切换用户

logout在图形级界面运行级别是无效的 在运行级别3下有效

## p21 用户管理

### 添加用户

useradd 用户名

1.创建用户成功后，会自动创建和用户名同名的home目录

2.也可以通过useradd -d 指定目录 新的用户名，给新创建的用户指定家目录

指定/修改密码

passwd 用户名（不写用户名会给当前登录的用户更改密码）

显示当前用户 pwd

删除用户但是不删除家目录

userdel  用户名

删除用户以及家目录

userdel -r 用户名	操作慎重 这样删除会把用户家目录所有内容删除

一般情况下建议保留家目录

## p22 查询用户信息指令

### 基本语法

id 用户名

### 切换用户

su - 切换用户名

权限高的用户切换到权限低的不需要输入密码，反之需要

返回到原来的用户 exit/logout

### 查看当前用户/登录用户

#### 基本语法

whoami/Who am I

## p23 用户组

### 介绍

类似于角色，系统可对有共性的多个用户进行统一的管理

### 新增组

指令：groupadd 组名

### 删除组

groupdel 组名

### 增加用户时直接加上组

useradd -g 用户组 用户名

### 修改用户的组

usermod -g 用户组 用户名

### 用户和组相关文件

#### /etc/password 文件

用户的配置文件

用户名:口令:用户标识号:组标识号:注释性描述:主目录:登录shell

#### /etc/shadow 文件

口令配置文件

登录名:加密口令:最后一次修改时间:最小时间间隔:最大时间间隔:警告时间:不活动时间:失效时间标志

/etc/group 文件

组配置文件

组名:口令:组标志号:组内用户列表

## p24 用户管理总结

## p25 第九章 实用指令

### 指定运行级别

基本介绍

0：关机

1：单用户【找回丢失密码】

2：多用户状态没有网络服务

3：多用户状态有网络服务

4：系统未使用保留给用户

5：图形界面

6：系统重启

常用运行级别为3和5，也可以指定默认运行级别

init[0123456]

在centos7之前,/etc/inittab文件中指定

简化为

multi-user.target:analogous to runlevel 3

graphical.target:analagous to runlevel 5

当前运行级别 systemctl get-default

systemctl set-default TARGET.target

## p26 如何找回root密码

[参考链接](https://blog.51cto.com/10802692/2398040?source=dra)

## p27 帮助指令

man 命令或配置文件

Linux下,隐藏文件以.开头	选项可以组合使用

help 命令

## p28 文件目录类

### pwd 指令

显示当前工作目录绝对路径

### ls 指令

ls 目录或文件

常用选项

-a 所有

-l 列表

应用实例

查看当前目录所有内容信息

### cd指令

cd ~ 或者cd  :回到自己的家目录

cd.. 回到当前目录的上一级目录

## p28 文件目录类（2）

### mkdir指令

创建目录 mkdir 要创建的目录

常见选项 

-p：创建多级目录 

案例一：创建一个目录 /home/dog

mkdir /home/dog

案例二：创建一个多级目录 /home/animal/tiger

mkdir -p /home/animal/tiger

### rmdir指令

删除空目录

rmdir 要删除的空目录

案例：删除一个目录 /home/dog

细节注意：删除的是空目录，有内容则无法删除

如果要删除非空目录，需要使用 rm-rf 要删除的目录

例：rm -rf /home/animal

### touch 指令

创建空文件

touch 文件名称

案例：创建一个空文件 hello.txt

## p30 文件目录指令（3）

### cp指令

拷贝文件到指定目录

cp [选项] source dest

常用选项

-r：递归复制整个文件夹

cp hello.txt /home/bbb

cp -r /home/bbb /opt/

\cp 表示强制覆盖不提示

### rm指令

移除文件或目录

rm [选项] 要删除的文件或目录

常用选项：

-r：递归删除整个文件夹

-f：强制删除不提示

案例一：将/home/hello.txt 删除，rm /home/hello.txt

案例二：递归删除整个文件夹 /home/bbb，rm -rf /home/bbb

## p31 文件目录指令（4）

### mv指令

mv移动文件与目录或重命名

基本语法

mv oldNameFile newNameFile （功能描述：重命名）

mv /temp/movefile /targetFolder (功能描述：移动文件)

实例

案例一：将/home/cat.txt 文件 重新命名为pig.txt

案例二：将/home/pig.txt 文件 移动到/root目录下

案例三：移动整个目录

### cat指令

cat 查看文件内容

基本用法

​	cat [选项] 要查看的文件

常用选项

​	-n：显示行号

cat只能浏览文件，而不能修改文件，为了浏览方便，一般会带上 管道命令| more

管道指的是 将前面得到的结果交给后面的指令来完成

### more 指令

基于vi编辑器的文本过滤器，全屏幕按页显示文本文件内容。more指令中内置了若干快捷键

![image-20201225135544255](https://b2files.173114.xyz/blogimg/2025/03/1cbe2b4d47ac68283e58572d49ddb98a.png)

基本语法：

more 要查看的文件

### less指令

分屏查看文件内容，功能与more类似，但比more更加强大，支持各种显示终端。less指令在显示文件内容时，并不是一次将整个文件加载之后才显示，而是根据显示需要加载内容，对于大型文件具有更高的效率。

基本语法

less 要查看的文件

![image-20201225140138011](https://b2files.173114.xyz/blogimg/2025/03/21fe935910f60127e0c921f37a60c6a2.png)

应用实例

案例: 采用less 查看一个大文件文件 /opt/杂文.txt

less /opt/杂文.txt

### echo 指令

echo 输出内容到控制台

基本语法

echo [选项] [输出内容]

应用实例

案例: 使用echo 指令输出环境变量, 比如输出	$PATH 	$HOSTNAME, 	echo $HOSTNAME

案例: 使用echo 指令输出hello,world!

### head 指令

head 用于显示文件的开头部分内容，默认情况下head 指令显示文件的前10 行内容

基本语法

head 文件(功能描述：查看文件头10 行内容)

head -n 5 文件(功能描述：查看文件头5 行内容，5 可以是任意行数)

应用实例

案例: 查看/etc/profile 的前面5 行代码

head -n 5 /etc/profile

### tail 指令

tail 用于输出文件中尾部的内容，默认情况下tail 指令显示文件的前10 行内容。

基本语法

1) tail 文件（功能描述：查看文件尾10 行内容）

2) tail -n 5 文件（功能描述：查看文件尾5 行内容，5 可以是任意行数）

3) tail -f 文件（功能描述：实时追踪该文档的所有更新）

应用实例

案例1: 查看/etc/profile 最后5 行的代码

tail -n 5 /etc/profile

案例2: 实时监控mydate.txt , 看看到文件有变化时，是否看到， 实时的追加hello,world

tail -f /home/mydate.txt

### > 指令和>> 指令

  \> 输出重定向（覆盖）和>> 追加

基本语法

1) ls -l >文件（功能描述：列表的内容写入文件a.txt 中（覆盖写））

2) ls -al >>文件（功能描述：列表的内容追加到文件aa.txt 的末尾）

3) cat 文件1 > 文件2 （功能描述：将文件1 的内容覆盖到文件2）

4) echo "内容">> 文件(追加)

应用实例

案例1: 将/home 目录下的文件列表写入到/home/info.txt 中, 覆盖写入

ls -l /home > /home/info.txt [如果info.txt 没有，则会创建]

案例2: 将当前日历信息追加到/home/mycal 文件中

指令为： cal >> /home/mycal

### ln 指令

link

软链接也称为符号链接，类似于windows 里的快捷方式，主要存放了链接其他文件的路径

基本语法

ln -s [原文件或目录] [软链接名] （功能描述：给原文件创建一个软链接）

应用实例

案例1: 在/home 目录下创建一个软连接myroot，连接到/root 目录

### history 指令

查看已经执行过历史命令,也可以执行历史指令

基本语法

history （功能描述：查看已经执行过历史命令）

应用实例

案例1: 显示所有的历史命令

history

案例2: 显示最近使用过的10 个指令。

history 10

案例3：执行历史编号为5 的指令

!5

## p34 时间日期类

### 时间日期类

### date 指令-显示当前日期

基本语法
1) date （功能描述：显示当前时间）
2) date +%Y （功能描述：显示当前年份）
3) date +%m（功能描述：显示当前月份）
4) date +%d （功能描述：显示当前是哪一天）
5) date "+%Y-%m-%d %H:%M:%S"（功能描述：显示年月日时分秒）

应用实例
案例1: 显示当前时间信息
date
案例2: 显示当前时间年月日
date "+%Y-%m-%d"

案例3: 显示当前时间年月日时分秒
date "+%Y-%m-%d %H:%M:%S"

### date 指令-设置日期

基本语法
date -s 字符串时间

应用实例
案例1: 设置系统当前时间， 比如设置成2020-11-03 20:02:10
date -s “2020-11-03 20:02:10”

### cal 指令

查看日历指令cal

基本语法
cal [选项] （功能描述：不加选项，显示本月日历）

应用实例
案例1: 显示当前日历cal
案例2: 显示2020 年日历: cal 2020

## p35 查找指令（1）

### 搜索查找类

#### find指令

find 指令将从指定目录向下递归地遍历其各个子目录，将满足条件的文件或者目录显示在终端。

基本语法
find [搜索范围] [选项]

选项说明

![image-20201226141155703](https://b2files.173114.xyz/blogimg/2025/03/f7881f8117b10fa5de714b08bf812190.png)

应用实例
案例1: 按文件名：根据名称查找/home 目录下的hello.txt 文件
find /home -name hello.txt
案例2：按拥有者：查找/opt 目录下，用户名称为nobody 的文件
find /opt -user nobody
案例3：查找整个linux 系统下大于200M 的文件（+n 大于-n 小于n 等于, 单位有k,M,G）
find / -size +200M

ls -lh h表示大小用k，m之类表示

### locate 指令

locate 指令可以快速定位文件路径。locate 指令利用事先建立的系统中所有文件名称及路径的locate 数据库实现快速定位给定的文件。Locate 指令无需遍历整个文件系统，查询速度较快。为了保证查询结果的准确度，管理员必须定期更新locate 时刻

#### 基本语法

locate 搜索文件

#### 特别说明

由于locate 指令基于数据库进行查询，所以第一次运行前，必须使用updatedb 指令创建locate 数据库。

#### 应用实例

案例1: 请使用locate 指令快速定位hello.txt 文件所在目录
which 指令，可以查看某个指令在哪个目录下，比如ls 指令在哪个目录
which ls

## p36 查找指令（2）

### grep 指令和管道符号 |

grep 过滤查找， 管道符，“|”，表示将前一个命令的处理结果输出传递给后面的命令处理。

#### 基本语法

grep [选项] 查找内容源文件

#### 常用选项

![image-20201229162422560](https://b2files.173114.xyz/blogimg/2025/03/ceea8362c1b6ffc2d1e1c95e02fe4f63.png)

#### 应用实例

案例1: 请在hello.txt 文件中，查找"yes" 所在行，并且显示行号
写法1: cat /home/hello.txt | grep "yes"
写法2: grep -n "yes" /home/hello.txt

## p37 压缩和解压类

### gzip/gunzip 指令

gzip 用于压缩文件， gunzip 用于解压的

#### 基本语法

gzip 文件（功能描述：压缩文件，只能将文件压缩为*.gz 文件）
gunzip 文件.gz （功能描述：解压缩文件命令）

#### 应用实例

案例1: gzip 压缩， 将/home 下的hello.txt 文件进行压缩
gzip /home/hello.txt
案例2: gunzip 压缩， 将/home 下的hello.txt.gz 文件进行解压缩
gunzip /home/hello.txt.gz

### zip/unzip 指令

zip 用于压缩文件， unzip 用于解压的，这个在项目打包发布中很有用的

#### 基本语法

zip [选项] XXX.zip 将要压缩的内容（功能描述：压缩文件和目录的命令）
unzip [选项] XXX.zip （功能描述：解压缩文件）

#### zip 常用选项

-r：递归压缩，即压缩目录

#### unzip 的常用选项

-d<目录> ：指定解压后文件的存放目录

## p38 压缩和解压类（2）

### tar 指令

tar 指令是打包指令，最后打包后的文件是.tar.gz 的文件。

#### 基本语法

tar [选项] XXX.tar.gz 打包的内容(功能描述：打包目录，压缩后的文件格式.tar.gz)

#### 选项说明

![image-20201230105920233](https://b2files.173114.xyz/blogimg/2025/03/4fc938eb8e08633aba8dc8ff2ab3b806.png)

#### 应用实例

案例1: 压缩多个文件，将/home/pig.txt 和/home/cat.txt 压缩成pc.tar.gz
tar -zcvf pc.tar.gz /home/pig.txt /home/cat.txt
案例2: 将/home 的文件夹压缩成myhome.tar.gz
tar -zcvf myhome.tar.gz /home/
案例3: 将pc.tar.gz 解压到当前目录
tar -zxvf pc.tar.gz
案例4: 将myhome.tar.gz 解压到/opt/tmp2 目录下(1) mkdir /opt/tmp2 (2) tar -zxvf /home/myhome.tar.gz -C /opt/tmp2

## p39 实用指令小结

## p40 第十章 Linux组的介绍

### Linux 组基本介绍

在linux 中的每个用户必须属于一个组，不能独立于组外。在linux 中每个文件
有所有者、所在组、其它组的概念。

1) 所有者
2) 所在组
3) 其它组
4) 改变用户所在的组

## p41 所有者

### 文件/目录所有者

一般为文件的创建者,谁创建了该文件，就自然的成为该文件的所有者。

#### 查看文件的所有者

指令：ls –ahl
应用实例

#### 修改文件所有者

（change owner）

指令：chown 用户名 文件名
应用案例
要求：使用root 创建一个文件apple.txt ，然后将其所有者修改成tom
chown tom apple.txt

### 组的创建

#### 基本指令

groupadd 组名

#### 应用实例

创建一个组, ,monster
groupadd monster

创建一个用户fox ，并放入到monster 组中
useradd -g monster fox

## p42 所在组

### 文件/目录所在组

当某个用户创建了一个文件后，这个文件的所在组就是该用户所在的组(默认)。

#### 查看文件/目录所在组

##### 基本指令

ls –ahl
应用实例, 使用fox 来创建一个文件，看看该文件属于哪个组?

-rw-r--r--. 1 fox monster 0 12月 30 15:08 ok.txt

#### 修改文件/目录所在的组

##### 基本指令

chgrp 组名文件名

##### 应用实例

使用root 用户创建文件orange.txt ,看看当前这个文件属于哪个组，然后将这个文件所在组，修改到fruit 组。

1. groupadd fruit

2. touch orange.txt

3. 看看当前这个文件属于哪个组-> root 组

4. chgrp fruit orange.txt

## p43 修改所在组

### 其它组

除文件的所有者和所在组的用户外，系统的其它用户都是文件的其它组

### 改变用户所在组

在添加用户时，可以指定将该用户添加到哪个组中，同样的用root 的管理权限可以改变某个用户所在的组。

#### 改变用户所在组

usermod –g 新组名用户名
usermod –d 目录名用户名改变该用户登陆的初始目录。特别说明：用户需要有进入到新目录的权限。

#### 应用实例

将zwj 这个用户从原来所在组，修改到wudang 组
usermod -g wudang zwj

## p44 rwx权限

### 权限的基本介绍

ls -l 中显示的内容如下：
-rwxrw-r-- 1 root root 1213 Feb 2 09:39 abc

0-9 位说明
第0 位确定文件类型(d, - , l , c , b)
-代表是一个普通文件
l 是链接，相当于windows 的快捷方式 link
d 是目录，相当于windows 的文件夹
c 是字符设备文件，鼠标，键盘
b 是块设备，比如硬盘
第1-3 位确定所有者（该文件的所有者）拥有该文件的权限。---User
第4-6 位确定所属组（同用户组的）拥有该文件的权限，---Group
第7-9 位确定其他用户拥有该文件的权限---Other

### rwx 权限详解，难点

#### rwx 作用到文件

1) [ r ]代表可读(read): 可以读取,查看
2) [ w ]代表可写(write): 可以修改,但是不代表可以删除该文件,删除一个文件的前提条件是对该文件所在的目录有写权
限，才能删除该文件.
3) [ x ]代表可执行(execute):可以被执行

#### rwx 作用到目录

1) [ r ]代表可读(read): 可以读取，ls 查看目录内容
2) [ w ]代表可写(write): 可以修改, 对目录内创建+删除+重命名目录
3) [ x ]代表可执行(execute):可以进入该目录

## p45 权限说明案例

### ls -l 中显示的内容如下：

-rwxrw-r-- 1 root root 1213 Feb 2 09:39 abc

#### 10 个字符确定不同用户能对文件干什么

第一个字符代表文件类型： - l d c b
其余字符每3 个一组(rwx) 读(r) 写(w) 执行(x)
第一组rwx : 文件拥有者的权限是读、写和执行
第二组rw- : 与文件拥有者同一组的用户的权限是读、写但不能执行
第三组r-- : 不与文件拥有者同组的其他用户的权限是读不能写和执行

可用数字表示为: r=4,w=2,x=1 因此rwx=4+2+1=7 , 数字可以进行组合

其它说明
1 文件：硬连接数或目录：子目录数
root 用户
root 组
1213 文件大小(字节)，如果是文件夹，显示4096 字节
Feb 2 09:39 最后修改日期
abc 文件名

## p46 修改权限

### 修改权限-chmod

#### 基本说明：

通过chmod 指令，可以修改文件或者目录的权限。

#### 第一种方式：+ 、-、= 变更权限

u:所有者g:所有组o:其他人a:所有人(u、g、o 的总和)

1) chmod u=rwx,g=rx,o=x 文件/目录名
2) chmod o+w 文件/目录名
3) chmod a-x 文件/目录名

##### 案例演示

1) 给abc 文件的所有者读写执行的权限，给所在组读执行权限，给其它组读执行权限。
chmod u=rwx,g=rx,o=rx abc
2) 给abc 文件的所有者除去执行的权限，增加组写的权限
chmod u-x,g+w abc
3) 给abc 文件的所有用户添加读的权限
chmod a+r abc

#### 第二种方式：通过数字变更权限

r=4 w=2 x=1 rwx=4+2+1=7
chmod u=rwx,g=rx,o=x 文件目录名
相当于chmod 751 文件/目录名

##### 案例演示

要求：将/home/abc.txt 文件的权限修改成rwxr-xr-x, 使用给数字的方式实现：

chmod 755 /home/abc.txt

## p47 修改所在组和所有者

### 基本介绍

chown newowner 文件/目录改变所有者
chown newowner:newgroup 文件/目录改变所有者和所在组

-R 如果是目录则使其下所有子文件或目录递归生效

#### 案例演示

1) 请将/home/abc.txt 文件的所有者修改成tom
chown tom /home/abc.txt

2) 请将/home/test 目录下所有的文件和目录的所有者都修改成tom
chown -R tom /home/test

#### 修改文件/目录所在组-chgrp

##### 基本介绍

chgrp newgroup 文件/目录【改变所在组】

##### 案例演示

请将/home/abc .txt 文件的所在组修改成shaolin (少林)
groupadd shaolin
chgrp shaolin /home/abc.txt
请将/home/test 目录下所有的文件和目录的所在组都修改成shaolin(少林)
chgrp -R shaolin /home/test

## p48 最佳实践-警察和土匪游戏

police ， bandit
jack, jerry: 警察
xh, xq: 土匪

1) 创建组groupadd police ; groupadd bandit
2) 创建用户
useradd -g police jack ; useradd -g police jerry
useradd -g bandit xh; useradd -g bandit xq
3) jack 创建一个文件，自己可以读r 写w，本组人可以读，其它组没人任何权限
首先jack 登录； vim jack.txt ; chmod 640 jack.txt
4) jack 修改该文件，让其它组人可以读, 本组人可以读写
chmod o=r,g=r jack.txt
5) xh 投靠警察，看看是否可以读写.
usermod -g police xh
6) 测试，看看xh 是否可以读写，xq 是否可以, 小结论，就是如果要对目录内的文件进行操作，需要要有对该目录的
相应权限

## p49文件权限管理[课堂练习1]

1) 建立两个组（神仙(sx),妖怪(yg)）
2) 建立四个用户(唐僧,悟空，八戒，沙僧)
3) 设置密码
4) 把悟空，八戒放入妖怪唐僧沙僧在神仙
5) 用悟空建立一个文件（monkey.java 该文件要输出i am monkey）
6) 给八戒一个可以r w 的权限
7) 八戒修改monkey.java 加入一句话( i am pig)
8) 唐僧沙僧对该文件没有权限
9) 把沙僧放入妖怪组
10) 让沙僧修改该文件monkey, 加入一句话("我是沙僧，我是妖怪!");
11) 对文件夹rwx 的细节讨论和测试!!!
x: 表示可以进入到该目录, 比如cd
r: 表示可以ls , 将目录的内容显示
w: 表示可以在该目录，删除或者创建文件

12) 示意图

<img src="https://b2files.173114.xyz/blogimg/2025/03/dce635d8f71816d223ddb67174bebc2c.png" alt="image-20210115140531445" style="zoom:150%;" />

课堂练习2，完成如下操作
1) 用root 登录，建立用户mycentos,自己设定密码
2) 用mycentos 登录，在主目录下建立目录test/t11/t1
3) 在t1 中建立一个文本文件aa,用vi 编辑其内容为ls –al
4) 改变aa 的权限为可执行文件[可以将当前日期追加到一个文件],运行该文件./aa
5) 删除新建立的目录test/t11/t1
6) 删除用户mycentos 及其主目录中的内容
7) 将linux 设置成进入到图形界面的
8) 重新启动linux 或关机

## p50 第10章总结

## p51 第11章 定时任务调度

### crond 任务调度

crontab 进行 定时任务的设置

### 概述

任务调度：是指系统在某个时间执行的特定的命令或程序。
任务调度分类：1.系统工作：有些重要的工作必须周而复始地执行。如病毒扫描等
个别用户工作：个别用户可能希望执行某些程序，比如对mysql 数据库的备份。
示意图

![image-20210120170042021](https://b2files.173114.xyz/blogimg/2025/03/bd6e62e665cfb90ec0f61bda40c23b3b.png)

## p52 crontab

### 基本语法

crontab [选项]

### 常用选项

![image-20210120170118097](https://b2files.173114.xyz/blogimg/2025/03/f09a0a27fa1128cda0d8297912770220.png)

### 快速入门

设置任务调度文件：/etc/crontab
设置个人任务调度。执行crontab –e 命令。
接着输入任务到调度文件
如：*/1 * * * * ls –l /etc/ > /tmp/to.txt
意思说每小时的每分钟执行ls –l /etc/ > /tmp/to.txt 命令

#### 参数细节说明

cron表达式

5 个占位符的说明

![image-20210120170150025](https://b2files.173114.xyz/blogimg/2025/03/ee4245f22252df6f5f2a574546cc35e1.png)

## p53 crond 时间规则

### 特殊时间执行案例

![image-20210121115047050](https://b2files.173114.xyz/blogimg/20210507102152.png)

每天的凌晨4点，每10分钟的时间段为 4-5点之内

## p54 crond应用实例

案例1：每隔1 分钟，就将当前的日期信息，追加到/tmp/mydate 文件中

*/1 * * * * date >> /tmp/mydate

案例2：每隔1 分钟， 将当前日期和日历都追加到/home/mycal 文件中
步骤:

(1) vim /home/my.sh 写入内容date >> /home/mycal 和cal >> /home/mycal
(2) 给my.sh 增加执行权限，chmod u+x /home/my.sh
(3) crontab -e 增加*/1 * * * * /home/my.sh

### crond 相关指令

conrtab –r：终止任务调度。其实就是删除crondtab -e 中的任务
crontab –l：列出当前有那些任务调度
service crond restart [重启任务调度]

## p55 at定时任务

### 基本介绍

1) at 命令是一次性定时计划任务，at 的守护进程atd 会以后台模式运行，检查作业队列来运行。
2) 默认情况下，atd 守护进程每60 秒检查作业队列（任务队列），有作业时，会检查作业运行时间，如果时间与当前时间匹配，则
运行此作业。
3) at 命令是一次性定时计划任务，执行完一个任务后不再执行此任务了
4) 在使用at 命令的时候，一定要保证atd 进程的启动, 可以使用相关指令来查看
ps -ef | grep atd //可以检测atd 是否在运行

ps -ef 检测现在有哪些进程在运行

| grep 过滤

5) 画一个示意图

![image-20210123135029411](https://b2files.173114.xyz/blogimg/20210507102156.png)

### at 命令格式

at [选项] [时间]
Ctrl + D 结束at 命令的输入， 输出两次

### at 命令选项

![image-20210123135756634](https://b2files.173114.xyz/blogimg/20210507102200.png)

### at 时间定义

at 指定时间的方法：
1) 接受在当天的hh:mm（小时:分钟）式的时间指定。假如该时间已过去，那么就放在第二天执行。例如：04:00
2) 使用midnight（深夜），noon（中午），teatime（饮茶时间，一般是下午4 点）等比较模糊的词语来指定时间。
3) 采用12 小时计时制，即在时间后面加上AM（上午）或PM（下午）来说明是上午还是下午。例如：12pm
4) 指定命令执行的具体日期，指定格式为month day（月日）或mm/dd/yy（月/日/年）或dd.mm.yy（日.月.年），指
定的日期必须跟在指定时间的后面。例如：04:00 2021-03-1
5) 使用相对计时法。指定格式为：now + count time-units ，now 就是当前时间，time-units 是时间单位，这里能够是minutes
（分钟）、hours（小时）、days（天）、weeks（星期）。count 是时间的数量，几天，几小时。例如：now + 5 minutes
6) 直接使用today（今天）、tomorrow（明天）来指定完成命令的时间。

## p56 at任务调度实例

### 案例1：2 天后的下午5 点执行/bin/ls /home

![image-20210123141446318](https://b2files.173114.xyz/blogimg/20210507102205.png)

### 案例2：atq 命令来查看系统中没有执行的工作任务

### 案例3：明天17 点钟，输出时间到指定文件内比如/root/date100.log

![image-20210123141512908](https://b2files.173114.xyz/blogimg/20210507102210.png)

### 案例4：2 分钟后，输出时间到指定文件内比如/root/date200.log

![image-20210123141526550](https://b2files.173114.xyz/blogimg/20210507102214.png)

### 案例5：删除已经设置的任务, atrm 编号

atrm 4 //表示将job 队列，编号为4 的job 删除.

### ***默认删除键变^H，只要按住ctrl键，删除键就可以使用了~***

## p57 任务调度小结

## p58 磁盘分区机制

### Linux 分区

#### 原理介绍

1) Linux 来说无论有几个分区，分给哪一目录使用，它归根结底就只有一个根目录，一个独立且唯一的文件结构, Linux
中每个分区都是用来组成整个文件系统的一部分。
2) Linux 采用了一种叫“载入”的处理方法，它的整个文件系统中包含了一整套的文件和目录，且将一个分区和一个目录
联系起来。这时要载入的一个分区将使它的存储空间在一个目录下获得。
3) 示意图

![image-20210123143218395](https://b2files.173114.xyz/blogimg/20210507102219.png)

#### 硬盘说明

1) Linux 硬盘分IDE 硬盘和SCSI 硬盘，目前基本上是SCSI 硬盘
2) 对于IDE 硬盘，驱动器标识符为“hdx~”,其中“hd”表明分区所在设备的类型，这里是指IDE 硬盘了。“x”为盘号（a 为
基本盘，b 为基本从属盘，c 为辅助主盘，d 为辅助从属盘）,“~”代表分区，前四个分区用数字1 到4 表示，它们是主分区或扩展分区，从5 开始就是逻辑分区。例，hda3 表示为第一个IDE 硬盘上的第三个主分区或扩展分区,hdb2表示为第二个IDE 硬盘上的第二个主分区或扩展分区。
3) 对于SCSI 硬盘则标识为“sdx~”，SCSI 硬盘是用“sd”来表示分区所在设备的类型的，其余则和IDE 硬盘的表示方法一样

![image-20210129134831613](https://b2files.173114.xyz/blogimg/20210507102223.png)

### 查看所有设备挂载情况

命令：lsblk 或者lsblk -f

![image-20210201094938180](https://b2files.173114.xyz/blogimg/20210507102227.png)

## p59 增加磁盘应用实例

### 挂载的经典案例

#### 说明：

下面我们以增加一块硬盘为例来熟悉下磁盘的相关指令和深入理解磁盘分区、挂载、卸载的概念。

#### 如何增加一块硬盘

1) 虚拟机添加硬盘
2) 分区
3) 格式化
4) 挂载
5) 设置可以自动挂载

#### 虚拟机增加硬盘步骤1

在【虚拟机】菜单中，选择【设置】，然后设备列表里添加硬盘，然后一路【下一步】，中间只有选择磁盘大小的地方
需要修改，至到完成。然后重启系统（才能识别）！

![image-20210201145342620](https://b2files.173114.xyz/blogimg/20210507102231.png)

#### 虚拟机增加硬盘步骤2

分区命令fdisk /dev/sdb

开始对/sdb 分区
m 显示命令列表
p 显示磁盘分区同fdisk –l
n 新增分区
d 删除分区
w 写入并退出

说明： 开始分区后输入n，新增分区，然后选择p ，分区类型为主分区。两次回车默认剩余全部空间。最后输入w
写入分区并退出，若不保存退出输入q。

![image-20210201170126047](https://b2files.173114.xyz/blogimg/20210507102235.png)

#### 虚拟机增加硬盘步骤3

格式化磁盘
分区命令:mkfs -t ext4 /dev/sdb1
其中ext4 是分区类型

#### 虚拟机增加硬盘步骤4

挂载: 将一个分区与一个目录联系起来，
mount 设备名称挂载目录
例如： mount /dev/sdb1 /newdisk

umount 设备名称或者挂载目录

例如： umount /dev/sdb1 或者umount /newdisk

老师注意: 用命令行挂载,重启后会失效

**问题：1.能否在一个目录下挂载多个分区**

不能，只能挂载一个

**如果切换挂载 已经写入的文件位置仍然不变**

#### 虚拟机增加硬盘步骤5

永久挂载: 通过修改/etc/fstab 实现挂载
添加完成后执行mount –a 即刻生效

![image-20210201175116348](https://b2files.173114.xyz/blogimg/20210507102240.png)

## p60 磁盘情况查询

### 查询系统整体磁盘使用情况

#### 基本语法

df -h

#### 应用实例

查询系统整体磁盘使用情况

![image-20210201175332950](https://b2files.173114.xyz/blogimg/20210507102244.png)

### 查询指定目录的磁盘占用情况

#### 基本语法

du -h

查询指定目录的磁盘占用情况，默认为当前目录
-s 指定目录占用大小汇总
-h 带计量单位
-a 含文件
--max-depth=1 子目录深度
-c 列出明细的同时，增加汇总值

#### 应用实例

查询/opt 目录的磁盘占用情况，深度为1

![image-20210201175545788](https://b2files.173114.xyz/blogimg/20210507102248.png)

## p61 磁盘情况-工作实用指令

1) 统计/opt 文件夹下文件的个数
ls -l /opt | grep "^-" | wc -l

![image-20210201175741424](https://b2files.173114.xyz/blogimg/20210507102251.png)

2) 统计/opt 文件夹下目录的个数
ls -l /opt | grep "^d" | wc -l

![image-20210201175813710](https://b2files.173114.xyz/blogimg/20210507102256.png)

3) 统计/opt 文件夹下文件的个数，包括子文件夹里的
ls -lR /opt | grep "^-" | wc -l

4) 统计/opt 文件夹下目录的个数，包括子文件夹里的
ls -lR /opt | grep "^d" | wc -l

5) 以树状显示目录结构tree 目录， 注意，如果没有tree ,则使用yum install tree 安装

## p62 磁盘挂载小结

## p63 NAT网络原理图

![image-20210202091602122](https://b2files.173114.xyz/blogimg/20210507102301.png)

## p64 网络配置指令

### 查看网络IP 和网关

ip自动分配与指定ip

![image-20210202100611325](https://b2files.173114.xyz/blogimg/20210507102317.png)

### 查看网关

![image-20210202100628749](https://b2files.173114.xyz/blogimg/20210507102322.png)

### 查看windows 环境的中VMnet8 网络配置(ipconfig 指令)

![image-20210202101222774](https://b2files.173114.xyz/blogimg/20210507102327.png)

### 查看linux 的网络配置ifconfig

![image-20210202101245459](https://b2files.173114.xyz/blogimg/20210507102332.png)

### ping 测试主机之间网络连通性

#### 基本语法

ping 目的主机（功能描述：测试当前服务器是否可以连接目的主机）

#### 应用实例

测试当前服务器是否可以连接百度
ping www.baidu.com

## p65 网络配置实例

### linux 网络环境配置

#### 第一种方法(自动获取)：

说明：登陆后，通过界面的来设置自动获取ip，特点：linux 启动后会自动获取IP,缺点是每次自动获取的ip 地址可
能不一样

![image-20210202101712920](https://b2files.173114.xyz/blogimg/20210507102336.png)

#### 第二种方法(指定ip)

说明
直接修改配置文件来指定IP,并可以连接到外网(程序员推荐)

编辑vi /etc/sysconfig/network-scripts/ifcfg-ens33
要求：将ip 地址配置的静态的，比如: ip 地址为192.168.200.130

##### ifcfg-ens33 文件说明

DEVICE=eth0 #接口名（设备,网卡）

HWADDR=00:0C:2x:6x:0x:xx #MAC 地址

TYPE=Ethernet #网络类型（通常是Ethemet）

UUID=926a57ba-92c6-4231-bacb-f27e5e6a9f44 #随机id

#系统启动的时候网络接口是否有效（yes/no）
ONBOOT=yes

#IP 的配置方法[none|static|bootp|dhcp]（引导时不使用协议|静态分配IP|BOOTP 协议|DHCP 协议）
BOOTPROTO=static
#IP 地址
IPADDR=192.168.200.130
#网关
GATEWAY=192.168.200.2
#域名解析器
DNS1=192.168.200.2
重启网络服务或者重启系统生效
service network restart 、reboot

## p66 主机名和hosts映射

### 设置主机名

1) 为了方便记忆，可以给linux 系统设置主机名, 也可以根据需要修改主机名
2) 指令hostname ： 查看主机名
3) 修改文件在/etc/hostname 指定
4) 修改后，重启生效

### 设置hosts 映射

思考：如何通过主机名能够找到(比如ping) 某个linux 系统?

windows
在C:\Windows\System32\drivers\etc\hosts 文件指定即可

[win10无法修改host文件参考](https://www.cnblogs.com/lwh-note/p/9005953.html)

案例: 192.168.200.130 hspedu100

linux
在/etc/hosts 文件指定

案例: 192.168.200.1 ThinkPad-PC

### 主机名解析过程分析(Hosts、DNS)

#### Hosts 是什么

一个文本文件，用来记录IP 和Hostname(主机名)的映射关系

#### DNS

DNS，就是Domain Name System 的缩写，翻译过来就是域名系统
是互联网上作为域名和IP 地址相互映射的一个分布式数据库

#### 应用实例: 用户在浏览器输入了www.baidu.com

1) 浏览器先检查浏览器缓存中有没有该域名解析IP 地址，有就先调用这个IP 完成解析；如果没有，就检查DNS 解析
器缓存，如果有直接返回IP 完成解析。这两个缓存，可以理解为本地解析器缓存
2) 一般来说，当电脑第一次成功访问某一网站后，在一定时间内，浏览器或操作系统会缓存他的IP 地址（DNS 解析记
录）.如在cmd 窗口中输入
ipconfig /displaydns //DNS 域名解析缓存
ipconfig /flushdns //手动清理dns 缓存
3) 如果本地解析器缓存没有找到对应映射，检查系统中hosts 文件中有没有配置对应的域名IP 映射，如果有，则完成
解析并返回。
4) 如果本地DNS 解析器缓存和hosts 文件中均没有找到对应的IP，则到域名服务DNS 进行解析域
5) 示意图

![image-20210202111536782](https://b2files.173114.xyz/blogimg/20210507102340.png)

## p67 网络配置小结

## p68 进程基本介绍

1) 在LINUX 中，每个执行的程序都称为一个进程。每一个进程都分配一个ID 号(pid,进程号)。=>windows => linux
2) 每个进程都可能以两种方式存在的。前台与后台，所谓前台进程就是用户目前的屏幕上可以进行操作的。后台进程
则是实际在操作，但由于屏幕上无法看到的进程，通常使用后台方式执行。
3) 一般系统的服务都是以后台进程的方式存在，而且都会常驻在系统中。直到关机才才结束。
4) 示意图

## p69 ps指令详解

### 显示系统执行的进程

#### 基本介绍

ps 命令是用来查看目前系统中，有哪些正在执行，以及它们执行的状况。可以不加任何参数.

![image-20210202113438356](https://b2files.173114.xyz/blogimg/20210507102344.png)

### ps 详解

1) 指令：ps –aux|grep xxx ，比如我看看有没有sshd 服务

2) 指令说明

 System V 展示风格
 USER：用户名称
 PID：进程号
 %CPU：进程占用CPU 的百分比
 %MEM：进程占用物理内存的百分比
 VSZ：进程占用的虚拟内存大小（单位：KB）
 RSS：进程占用的物理内存大小（单位：KB）
 TT：终端名称,缩写.
 STAT：进程状态，其中S-睡眠，s-表示该进程是会话的先导进程，N-表示进程拥有比普通优先级更   低的优先级，R-
 正在运行，D-短期等待，Z-僵死进程，T-被跟踪或者被停止等等
 STARTED：进程的启动时间
 TIME：CPU 时间，即进程使用CPU 的总时间
 COMMAND：启动进程所用的命令和参数，如果过长会被截断显示

## p70 父子进程

### 应用实例

要求：以全格式显示当前所有的进程，查看进程的父进程。查看sshd 的父进程信息
ps -ef 是以全格式显示当前所有的进程
-e 显示所有进程。-f 全格式
ps -ef|grep sshd

 是BSD 风格
UID：用户ID
PID：进程ID
PPID：父进程ID
C：CPU 用于计算执行优先级的因子。数值越大，表明进程是CPU 密集型运算，执行优先级会降低；数值越小，表
明进程是I/O 密集型运算，执行优先级会提高
STIME：进程启动的时间
TTY：完整的终端名称
TIME：CPU 时间
CMD：启动进程所用的命令和参数

## p71 终止进程kill 和killall

### 介绍:

若是某个进程执行一半需要停止时，或是已消了很大的系统资源时，此时可以考虑停止该进程。使用kill 命令来完
成此项任务。

### 基本语法

kill [选项] 进程号（功能描述：通过进程号杀死/终止进程）
killall 进程名称（功能描述：通过进程名称杀死进程，也支持通配符，这在系统因负载过大而变得很慢时很有用）

### 常用选项

-9 :表示强迫进程立即停止

### 最佳实践

1) 案例1：踢掉某个非法登录用户
kill 进程号, 比如kill 11421
2) 案例2: 终止远程登录服务sshd, 在适当时候再次重启sshd 服务
kill sshd 对应的进程号; /bin/systemctl start sshd.service
3) 案例3: 终止多个gedit , 演示killall gedit
4) 案例4：强制杀掉一个终端, 指令kill -9 bash 对应的进程号

## p72 查看进程树

### 14.4.1 基本语法

pstree [选项] ,可以更加直观的来看进程信息

### 14.4.2 常用选项

-p :显示进程的PID
-u :显示进程的所属用户

### 14.4.3 应用实例：

 案例1：请你树状的形式显示进程的pid
pstree -p
 案例2：请你树状的形式进程的用户
pstree -u

## p73 服务管理

### 14.5.1 介绍:

服务(service) 本质就是进程，但是是运行在后台的，通常都会监听某个端口，等待其它程序的请求，比如(mysqld , sshd
防火墙等)，因此我们又称为守护进程，是Linux 中非常重要的知识点。【原理图】

### 14.5.2 service 管理指令

1) service 服务名[start | stop | restart | reload | status]
2) 在CentOS7.0 后很多服务不再使用<font color=SkyBlue>  **service**</font>  ,而是<font color=SkyBlue>  **systemctl**</font>  (后面专门讲)
3) service 指令管理的服务在/etc/init.d 查看

### service 管理指令案例

请使用service 指令，查看，关闭，启动network [注意：在虚拟系统演示，因为网络连接会关闭]
指令:
service network status
service network stop
service network start

### 14.5.4 查看服务名:

方式1：使用setup -> 系统服务就可以看到全部。
setup

<font color=Red>按tab会进入图形化界面的下面的菜单 ，利于退出</font >

方式2: /etc/init.d 看到service 指令管理的服务
ls -l /etc/init.d

## p74 服务管理（2）

### 14.5.5 服务的运行级别(runlevel):

Linux 系统有7 种运行级别(runlevel)：常用的是级别3 和5
运行级别0：系统停机状态，系统默认运行级别不能设为0，否则不能正常启动
运行级别1：单用户工作状态，root 权限，用于系统维护，禁止远程登陆
运行级别2：多用户状态(没有NFS)，不支持网络
运行级别3：完全的多用户状态(有NFS)，无界面，登陆后进入控制台命令行模式
运行级别4：系统未使用，保留
运行级别5：X11 控制台，登陆后进入图形GUI 模式
运行级别6：系统正常关闭并重启，默认运行级别不能设为6，否则不能正常启动
开机的流程说明：

![image-20210205142706265](https://b2files.173114.xyz/blogimg/20210507102348.png)

## p75 服务管理（3）

### 14.5.7 chkconfig 指令

#### 介绍

通过chkconfig 命令可以给服务的各个运行级别设置自启动/关闭
chkconfig 指令管理的服务在/etc/init.d 查看
注意: Centos7.0 后，很多服务使用systemctl 管理(后面马上讲)

#### chkconfig 基本语法

1) 查看服务chkconfig --list [| grep xxx]
2) chkconfig 服务名--list
3) chkconfig --level 5 服务名on/off
 案例演示: 对network 服务进行各种操作, 把network 在3 运行级别,关闭自启动
chkconfig --level 3 network off
chkconfig --level 3 network on

#### 使用细节

chkconfig 重新设置服务后自启动或关闭，需要重启机器reboot 生效.

## p76 服务管理（4）

### 14.5.8 systemctl 管理指令

基本语法： systemctl [start | stop | restart | status] 服务名
systemctl 指令管理的服务在/usr/lib/systemd/system 查看

### 14.5.9 systemctl 设置服务的自启动状态

systemctl list-unit-files [ | grep 服务名] (查看服务开机启动状态, grep 可以进行过滤)
systemctl enable 服务名(设置服务开机启动)
systemctl disable 服务名(关闭服务开机启动)
systemctl is-enabled 服务名(查询某个服务是否是自启动的)

### 14.5.10 应用案例：

查看当前防火墙的状况，关闭防火墙和重启防火墙。=> firewalld.service
systemctl status firewalld; systemctl stop firewalld; systemctl start firewalld

### 14.5.11 细节讨论：

关闭或者启用防火墙后，立即生效。[telnet 测试某个端口即可]
这种方式只是<font color=Red>临时生效</font >，当重启系统后，还是回归以前对服务的设置。
如果希望设置某个服务自启动或关闭永久生效，要使用systemctl [enable|disable] 服务名. [演示]

## p77 服务管理（5）

### 14.5.12 打开或者关闭指定端口

在真正的生产环境，往往需要将防火墙打开，但问题来了，如果我们把防火墙打开，那么外部请求数据包就不能跟
服务器监听端口通讯。这时，需要打开指定的端口。比如80、22、8080 等，这个又怎么做呢？老韩给给大家讲一讲。[示
意图]

![image-20210205155145378](https://b2files.173114.xyz/blogimg/20210507102353.png)

### 14.5.13 firewall 指令

1) 打开端口: firewall-cmd --permanent --add-port=端口号/协议
2) 关闭端口: firewall-cmd --permanent --remove-port=端口号/协议
3) 重新载入,才能生效: firewall-cmd --reload
4) 查询端口是否开放: firewall-cmd --query-port=端口/协议

### 14.5.14 应用案例：

1) 启用防火墙， 测试111 端口是否能telnet , 不行
2) 开放111 端口
firewall-cmd --permanent --add-port=111/tcp ; 需要firewall-cmd --reload
3) 再次关闭111 端口
firewall-cmd --permanent --remove-port=111/tcp ; 需要firewall-cmd --reload

## p78 动态监控进程

### 介绍：

top 与ps 命令很相似。它们都用来显示正在执行的进程。Top 与ps 最大的不同之处，在于top 在执行一段时间可以
更新正在运行的的进程。

### 14.6.2 基本语法

top [选项]

#### 14.6.3 选项说明：

![image-20210220092556056](https://b2files.173114.xyz/blogimg/20210507102357.png)

## p79 交互操作说明

![image-20210220092641785](https://b2files.173114.xyz/blogimg/20210507102402.png)

### 14.6.5 应用实例

 案例1.监视特定用户, 比如我们监控tom 用户
top：输入此命令，按回车键，查看执行的进程。
u：然后输入“u”回车，再输入用户名，即可,
 案例2：终止指定的进程, 比如我们要结束tom 登录
top：输入此命令，按回车键，查看执行的进程。
k：然后输入“k”回车，再输入要结束的进程ID 号
 案例3:指定系统状态更新的时间(每隔10 秒自动更新), 默认是3 秒
top -d 10

## p80 监控网络状态

### 14.7.1 查看系统网络情况netstat

#### 基本语法

netstat [选项]

#### 选项说明

-an 按一定顺序排列输出
-p 显示哪个进程在调用

#### 应用案例

请查看服务名为sshd 的服务的信息。
netstat -anp | grep sshd

![image-20210220103422291](https://b2files.173114.xyz/blogimg/20210507102406.png)

### 14.7.2 检测主机连接命令ping：

是一种网络检测工具，它主要是用检测远程主机是否正常，或是两部主机间的网线或网卡故障。
如: ping 对方ip 地址

## p81 进程管理小结

## p82 rpm管理（1）

### 15.1 rpm 包的管理

#### 15.1.1 介绍

rpm 用于互联网下载包的打包及安装工具，它包含在某些Linux 分发版中。它生成具有.RPM 扩展名的文件。RPM
是RedHat Package Manager（RedHat 软件包管理工具）的缩写，类似windows 的setup.exe，这一文件格式名称虽然打上
了RedHat 的标志，但理念是通用的。
Linux 的分发版本都有采用（suse,redhat, centos 等等），可以算是公认的行业标准了。

#### 15.1.2 rpm 包的简单查询指令

查询已安装的rpm 列表rpm –qa|grep xx
举例： 看看当前系统，是否安装了firefox
指令: rpm -qa | grep firefox

#### 15.1.3 rpm 包名基本格式

一个rpm 包名：firefox-60.2.2-1.el7.centos.x86_64
名称:firefox
版本号：60.2.2-1
适用操作系统: el7.centos.x86_64
表示centos7.x 的64 位系统
如果是i686、i386 表示32 位系统，noarch 表示通用

#### 15.1.4 rpm 包的其它查询指令：

rpm -qa :查询所安装的所有rpm 软件包
rpm -qa | more
rpm -qa | grep X [rpm -qa | grep firefox ]

rpm -q 软件包名:查询软件包是否安装
案例：rpm -q firefox
rpm -qi 软件包名：查询软件包信息
案例: rpm -qi firefox
rpm -ql 软件包名:查询软件包中的文件
比如： rpm -ql firefox
rpm -qf 文件全路径名查询文件所属的软件包
rpm -qf /etc/passwd
rpm -qf /root/install.log

## p83 rpm的卸载

#### 15.1.5 卸载rpm 包：

#####  基本语法

rpm -e RPM 包的名称//erase

#####  应用案例

删除firefox 软件包
rpm -e firefox

#####  细节讨论

1) 如果其它软件包依赖于您要卸载的软件包，卸载时则会产生错误信息。
如： $ rpm -e foo
removing these packages would break dependencies:foo is needed by bar-1.0-1
2) 如果我们就是要删除foo 这个rpm 包，可以增加参数--nodeps ,就可以强制删除，但是一般不推荐这样做，因为依
赖于该软件包的程序可能无法运行
如：$ rpm -e --nodeps foo

#### 15.1.6 安装rpm 包

#####  基本语法

rpm -ivh RPM 包全路径名称

#####  参数说明

i=install 安装
v=verbose 提示
h=hash 进度条

#####  应用实例

演示卸载和安装firefox 浏览器
rpm -e firefox
rpm -ivh firefox

:cry: 2021年2月20日10点59分

## p84 yum

### 15.2.1 介绍：

Yum 是一个Shell 前端软件包管理器。基于RPM 包管理，能够从指定的服务器自动
下载RPM 包并且安装，可以自动处理依赖性关系，并且一次安装所有依赖的软件包。
示意图

### 15.2.2 yum 的基本指令

查询yum 服务器是否有需要安装的软件
yum list|grep xx 软件列表

### 15.2.3 安装指定的yum 包

yum install xxx 下载安装

### 15.2.4 yum 应用实例：

案例：请使用yum 的方式来安装firefox
rpm -e firefox
yum list | grep firefox
yum install firefox

## p85 软件包管理小结

## p86 安装配置JDK1.8

### 16.1 概述

如果需要在Linux 下进行JavaEE 的开发，我们需要安装如下软件

![image-20210220113612663](https://b2files.173114.xyz/blogimg/20210507102409.png)

### 16.2 安装JDK

#### 16.2.1 安装步骤

1) mkdir /opt/jdk
2) 通过xftp6 上传到/opt/jdk 下
3) cd /opt/jdk
4) 解压tar -zxvf jdk-8u261-linux-x64.tar.gz
5) mkdir /usr/local/java
6) mv /opt/jdk/jdk1.8.0_261 /usr/local/java
7) 配置环境变量的配置文件vim /etc/profile
8) export JAVA_HOME=/usr/local/java/jdk1.8.0_261
9) export PATH=$JAVA_HOME/bin:$PATH
10) source /etc/profile [让新的环境变量生效]

刷新系统环境变量

#### 16.2.2 测试是否安装成功

编写一个简单的Hello.java 输出"hello,world!"

## p87  tomcat 的安装

#### 16.3.1 步骤:

1) 上传安装文件，并解压缩到/opt/tomcat
2) 进入解压目录/bin , 启动tomcat ./startup.sh
3) 开放端口8080 , 回顾firewall-cmd

#### 16.3.2 测试是否安装成功：

在windows、Linux 下访问http://linuxip:8080

![image-20210220135615700](https://b2files.173114.xyz/blogimg/20210507102413.png)

## p88 idea2020 的安装

### 16.4.1 步骤

1) 下载地址: https://www.jetbrains.com/idea/download/#section=windows
2) 解压缩到/opt/idea
3) 启动idea bin 目录下./idea.sh，配置jdk
4) 编写Hello world 程序并测试成功！

## p89 mysql5.7 的安装(!!)

1. 新建文件夹/opt/mysql，并cd进去

2. 运行wget http://dev.mysql.com/get/mysql-5.7.26-1.el7.x86_64.rpm-bundle.tar，下载mysql安装包

PS：centos7.6自带的类mysql数据库是mariadb，会跟mysql冲突，要先删除。

3. 运行tar -xvf mysql-5.7.26-1.el7.x86_64.rpm-bundle.tar 

4. 运行rpm -qa|grep mari，查询mariadb相关安装包

![img](https://b2files.173114.xyz/blogimg/20210507102417.jpg)

5. 运行rpm -e --nodeps mariadb-libs，卸载

6. 然后开始真正安装mysql，依次运行以下几条

rpm -ivh mysql-community-common-5.7.26-1.el7.x86_64.rpm

rpm -ivh mysql-community-libs-5.7.26-1.el7.x86_64.rpm

rpm -ivh mysql-community-client-5.7.26-1.el7.x86_64.rpm

rpm -ivh mysql-community-server-5.7.26-1.el7.x86_64.rpm

7. 运行systemctl start mysqld.service，启动mysql

8. 然后开始设置root用户密码

Mysql自动给root用户设置随机密码，运行grep "password" /var/log/mysqld.log可看到当前密码

![img](https://b2files.173114.xyz/blogimg/20210507102420.jpg)

9. 运行mysql -u root -p，用root用户登录，提示输入密码可用上述的，可以成功登陆进入mysql命令行

10. 设置root密码，对于个人开发环境，如果要设比较简单的密码（**生产环境服务器要设复杂密码**），可以运行

set global validate_password_policy=0; 提示密码设置策略

（validate_password_policy默认值1，）

![img](https://b2files.173114.xyz/blogimg/20210507102425.jpg)

11. set password for 'root'@'localhost' =password('xjxj1109');

12. 运行flush privileges;使密码设置生效

## p90 小结

## p91 shell编程快速入门

### 17.1 为什么要学习Shell 编程

1) Linux 运维工程师在进行服务器集群管理时，需要编写Shell 程序来进行服务器管理。
2) 对于JavaEE 和Python 程序员来说，工作的需要，你的老大会要求你编写一些Shell 脚本进行程序或者是服务器的维
护，比如编写一个定时备份数据库的脚本。
3) 对于大数据程序员来说，需要编写Shell 程序来管理集群

### 17.2 Shell 是什么

Shell 是一个命令行解释器，它为用户提供了一个向Linux 内核发送请求以便运行程序的界面系统级程序，用户可以
用Shell 来启动、挂起、停止甚至是编写一些程序。看一个示意图

![image-20210222092830033](https://b2files.173114.xyz/blogimg/20210507102428.png)

### 17.3 Shell 脚本的执行方式

#### 17.3.1 脚本格式要求

1) 脚本以#!/bin/bash 开头
2) 脚本需要有可执行权限

chmod u+x [file]

#### 17.3.2 编写第一个Shell 脚本

需求说明：创建一个Shell 脚本，输出hello world!
vim hello.sh
#!/bin/bash
echo "hello,world~"

可以使用绝对也可以使用相对路径来执行这个脚本，前提是有可执行权限

./hello.sh	`相对路径`

/root/shcode/hello.sh	`绝对路径`

#### 17.3.3 脚本的常用执行方式

方式1(输入脚本的绝对路径或相对路径)
说明：首先要赋予helloworld.sh 脚本的+x 权限， 再执行脚本
比如./hello.sh 或者使用绝对路径/root/shcode/hello.sh
方式2(sh+脚本)
说明：**不用赋予脚本+x 权限，直接执行即可。**
比如sh hello.sh , 也可以使用绝对路径

## p92 shell变量

### 17.4 Shell 的变量

#### 17.4.1 Shell 变量介绍

1) Linux Shell 中的变量分为，系统变量和用户自定义变量。
2) 系统变量：$HOME、$PWD、$SHELL、$USER 等等，比如： echo $HOME 等等..
3) 显示当前shell 中所有变量：set

#### 17.4.2 shell 变量的定义

基本语法
1) 定义变量：变量名=值

`中间不要空格`

2) 撤销变量：unset 变量
3) 声明静态变量：readonly 变量，注意：不能unset
快速入门
1) 案例1：定义变量A
2) 案例2：撤销变量A
3) 案例3：声明静态的变量B=2，不能unset

```
#!/bin/bash
#案例1：定义变量A
A=100
#输出变量需要加上$
echo A=$A
echo "A=$A"
#案例2：撤销变量A
unset A
echo "A=$A"
#案例3：声明静态的变量B=2，不能unset
readonly B=2
echo "B=$B"
#unset B
#将指令返回的结果赋给变量
:<<!
C=`date`
D=$(date)
echo "C=$C"
echo "D=$D"
!
#使用环境变量TOMCAT_HOME
echo "tomcat_home=$TOMCAT_HOME"
```

4) 案例4：可把变量提升为全局环境变量，可供其他shell 程序使用[该案例后面讲]

#### 17.4.3 shell 变量的定义

定义变量的规则
1) 变量名称可以由字母、数字和下划线组成，但是不能以数字开头。5A=200(×)
2) 等号两侧不能有空格
3) 变量名称一般习惯为大写， 这是一个规范，我们遵守即可
将命令的返回值赋给变量
1) A=`date`反引号，运行里面的命令，并把结果返回给变量A
2) A=$(date) 等价于反引号

## p93 设置环境变量

### 17.5 设置环境变量

#### 17.5.1 基本语法

1) export 变量名=变量值（功能描述：将shell 变量输出为环境变量/全局变量）
2) source 配置文件（功能描述：让修改后的配置信息立即生效）
3) echo $变量名（功能描述：查询环境变量的值）
4) 示意

![image-20210222093111460](https://b2files.173114.xyz/blogimg/20210507103217.png)

#### 17.5.2 快速入门

1) 在/etc/profile 文件中定义TOMCAT_HOME 环境变量
2) 查看环境变量TOMCAT_HOME 的值
3) 在另外一个shell 程序中使用TOMCAT_HOME
注意：在输出TOMCAT_HOME 环境变量前，需要让其生效
source /etc/profile

![image-20210222093129382](https://b2files.173114.xyz/blogimg/20210507103221.png)

shell 脚本的多行注释
:<<! 内容!

## p94 位置参数变量

#### 17.6.1 介绍

当我们执行一个shell 脚本时，如果希望获取到命令行的参数信息，就可以使用到位置参数变量
比如： ./myshell.sh 100 200 , 这个就是一个执行shell 的命令行，可以在myshell 脚本中获取到参数信息

#### 17.6.2 基本语法

$n （功能描述：n 为数字，$0 代表命令本身，$1-$9 代表第一到第九个参数，十以上的参数，十以上的参数需要用
大括号包含，如${10}）
$* （功能描述：这个变量代表命令行中所有的参数，$*把所有的参数看成一个整体）
$@（功能描述：这个变量也代表命令行中所有的参数，不过$@把每个参数区分对待）
$#（功能描述：这个变量代表命令行中所有参数的个数）

#### 17.6.3 位置参数变量

案例：编写一个shell 脚本position.sh ， 在脚本中获取到命令行的各个参数信息。

![image-20210222104341185](https://b2files.173114.xyz/blogimg/20210507103225.png)

## p95 预定义变量

### 17.7 预定义变量

#### 17.7.1 基本介绍

就是shell 设计者事先已经定义好的变量，可以直接在shell 脚本中使用

#### 17.7.2 基本语法

1) $$ （功能描述：当前进程的进程号（PID））
2) $! （功能描述：后台运行的最后一个进程的进程号（PID））
3) $？（功能描述：最后一次执行的命令的返回状态。如果这个变量的值为0，证明上一个命令正确执行；如果这个变
量的值为非0（具体是哪个数，由命令自己来决定），则证明上一个命令执行不正确了。）

#### 17.7.3 应用实例

在一个shell 脚本中简单使用一下预定义变量
preVar.sh
#!/bin/bash
echo "当前执行的进程id=$$"
#以后台的方式运行一个脚本，并获取他的进程号
/root/shcode/myshell.sh &
echo "最后一个后台方式运行的进程id=$!"
echo "执行的结果是=$?"

## p96 运算符

#### 17.8.1 基本介绍

学习如何在shell 中进行各种运算操作。

#### 17.8.2 基本语法

```
1) “$((运算式))”或“$[运算式]”或者expr m + n //expression 表达式
2) 注意expr 运算符间要有 空格 , 如果希望将expr 的结果赋给某个变量，使用``
3) expr m - n
4) expr \*, /, % 乘，除，取余
```

#### 17.8.3 应用实例oper.sh

```
案例1：计算（2+3）X4 的值
案例2：请求出命令行的两个参数[整数]的和20 50
#!/bin/bash
#案例1：计算（2+3）X4 的值
#使用第一种方式
RES1=$(((2+3)*4))
echo "res1=$RES1"
#使用第二种方式, 推荐使用
RES2=$[(2+3)*4]
echo "res2=$RES2"
#使用第三种方式expr
TEMP=`expr 2 + 3`
RES4=`expr $TEMP \* 4`
echo "temp=$TEMP"
echo "res4=$RES4"
#案例2：请求出命令行的两个参数[整数]的和20 50
SUM=$[$1+$2]
echo "sum=$SUM"
```

## p97 条件判断

#### 17.9.1 判断语句

##### 基本语法 :cry:

[ condition ]（注意condition 前后要有空格）
#非空返回true，可使用$?验证（0 为true，>1 为false）

##### 应用实例 :no_bell:

[ hspEdu ] 返回true
[ ] 返回false
[ condition ] && echo OK || echo notok 条件满足，执行后面的语句

##### 判断语句 :fu:

常用判断条件 
1) = 字符串比较

2) 两个整数的比较
-lt 小于
-le 小于等于little equal
-eq 等于
-gt 大于
-ge 大于等于
-ne 不等于

3) 按照文件权限进行判断
-r 有读的权限
-w 有写的权限
-x 有执行的权限

4) 按照文件类型进行判断
-f 文件存在并且是一个常规的文件
-e 文件存在
-d 文件存在并是一个目录

##### 应用实例:rocket:

案例1："ok"是否等于"ok"
判断语句：使用=
案例2：23 是否大于等于22
判断语句：使用-ge
案例3：/root/shcode/aaa.txt 目录中的文件是否存在
判断语句： 使用-f
代码如下:

![image-20210222152906029](https://b2files.173114.xyz/blogimg/20210507103229.png)

## p98 流程控制

#### 17.10.1 if 判断

##### 基本语法

```
if [ 条件判断式]
then
代码
fi
或者, 多分支

if [ 条件判断式]
then
代码
elif [条件判断式]
then
代码
fi
```

 注意事项：[ 条件判断式]，中括号和条件判断式之间必须有空格
 应用实例ifCase.sh
案例：请编写一个shell 程序，如果输入的参数，大于等于60，则输出"及格了"，如果小于60,则输出"不及格"

### :kissing:

### :smirk:

![image-20210222160234077](https://b2files.173114.xyz/blogimg/20210507103232.png)

## p99 流程控制（2）

#### 17.10.2 case 语句

##### 基本语法

case $变量名in
"值1"）
如果变量的值等于值1，则执行程序1
;;
"值2"）
如果变量的值等于值2，则执行程序2
;;
…省略其他分支…

*）
如果变量的值都不是以上的值，则执行此程序
;;
esac

##### 应用实例 testCase.sh

案例1 ：当命令行参数是1 时，输出"周一", 是2 时，就输出"周二"， 其它情况输出"other"

![image-20210222160323330](https://b2files.173114.xyz/blogimg/20210507103235.png)

## p100 for 循环

#### 基本语法1:face_with_head_bandage:

for 变量in 值1 值2 值3…
do
程序/代码
done

#### 应用实例testFor1.sh:factory:

案例1 ：打印命令行输入的参数[这里可以看出$* 和$@ 的区别]

#### 基本语法2:face_with_thermometer:

for (( 初始值;循环控制条件;变量变化))
do
程序/代码
done

#### 应用实例testFor2.sh:facepunch:

案例1 ：从1 加到100 的值输出显示

![image-20210222175514495](https://b2files.173114.xyz/blogimg/20210507103238.png)

## p101 while循环

#### 基本语法1

while [ 条件判断式]
do
程序/代码
done
注意：while 和[有空格，条件判断式和[也有空格

#### 应用实例testWhile.sh

案例1 ：从命令行输入一个数n，统计从1+..+ n 的值是多少？

```
#!/bin/bash
#案例1 ：从命令行输入一个数n，统计从1+..+ n 的值是多少？
SUM=0
i=0
while [ $i -le $1 ]
do
SUM=$[$SUM+$i]
#i 自增
i=$[$i+1]
done
echo "执行结果=$SUM"
```

## p102 read 读取控制台输入

#### 17.11.1 基本语法

read(选项)(参数)
选项：
-p：指定读取值时的提示符；
-t：指定读取值时等待的时间（秒），如果没有在指定的时间内输入，就不再等待了。。
参数
变量：指定读取值的变量名

#### 17.11.2 应用实例testRead.sh

案例1：读取控制台输入一个NUM1 值
案例2：读取控制台输入一个NUM2 值，在10 秒内输入。
代码:

```
#!/bin/bash
#案例1：读取控制台输入一个NUM1 值
read -p "请输入一个数NUM1=" NUM1
echo "你输入的NUM1=$NUM1"
#案例2：读取控制台输入一个NUM2 值，在10 秒内输入。
read -t 10 -p "请输入一个数NUM2=" NUM2
echo "你输入的NUM2=$NUM2"
```

## p103 函数

#### 17.12.1 函数介绍

shell 编程和其它编程语言一样，有系统函数，也可以自定义函数。系统函数中，我们这里就介绍两个。

#### 17.12.2 系统函数

#####  basename 基本语法

功能：返回完整路径最后/ 的部分，常用于获取文件名
basename [pathname] [suffix]
basename [string] [suffix] （功能描述：basename 命令会删掉所有的前缀包括最后一个（‘/’）字符，然后将字符串
显示出来。
选项：
suffix 为后缀，如果suffix 被指定了，basename 会将pathname 或string 中的suffix 去掉。

应用实例
案例1：请返回/home/aaa/test.txt 的"test.txt" 部分
basename /home/aaa/test.txt

#####  dirname 基本语法

功能：返回完整路径最后/ 的前面的部分，常用于返回路径部分
dirname 文件绝对路径（功能描述：从给定的包含绝对路径的文件名中去除文件名（非目录的部分），然后返回剩
下的路径（目录的部分））
 应用实例
案例1：请返回/home/aaa/test.txt 的/home/aaa
dirname /home/aaa/test.txt

## p104 自定义函数

基本语法
[ function ] funname[()]
{
Action;
[return int;]
}
调用直接写函数名：funname [值]
应用实例
案例1：计算输入两个参数的和(动态的获取)， getSum
代码

```
#!/bin/bash
#案例1：计算输入两个参数的和(动态的获取)， getSum
#定义函数getSum
function getSum() {
SUM=$[$n1+$n2]
echo "和是=$SUM"
}
#输入两个值
read -p "请输入一个数n1=" n1
read -p "请输入一个数n2=" n2
#调用自定义函数
getSum $n1 $n2
```

## p105 Shell 编程综合案例

### 17.13.1 需求分析

1) 每天凌晨2:30 备份数据库hspedu 到/data/backup/db
2) 备份开始和备份结束能够给出相应的提示信息
3) 备份后的文件要求以备份时间为文件名，并打包成.tar.gz 的形式，比如：2021-03-12_230201.tar.gz
4) 在备份的同时，检查是否有10 天前备份的数据库文件，如果有就将其删除。
5) 画一个思路分析图

![image-20210223111934958](https://b2files.173114.xyz/blogimg/20210507103242.png)

#### 17.13.2 代码/usr/sbin/mysql_db.backup.sh

```
#备份目录
BACKUP=/data/backup/db
#当前时间
DATETIME=$(date +%Y-%m-%d_%H%M%S)
echo $DATETIME
#数据库的地址
HOST=localhost
#数据库用户名
DB_USER=root
#数据库密码
DB_PW=hspedu100
#备份的数据库名
DATABASE=hspedu
#创建备份目录, 如果不存在，就创建
[ ! -d "${BACKUP}/${DATETIME}" ] && mkdir -p "${BACKUP}/${DATETIME}"
#备份数据库
mysqldump -u${DB_USER} -p${DB_PW} --host=${HOST} -q -R --databases ${DATABASE} | gzip >
${BACKUP}/${DATETIME}/$DATETIME.sql.gz
#将文件处理成tar.gz
cd ${BACKUP}
tar -zcvf $DATETIME.tar.gz ${DATETIME}
#删除对应的备份目录
rm -rf ${BACKUP}/${DATETIME}
#删除10 天前的备份文件
find ${BACKUP} -atime +10 -name "*.tar.gz" -exec rm -rf {} \;
echo "备份数据库${DATABASE} 成功~"
```

## p106 备份数据库

## p107 小结

## p108 Ubuntu安装

## p109 中文包

## p110 ubuntu的root

#### 18.4.1 介绍

安装ubuntu 成功后，都是普通用户权限，并没有最高root 权限，如果需要使用root 权限的时候，通常都会在命令
前面加上sudo 。有的时候感觉很麻烦。(演示)
我们一般使用su 命令来直接切换到root 用户的，但是如果没有给root 设置初始密码，就会抛出su : Authentication
failure 这样的问题。所以，我们只要给root 用户设置一个初始密码就好了。

#### 18.4.2 给root 用户设置密码并使用

1) 输入sudo passwd 命令，设定root 用户密码。
2) 设定root 密码成功后，输入su 命令，并输入刚才设定的root 密码，就可以切换成root 了。提示符$代表一般用户，
提示符#代表root 用户。
3) 以后就可以使用root 用户了
4) 输入exit 命令，退出root 并返回一般用户

## p111 Ubuntu 下开发Python

#### 18.5.1 说明

安装好Ubuntu 后，默认就已经安装好Python 的开发环境。

![image-20210224163302346](https://b2files.173114.xyz/blogimg/20210507103246.png)

#### 18.5.2 在Ubuntu 下开发一个Python 程序

vi hello.py [编写hello.py]
python3 hello.py [运行hello.py]

## p112 APT 软件管理和远程登录

### 19.1 apt 介绍

apt 是Advanced Packaging Tool 的简称，是一款安装包管理工具。在Ubuntu 下，我们可以使用apt 命令进行软件包
的安装、删除、清理等，类似于Windows 中的软件管理工具。
unbuntu 软件管理的原理示意图：

![image-20210224164240421](https://b2files.173114.xyz/blogimg/20210507103249.png)

### 19.2 Ubuntu 软件操作的相关命令

sudo apt-get update 更新源

sudo apt-get install package 安装包

sudo apt-get remove package 删除包

sudo apt-cache search package 搜索软件包

sudo apt-cache show package 获取包的相关信息，如说明、大小、版本等

sudo apt-get install package --reinstall 重新安装包

sudo apt-get -f install 修复安装

sudo apt-get remove package --purge 删除包，包括配置文件等

sudo apt-get build-dep package 安装相关的编译环境

sudo apt-get upgrade 更新已安装的包

sudo apt-get dist-upgrade 升级系统

sudo apt-cache depends package 了解使用该包依赖那些包

sudo apt-cache rdepends package 查看该包被哪些包依赖

sudo apt-get source package

更新Ubuntu 软件下载地址

#### 19.3.1 原理介绍

(画出示意图)

#### 19.3.2 寻找国内镜像源

https://mirrors.tuna.tsinghua.edu.cn/
所谓的镜像源：可以理解为提供下载软件的地方，比如Android 手机上可以下载软件的安卓市场；iOS 手机上可
以下载软件的AppStore

#### 19.3.3 寻找国内镜像源

#### 19.3.4 备份Ubuntu 默认的源地址

sudo cp /etc/apt/sources.list /etc/apt/sources.list.backup

![image-20210225120327120](https://b2files.173114.xyz/blogimg/20210507103252.png)

#### 19.3.5 更新源服务器列表

先清空sources.list 文件复制镜像网站的地址

![image-20210225120351316](https://b2files.173114.xyz/blogimg/20210507103257.png)

复制镜像网站的地址， 拷贝到sources.list 文件

![image-20210225120405564](https://b2files.173114.xyz/blogimg/20210507103301.png)

## p113 更新源和实例

#### 19.3.6 更新源

更新源地址：sudo apt-get update

### 19.4 Ubuntu 软件安装，卸载的最佳实践

案例说明：使用apt 完成安装和卸载vim 软件，并查询vim 软件的信息：（因为使用了镜像网站， 速度很快）
sudo apt-get remove vim //删除
sudo apt-get install vim //安装
sudo apt-cache show vim //获取软件信息

## p114 ubuntu远程登录和集群

#### 19.5.1 ssh 介绍

SSH 为Secure Shell 的缩写，由IETF 的网络工作小组（Network Working Group）所制
定；SSH 为建立在应用层和传输层基础上的安全协议。

SSH 是目前较可靠，专为远程登录会话和其他网络服务提供安全性的协议。常用于远程登录。几乎所有UNIX/LInux
平台都可运行SSH。
使用SSH 服务，需要安装相应的服务器和客户端。客户端和服务器的关系：如果，A 机器想被B 机器远程控制，
那么，A 机器需要安装SSH 服务器，B 机器需要安装SSH 客户端。
和CentOS 不一样，Ubuntu 默认没有安装SSHD 服务(使用netstat 指令查看: apt install net-tools)，因此，我们不能进行远程登录。

#### 19.5.2 原理示意图

![image-20210225135132153](https://b2files.173114.xyz/blogimg/20210507103305.png)

#### 19.5.3 安装SSH 和启用

sudo apt-get install openssh-server
执行上面指令后，在当前这台Linux 上就安装了SSH 服务端和客户端。
service sshd restart
执行上面的指令，就启动了sshd 服务。会监听端口22

#### 19.5.4 在Windows 使用XShell6/XFTP6 登录Ubuntu

前面我们已经安装了XShell6，直接使用即可。
注意：使用hspEdu 用户登录，需要的时候再su - 切换成root 用户

#### 19.5.5 从一台linux 系统远程登陆另外一台linux 系统

在创建服务器集群时，会使用到该技术

##### 基本语法：

ssh 用户名@IP
例如：ssh hspedu@192.168.200.130
使用ssh 访问，如访问出现错误。可查看是否有该文件～/.ssh/known_ssh 尝试删除该文件解决，一般不会有问题

##### 登出

登出命令：exit 或者logout

![image-20210225135212566](https://b2files.173114.xyz/blogimg/20210507103308.png)

## p115 小结

## p116 CentOS8.1/8.2的使用

### 安装Centos8.1/8.2

#### 20.1.1 Centos 下载地址

CentOS-8.1.1911-x86_64-dvd1.iso CentOS 8.1/8.2 DVD 版8G (未来的主流.)
https://mirrors.aliyun.com/centos/8.1.1911/isos/x86_64/

## p117 日志管理

### 21.1 基本介绍

1) 日志文件是重要的系统信息文件，其中记录了许多重要的系统事件，包括用户的登录信息、系统的启动信息、系统
的安全信息、邮件相关信息、各种服务相关信息等。
2) 日志对于安全来说也很重要，它记录了系统每天发生的各种事情，通过日志来检查错误发生的原因，或者受到攻击
时攻击者留下的痕迹。
3) 可以这样理解日志是用来记录重大事件的工具

### 21.2 系统常用的日志

 /var/log/ 目录就是系统日志文件的保存位置，看张图
![image-20210225154356225](https://b2files.173114.xyz/blogimg/20210507103311.png)

系统常用的日志

![image-20210225154408482](https://b2files.173114.xyz/blogimg/20210507103314.png)

##### 应用案例

使用root 用户通过xshell6 登陆, 第一次使用错误的密码，第二次使用正确的密码登录成功
看看在日志文件/var/log/secure 里有没有记录相关信息

## p118 日志管理服务rsyslogd

#### 21.3 日志管理服务rsyslogd

CentOS7.6 日志服务是rsyslogd ， CentOS6.x 日志服务是syslogd 。rsyslogd 功能更强大。rsyslogd 的使用、日志
文件的格式，和syslogd 服务兼容的。原理示意图

![image-20210225164253173](https://b2files.173114.xyz/blogimg/20210507103318.png)

## p119 日志服务配置文件

查询Linux 中的rsyslogd 服务是否启动
ps aux | grep "rsyslog" | grep -v "grep"

-v 表示反向匹配 表示查询不包含grep的服务

查询rsyslogd 服务的自启动状态
systemctl list-unit-files | grep rsyslog
 配置文件：/etc/rsyslog.conf
编辑文件时的格式为： *.* 存放日志文件
其中第一个*代表日志类型，第二个*代表日志级别
1) 日志类型分为：
auth ##pam 产生的日志

authpriv ##ssh、ftp 等登录信息的验证信息
corn ##时间任务相关
kern ##内核
lpr ##打印
mail ##邮件
mark(syslog)-rsyslog##服务内部的信息，时间标识
news ##新闻组
user ##用户程序产生的相关信息
uucp ##unix to nuix copy 主机之间相关的通信
local 1-7 ##自定义的日志设备
2) 日志级别分为：
debug ##有调试信息的，日志通信最多
info ##一般信息日志，最常用
notice ##最具有重要性的普通条件的信息
warning ##警告级别
err ##错误级别，阻止某个功能或者模块不能正常工作的信息
crit ##严重级别，阻止整个系统或者整个软件不能正常工作的信息
alert ##需要立刻修改的信息
emerg ##内核崩溃等重要信息
none ##什么都不记录
注意：从上到下，级别从低到高，记录信息越来越少
 由日志服务rsyslogd 记录的日志文件，日志文件的格式包含以下4 列：
1) 事件产生的时间
2) 产生事件的服务器的主机名
3) 产生事件的服务名或程序名
4) 事件的具体信息

日志如何查看实例
查看一下/var/log/secure 日志，这个日志中记录的是用户验证和授权方面的信息来分析如何查看

![image-20210225164345348](https://b2files.173114.xyz/blogimg/20210507103321.png)

## p120 自定义日志服务

日志管理服务应用实例
在/etc/rsyslog.conf 中添加一个日志文件/var/log/hsp.log,当有事件发送时(比如sshd 服务相关事件)，该文件会接收到
信息并保存. 给小伙伴演示重启，登录的情况，看看是否有日志保存

![image-20210225164353977](https://b2files.173114.xyz/blogimg/20210507103324.png)

## p121 日志轮替

### 21.4.1 基本介绍

日志轮替就是把旧的日志文件移动并改名，同时建立新的空日志文件，当旧日志文件超出保存的范围之后，就会进
行删除

### 21.4.2 日志轮替文件命名

1) centos7 使用logrotate 进行日志轮替管理，要想改变日志轮替文件名字，通过/etc/logrotate.conf 配置文件中“dateext”
参数：

2) 如果配置文件中有“dateext”参数，那么日志会用日期来作为日志文件的后缀，例如“secure-20201010”。这样日
志文件名不会重叠，也就不需要日志文件的改名， 只需要指定保存日志个数，删除多余的日志文件即可。
3) 如果配置文件中没有“dateext”参数，日志文件就需要进行改名了。当第一次进行日志轮替时，当前的“secure”日
志会自动改名为“secure.1”，然后新建“secure”日志， 用来保存新的日志。当第二次进行日志轮替时，“secure.1”
会自动改名为“secure.2”， 当前的“secure”日志会自动改名为“secure.1”，然后也会新建“secure”日志，用来
保存新的日志，以此类推。

### 21.4.3 logrotate 配置文件

/etc/logrotate.conf 为logrotate 的全局配置文件

```
# rotate log files weekly, 每周对日志文件进行一次轮替

weekly

# keep 4 weeks worth of backlogs, 共保存4 份日志文件，当建立新的日志文件时，旧的将会被删除

rotate 4

# create new (empty) log files after rotating old ones, 创建新的空的日志文件，在日志轮替后

create

# use date as a suffix of the rotated file, 使用日期作为日志轮替文件的后缀

dateext

# uncomment this if you want your log files compressed, 日志文件是否压缩。如果取消注释，则日志会在转储的同时进

行压缩
#compress
#RPM packages drop log rotation information into this directory
include /etc/logrotate.d

# 包含/etc/logrotate.d/ 目录中所有的子配置文件。也就是说会把这个目录中所有子配置文件读取进来，

#下面是单独设置，优先级更高。

# no packages own wtmp and btmp -- we'll rotate them here

/var/log/wtmp {
monthly # 每月对日志文件进行一次轮替

create 0664 root utmp # 建立的新日志文件，权限是0664 ，所有者是root ，所属组是utmp 组
minsize 1M # 日志文件最小轮替大小是1MB 。也就是日志一定要超过1MB 才会轮替，否则就算时间达到
一个月，也不进行日志转储
rotate 1 # 仅保留一个日志备份。也就是只有wtmp 和wtmp.1 日志保留而已
}
/var/log/btmp {
missingok # 如果日志不存在，则忽略该日志的警告信息
monthly
create 0600 root utmp
rotate 1
}
```

## p122 自定义日志轮替

#### 参数说明

```
参数参数说明
daily 日志的轮替周期是每天
weekly 日志的轮替周期是每周
monthly 日志的轮替周期是每月
rotate 数字保留的日志文件的个数。0 指没有备份
compress 日志轮替时，旧的日志进行压缩
create mode owner group 建立新日志，同时指定新日志的权限与所有者和所属组。
mail address 当日志轮替时，输出内容通过邮件发送到指定的邮件地址。
missingok 如果日志不存在，则忽略该日志的警告信息
notifempty 如果日志为空文件，则不进行日志轮替
minsize 大小日志轮替的最小值。也就是日志一定要达到这个最小值才会轮替，否则就算时间达到也
不轮替
size 大小日志只有大于指定大小才进行日志轮替，而不是按照时间轮替。
dateext 使用日期作为日志轮替文件的后缀。
sharedscripts 在此关键字之后的脚本只执行一次。
prerotate/endscript 在日志轮替之前执行脚本命令。
postrotate/endscript 在日志轮替之后执行脚本命令。
```

### 21.4.4 把自己的日志加入日志轮替

1) 第一种方法是直接在/etc/logrotate.conf 配置文件中写入该日志的轮替策略
2) 第二种方法是在/etc/logrotate.d/目录中新建立该日志的轮替文件，在该轮替文件中写入正确的轮替策略，因为该目录
中的文件都会被“include”到主配置文件中，所以也可以把日志加入轮替。
3) 推荐使用第二种方法，因为系统中需要轮替的日志非常多，如果全都直接写入/etc/logrotate.conf 配置文件，那么这
个文件的可管理性就会非常差，不利于此文件的维护。
4) 在/etc/logrotate.d/ 配置轮替文件一览

![image-20210226134642042](https://b2files.173114.xyz/blogimg/20210507103328.png)

### 21.4.5 应用实例

看一个案例, 在/etc/logrotate.conf 进行配置, 或者直接在/etc/logrotate.d/ 下创建文件hsplog 编写如下内容, 具体
轮替的效果可以参考/var/log 下的boot.log 情况.

![image-20210226134658670](https://b2files.173114.xyz/blogimg/20210507103331.png)

## p123 日志轮替机制原理

###  21.5 日志轮替机制原理

日志轮替之所以可以在指定的时间备份日志，是依赖系统定时任务。在/etc/cron.daily/目录，就会发现这个目录中是有logrotate 文件(可执行)，logrotate 通过这个文件依赖定时任务执行的。

![image-20210301104806772](https://b2files.173114.xyz/blogimg/20210507103334.png)

## p124 查看内存日志

journalctl 可以查看内存日志, 这里我们看看常用的指令
journalctl ##查看全部
journalctl -n 3 ##查看最新3 条
journalctl --since 19:00 --until 19:10:10 #查看起始时间到结束时间的日志可加日期
journalctl -p err ##报错日志
journalctl -o verbose ##日志详细内容
journalctl _PID=1245 _COMM=sshd ##查看包含这些参数的日志（在详细日志查看）
或者journalctl | grep sshd

注意: journalctl 查看的是内存日志, 重启清空
演示案例:
使用journalctl | grep sshd 来看看用户登录清空, 重启系统，再次查询，看看日志有什么变化没有

## p125 小结

## p126 定制自己的linux系统

### 22.1 基本介绍

通过裁剪现有Linux 系统(CentOS7.6)，创建属于自己的min Linux 小系统，可以加深我们对linux 的理解。
老韩利用centos7.6，搭建一个小小linux 系统, 很有趣。

### 22.2 基本原理

启动流程介绍：
制作Linux 小系统之前，再了解一下Linux 的启动流程：
1、首先Linux 要通过自检，检查硬件设备有没有故障
2、如果有多块启动盘的话，需要在BIOS 中选择启动磁盘
3、启动MBR 中的bootloader 引导程序
4、加载内核文件
5、执行所有进程的父进程、老祖宗systemd
6、欢迎界面
在Linux 的启动流程中，加载内核文件时关键文件：
1）kernel 文件: vmlinuz-3.10.0-957.el7.x86_64
2）initrd 文件: initramfs-3.10.0-957.el7.x86_64.img

### 22.3 制作min linux 思路分析

1) 在现有的Linux 系统(centos7.6)上加一块硬盘/dev/sdb，在硬盘上分两个分区，一个是/boot，一个是/，并将其格式化。
需要明确的是，现在加的这个硬盘在现有的Linux 系统中是/dev/sdb，但是，当我们把东西全部设置好时，要把这个
硬盘拔除，放在新系统上，此时，就是/dev/sda
2) 在/dev/sdb 硬盘上，将其打造成独立的Linux 系统，里面的所有文件是需要拷贝进去的
3) 作为能独立运行的Linux 系统，内核是一定不能少，要把内核文件和initramfs 文件也一起拷到/dev/sdb 上
4) 以上步骤完成，我们的自制Linux 就完成, 创建一个新的linux 虚拟机，将其硬盘指向我们创建的硬盘，启动即可
5) 示意图

![image-20210301134859946](https://b2files.173114.xyz/blogimg/20210507103337.png)

### **制作自己的min linux(基于CentOS7.6)**

1. 首先，我们在现有的linux添加一块大小为20G的硬盘

![image-20210301145006791](https://b2files.173114.xyz/blogimg/20210507103355.png)

![image-20210301145016514](https://b2files.173114.xyz/blogimg/20210507103400.png)

![image-20210301145022970](https://b2files.173114.xyz/blogimg/20210507103408.png)

![image-20210301145029299](https://b2files.173114.xyz/blogimg/20210507103412.png)

![image-20210301145034675](https://b2files.173114.xyz/blogimg/20210507103416.png)

![image-20210301145040827](https://b2files.173114.xyz/blogimg/20210507103420.png)

![image-20210301145045883](https://b2files.173114.xyz/blogimg/20210507103422.png)

点击完成，就OK了， 可以使用 lsblk 查看，需要重启

2. 添加完成后，点击确定，然后启动现有的linux(centos7.6)。 通过fdisk来给我们的/dev/sdb进行分区

```
 1 [root@localhost ~]# fdisk /dev/sdb
 2 Device contains neither a valid DOS partition table, nor Sun, SGI or OSF disklabel
 3 Building a new DOS disklabel with disk identifier 0x4fde4cd0.
 4 Changes will remain in memory only, until you decide to write them.
 5 After that, of course, the previous content won't be recoverable.
 6 
 7  
 8 Warning: invalid flag 0x0000 of partition table 4 will be corrected by w(rite)
 9 
10  
11 WARNING: DOS-compatible mode is deprecated. It's strongly recommended to
12 switch off the mode (command 'c') and change display units to
13 sectors (command 'u').
14 
15 
16 Command (m for help): n
17 Command action
18 e extended
19 p primary partition (1-4)
20 p
21 Partition number (1-4): 1
22 First cylinder (1-2610, default 1):
23 Using default value 1
24 Last cylinder, +cylinders or +size{K,M,G} (1-2610, default 2610): +500M
25 
26 
27 Command (m for help): n
28 Command action
29 e extended
30 p primary partition (1-4)
31 p
32 Partition number (1-4): 2
33 First cylinder (15-2610, default 15):
34 Using default value 15
35 Last cylinder, +cylinders or +size{K,M,G} (15-2610, default 2610):
36 Using default value 2610
37 #查看分区
38 Command (m for help): p
39 
40  
41 Disk /dev/sdb: 21.5 GB, 21474836480 bytes
42 255 heads, 63 sectors/track, 2610 cylinders
43 Units = cylinders of 16065 * 512 = 8225280 bytes
44 Sector size (logical/physical): 512 bytes / 512 bytes
45 I/O size (minimum/optimal): 512 bytes / 512 bytes
46 Disk identifier: 0x4fde4cd0
47 
48  
49 Device Boot Start End Blocks Id System
50 /dev/sdb1 1 14 112423+ 83 Linux
51 /dev/sdb2 15 2610 20852370 83 Linux
52 #保存并退出
53 Command (m for help): w
54 The partition table has been altered!
```

3. 接下来，我们对/dev/sdb的分区进行格式化

```
[root@localhost ~]# mkfs.ext4 /dev/sdb1
[root@localhost ~]# mkfs.ext4 /dev/sdb2 
```

4. 创建目录，并挂载新的磁盘

```
#mkdir -p /mnt/boot /mnt/sysroot 
#mount /dev/sdb1 /mnt/boot 
#mount /dev/sdb2 /mnt/sysroot/
```

5. 安装grub, 内核文件拷贝至目标磁盘

```
#grub2-install --root-directory=/mnt /dev/sdb
#我们可以来看一下二进制确认我们是否安装成功
#hexdump -C -n 512 /dev/sdb    
#cp -rf /boot/*  /mnt/boot/
```

6. 修改 grub2/grub.cfg 文件, 标红的部分 是需要使用 指令来查看的

![image-20210301145323167](https://b2files.173114.xyz/blogimg/20210507103426.png)

在grub.cfg文件中 , 红色部分用 上面 sdb1 的 UUID替换，蓝色部分用 sdb2的UUID来替换, 紫色部分是添加的，表示

selinux给关掉，同时设定一下init，告诉内核不要再去找这个程序了，不然开机的时候会出现错误的

```
### BEGIN /etc/grub.d/10_linux ###
menuentry 'CentOS Linux (3.10.0-957.el7.x86_64) 7 (Core)' --class centos --class gnu-linux --class gnu --class os --unrestricted $menuentry_id_option 'gnulinux-3.10.0-957.el7.x86_64-advanced-2eef594e-68fc-49a0-8b23-07cf87dda424' {
	load_video
	set gfxpayload=keep
	insmod gzio
	insmod part_msdos
	insmod ext2
	set root='hd0,msdos1'
	if [ x$feature_platform_search_hint = xy ]; then
	  search --no-floppy --fs-uuid --set=root --hint-bios=hd0,msdos1 --hint-efi=hd0,msdos1 --hint-baremetal=ahci0,msdos1
--hint='hd0,msdos1'  6ba72e9a-19ec-4552-ae54-e35e735142d4
	else
	  search --no-floppy --fs-uuid --set=root 6ba72e9a-19ec-4552-ae54-e35e735142d4
	fi
	linux16 /vmlinuz-3.10.0-957.el7.x86_64 root=UUID=d2e0ce0f-e209-472a-a4f1-4085f777d9bb ro crashkernel=auto rhgb quiet LANG=zh_CN.UTF-8  selinux=0 init=/bin/bash
	initrd16 /initramfs-3.10.0-957.el7.x86_64.img
}
menuentry 'CentOS Linux (0-rescue-5bd4fb8d8e9d4198983fc1344f652b5d) 7 (Core)' --class centos --class gnu-linux --class gnu --class os --unrestricted $menuentry_id_option 'gnulinux-0-rescue-5bd4fb8d8e9d4198983fc1344f652b5d-advanced-2eef594e-68fc-49a0-8b23-07cf87dda424' {
	load_video
	insmod gzio
	insmod part_msdos
	insmod ext2
	set root='hd0,msdos1'
	if [ x$feature_platform_search_hint = xy ]; then
	  search --no-floppy --fs-uuid --set=root --hint-bios=hd0,msdos1 --hint-efi=hd0,msdos1 --hint-baremetal=ahci0,msdos1 --hint='hd0,msdos1'  6ba72e9a-19ec-4552-ae54-e35e735142d4
	else
	  search --no-floppy --fs-uuid --set=root 6ba72e9a-19ec-4552-ae54-e35e735142d4
	fi
	linux16 /vmlinuz-0-rescue-5bd4fb8d8e9d4198983fc1344f652b5d root=UUID=d2e0ce0f-e209-472a-a4f1-4085f777d9bb ro crashkernel=auto rhgb quiet selinux=0 init=/bin/bash
	initrd16 /initramfs-0-rescue-5bd4fb8d8e9d4198983fc1344f652b5d.img
}

### END /etc/grub.d/10_linux ###
```

7. 创建目标主机根文件系统

```
#mkdir -pv /mnt/sysroot/{etc/rc.d,usr,var,proc,sys,dev,lib,lib64,bin,sbin,boot,srv,mnt,media,home,root}  
```

8. 拷贝需要的bash(也可以拷贝你需要的指令)和库文件给新的系统使用

```
#cp /lib64/*.* /mnt/sysroot/lib64/ 
#cp /bin/bash /mnt/sysroot/bin/ 
```

9. 现在我们就可以创建一个新的虚拟机，然后将默认分配的硬盘 移除掉，指向我们刚刚创建的磁盘即可.

![image-20210301145604557](https://b2files.173114.xyz/blogimg/20210507103429.png)

![image-20210301145609028](https://b2files.173114.xyz/blogimg/20210507103432.png)

![image-20210301145614315](https://b2files.173114.xyz/blogimg/20210507103435.png)

![image-20210301145618467](https://b2files.173114.xyz/blogimg/20210507103438.png)

![image-20210301145623533](https://b2files.173114.xyz/blogimg/20210507103441.png)

![image-20210301145627627](https://b2files.173114.xyz/blogimg/20210507103443.png)

![image-20210301145632539](https://b2files.173114.xyz/blogimg/20210507103446.png)

![image-20210301145644662](https://b2files.173114.xyz/blogimg/20210507103449.png)

![image-20210301145649091](https://b2files.173114.xyz/blogimg/20210507103451.png)

![image-20210301145652835](https://b2files.173114.xyz/blogimg/20210507103454.png)

![image-20210301145656635](https://b2files.173114.xyz/blogimg/20210507103457.png)

10. 这时，很多指令都不能使用，比如 ls , reboot 等，可以将需要的指令拷贝到对应的目录即可

11. 如果要拷贝指令，**重新进入到原来的** **linux****系统拷贝相应的指令即可**，比较将 /bin/ls 拷贝到 /mnt/sysroot/bin 将/sbin/reboot 拷贝到 /mnt/sysroot/sbin 

```
root@hspedu100 ~]# mount /dev/sdb2 /mnt/sysroot/
[root@hspedu100 ~]# cp /bin/ls /mnt/sysroot/bin/
[root@hspedu100 ~]# cp /bin/systemctl  /mnt/sysroot/bin/
[root@hspedu100 ~]# cp /sbin/reboot /mnt/sysroot/sbin/
```

12.    再重新启动新的min linux系统，就可以使用 ls , reboot 指令了

![image-20210301145751469](https://b2files.173114.xyz/blogimg/20210507103500.png)

## p127 定制自己的linux系统(2)

## p128 小结

## p129 Linux 内核源码介绍&内核升级

### 23.1 为什么要阅读linux 内核?

1) 爱好，就是喜欢linux(黑客精神)
2) 想深入理解linux 底层运行机制，对操作系统有深入理解
3) 阅读Linux 内核，你会对整个计算机体系有一个更深刻的认识。作为开发者，不管你从事的是驱动开发，应用开发
还是后台开发，你都需要了解操作系统内核的运行机制，这样才能写出更好的代码。
4) 作为开发人员不应该只局限在自己的领域，你设计的模块看起来小，但是你不了解进程的调用机制，你不知道进程
为什么会阻塞、就绪、执行几个状态。那么很难写出优质的代码。
5) 找工作面试的需要
:smirk: 老韩忠告，作为有追求的程序员，还是应该深入的了解一个操作系统的底层机制,(比如linux/unix) 最好是源码级别
的，这样你写多线程高并发程序，包括架构，优化，算法等，高度不一样的，当然老韩也不是要求小伙伴儿把一个
非常庞大的Linux 内核每一行都读懂。我觉得。你至少能看几个核心的模块。

### 23.2 linux0.01 内核源码

23.2.1 基本介绍
Linux 的内核源代码可以从网上下载, 解压缩后文件一般也都位于linux 目录下。内核源代码有很多版本，可以从
linux0.01 内核入手，总共的代码1w 行左右， 最新版本5.9.8 总共代码超过700w 行，非常庞大.
内核地址：https://www.kernel.org/

很多人害怕读Linux 内核，Linux 内核这样大而复杂的系统代码，阅读起来确实有很多困难，但是也不象想象的那
么高不可攀。老韩建议可以从linux0.01 入手。

## p130 linux0.01 内核源码目录&阅读

### 23.2.2 linux0.01 内核源码目录&阅读

老韩提示阅读内核源码技巧
1) linux0.01 的阅读需要懂c 语言
2) 阅读源码前，应知道Linux 内核源码的整体分布情况。现代的操作系统一般由进程管理、内存管理、文件系统、驱
动程序和网络等组成。Linux 内核源码的各个目录大致与此相对应.
3) 在阅读方法或顺序上，有纵向与横向之分。所谓纵向就是顺着程序的执行顺序逐步进行；所谓横向，就是按模块进
行。它们经常结合在一起进行。
4) 对于Linux 启动的代码可顺着Linux 的启动顺序一步步来阅读；对于像内存管理部分，可以单独拿出来进行阅读分
析。实际上这是一个反复的过程，不可能读一遍就理解
 linux 内核源码阅读&目录介绍&main.c 说明

![image-20210301174633732](https://b2files.173114.xyz/blogimg/20210507103503.png)

![image-20210301174643079](https://b2files.173114.xyz/blogimg/20210507103506.png)

## p131 linux 内核最新版和内核升级

#### 23.3.1 内核地址：https://www.kernel.org/ 查看

#### 23.3.2 下载&解压最新版

wget https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.11.2.tar.gz
tar -zxvf linux-5.8.16.tar.gz

#### 23.3.3 linux 内核升级应用实例

将Centos 系统从7.6 内核升级到7.8 版本内核(兼容性问题)

![image-20210301181655226](https://b2files.173114.xyz/blogimg/20210507103509.png)

#### 23.3.4 具体步骤，看老师演示

uname -a // 查看当前的内核版本
yum info kernel -q //检测内核版本，显示可以升级的内核
yum update kernel //升级内核
yum list kernel -q //查看已经安装的内核

## p132 linux 内核最新版和内核升级(2)

## p133 第24 章linux 系统-备份与恢复

### 24.1 基本介绍

实体机无法做快照，如果系统出现异常或者数据损坏，后果严重， 要重做系统，还会造成数据丢失。所以我们可
以使用备份和恢复技术
linux 的备份和恢复很简单， 有两种方式：
1) 把需要的文件(或者分区)用TAR 打包就行，下次需要恢复的时候，再解压开覆盖即可
2) 使用dump 和restore 命令
3) 示意图

![image-20210302115649592](https://b2files.173114.xyz/blogimg/20210507103512.png)

### 24.2 安装dump 和restore

如果linux 上没有dump 和restore 指令，需要先按照
yum -y install dump
yum -y install restore

### 24.3 使用dump 完成备份

#### 24.3.1 基本介绍

dump 支持分卷和增量备份（所谓增量备份是指备份上次备份后修改/增加过的文件，也称差异备份）。

#### 24.3.2 dump 语法说明

dump [ -cu] [-123456789] [ -f <备份后文件名>] [-T <日期>] [ 目录或文件系统]
dump []-wW
-c ： 创建新的归档文件，并将由一个或多个文件参数所指定的内容写入归档文件的开头。
-0123456789： 备份的层级。0 为最完整备份，会备份所有文件。若指定0 以上的层级，则备份至上一次备份以来
修改或新增的文件, 到9 后，可以再次轮替.
-f <备份后文件名>： 指定备份后文件名
-j : 调用bzlib 库压缩备份文件，也就是将备份后的文件压缩成bz2 格式，让文件更小
-T <日期>： 指定开始备份的时间与日期
-u ： 备份完毕后，在/etc/dumpdares 中记录备份的文件系统，层级，日期与时间等。
-t ： 指定文件名，若该文件已存在备份文件中，则列出名称
-W ：显示需要备份的文件及其最后一次备份的层级，时间，日期。
-w ：与-W 类似，但仅显示需要备份的文件。

#### 24.3.3 dump 应用案例1

将/boot 分区所有内容备份到/opt/boot.bak0.bz2 文件中，备份层级为“0”
􀀃dump -0uj -f /opt/boot.bak0.bz2 /boot

#### 24.3.4 dump 应用案例2

在/boot 目录下增加新文件，备份层级为“1”(只备份上次使用层次“0”备份后发生过改变的数据), 注意比较看看
这次生成的备份文件boot1.bak 有多大
dump -1uj -f /opt/boot.bak1.bz2 /boot
老韩提醒: 通过dump 命令在配合crontab 可以实现无人值守备份

只有分区支持增量备份

#### 24.3.5 dump -W

显示需要备份的文件及其最后一次备份的层级，时间，日期

![image-20210302115744713](https://b2files.173114.xyz/blogimg/20210507103515.png)

#### 24.3.6 查看备份时间文件

cat /etc/dumpdates

![image-20210302115759588](https://b2files.173114.xyz/blogimg/20210507103518.png)

#### 24.3.7 dump 备份文件或者目录

前面我们在备份分区时，是可以支持增量备份的，如果备份文件或者目录，不再支持增量备份, 即只能使用0 级别
备份
案例， 使用dump 备份/etc 整个目录
dump -0j -f /opt/etc.bak.bz2 /etc/
#下面这条语句会报错，提示DUMP: Only level 0 dumps are allowed on a subdirectory
dump -1j -f /opt/etc.bak.bz2 /etc/

#### 24.3.8 老韩提醒

如果是重要的备份文件， 比如数据区，建议将文件上传到其它服务器保存，不要将鸡蛋放在同一个篮子.

## p134 数据备份与恢复

### 24.4 使用restore 完成恢复

#### 24.4.1 基本介绍

restore 命令用来恢复已备份的文件，可以从dump 生成的备份文件中恢复原文件

#### 24.4.2 restore 基本语法

restore [模式选项] [选项]

说明下面四个模式， 不能混用，在一次命令中， 只能指定一种。
-C ：使用对比模式，将备份的文件与已存在的文件相互对比。
-i：使用交互模式，在进行还原操作时，restors 指令将依序询问用户
-r：进行还原模式
-t : 查看模式，看备份文件有哪些文件
选项
-f <备份设备>：从指定的文件中读取备份数据，进行还原操作

#### 24.4.3 应用案例1

restore 命令比较模式，比较备份文件和原文件的区别
测试
mv /boot/hello.java /boot/hello100.java
restore -C -f boot.bak1.bz2 //注意和最新的文件比较

![image-20210305172200189](https://b2files.173114.xyz/blogimg/20210507103521.png)

mv /boot/hello100.java /boot/hello.java
restore -C -f boot.bak1.bz2

![image-20210305172212863](https://b2files.173114.xyz/blogimg/20210507103524.png)

#### 24.4.4 应用案例2

restore 命令查看模式，看备份文件有哪些数据/文件

测试
restore -t -f boot.bak0.bz2

#### 24.4.5 应用案例3

restore 命令还原模式, 注意细节： 如果你有增量备份，需要把增量备份文件也进行恢复， 有几个增量备份文件，
就要恢复几个，按顺序来恢复即可。
测试
mkdir /opt/boottmp
cd /opt/boottmp
restore -r -f /opt/boot.bak0.bz2 //恢复到第1 次完全备份状态
restore -r -f /opt/boot.bak1.bz2 //恢复到第2 次增量备份状态

![image-20210305172244722](https://b2files.173114.xyz/blogimg/20210507103527.png)

#### 24.4.6 应用案例4

restore 命令恢复备份的文件，或者整个目录的文件
基本语法： restore -r -f 备份好的文件
测试
[root@hspedu100 opt]# mkdir etctmp
[root@hspedu100 opt]# cd etctmp/
[root@hspedu100 etctmp]# restore -r -f /opt/etc.bak0.bz2

## p135 数据备份与恢复（2）

## p136 数据备份与恢复小结

## p137 Linux 可视化管理-webmin 和bt 运维工具

### 25.1 webmin

#### 25.1.1 基本介绍

Webmin 是功能强大的基于Web 的Unix/linux 系统管理工具。管理员通过浏览器访问Webmin 的各种管理功能并完
成相应的管理操作。除了各版本的linux 以外还可用于：AIX、HPUX、Solaris、Unixware、Irix 和FreeBSD 等系统

![image-20210306093452146](https://b2files.173114.xyz/blogimg/20210507103530.png)

#### 25.1.2 安装webmin&配置

1) 下载地址: http://download.webmin.com/download/yum/ , 用下载工具下载即可

![image-20210306093509857](https://b2files.173114.xyz/blogimg/20210507103533.png)

也可以使用wget http://download.webmin.com/download/yum/webmin-1.700-1.noarch.rpm

2) 安装： rpm -ivh webmin-1.700-1.noarch.rpm

3) 重置密码/usr/libexec/webmin/changepass.pl /etc/webmin root test
root 是webmin 的用户名，不是OS 的, 这里就是把webmin 的root 用户密码改成了test
4) 修改webmin 服务的端口号（默认是10000 出于安全目的）
vim /etc/webmin/miniserv.conf # 修改端口
5) 将port=10000 修改为其他端口号，如port=6666
6) 重启webmin
/etc/webmin/restart # 重启
/etc/webmin/start # 启动
/etc/webmin/stop # 停止
7) 防火墙放开6666 端口
firewall-cmd --zone=public --add-port=6666/tcp --permanent # 配置防火墙开放6666 端口
firewall-cmd --reload # 更新防火墙配置
firewall-cmd --zone=public --list-ports # 查看已经开放的端口号

#### 在这个位置我出现了登录不上去的问题，搜了很多方案没有解决:cry:

包括 1.杀进程换端口 2.reboot 3.在gnu上登录

8) 登录webmin
http://ip:6666 可以访问了
用root 账号和重置的新密码test

![image-20210306093559177](https://b2files.173114.xyz/blogimg/20210507103536.png)

## p138 webmin演示

#### 25.1.3 简单使用演示

比如修改语言设置，IP 访问控制，查看进程, 修改密码， 任务调度，mysql 等.

![image-20210306093905143](https://b2files.173114.xyz/blogimg/20210507103539.png)

## p139 bt宝塔介绍和安装

### 25.2 bt(宝塔)

#### 25.2.1 基本介绍

bt 宝塔Linux 面板是提升运维效率的服务器管理软件，支持一键LAMP/LNMP/集群/监控/网站/FTP/数据库/JAVA 等
多项服务器管理功能。

#### 25.2.2 安装和使用

1) 安装: yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
2) 安装成功后控制台会显示登录地址，账户密码，复制浏览器打开登录，

![image-20210306104341551](https://b2files.173114.xyz/blogimg/20210507103542.png)



#### myself command

![image-20210306104904512](https://b2files.173114.xyz/blogimg/20210507103545.png)

外网面板地址: http://58.221.242.226:8888/d9b5227e
内网面板地址: http://192.168.200.130:8888/d9b5227e
username: tz6prifg
password: 2276bcb2

## p140 介绍

#### 25.2.3 使用介绍， 比如可以登录终端, 配置，快捷安装运行环境和系统工具, 添加计划任务脚本

http://192.168.200.130:8888/2e673418/

![image-20210306104404359](https://b2files.173114.xyz/blogimg/20210507103548.png)

#### 25.2.4 如果bt 的用户名，密码忘记了，使用bt default 可以查看

![image-20210306104415737](https://b2files.173114.xyz/blogimg/20210507103551.png)

## p141 小结

## p142 Linux 面试题-(腾讯,百度,美团,滴滴)

### 26.1 分析日志t.log(访问量)，将各个ip 地址截取，并统计出现次数,并按从大到小排序(腾讯)

http://192.168.200.10/index1.html
http://192.168.200.10/index2.html
http://192.168.200.20/index1.html
http://192.168.200.30/index1.html
http://192.168.200.40/index1.html
http://192.168.200.30/order.html
http://192.168.200.10/order.html
答案: cat t.txt | cut -d '/' -f 3 | sort | uniq -c | sort -nr

### 26.2 统计连接到服务器的各个ip 情况，并按连接数从大到小排序(腾讯)

netstat -an | grep ESTABLISHED | awk -F " " '{print $5}' | cut -d ":" -f 1 | sort | uniq -c| sort -nr

## 其他

redis 相关指令

```
# 重新加载系统服务
systemctl daemon-reload

# 开机启动
system enable redis-server.service

# 关闭redis-server
system stop redis-server.service

# 启动redis-server
system start redis-server.service

# 重新启动redis-server
system restart redis-server.service

# 查看redis-server运行状态
system status redis-server.service

```

