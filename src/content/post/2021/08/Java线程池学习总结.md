---
title: "Java线程池学习总结"
description: "Java线程池学习总结"
publishDate: 2021-08-13T08:28:25+08:00
updatedDate: "2021-08-13T08:28:25+08:00"
tags: ["JAVA"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---

[参考链接https://snailclimb.gitee.io/javaguide/#/./docs/java/multi-thread/java%E7%BA%BF%E7%A8%8B%E6%B1%A0%E5%AD%A6%E4%B9%A0%E6%80%BB%E7%BB%93](https://snailclimb.gitee.io/javaguide/#/./docs/java/multi-thread/java%E7%BA%BF%E7%A8%8B%E6%B1%A0%E5%AD%A6%E4%B9%A0%E6%80%BB%E7%BB%93)

[https://tech.meituan.com/2020/04/02/java-pooling-pratice-in-meituan.html](https://tech.meituan.com/2020/04/02/java-pooling-pratice-in-meituan.html)

[https://www.cnblogs.com/thisiswhy/p/12690630.html](https://www.cnblogs.com/thisiswhy/p/12690630.html)

https://blog.csdn.net/woshiluoye9/article/details/60883461

![img](https://b2files.173114.xyz/blogimg/20210812123219.png)



守护线程： Daemon Thread
java中的线程有两类，守护线程和用户线程
守护线程指在程序运行在后台的一种特殊线程，为其他的线程服务，比如垃圾回收线程就是一个很称职的守护线程。它并不属于程序中不可或缺的部分，但是确实是很有用的， 如果用户线程已经全部退出运行了，只剩下守护线程存在了，虚拟机也就退出了，但是用户进程只要还存在一个，虚拟机就不会退出。
守护线程有几个特点：
1、 thread.setDaemon(true)必须在thread.start()之前设置，你不能把一个正在运行的线程转化为守护线程
2、 在守护线程内的产生的线程也是守护线程
3、 永远不要试图利用守护线程去访问文件、数据库等固有资源，因为守护线程可以被任何用户线程所中断，线程的优先级最低。



还没写完、、、

