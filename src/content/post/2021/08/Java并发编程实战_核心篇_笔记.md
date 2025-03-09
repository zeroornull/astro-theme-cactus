---
title: "Java并发编程实战_核心篇笔记"
description: "Java并发编程实战_核心篇笔记"
publishDate: 2021-08-15T09:28:25+08:00
updatedDate: "2021-08-15T09:28:25+08:00"
tags: ["JAVA"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---

## 第4章

### 4.4 基于任务的分割实现并发化

![image-20210831100100919](https://b2files.173114.xyz/blogimg/20210831100101.png)

**使用多线程编程的一个好的方式是从单线程程序开始，只有在单线程程序算法本身没有重大性能瓶颈但仍然无法满足要求的情况下我们才考虑使用多线程。**

## 第5章

### 5.3 CountDownLatch

实现一个（或者多个）线程等待其他线程完成一组特定的操作之后才继续运行。这组操作也被称为 **先决操作**

## 第6章 保障线程安全的设计技术

### 6.1 java运行时存储空间

堆空间 存储对象

栈空间 存储相应方法的局部变量、返回值等私有数据

非堆空间 存储常量以及类的元数据

### 6.2 无状态对象

一个类的同一个实例被多个线程共享并不会使这些线程存在共享状态，那么这个类及其任意一个实例就被称为无状态对象。反之，则成为有状态对象。

无状态对象不含任何实例变量，且不包含任何静态变量或常量。

#### **清单6-2 无状态对象实例**

```java
package io.renren.modules.ch3;

/**
 * 下游部件的节点
 *
 * @author xxp
 * @version 1.0
 * @date 2021-09-09 9:27
 **/
public class Endpoint {
    public final String host;
    public final int port;
    public final int weight;
    private volatile boolean online = true;

    public Endpoint(String host, int port, int weight) {
        this.host = host;
        this.port = port;
        this.weight = weight;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((host == null) ? 0 : host.hashCode());
        result = prime * result + port;
        result = prime * result + weight;
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Endpoint other = (Endpoint) obj;
        if (host == null) {
            if (other.host != null)
                return false;
        } else if (!host.equals(other.host))
            return false;
        if (port != other.port)
            return false;
        if (weight != other.weight)
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Endpoint [host=" + host + ", port=" + port + ", weight=" + weight
                + ", online=" + online + "]\n";
    }

}
```

```java
package io.renren.modules.ch6;

import io.renren.modules.ch3.Endpoint;

import java.util.Comparator;

/**
 * @author xxp
 * @version 1.0
 * @date 2021-09-09 9:23
 **/
public class DefaultEndpointComparator implements Comparator<Endpoint> {
    @Override
    public int compare(Endpoint o1, Endpoint o2) {
        int result = 0;
        boolean isOnline1 = o1.isOnline();
        boolean isOnline2 = o2.isOnline();
        // 优先按照服务器是否在线排序
        if (isOnline1 == isOnline2) {
            // 被比较的两台服务器都在线（或不在线）的情况下进一步比较服务器权重
            result = compareWeight(o1.weight, o2.weight);
        } else {
            // 在线的服务器排序靠前
            if (isOnline1) {
                result = -1;
            }
        }
        return result;
    }

    private int compareWeight(int weight1, int weight2) {
        // 按权重降序排列
        return Integer.compare(weight2, weight1);
    }

}
```

#### **清单6-3 对服务器节点进行排序**

```java
package io.renren.modules.ch6;

import io.renren.common.util.Debug;
import io.renren.modules.ch3.Endpoint;

import java.util.Arrays;
import java.util.Comparator;

/**
 * @author xxp
 * @version 1.0
 * @date 2021-09-09 9:34
 **/
public class EndpointView {
    static final Comparator<Endpoint> DEFAULT_COMPARATOR;

    static {
        DEFAULT_COMPARATOR = new DefaultEndpointComparator();
    }

    // 省略其他代码

    public Endpoint[] retrieveServletList(Comparator<Endpoint> comparator) {
        Endpoint[] serverList = doRetrieveServerList();
        Arrays.sort(serverList, comparator);
        return serverList;
    }

    public Endpoint[] retrieveServerList() {
        return retrieveServletList(DEFAULT_COMPARATOR);
    }

    private Endpoint[] doRetrieveServerList() {
        // // 模拟实际代码
        Endpoint[] serverList = new Endpoint[]{
                new Endpoint("192.168.1.100", 8080, 5),
                new Endpoint("192.168.1.101", 8081, 3),
                new Endpoint("192.168.1.102", 8082, 2),
                new Endpoint("192.168.1.103", 8080, 4)};
        serverList[0].setOnline(false);
        serverList[3].setOnline(false);
        return serverList;
    }

    public static void main(String[] args) {
        EndpointView endpointView = new EndpointView();
        Endpoint[] serverList = endpointView.retrieveServerList();
        Debug.info(Arrays.toString(serverList));

    }

}
```

#### **清单6-4 多个线程访问本身不包含状态的对象也可能存在共享状态示例**

```java
package io.renren.modules.ch6;

import java.util.HashMap;
import java.util.Map;

/**
 * @author xxp
 * @version 1.0
 * @date 2021-09-09 9:50
 **/
public class BrokenStatelessObject {
    public String doSomething(String s) {
        UnsafeSingleton us = UnsafeSingleton.INSTANCE;
        int i = us.doSomething(s);
        UnsafeStatefullObject sfo = new UnsafeStatefullObject();
        String str = sfo.doSomething(s, i);
        return str;

    }

    public String doSomething1(String s) {
        UnsafeSingleton us = UnsafeSingleton.INSTANCE;
        UnsafeStatefullObject sfo = new UnsafeStatefullObject();
        String str;
        // 加锁保障线程安全
        synchronized (this) {
            str = sfo.doSomething(s, us.doSomething(s));
        }
        return str;
    }

}

class UnsafeStatefullObject {
    static Map<String, String> cache = new HashMap<>();

    public String doSomething(String s, int len) {
        String result = cache.get(s);
        if (null == result) {
            result = md5sum(result, len);
            cache.put(s, result);
        }
        return result;
    }

    public String md5sum(String s, int len) {
        // 生成md5摘要
        // 省略其他代码
        return s;
    }

}

enum UnsafeSingleton {
    INSTANCE;
    public int state1;

    public int doSomething(String s) {
        // 省略其他代码

        // 访问state1
        return 0;
    }
}
```

#### 清单6-5 非线程安全的Servlet示例

```java
package io.renren.modules.ch6;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;

/**
 * 该类是一个错误的Servlet类（非线程安全）
 *
 * @author xxp
 * @version 1.0
 * @date 2021-09-09 10:02
 **/
public class UnsafeServlet extends HttpServlet {
    private static final long serialVersionUID = -2772996404655982182L;
    private final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String strExpiryDate = req.getParameter("expirtyDate");
        try {
            sdf.parse(strExpiryDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        // 省略其他代码
    }
}
```

### 6.3 不可变对象

#### 清单6-6 减少不可变对象所占用的空间

```java
package io.renren.modules.ch6;

import io.renren.common.util.ReadOnlyIterator;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author xxp
 * @version 1.0
 * @date 2021-09-09 10:26
 **/
public class BigImmutableObject implements Iterable<Map.Entry<String, BigObject>> {

    private final HashMap<String, BigObject> registry;

    public BigImmutableObject(Map<String, BigObject> registry) {
        this.registry = (HashMap<String, BigObject>) registry;
    }

    public BigImmutableObject(BigImmutableObject prototype, String key, BigObject newValue) {
        this(createRegistry(prototype, key, newValue));
    }

    @SuppressWarnings("unchecked")
    private static HashMap<String, BigObject> createRegistry(BigImmutableObject prototype, String key, BigObject newValue) {
        // 从现有对象中复制（浅复制）字段
        HashMap<String, BigObject> newRegistry = (HashMap<String, BigObject>) prototype.registry.clone();

        // 仅更新需要更新的部分
        newRegistry.put(key, newValue);
        return newRegistry;
    }

    @Override
    public Iterator<Map.Entry<String, BigObject>> iterator() {
        // 对entrySet进行防御性复制
        final Set<Map.Entry<String, BigObject>> readOnlyEntries = Collections.unmodifiableSet(registry.entrySet());
        // 返回一个只读的Iterator实例
        return ReadOnlyIterator.with(readOnlyEntries.iterator());
    }

    public BigObject getObject(String key) {
        return registry.get(key);
    }

    public BigImmutableObject update(String key, BigObject newValue) {
        return new BigImmutableObject(this, key, newValue);
    }

}

class BigObject {
    byte[] data = new byte[4 * 1024 * 1024];
    private int id;
    private final static AtomicInteger ID_Gen = new AtomicInteger(0);

    public BigObject() {
        id = ID_Gen.incrementAndGet();
    }

    @Override
    public String toString() {
        return new StringJoiner(", ", BigObject.class.getSimpleName() + "[", "]")
                .add("data=" + Arrays.toString(data))
                .add("id=" + id)
                .toString();
    }

    // 省略其他代码
}
```

### 6.4 线程特有对象

####  清单6-7 使用ThreadLocal实现线程安全示例代码

```java
package io.renren.modules.ch6;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;

/**
 * @author xxp
 * @version 1.0
 * @date 2021-09-09 10:49
 **/
@WebServlet("/threadLocalExample")
public class ServletWithThreadLocal extends HttpServlet {
    final static ThreadLocal<SimpleDateFormat> SDF = new ThreadLocal<SimpleDateFormat>() {
        @Override
        protected SimpleDateFormat initialValue() {
            return new SimpleDateFormat("yyyy-MM-dd");
        }
    };

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        final SimpleDateFormat sdf = SDF.get();
        String strExpiryDate = req.getParameter("expirtyDate");
        try (PrintWriter pwr = resp.getWriter()) {
            sdf.parse(strExpiryDate);
            // 省略其他代码
            pwr.printf("[%s]expirtyDate:%s", Thread.currentThread().getName(), strExpiryDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        // 省略其他代码
    }
}
```

#### 清单6-8 使用ThreadLocal避免锁的争用

```java
package io.renren.modules.ch6.case01;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

/**
 * @author xxp
 * @version 1.0
 * @date 2021-09-09 10:59
 **/
public enum ThreadSpecificSecureRandom {
    INSTANCE;
    final static ThreadLocal<SecureRandom> SECURE_RANDOM = new ThreadLocal<SecureRandom>() {
        @Override
        protected SecureRandom initialValue() {
            SecureRandom srnd;
            try {
                srnd = SecureRandom.getInstance("SHA1PRNG");

            } catch (NoSuchAlgorithmException e) {
                srnd = new SecureRandom();
                new RuntimeException("No SHA1PRNG available,defaults to new SecureRandom()", e)
                        .printStackTrace();
            }
            // 通过以下调用来初始化种子
            srnd.nextBytes(new byte[20]);
            return srnd;
        }
    };

    // 生成随机数
    public int nextInt(int upperBound) {
        SecureRandom secureRnd = SECURE_RANDOM.get();
        return secureRnd.nextInt(upperBound);
    }

    public void setSeed(long seed) {
        SecureRandom secureRnd = SECURE_RANDOM.get();
        secureRnd.setSeed(seed);
    }
}

```

#### 清单6-11 使用Filter规避ThreadLocal内存泄漏示例代码

```java
package io.renren.modules.ch6;import javax.servlet.*;import java.io.IOException;/** * @author xxp * @version 1.0 * @date 2021-09-09 16:19 **/public class ThreadLocalCleanupFilter implements Filter {    @Override    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {        filterChain.doFilter(servletRequest, servletResponse);        ThreadLocalMemoryLeak.counterHolder.remove();    }    @Override    public void init(FilterConfig filterConfig) throws ServletException {        Filter.super.init(filterConfig);    }    @Override    public void destroy() {        Filter.super.destroy();    }}
```

![image-20210909163029481](https://b2files.173114.xyz/blogimg/20210909163029.png)

## 第7章 线程活性故障

**规避死锁的常见方法**

- 粗锁法（Coarsen-gained Lock）- 使用一个粗粒度的锁代替多个锁。
- 锁排序法（Lock Ordering）- 相关线程使用全局统一的顺序申请锁。
- 使用 ReentrantLock.tryLock(long,TimeUnit) 来申请锁。
- 使用开放调用(Open Call) - 在调用外部方法时不加锁。
- 使用锁的替代品。

终极方法-**不使用锁**

### 7.2 沉睡不醒的睡美人：锁死

**信号丢失锁死**

常见例子

​	CountDownLatch.countDown()调用没有放在finally块中导致CountDownLatch.await()的执行流程一直处于等待状态，从而使其任务一直无法进展

嵌套监视器锁死

## 第8章 线程管理