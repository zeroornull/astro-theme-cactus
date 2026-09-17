---
title: "DB2 数据及结构迁移从window到linux"
description: "DB2 数据及结构迁移从window到linux"
publishDate: 2021-05-17T14:30:00+08:00
updatedDate: "2025-03-09T14:30:00+08:00"
tags: ["db2"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---

# 前言

  db2window数据及结构迁移linux

<!-- more -->



环境 

```
win10 db2v9.5
linux db2v9.7
```

## 一、操作系统相同之脱机备份

原本准备使用备份backup 与 restore  但是有与系统不同失败了

```xml
--断开连接
db2 force application all  
--备份数据库      
db2 backup database <db_name> to <location>   
--恢复数据库，20161101134642 为备份文件时间戳      
db2 restore database <db_name> from <location> taken at 20161101134642                                
```

据向下兼容原则，版本相同或者低版本的数据库可以还原在高版本上。

## 二、操作系统不同，或者源数据库版本较高

DB2 提供了两个非常实用的工具：
 ★数据迁移工具 db2move
 ★数据字典获取工具 db2look
 以下为Windows 环境迁移到Linux下操作小结：
 1、登录Windows>db2cmd,使用 db2move 命令将源数据库（TEST）数据导出至指定的文件夹D:\db2move 下：

```bash
D:\db2move>db2move TEST export -u db2inst1 -p 123456 
```

```
# 另可以将导出操作限制在特定的表(-tn)、表空间(-ts)、表创建者(-tc)、表模式 (-sn)的范围内。
-- db2move TEST export -sn test -u db2inst1 -p 123456（密码）
-- 将test模式下的所有数据导出。
```

执行成功后会显示 Disconnecting from database ... successful!

2、使用 db2look 命令将数据库结构（DDL文件） 导出至指定的文件夹D:\db2look下：

```css
D:\db2look> db2look -d TEST -e -a -o db2look_TEST.sql
```

ps：参数说明：
 -d 为指定数据库，必须参数
 -e 抽取数据库对象的DDL，必须参数
 -a 所有用户和模式，(-u test01 可以指定用户， -a 和 -u 都没有时默认当前登录用户)
 -o 指定输出文件名称

3、将db2move和db2look文件上传至Linux系统下：
4、Linux下db2用户登录，同步数据结构，载入数据：

★更新表结构：

```ruby
su - db2inst1:
password:123456  
db2inst1@localhost:~/db2back/db2look> db2 -tvf db2look_TEST.sql
```

出现缺表可能是表空间太小

注意选择较大的表空间即可

参考 https://blog.csdn.net/weixin_33901641/article/details/90500494

具体指令为

```
#创建pagesize为32K的bufferpool
db2 => create BUFFERPOOL bigbuffer SIZE 5000 PAGESIZE 32K
DB20000I  The SQL command completed successfully.
 
#创建pagesize为32K的tablespace，同时使用新创建的bufferpool
db2 => CREATE TABLESPACE bigtablespace PAGESIZE 32K BUFFERPOOL bigbuffer
DB20000I  The SQL command completed successfully.
```



★装载数据：

```ruby
db2inst1@localhost:~/db2back/db2move> db2move TEST load 
```

在这需要注意操作角色需要有对于文件的写入权限且 load指令在含有db2move.list的目录下



操作顺利的话，数据已迁移至linux>db2。要注意几个问题：
★关于表模式

> 关于表模式，Windows下面默认用户db2admin ,默认表模式也是db2admin ，而linux下面的默认用户是db2inst1 表模式也是db2inst1，
>  所以需要做以下处理：
>  D:\DBBack\CNAS\db2look\TEST\db2look_TEST.sql里面的db2admin字符全部替换成db2inst1
>  D:\DBBack\CNAS\db2move\TEST\db2move.lst 也做同样的操作

★CHECK表状态，修改暂挂状态的表

> 在db2move过程中会有些表因为检查约束可能会处于暂挂状态，需要执行SET INTEGRITY命令来恢复它的暂挂状态。
> 可以从系统表中检索处于检查暂挂状态的表信息 Select tabname from syscat.tables where status='C' ---暂挂状态的表信息
> 对暂挂的表执行

```csharp
set integrity for usertbl ALLOW NO ACCESS immediate checked   
```

遗漏的表

> 导出的时候，可能会有个别表的数据丢失，这时候只能对相应的表执行db2move命令重新load了，如果还是不行就重建表再load
> load单个表的命令

```css
db2 load from tab11.ixf of ixf terminate into db2admin.tablename  --tab11.ixf对应的是tablename表
```

```
关键，可能需要
call sysproc.admin_cmd (‘reorg table schema名.表名’)
```



## 三、Linux下数据导出

参看: http://www.ibm.com/developerworks/cn/education/data/db2-cert7315/section6.html 

和 

http://www.ibm.com/developerworks/cn/data/library/techarticles/dm-0712xiam/index.html?ca=drs

**The below is how to do the db2 data migration.**

(1).Export source data from source DB(导出至指定数据库)

```
db2move <database_name> export -sn <database_schema> -u <DBA> -p <DBA_PASSWORD> > <logFile>
db2move sample export -sn NPMM -u db2inst1 -p db2inst1
```

For example:

```
db2move GEHGAL export -sn GEH_ADMIN -u GEH_ADMIN -p GEH_ADMIN > mv.log
```

If you want to export the db DDL schema from source DB, you should use the below db2 commands:

```
db2look -d GEHGAL -e -o ddlfile -i GEH_ADMIN -w GEH_ADMIN
```

or

```
db2look -d GEHGAL -u GEH_ADMIN -e -o alltables.sql
db2look -d sample -z NPMM -u db2inst1 -e -o NP.sql
```

以上为导出

(2).Create a 32k normal or large tablespace

```
db2 CREATE LARGE TABLESPACE LARGEGEHGAL32 PAGESIZE 32 K MANAGED BY DATABASE USING (FILE 'C:\DB2\NODE0000\SQL00001\largegehgal32' 20000) BUFFERPOOL IBMDEFAULT32K
```

(3).Create the db2 user that should be same name as exported <database_schema> that is from source DB in target DB2 database, assign the 32k tablespace to the user, and delete the other tablespaces
(4).Code page from target DB should be same as the code page of source DB. You should use the following command to check:

```
db2 get db cfg
```

If they are different, change the code page in target DB, use the following command:

```
 db2set db2codepage=1252 (1252 is the page code of source DB)
 db2 terminate
```

`db2 terminate command must be executed(**注意一定要进行terminate**)`
(5).Create a 16k or 32k temporary tablespace. It will be used when you view the Project Exception List from deployed GEH GUI

```
DB2 CREATE TEMPORARY TABLESPACE gehgalsystemtmp32 IN DATABASE PARTITION GROUP IBMTEMPGROUP PAGESIZE 32K MANAGED BY SYSTEM USING ('C:\DB2\NODE0000\SQL00001\gehgalsystemtmp32') EXTENTSIZE 32 PREFETCHSIZE 16 BUFFERPOOL IBMDEFAULT32K
```

(6).Import the data into the target DB

```
db2move <database_name> import -io create -u <DBA> -p <DBA_PASSWORD> > <logFile>
```

For example:

```
db2move GEHGAL import -io create -u GEH_MIGRATION -p Gal@pass > imp.log
```

Check the imp.log whether the import operation is successful.

If the table schema has been created/existed in target DB, so you can use the following command:

```
db2move GEHGAL import -io INSERT_UPDATE -u GEH_MIGRATION -p Gal@pass > imp.log
```

(7).If the export operation is successful, and you will find some tables in [color=green]userspace1 tablespace[/color], and the other tables in [color=green]LARGEGEHGAL32 tablespace[/color]
(8).If there are some procedures in your db schema, you should [color=green]execute the procedures that will not be imported into target database[/color]
(9).You should change the tables that have identify column if you want to store new messages in the target DB. The below is the commands that reset the identify value of EXCEPTION_MESSAGE table.

```
select max(EXCEPTION_MESSAGE_ID) from EXCEPTION_MESSAGE
$nextMessageId = max(EXCEPTION_MESSAGE_ID) + 1
alter table EXCEPTION_MESSAGE alter column EXCEPTION_MESSAGE_ID restart with $nextMessageId
```

import usage

```
db2move <database-name> <action> [<option> <value>]
```

首先，您必须指定数据库名（想要移动的表所在的数据库）和要执行的操作(export和import或load)。然后指定一个选项来定义操作的范围。例如，可以将一个操作限制在特定的表（-tn）、表空间（-ts）、表创建者（-tc）或模式名（-sn）范围内。指定表、表空间或表的创建者的一个子集只对export操作有效。如果指定多个值，就必须使用逗号将其分隔开；在值列表项之间不允许有空格。可以指定的项最多为10个。

另外，也可以指定-tf选项，此时要使用一个文件名作为参数，其中列出了要导出的表名；在该文件中，每行只能列出一个完整的表名。您还可以指定以下内容：
-io import-option
指定DB2的import工具可以运行的一种模式。有效的选项有：CREATE、INSERT、INSERT_UPDATE、REPLACE和REPLACE_CREATE。缺省值为REPLACE_CREATE。

参看: http://publib.boulder.ibm.com/infocenter/db2luw/v8/index.jsp?topic=/com.ibm.db2.udb.doc/core/r0008304.html

-lo load-option
指定DB2的load工具可以运行的一种模式。有效的选项有：INSERT和REPLACE。缺省值为INSERT。

-l lobpaths
指定要创建或查找的LOB文件的位置。必须指定一个或多个绝对路径名。如果指定了多个绝对路径，就必须使用逗号将其分隔开；值之间不允许有空格。缺省值是当前目录。

-u userid
指定一个用户ID，该工具可以使用这个用户ID登录到远程系统上。

-p password
指定对该用户进行认证的密码；该工具需要使用一个有效的用户ID和密码登录到远程系统上。

[b]db2codepage 设置[/b]
1、db2 变量查看
db2set -all
(connect to dbanme ) get db cfg
db2pd -osinfo

2、db2c变量的设置用命令
db2set 变量=value
可以参考一下：
客户端：
db2codepage=1386(简体中文)
db2country=86(中国)
db2comm=tcpip

服务器端：
db2codepage=1386(简体中文)
db2country=86(中国)
db2comm=tcpip
一定要把缺省的db2codepage=819改为数据库的代码页设置