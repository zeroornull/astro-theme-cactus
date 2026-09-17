---
title: "Java并发编程实战"
description: "Java并发编程实战"
publishDate: 2021-09-15T13:18:05+08:00
updatedDate: "2021-09-15T13:18:05+08:00"
tags: ["JAVA"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---

# Java并发编程实战

https://time.geekbang.org/column/intro/100023901

## 01 | 可见性、原子性和有序性问题：并发编程Bug的源头

源头之一：缓存导致的可见性问题

源头之二：线程切换带来的原子性问题

源头之三：编译优化带来的有序性问题

**在 32 位的机器上对 long 型变量进行加减操作存在并发隐患?**

long类型64位，所以在32位的机器上，对long类型的数据操作通常需要多条指令组合出
来，无法保证原子性，所以并发的时候会出问题

## 02 | Java内存模型：看Java如何解决可见性和有序性问题

volatile 关键字并不是 Java 语言的特产，古老的 C 语言里也有，它最原始的意义就是禁用 CPU 缓存。

### Happens-Before 规则

前面一个操作的结果对后续操作是可见的。

#### 1. 程序的顺序性规则

这条规则是指在一个线程中，按照程序顺序，前面的操作 Happens-Before 于后续的任意操作。

#### 2. volatile 变量规则

对一个 volatile 变量的写操作， Happens-Before 于后续对这个 volatile变量的读操作。

#### 3. 传递性

这条规则是指如果 A Happens-Before B，且 B Happens-Before C，那么 A Happens-Before C。

#### 4. 管程中锁的规则

对一个锁的解锁 Happens-Before 于后续对这个锁的加锁。

管程是一种通用的同步原语，在Java 中指的就是 synchronized，synchronized 是 Java 里对管程的实现。

#### 5. 线程 start() 规则

主线程 A 启动子线程 B 后，子线程 B 能够看到主线程在启动子线程 B 前的操作。

#### 6. 线程 join() 规则

主线程 A 等待子线程 B 完成（主线程 A 通过调用子线程B 的 join() 方法实现），当子线程 B 完成后（主线程 A 中 join() 方法返回），主线程能够看到子线程的操作。当然所谓的“看到”，指的是对共享变量的操作。

#### 线程中断规则：

对线程interrupt()方法的调用先行发生于被中断线程的代码检测到中断事件的发生，可以通过Thread.interrupted()方法检测到是否有中断发生。

#### 对象终结规则：

一个对象的初始化完成(构造函数执行结束)先行发生于它的finalize()方法的开始。

**课后题**

有一个共享变量 abc，在一个线程里设置了 abc 的值 abc=3，你思考一下，有哪些办法可以让其他线程能够看到abc==3？

1.声明共享变量abc，并使用volatile关键字修饰abc
2.声明共享变量abc，在synchronized关键字对abc的赋值代码块加锁，由于Happenbefore
管程锁的规则，可以使得后续的线程可以看到abc的值。

## 03 | 互斥锁（上）：解决原子性问题

```java
// 下面的代码用 synchronized 修饰代码块来尝试解决并发问题，你觉得这个使用方式正确吗？有哪些问题呢？能解决可见性和原子性问题吗？
class SafeCalc {
    long value = 0L;

    long get() {
        synchronized (new Object()) {
            return value;
        }
    }

    void addOne() {
        synchronized (new Object()) {
            value += 1;
        }
    }
}
```

加锁本质就是在锁对象的对象头中写入当前线程id，但是new object每次在内存中都是新对象，所以加锁无效。

**JVM 开启逃逸分析之后，synchronized (new Object()) 这行代码在实际执行的时候会被优化掉，也就是说在真实执行的时候，这行代码压根就不存在。**

## 04 | 互斥锁（下）：如何用一把锁保护多个资源？

用Account.class 作为共享的锁

Account.class 是所有 Account 对象共享的，而且这个对象是 Java 虚拟机在加载 Account 类的时候创建的，所以我们不用担心它的唯一性。

```java
public class Account {
    // lock for balance
    private final Object balLock = new Object();
    // balance
    private Integer balance;
    // lock for password
    private final Object pwLock = new Object();
    // password
    private String password;

    // withdraw money
    void withdraw(Integer amt) {
        synchronized (balLock) {
            if (this.balance > amt) {
                this.balance -= amt;
            }
        }
    }

    // show balance
    Integer getBalance() {
        synchronized (balLock) {
            return balance;
        }
    }

    // change password
    void updatePassword(String pw) {
        synchronized (pwLock) {
            this.password = pw;
        }
    }

    // show password
    String getPassword() {
        synchronized (pwLock) {
            return this.password;
        }
    }

    // transfer
    void transfer(Account target, int amt) {
        if (this.balance > amt) {
            this.balance -= amt;
            target.balance += amt;
        }
    }
}
```

在第一个示例程序里，我们用了两把不同的锁来分别保护账户余额、账户密码，创建锁的时候，我们用的是：private final Object xxxLock = new Object();，如果账户余额用 this.balance 作为互斥锁，账户密码用 this.password 作为互斥锁，你觉得是否可以呢？

用this.balance 和this.password 都不行。在同一个账户多线程访问时候，A线程取款进行this.balance-=amt;时候此时this.balance对应的值已经发生变换，线程B再次取款时拿到的balance对应的值并不是A线程中的，也就是说不能把可变的对象当成一把锁。this.password 虽然说是String修饰但也会改变，所以也不行。

## 05 | 一不小心就死锁了，怎么办？

### 如何预防死锁

1. 互斥，共享资源 X 和 Y 只能被一个线程占用；
2. 占有且等待，线程 T1 已经取得共享资源 X，在等待共享资源 Y 的时候，不释放共享资源 X；
3. 不可抢占，其他线程不能强行抢占线程 T1 占有的资源；

4. 循环等待，线程 T1 等待线程 T2 占有的资源，线程 T2 等待线程 T1 占有的资源，就是循环等
    待。



1. 对于“占用且等待”这个条件，我们可以一次性申请所有的资源，这样就不存在等待了。
2. 对于“不可抢占”这个条件，占用部分资源的线程进一步申请其他资源时，如果申请不到，可
以主动释放它占有的资源，这样不可抢占这个条件就破坏掉了。
3. 对于“循环等待”这个条件，可以靠按序申请资源来预防。所谓按序申请，是指资源是有线性
顺序的，申请的时候可以先申请资源序号小的，再申请资源序号大的，这样线性化后自然就不
存在循环了。

### 1. 破坏占用且等待条件

```java
public class Allocator {
    private List<Object> als = new ArrayList<>();

    // allocate resource in one time
    synchronized boolean apply(Object from, Object to) {
        if (als.contains(from) || als.contains(to)) {
            return false;
        } else {
            als.add(from);
            als.add(to);
        }
        return true;
    }

    // return resource
    synchronized void free(Object from, Object to) {
        als.remove(from);
        als.remove(to);
    }
}

class Account {
    // actr should be single_instance 
    private Allocator actr;
    private int balance;

    // transfer
    void transfer(Account target, int amt) {
        // apply transfer from or to until success 
        while (!actr.apply(this, target)) {
            try {
                synchronized (target) {
                    if (this.balance > amt) {
                        this.balance -= amt;
                        target.balance += amt;
                    }
                }
            } finally {
                actr.free(this, target);
            }
        }
    }
    
    // for 3
    void transfer1(Account target, int amt) {
        Account left = this;
        Account right = target;
        if (this.id > target.id) {
            left = target;
            right = this;
        }
        // lock small number
        synchronized (left) {
            // lock big number
            synchronized (right) {
                if (this.balance > amt) {
                    this.balance -= amt;
                    target.balance += amt;
                }
            }
        }
    }
}
```

### 2. 破坏不可抢占条件

### 3. 破坏循环等待条件



### 课后题

破坏占用且等待条件，我们也是锁了所有的账户，而且还是用了死循环while(!actr.apply(this, target));这个方法，那它比 synchronized(Account.class)有没有性能优势呢？

synchronized(Account.class) 锁了Account类相关的所有操作。相当于文中说的包场了，只要与Account有关联，通通需要等待当前线程操作完成。while死循环的方式只锁定了当前操作的两个相关的对象。两种影响到的范围不同。

## 06 | 用“等待-通知”机制优化循环等待

### 一个更好地资源分配器

```java
public class Allocator {
    private List<Object> als;

    // apply all resource at once
    synchronized void apply(Object from, Object to) {
        // classic writing
        while (als.contains(from) || als.contains(to)) {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        als.add(from);
        als.add(to);
    }

    // return resource
    synchronized void free(Object from, Object to) {
        als.remove(from);
        als.remove(to);
        notifyAll();
    }
}

```

### 尽量使用 notifyAll()

notify() 是会随机地通知等待队列中的一个线程，而 notifyAll() 会通知等待队列中的所有线程。

### 课后题

wait() 方法和 sleep() 方法都能让当前线程挂起一段时间，那它们的区别是什么？

wait与sleep区别在于：
1. wait会释放所有锁而sleep不会释放锁资源.
2. wait只能在同步方法和同步块中使用，而sleep任何地方都可以.
3. wait无需捕捉异常，而sleep需要.



两者相同点：都会让渡CPU执行时间，等待再次调度！

## 07 | 安全性、活跃性以及性能问题

### 课后思考

Java 语言提供的 Vector 是一个线程安全的容器，有同学写了下面的代码，你看看是否存在并发问题呢？

```java
void addIfNotExist(Vector v,Object o){
    if(!v.contains(o)) {
        v.add(o);
    }
}
// contains和add之间不是原子操作，有可能重复添加。
// vector是线程安全，指的是它方法单独执行的时候没有并发正确性问题，并不代表把它的操作组合在一起问木有，而这个程序显然有竞态条件问题。
```

## 08 | 管程：并发编程的万能钥匙

### 课后思考

wait() 方法，在 Hasen 模型和 Hoare 模型里面，都是没有参数的，而在 MESA 模型里面，增加了超时参数，你觉得这个参数有必要吗？

1.由于是while 循环，所以就算超时自动唤醒也会去重新检查条件，所以不存在逻辑错误问题
2.假设另外一个线程在唤醒之前因为某些原因退出了，那带参数的notify可以超时而进去就绪状态。



hasen 是执行完，再去唤醒另外一个线程。能够保证线程的执行。hoare，是中断当前线程，唤醒另外一个线程，执行完再去唤醒，也能够保证完成。而mesa是进入等待队列，不一定有机会能够执行。

## 09 | Java线程（上）：Java线程的生命周期

### 课后思考

下面代码的本意是当前线程被中断之后，退出while(true)，你觉得这段代码是否正确呢？

```java
Thread th = Thread.currentThread();
        while (true) {
            if (th.isInterrupted()) {
                break;
            }
            // 省略业务代码无数
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
```

```java
//可能出现无限循环，线程在sleep期间被打断了，抛出一个InterruptedException异常，try catch捕捉此异常，应该重置一下中断标示，因为抛出异常后，中断标示会自动清除掉！
Thread th = Thread.currentThread();
        while (true) {
            if (th.isInterrupted()) {
                break;
            }
            // 省略业务代码无数
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                e.printStackTrace();
            }

        }
```

## 10 | Java线程（中）：创建多少线程才是合适的？

对于 CPU 密集型的计算场景，理论上“线程的数量 =CPU 核数”就是最合适的



对于 I/O 密集型计算场景，最佳的线程数是与程序中 CPU 计算和 I/O 操作的耗时比相关的，我们可以总结出这样一个公式：

**最佳线程数 =1 +（I/O 耗时 / CPU 耗时）**

不过上面这个公式是针对单核 CPU 的，至于多核 CPU，也很简单，只需要等比扩大就可以了，计算公式如下：

**最佳线程数 =CPU 核数 * [ 1 +（I/O 耗时 / CPU 耗时）]**

### 课后思考

对于最佳线程数的设置积累了一些经验值，认为对于 I/O 密集型应用，最佳线程数应该为：2 * CPU 的核数 + 1，你觉得这个经验值合理吗？

bu

## 11| Java线程（下）：为什么局部变量是线程安全的？

### 课后思考

常听人说，递归调用太深，可能导致栈溢出。你思考一下原因是什么？有哪些解决方案呢？

因为调用方法时局部变量会进线程的栈帧，线程的栈内存是有限的，而递归没控制好容易造成太多层次调用，最终栈溢出。
解决思路一是开源节流，即减少多余的局部变量或扩大栈内存大小设置，减少调用层次涉及具体业务逻辑，优化空间有限；二是改弦更张，即想办法消除递归，比如说能否改造成尾递归（Java会优化掉尾递归）

## 12 | 如何用面向对象思想写好并发程序？

### 一、封装共享变量

### 二、识别共享变量间的约束条件

### 三、制定并发访问策略

1. 避免共享：避免共享的技术主要是利于线程本地存储以及为每个任务分配独立的线程。

2. 不变模式：这个在 Java 领域应用的很少，但在其他领域却有着广泛的应用，例如 Actor 模式、CSP 模式以及函数式编程的基础都是不变模式。

3. 管程及其他同步工具：Java 领域万能的解决方案是管程，但是对于很多特定场景，使用 Java并发包提供的读写锁、并发容器等同步工具会更好。



除了这些方案之外，还有一些宏观的原则需要你了解。这些宏观原则，有助于你写出“健壮”的并发程序。这些原则主要有以下三条。

1. 优先使用成熟的工具类：Java SDK 并发包里提供了丰富的工具类，基本上能满足你日常的需要，建议你熟悉它们，用好它们，而不是自己再“发明轮子”，毕竟并发工具类不是随随便便就能发明成功的。

2. 迫不得已时才使用低级的同步原语：低级的同步原语主要指的是 synchronized、Lock、Semaphore 等，这些虽然感觉简单，但实际上并没那么简单，一定要小心使用。

3. 避免过早优化：安全第一，并发程序首先要保证安全，出现性能瓶颈后再优化。在设计期和开发期，很多人经常会情不自禁地预估性能的瓶颈，并对此实施优化，但残酷的现实却是：性能瓶颈不是你想预估就能预估的。

```java
public class SafeWM {
    // inventory ceiling
    private final AtomicLong upper = new AtomicLong(0);

    // stock low limit
    private final AtomicLong lower = new AtomicLong(0);

    // set stock high limit
    void setUpper(long v) {
        // check param in law
        if (v < lower.get()) {
            throw new IllegalArgumentException();
        }
        upper.set(v);
    }


    // set stock low limit
    void setLower(long v) {
        // check param in law
        if (v > upper.get()) {
            throw new IllegalArgumentException();
        }
        lower.set(v);
    }
    // omit other operation

}
```

### 课后思考

本期示例代码中，类 SafeWM 不满足库存下限要小于库存上限这个约束条件，那你来试试修改一下，让它能够在并发条件下满足库存下限要小于库存上限这个约束条件。

## 13 | 理论基础模块热点问题答疑

## 14 | Lock&Condition（上）：隐藏在并发包中的管程

### 什么是可重入锁

所谓可重入锁，顾名思义，指的是线程可以重复获取同一把锁。

所谓可重入函数，指的是多个线程可以同时调用该函数，每个线程都能得到正确结果

### 用锁的最佳实践

1. 永远只在更新对象的成员变量时加锁
2. 永远只在访问可变的成员变量时加锁
3. 永远不在调用其他对象的方法时加锁

**并发问题，本来就难以诊断，所以你一定要让你的代码尽量安全，尽量简单，哪怕有一点可能会出问题，都要努力避免。**

### 课后思考

你已经知道 tryLock() 支持非阻塞方式获取锁，下面这段关于转账的程序就使用到了 tryLock()，你来看看，它是否存在死锁问题呢？

```java
class Account {
    private int balance;
    private final Lock lock
            = new ReentrantLock();

    // 转账
    void transfer(Account tar, int amt) {
        while (true) {
            if (this.lock.tryLock()) {
                try {
                    if (tar.lock.tryLock()) {
                        try {
                            this.balance -= amt;
                            tar.balance += amt;
                        } finally {
                            tar.lock.unlock();
                        }
                    }//if
                } finally {
                    this.lock.unlock();
                }
            }//if
        }//while
    }//transfer
}
```

```java
class Account {
    private int balance;
    private final Lock lock
            = new ReentrantLock();

    // 转账
    void transfer(Account tar, int amt) {
        while (true) {
            if (this.lock.tryLock()) {
                try {
                    if (tar.lock.tryLock()) {
                        try {
                            this.balance -= amt;
                            tar.balance += amt;
//新增：退出循环
                            break;
                        } finally {
                            tar.lock.unlock();
                        }
                    }//if
                } finally {
                    this.lock.unlock();
                }
            }//if
//新增：sleep⼀个随机时间避免活锁
            Thread.sleep(随机时间);
        }//while
    }//transfer
}
```



## 15 | Lock和Condition（下）：Dubbo如何用管程实现异步转同步？

### 课后思考

**DefaultFuture 里面唤醒等待的线程，用的是 signal()，而不是 signalAll()，你来分析一下，这样做是否合理呢？**

每个rpc请求都会占用一个线程并产生一个新的DefaultFuture实例，它们的lock&condition是不同的，并没有竞争关系
这里的lock&condition是用来做异步转同步的，使get()方法不必等待timeout那么久，用得很巧妙

```java
// RPC结果返回时调⽤该⽅法
private void doReceived(Response res) {
lock.lock();
try {
response = res;
done.signalAll();
} finally {
lock.unlock();
}
}
```



## 16 | Semaphore：如何快速实现一个限流器？

**Semaphore 可以允许多个线程访问一个临界区。**

### 课后思考

在上面对象池的例子中，对象保存在了 Vector 中，Vector 是 Java 提供的线程安全的容器，如果我们把 Vector 换成 ArrayList，是否可以呢？

答案是不可以的。Semaphore可以允许多个线程访问一个临界区，那就意味着可能存在多个线程同时访问
ArrayList，而ArrayList不是线程安全的，所以对象池的例子中是不能够将Vector换成ArrayList的。
Semaphore允许多个线程访问一个临界区，这也是一把双刃剑，当多个线程进入临界区时，如果需要访问
共享变量就会存在并发问题，所以必须加锁，也就是说Semaphore需要锁中锁。

## 17 | ReadWriteLock：如何快速实现一个完备的缓存？

```java
//快速实现一个缓存
public class Cache<K, V> {
    final Map<K, V> m = new HashMap<>();
    final ReadWriteLock rwl = new ReentrantReadWriteLock();

    // read lock
    final Lock r = rwl.readLock();
    // write lock
    final Lock w = rwl.writeLock();

    // read cache
    V get(K key) {
        r.lock();
        try {
            return m.get(key);
        } finally {
            r.unlock();
        }
    }

    // write cache
    V put(K key, V v) {
        w.lock();
        try {
            return m.put(key, v);
        } finally {
            w.unlock();
        }
    }
}
```

```java
// 实现缓存的按需加载
public class Cache<K, V> {
    Object data;
    volatile boolean cacheValid;
    final Map<K, V> m = new HashMap<>();
    final ReadWriteLock rwl = new ReentrantReadWriteLock();
    final Lock r = rwl.readLock();
    final Lock w = rwl.writeLock();

    V get(K k) {
        V v = null;
        // read cache
        r.lock();
        try {
            v = m.get(k);
        } finally {
            r.unlock();
        }
        // cache exist,return
        if (v != null) {
            return v;
        }
        // cache doesn't exist,query database
        w.lock();
        try {
            // check again
            // other thread may already query database
            v = m.get(k);
            if (v == null) {
                // query database
                v = v;
                m.put(k, v);
            }
        } finally {
            w.unlock();
        }
        return v;
    }

    void processCachedData() {
        // earn read lock
        r.lock();
        if (!cacheValid) {
            // release read lock because can't allow upgrade read lock
            r.unlock();
            // earn write lock
            w.lock();
            try {
                // check status again 
                if (!cacheValid) {
                    data = "1";
                    cacheValid = true;
                }
                // before release write lock,downgrade lock to read lock
                // downgrade is allow
                r.lock();
            } finally {
                w.unlock();
            }

        }
        // in this place,still own read lock
        try {
            // do something. use(data)
        } finally {
            r.unlock();
        }
    }
}
```



### 课后思考

有同学反映线上系统停止响应了，CPU 利用率很低，你怀疑有同学一不小心写出了读锁升级写锁
的方案，那你该如何验证自己的怀疑呢？

## 18 | StampedLock：有没有比读写锁更快的锁？

### StampedLock 读模板：

```java
final StampedLock sl =
                new StampedLock();
        // 乐观读
        long stamp = sl.tryOptimisticRead();
        // 读⼊⽅法局部变量 ... 
        // 校验 stamp
        if (!sl.validate(stamp)) {
            // 升级为悲观读锁
            stamp = sl.readLock();
            try {
                // 读⼊⽅法局部变量 ... 
            } finally {
                // 释放悲观读锁
                sl.unlockRead(stamp);
            }
        }
        // 使⽤⽅法局部变量执⾏业务操作 .. 
```

### StampedLock 写模板：

```java
long stamp = sl.writeLock();
try {
// 写共享变量 ......

} finally {
    sl.unlockWrite(stamp);
}
```

## 课后思考

StampedLock 支持锁的降级（通过 tryConvertToReadLock() 方法实现）和升级（通过tryConvertToWriteLock() 方法实现），但是建议你要慎重使用。下面的代码也源自 Java 的官方示例，我仅仅做了一点修改，隐藏了一个 Bug，你来看看 Bug 出在哪里吧。

```java
private double x, y;
final StampedLock sl = new StampedLock();

// 存在问题的⽅法
void moveIfAtOrigin(double newX, double newY) {
    long stamp = sl.readLock();
    try {
        while (x == 0.0 && y == 0.0) {
            long ws = sl.tryConvertToWriteLock(stamp);
            if (ws != 0L) {
                //问题出在没有对stamp重新赋值
//新增下⾯⼀⾏
                stamp = ws;
                x = newX;
                y = newY;
                break;
            } else {
                sl.unlockRead(stamp);
                stamp = sl.writeLock();
            }
        }
    } finally {
        sl.unlock(stamp);
    }
}
```

bug是tryConvertToWriteLock返回的write stamp没有重新赋值给stamp

## 19 | CountDownLatch和CyclicBarrier：如何让多线程步调一致？

```java
// CountDownLatch
public class CountDownLatchTest {
    public static void main(String[] args) throws InterruptedException {
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        while (true) {
            // count init 2
            CountDownLatch latch = new CountDownLatch(2);
            // query 1
            executorService.execute(() -> {
                // do somethings
                latch.countDown();
            });
            // query 2
            executorService.execute(() -> {
                latch.countDown();
            });

            latch.await();
            boolean check = check();
            save();

        }
    }

    private static void save() {
        
    }

    private static boolean check() {
        // check something
        return true;
    }
}
```



```java
// CyclicBarrier
public class CyclicBarrierTest {
    // queue 1
    static Vector<String> pos;
    // queue 2
    static Vector<String> dos;

    // threadpool
    static Executor executor = Executors.newFixedThreadPool(1);
    final static CyclicBarrier barrier = new CyclicBarrier(2, () -> {
        executor.execute(() -> check());
    });

    public static void main(String[] args) {


    }

    private static void check() {
        String p = pos.remove(0);
        String d = dos.remove(0);
        //
        check(p, d);
        save();
    }

    private static void save() {
    }

    private static void check(String p, String d) {

    }

    void checkAll() {
        Thread t1 = new Thread(() -> {
            while (true) {
                // exist 
                pos.add("");
                // 
                try {
                    barrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }
        });
        t1.start();
        Thread t2 = new Thread(() -> {
            while (true) {
                // exist 
                dos.add("");
                // 
                try {
                    barrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            }
        });
        t2.start();

    }

}
```

**CyclicBarrier 的计数器有自动重置的功能，当减到 0 的时候，会自动重置你设置的初始值。**

### 课后思考

**本章最后的示例代码中，CyclicBarrier 的回调函数我们使用了一个固定大小的线程池，你觉得是否有必要呢？**

设置线程池为单个线程可以保证对账的操作按顺序执行

其实线程池改成多线程也可以，要把两个remove(0)放到一个同步块中

第二个是使用了线程池，如果不使用，直接在回调函数里调用check()方法是否可以呢？绝对不可以。为什么呢？这个要分析一下回调函数和唤醒等待线程之间的关系。下面是CyclicBarrier相关的源码，通过源码你会发现CyclicBarrier是同步调用回调函数之后才唤醒等待的线程，如果我们在回调函数里直接调用check()方
法，那就意味着在执行check()的时候，是不能同时执行getPOrders()和getDOrders()的，这样就起不到提升性能的作用。

```java
try {
//barrierCommand是回调函数
final Runnable command = barrierCommand;
//调⽤回调函数
if (command != null)
command.run();
ranAction = true;
//唤醒等待的线程
nextGeneration();
return 0;
} finally {
if (!ranAction)
breakBarrier();
}
```

所以，当遇到回调函数的时候，你应该本能地问自己：执行回调函数的线程是哪一个？这个在多线程场景下非常重要。因为不同线程ThreadLocal里的数据是不同的，有些框架比如Spring就用ThreadLocal来管理事务，如果不清楚回调函数用的是哪个线程，很可能会导致错误的事务管理，并最终导致数据不一致。

CyclicBarrier的回调函数究竟是哪个线程执行的呢？如果你分析源码，你会发现执行回调函数的线程是将CyclicBarrier内部计数器减到 0 的那个线程。所以我们前面讲执行check()的时候，是不能同时执行getPOrders()和getDOrders()，因为执行这两个方法的线程一个在等待，一个正在忙着执行check()。

**再次强调一下：当看到回调函数的时候，一定问一问执行回调函数的线程是谁。**

## 20 | 并发容器：都有哪些“坑”需要我们填？

### （一）List

CopyOnWriteArrayList

使用 CopyOnWriteArrayList 需要注意的“坑”主要有两个方面。一个是应用场景，
CopyOnWriteArrayList 仅适用于写操作非常少的场景，而且能够容忍读写的短暂不一致。写入的新元素并不能立刻被遍历到。另一个需要注意的是，CopyOnWriteArrayList迭代器是只读的，不支持增删改。因为迭代器遍历的仅仅是一个快照，而对快照进行增删改是没有意义的。

### （二）Map

ConcurrentHashMap 和 ConcurrentSkipListMap

ConcurrentHashMap 的 key 是无序的

ConcurrentSkipListMap 的 key 是有序的

使用 ConcurrentHashMap 和 ConcurrentSkipListMap 需要注意的地方是，它们的 key 和 value都不能为空，否则会抛出NullPointerException

![image-20210914155457963](https://b2files.173114.xyz/blogimg/20210914155458.png)

### （三）Set

CopyOnWriteArraySet 和 ConcurrentSkipListSet

### （四）Queue

1.单端阻塞队列

ArrayBlockingQueue、LinkedBlockingQueue、SynchronousQueue、LinkedTransferQueue、PriorityBlockingQueue 和 DelayQueue。

2.双端阻塞队列：其实现是 LinkedBlockingDeque。

3.单端非阻塞队列：其实现是 ConcurrentLinkedQueue。

4.双端非阻塞队列：其实现是 ConcurrentLinkedDeque。

需要格外注意队列是否支持有界

**在使用其他无界队列时，一定要充分考虑是否存在导致 OOM 的隐患。**

### 课后思考

线上系统 CPU 突然飙升，你怀疑有同学在并发场景里使用了 HashMap，因为在 1.8 之前的版本里并发执行 HashMap.put() 可能会导致 CPU 飙升到 100%，你觉得该如何验证你的猜测呢？

**Java7中的HashMap在执行put操作时会涉及到扩容，由于扩容时链表并发操作会造成链表成环，所以可能导致cpu飙升100%。**

## 21 | 原子类：无锁工具类的典范

无锁方案的实现原理

其实原子类性能高的秘密很简单，硬件支持而已。CPU 为了解决并发问题，提供了 CAS 指令（CAS，全称是 Compare And Swap，即“比较并交换”）。CAS 指令包含 3 个参数：共享变量的内存地址 A、用于比较的值 B 和共享变量的新值 C；并且只有当内存中地址 A 处的值等于 B时，才能将内存中地址 A 处的值更新为新值 C。作为一条 CPU 指令，CAS 指令本身是能够保证原子性的。

### 1. 原子化的基本数据类型

### 2. 原子化的对象引用类型

不过需要注意的是，对象引用的更新需要重点关注 ABA 问题，AtomicStampedReference 和 AtomicMarkableReference 这两个原子类可以解决 ABA 问题。

### 3. 原子化数组

### 4. 原子化对象属性更新器

### 5. 原子化的累加器

### 课后思考

**下面的示例代码是合理库存的原子化实现，仅实现了设置库存上限 setUpper() 方法，你觉得setUpper() 方法的实现是否正确呢？**

```java
public class SafeWM {
    class WMRange {
        final int upper;
        final int lower;

        WMRange(int upper, int lower) {
        // 省略构造函数实现
        }
    }

    final AtomicReference<WMRange>
            rf = new AtomicReference<>(
            new WMRange(0, 0)
    );

    // 设置库存上限
    void setUpper(int v) {
        WMRange nr;
        WMRange or = rf.get();
        do {
            // 检查参数合法性
            if (v < or.lower) {
                throw new IllegalArgumentException();
            }
            nr = new
                    WMRange(v, or.lower);
        } while (!rf.compareAndSet(or, nr));
    }
}
```

or是原始的 nr是new出来的 指向不同的内存地址 compareandset的结果永远返回false 结果是死循环？

```java
public class SafeWM {
class WMRange{
final int upper;
final int lower;
WMRange(int upper,int lower){
//省略构造函数实现
}
}
final AtomicReference<WMRange>
rf = new AtomicReference<>(
new WMRange(0,0)
);
// 设置库存上限
void setUpper(int v){
WMRange nr;
WMRange or;
//原代码在这⾥
//WMRange or=rf.get();
do{
//移动到此处
//每个回合都需要重新获取旧值
or = rf.get();
// 检查参数合法性
if(v < or.lower){
throw new IllegalArgumentException();
}
nr = new
WMRange(v, or.lower);
}while(!rf.compareAndSet(or, nr));
}
}
```



## 22-Executor与线程池：如何创建正确的线程池？

```java
//简化的线程池，仅⽤来说明⼯作原理
public class MyThreadPool {
    //
    BlockingQueue<Runnable> workQueue;
    //
    List<WorkerThread> threads = new ArrayList<>();

    //


    public MyThreadPool(int poolSize, BlockingQueue<Runnable> workQueue) {
        this.workQueue = workQueue;
        //
        for (int i = 0; i < poolSize; i++) {
            WorkerThread workerThread = new WorkerThread();
            workerThread.start();
            threads.add(workerThread);
        }
    }

    void execute(Runnable command) throws InterruptedException {
        workQueue.put(command);
    }

    // workthread
    class WorkerThread extends Thread {
        @SneakyThrows
        @Override
        public void run() {
            //
            while (true) {
                Runnable task = workQueue.take();
                task.run();
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        //
        BlockingQueue<Runnable> workQueue = new LinkedBlockingQueue<>(2);
        //
        MyThreadPool myThreadPool = new MyThreadPool(10, workQueue);
        myThreadPool.execute(() -> {
            System.out.println("fuck");
        });
    }
}
```

### 课后思考

使用线程池，默认情况下创建的线程名字都类似pool-1-thread-2这样，没有业务含义。而很多情况下为了便于诊断问题，都需要给线程赋予一个有意义的名字，那你知道有哪些办法可以给线程池里的线程指定名字吗？

## 23-Future：如何用多线程实现最优的“烧水泡茶”程序？

那如何使用FutureTask呢？其实很简单，FutureTask实现了Runnable和Future接口，由于实现了Runnable接口，所以可以将FutureTask对象作为任务提交给ThreadPoolExecutor去执行，也可以直接被Thread执行；又因为实现了Future接口，所以也能用来获得任务的执行结果。下面的示例代码是将FutureTask对象提
交给ThreadPoolExecutor去执行。

```java
@Slf4j
public class PaoCha {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
//        BasicConfigurator.configure();


    }

    @Test
    public void name() throws ExecutionException, InterruptedException {
        FutureTask<String> ft2 = new FutureTask<>(new T2Task());
        FutureTask<String> ft1 = new FutureTask<>(new T1Task(ft2));
        Thread t1 = new Thread(ft1);
        t1.start();
        Thread t2 = new Thread(ft2);
        t2.start();
        log.info("fuck");
        log.info(ft1.get());
    }

    static class T1Task implements Callable<String> {

        FutureTask<String> ft2;

        T1Task(FutureTask<String> ft2) {
            this.ft2 = ft2;
        }

        @Override
        public String call() throws Exception {
            log.info("T2.洗水壶...");
            TimeUnit.SECONDS.sleep(1);
            log.info("T2.烧开水...");
            TimeUnit.SECONDS.sleep(1);
            // 获取T2线程的茶叶
            String tf = ft2.get();

            log.info("T1.拿到茶叶...{}", tf);
            log.info("T1 泡茶");
            TimeUnit.SECONDS.sleep(1);
            return "上茶" + tf;
        }
    }

    static class T2Task implements Callable<String> {

        @Override
        public String call() throws Exception {
            log.info("T2.洗茶壶...");
            TimeUnit.SECONDS.sleep(1);
            log.info("T2.洗茶杯...");
            TimeUnit.SECONDS.sleep(1);
            log.info("T2.拿茶叶...");
            TimeUnit.SECONDS.sleep(1);
            return "龙井";
        }
    }
}
```

课后思考
不久前听说小明要做一个询价应用，这个应用需要从三个电商询价，然后保存在自己的数据库里。核心示例代码如下所示，由于是串行的，所以性能很慢，你来试着优化一下吧。

```java
// 向电商S1询价，并保存
r1 = getPriceByS1();
save(r1);
// 向电商S2询价，并保存
r2 = getPriceByS2();
// 向电商S3询价，并保存
r3 = getPriceByS3();
```

现在是在主线程串行完成3个询价的任务，执行第一个任务，其它2个任务只能等待执行，如果要提高效率，这个地方需要改进，可以用老师今天讲的futuretask，三个询价任务改成futuretask并行执行，效率会提高

## 24-CompletableFuture：异步编程没那么难

CompletableFuture的核心优势 

分工、协作和互斥

```java
@Slf4j
public class PaoCha {
    @Test
    public void Test1() {
        // task 1 spoil
        CompletableFuture<Void> f1 = CompletableFuture.runAsync(() -> {
            log.info("T2.洗水壶...");
            sleep(1, TimeUnit.SECONDS);
            log.info("T2.烧开水...");
            sleep(1, TimeUnit.SECONDS);
        });
        
        // task 2 get tea
        CompletableFuture<String> f2 = CompletableFuture.supplyAsync(() -> {
            log.info("T2.洗茶壶...");
            sleep(1,TimeUnit.SECONDS);
            log.info("T2.洗茶杯...");
            sleep(1,TimeUnit.SECONDS);
            log.info("T2.拿茶叶...");
            sleep(1,TimeUnit.SECONDS);
            return "龙井";
        });
        // task 3 after 1 and 2 spoil tea
        CompletableFuture<String> f3 = f1.thenCombine(f2, (unused, tf) -> {
            log.info("T1,拿到茶叶{}", tf);
            log.info("T1.泡茶");
            return "上茶:" + tf;
        });
        
        log.info(f3.join());

    }

    void sleep(int t, TimeUnit u) {
        try {
            u.sleep(t);
        }catch(InterruptedException e){}
    }
}
```

**根据不同的业务类型创建不同的线程池，以避免互相干扰。**

### 如何理解CompletionStage接口

#### 1. 描述串行关系

thenApply、thenAccept、thenRun和thenCompose

```java
@Test
public void Test2() {
    CompletableFuture<String> f0 = CompletableFuture.supplyAsync(() -> {
                return "Hello World";
            })
            .thenApply(s -> s + "QQ")
            .thenApply(String::toUpperCase);
    log.info(f0.join());
}
```

#### 2. 描述AND汇聚关系

#### 3. 描述OR汇聚关系

```java
@Test
public void Test3() {
    CompletableFuture<String> f1 = CompletableFuture.supplyAsync(() -> {
        int t = getRandom(5, 10);
        sleep(t, TimeUnit.SECONDS);
        return String.valueOf(t);
    });

    CompletableFuture<String> f2 = CompletableFuture.supplyAsync(() -> {
        int t = getRandom(5, 10);
        sleep(t, TimeUnit.SECONDS);
        return String.valueOf(t);
    });

    CompletableFuture<String> f3 = f1.applyToEither(f2, s -> s);

    log.info(f3.join());
}

private int getRandom(int i, int i1) {
    ThreadLocalRandom random1 = RandomUtil.getRandom();
    return random1.nextInt(i, i1);
}
```

#### 4. 异常处理

### 课后思考

创建采购订单的时候，需要校验一些规则，例如最大金额是和采购员级别相关的。有同学利用CompletableFuture实现了这个校验的功能，逻辑很简单，首先是从数据库中把相关规则查出来，然后执行规则校验。你觉得他的实现是否有问题呢？

```java
//采购订单
PurchersOrder po;
CompletableFuture<Boolean> cf =
CompletableFuture.supplyAsync(()->{
//在数据库中查询规则
return findRuleByJdbc();
}).thenApply(r -> {
//规则校验
return check(po, r);
});
Boolean isOk = cf.join();
```

findRuleByJdbc()这个方法
隐藏着一个阻塞式I/O，这意味着会阻塞调用线程。默认情况下所有的CompletableFuture共享一个
ForkJoinPool，当有阻塞式I/O时，可能导致所有的ForkJoinPool线程都阻塞，进而影响整个系统的性能。

利用共享，往往能让我们快速实现功能，所谓是有福同享，但是代价就是有难要同当。在强调高可用的今
天，大多数人更倾向于使用隔离的方案。

## 25-CompletionService：如何批量执行异步任务？

### 课后思考

本章使用CompletionService实现了一个询价应用的核心功能，后来又有了新的需求，需要计算出最低报价
并返回，下面的示例代码尝试实现这个需求，你看看是否存在问题呢？

```java
// 创建线程池
ExecutorService executor =
Executors.newFixedThreadPool(3);
// 创建CompletionService
CompletionService<Integer> cs = new
ExecutorCompletionService<>(executor);
// 异步向电商S1询价
cs.submit(()->getPriceByS1());
// 异步向电商S2询价
cs.submit(()->getPriceByS2());
// 异步向电商S3询价
cs.submit(()->getPriceByS3());
// 将询价结果异步保存到数据库
// 并计算最低报价
AtomicReference<Integer> m =
new AtomicReference<>(Integer.MAX_VALUE);
for (int i=0; i<3; i++) {
executor.execute(()->{
Integer r = null;
try {
r = cs.take().get();
} catch (Exception e) {}
save(r);
m.set(Integer.min(m.get(), r));
});
}
return m;
```

1.AtomicReference<Integer>的get方法应该改成使用cas方法

2.最后筛选最小结果的任务是异步执行的，应该在return之前做同步，所以最好使用sumit提交该任务便
于判断任务的完成

## 26-ForkJoin：单机版的MapReduce

对于简单的并行任务，你可以通过“线程池+Future”的方案来解决；如果任务之间有聚合关系，无论是AND聚合还是OR聚合，都可以通过CompletableFuture来解决；而批量的并行任务，则可以通过CompletionService来解决。

### 分治任务模型

### Fork/Join的使用

```java
@Slf4j
public class ForkJoinTest {
    public static void main(String[] args) {
        // create Divide and conquer task thread pool
        ForkJoinPool fjp = new ForkJoinPool(4);
        // create Divide and conquer task
        Fibonacci fib = new Fibonacci(30);
        // start task
        Integer result = fjp.invoke(fib);
        log.info(String.valueOf(result));

    }

    static class Fibonacci extends RecursiveTask<Integer> {

        final int n;

        public Fibonacci(int n) {
            this.n = n;
        }

        @Override
        protected Integer compute() {
            if (n <= 1) {
                return n;
            }
            Fibonacci f1 = new Fibonacci(n - 1);
            // create child task
            f1.fork();
            Fibonacci f2 = new Fibonacci(n - 2);
            // wait the result of child task ,and combine result
            return f2.compute() + f1.join();
        }
    }
}
```

### 模拟MapReduce统计单词数量

```java
@Slf4j
public class CountWord {

    public static void main(String[] args) {
        String[] fc = {"hello world",
                "hello me",
                "hello fork",
                "hello join",
                "fork join in world"};
        // create fork join thread pool 
        ForkJoinPool fjp = new ForkJoinPool(3);
        // create task
        MR mr = new MR(fc, 0, fc.length);
        // start task
        Map<String, Long> result = fjp.invoke(mr);
        // sout result
        result.forEach((k, v) -> {
            log.info("{}:{}",k, v);
        });

    }

    static class MR extends RecursiveTask<Map<String, Long>> {
        private String[] fc;
        private int start, end;

        public MR(String[] fc, int start, int end) {
            this.fc = fc;
            this.start = start;
            this.end = end;
        }

        @Override
        protected Map<String, Long> compute() {
            if (end - start == 1) {
                return calc(fc[start]);
            } else {
                int mid = (start + end) / 2;
                MR mr1 = new MR(fc, start, mid);
                mr1.fork();
                MR mr2 = new MR(fc, mid, end);
                // compute child task and return combine count
                return merge(mr2.compute(), mr1.join());

            }

        }

        private Map<String, Long> merge(Map<String, Long> r1, Map<String, Long> r2) {
            Map<String, Long> result = new HashMap<>(r1);
            // merge result
            r2.forEach((k, v) -> result.merge(k, v, Long::sum));
            return result;
        }

        private Map<String, Long> calc(String line) {
            Map<String, Long> result = new HashMap<>();
            // divide word
            String[] words = line.split("\\s+");
            // count words
            for (String word : words) {
                Long v = result.get(word);
                if (v != null) {
                    result.put(word, v + 1);
                } else {
                    result.put(word, 1L);
                }
            }
            return result;
        }
    }

}
```

### 总结

Fork/Join并行计算框架主要解决的是分治任务。分治的核心思想是“分而治之”：将一个大的任务拆分成小的子任务去解决，然后再把子任务的结果聚合起来从而得到最终结果。这个过程非常类似于大数据处理中的MapReduce，所以你可以把Fork/Join看作单机版的MapReduce。

Fork/Join并行计算框架的核心组件是ForkJoinPool。ForkJoinPool支持任务窃取机制，能够让所有线程的工作量基本均衡，不会出现有的线程很忙，而有的线程很闲的状况，所以性能很好。Java 1.8提供的StreamAPI里面并行流也是以ForkJoinPool为基础的。不过需要你注意的是，默认情况下所有的并行流计算都共享一个ForkJoinPool，这个共享的ForkJoinPool默认的线程数是CPU的核数；如果所有的并行流计算都是CPU密集型计算的话，完全没有问题，但是如果存在I/O密集型的并行流计算，那么很可能会因为一个很慢的I/O计算而拖慢整个系统的性能。所以建议用不同的ForkJoinPool执行不同类型的计算任务。

## 27-并发工具类模块热点问题答疑
