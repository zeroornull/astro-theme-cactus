---
title: "Vuex学习笔记"
description: "Vuex学习笔记"
publishDate: 2021-04-22T14:30:00+08:00
updatedDate: "2025-03-09T14:30:00+08:00"
tags: ["Vue"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---

# Vuex学习

## State

单一状态树

> #### js浅拷贝与深拷贝的区别和实现方式 

[源链接](https://www.jianshu.com/p/1c142ec2ca45)

如何区分深拷贝与浅拷贝，简单点来说，就是假设B复制了A，当修改A时，看B是否会发生变化，如果B也跟着变了，说明这是浅拷贝，拿人手短，如果B没变，那就是深拷贝，自食其力。

1. 如果是基本数据类型，名字和值都会储存在栈内存中

```jsx
var a = 1;
b = a; // 栈内存会开辟一个新的内存空间，此时b和a都是相互独立的
b = 2;
console.log(a); // 1
```

当然，这也算不上深拷贝，因为深拷贝本身只针对较为复杂的object类型数据。

2. 如果是引用数据类型，名字存在栈内存中，值存在堆内存中，但是栈内存会提供一个引用的地址指向堆内存中的值
