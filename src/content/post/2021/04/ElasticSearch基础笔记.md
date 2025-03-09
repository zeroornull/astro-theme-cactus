---
title: "ElasticSearch基础笔记"
description: "ElasticSearch基础笔记"
publishDate: 2021-04-13T14:30:00+08:00
updatedDate: "2025-03-09T14:30:00+08:00"
tags: ["ElasticSearch"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---

# ES

个人使用环境为 es7.12

## 1.ElasticSearch 核心概念介绍

### 4.1 ElasticSearch 十大核心概念

#### 4.1.1 集群（Cluster）

一个或者多个安装了 es 节点的服务器组织在一起，就是集群，这些节点共同持有数据，共同提供搜索服务。

一个集群有一个名字，这个名字是集群的唯一标识，该名字成为 cluster name，默认的集群名称是 elasticsearch，具有相同名称的节点才会组成一个集群。

可以在 config/elasticsearch.yml 文件中配置集群名称：

```
cluster.name: javaboy-es
```

在集群中，节点的状态有三种：绿色、黄色、红色：

- 绿色：节点运行状态为健康状态。所有的主分片、副本分片都可以正常工作。
- 黄色：表示节点的运行状态为警告状态，所有的主分片目前都可以直接运行，但是至少有一个副本分片是不能正常工作的。
- 红色：表示集群无法正常工作。

#### 4.1.2 节点（Node）

集群中的一个服务器就是一个节点，节点中会存储数据，同时参与集群的索引以及搜索功能。一个节点想要加入一个集群，只需要配置一下集群名称即可。默认情况下，如果我们启动了多个节点，多个节点还能够互相发现彼此，那么它们会自动组成一个集群，这是 es 默认提供的，但是这种方式并不可靠，有可能会发生脑裂现象。所以在实际使用中，建议一定手动配置一下集群信息。

#### 4.1.3 索引（Index）

索引可以从两方面来理解：

**名词**

具有相似特征文档的集合。

**动词**

索引数据以及对数据进行索引操作。

#### 4.1.4 类型（Type）

类型是索引上的逻辑分类或者分区。在 es6 之前，一个索引中可以有多个类型，从 es7 开始，一个索引中，只能有一个类型。在 es6.x 中，依然保持了兼容，依然支持单 index 多个 type 结构，但是已经不建议这么使用。

#### 4.1.5 文档（Document）

一个可以被索引的数据单元。例如一个用户的文档、一个产品的文档等等。文档都是 JSON 格式的。

#### 4.1.6 分片（Shards）

索引都是存储在节点上的，但是受限于节点的空间大小以及数据处理能力，单个节点的处理效果可能不理想，此时我们可以对索引进行分片。当我们创建一个索引的时候，就需要指定分片的数量。每个分片本身也是一个功能完善并且独立的索引。

默认情况下，一个索引会自动创建 1 个分片，并且为每一个分片创建一个副本。

#### 4.1.7 副本（Replicas）

副本也就是备份，是对主分片的一个备份。

#### 4.1.8 Settings

集群中对索引的定义信息，例如索引的分片数、副本数等等。

#### 4.1.9 Mapping

Mapping 保存了定义索引字段的存储类型、分词方式、是否存储等信息。

#### 4.1.10 Analyzer

字段分词方式的定义。

### 4.2 ElasticSearch Vs 关系型数据库

| 关系型数据库          | ElasticSearch                 |
| :-------------------- | :---------------------------- |
| 数据库                | 索引                          |
| 表                    | 类型                          |
| 行                    | 文档                          |
| 列                    | 字段                          |
| 表结构                | 映射（Mapping）               |
| SQL                   | DSL(Domain Specific Language) |
| Select * from xxx     | GET http://                   |
| update xxx set xx=xxx | PUT http://                   |
| Delete xxx            | DELETE http://                |
| 索引                  | 全文索引                      |

## 2.ElasticSearch 分词器

### 1.1 内置分词器

ElasticSearch 核心功能就是数据检索，首先通过索引将文档写入 es。查询分析则主要分为两个步骤：

1. 词条化：**分词器**将输入的文本转为一个一个的词条流。
2. 过滤：比如停用词过滤器会从词条中去除不相干的词条（的，嗯，啊，呢）停用词；另外还有同义词过滤器、小写过滤器等。

ElasticSearch 中内置了多种分词器可以供使用。

内置分词器：

| 分词器               | 作用                                                       |
| :------------------- | :--------------------------------------------------------- |
| Standard Analyzer    | 标准分词器，适用于英语等。                                 |
| Simple Analyzer      | 简单分词器，基于非字母字符进行分词，单词会被转为小写字母。 |
| Whitespace Analyzer  | 空格分词器。按照空格进行切分。                             |
| Stop Analyzer        | 类似于简单分词器，但是增加了停用词的功能。                 |
| Keyword Analyzer     | 关键词分词器，输入文本等于输出文本。                       |
| Pattern Analyzer     | 利用正则表达式对文本进行切分，支持停用词。                 |
| Language Analyzer    | 针对特定语言的分词器。                                     |
| Fingerprint Analyzer | 指纹分析仪分词器，通过创建标记进行重复检测。               |

### 1.2 中文分词器

在 Es 中，使用较多的中文分词器是 elasticsearch-analysis-ik，这个是 es 的一个第三方插件，代码托管在 GitHub 上：

- https://github.com/medcl/elasticsearch-analysis-ik

#### 1.2.1 安装

两种使用方式：

**第一种：**

1. 首先打开分词器官网：https://github.com/medcl/elasticsearch-analysis-ik。
2. 在 https://github.com/medcl/elasticsearch-analysis-ik/releases 页面找到最新的正式版，下载下来。我们这里的下载链接是 https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.9.3/elasticsearch-analysis-ik-7.9.3.zip。
3. 将下载文件解压。
4. 在 es/plugins 目录下，新建 ik 目录，并将解压后的所有文件拷贝到 ik 目录下。
5. 重启 es 服务。

**第二种：**

```
./bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.9.3/elasticsearch-analysis-ik-7.9.3.zip
```

#### 1.2.2 测试

es 重启成功后，首先创建一个名为 test 的索引：

![image-20210409154614421](https://b2files.173114.xyz/blogimg/image-20210409154614421.png)

接下来，在该索引中进行分词测试：

![image-20210409154701047](https://b2files.173114.xyz/blogimg/image-20210409154701047.png)

#### 1.2.3 自定义扩展词库

##### 1.2.3.1 本地自定义

在 es/plugins/ik/config 目录下，新建 ext.dic 文件（文件名任意），在该文件中可以配置自定义的词库。

![img](https://b2files.173114.xyz/blogimg/20201103214857.png)

如果有多个词，换行写入新词即可。

然后在 es/plugins/ik/config/IKAnalyzer.cfg.xml 中配置扩展词典的位置：

![img](https://b2files.173114.xyz/blogimg/20201103215035.png)

##### 1.2.3.2 远程词库

也可以配置远程词库，远程词库支持热更新（不用重启 es 就可以生效）。

热更新只需要提供一个接口，接口返回扩展词即可。

具体使用方式如下，新建一个 Spring Boot 项目，引入 Web 依赖即可。然后在 resources/stastic 目录下新建 ext.dic 文件，写入扩展词：

![img](https://b2files.173114.xyz/blogimg/20201103215946.png)

接下来，在 es/plugins/ik/config/IKAnalyzer.cfg.xml 文件中配置远程扩展词接口：

![img](https://b2files.173114.xyz/blogimg/20201103220041.png)

配置完成后，重启 es ，即可生效。

热更新，主要是响应头的 `Last-Modified` 或者 `ETag` 字段发生变化，ik 就会自动重新加载远程扩展辞典。

## 3. ElasticSearch 索引管理

启动一个 master 节点和两个 slave 节点进行测试。

### 2.1 新建索引

#### 2.1.1 通过 head 插件新建索引

在 head 插件中，选择 索引选项卡，然后点击新建索引。新建索引时，需要填入索引名称、分片数以及副本数。

![img](https://b2files.173114.xyz/blogimg/20201104190359.png)

索引创建成功后，如下图：

![img](https://b2files.173114.xyz/blogimg/20201104190534.png)

0、1、2、3、4 分别表示索引的分片，粗框表示主分片，细框表示副本（点一下框，通过 primary 属性可以查看是主分片还是副本）。.kibana 索引只有一个分片和一个副本，所以只有 0。

#### 2.1.2 通过请求创建

可以通过 postman 发送请求，也可以通过 kibana 发送请求，由于 kibana 有提示，所以这里采用 kibana。

创建索引请求：

```
PUT book
```

创建成功后，可以查看索引信息：

![img](https://b2files.173114.xyz/blogimg/20201104191119.png)

需要注意两点：

- 索引名称不能有大写字母

![img](https://b2files.173114.xyz/blogimg/20201104191326.png)

- 索引名是唯一的，不能重复，重复创建会出错

![img](https://b2files.173114.xyz/blogimg/20201104191248.png)

### 2.2 更新索引

索引创建好之后，可以修改其属性。

例如修改索引的副本数：

```
PUT book/_settings
{
  "number_of_replicas": 2
}
```

修改成功后，如下：

![img](https://b2files.173114.xyz/blogimg/20201104191605.png)

更新分片数也是一样。

### 2.3 修改索引的读写权限

索引创建成功后，可以向索引中写入文档：

```
PUT book/_doc/1
{
  "title":"三国演义"
}
```

写入成功后，可以在 head 插件中查看：

![img](https://b2files.173114.xyz/blogimg/20201104191935.png)

默认情况下，索引是具备读写权限的，当然这个读写权限可以关闭。

例如，关闭索引的写权限：

```
PUT book/_settings
{
  "blocks.write": true
}
```

关闭之后，就无法添加文档了。关闭了写权限之后，如果想要再次打开，方式如下：

```
PUT book/_settings
{
  "blocks.write": false
}
```

其他类似的权限有：

- blocks.write
- blocks.read
- blocks.read_only

### 2.4 查看索引

head 插件查看方式如下：

![img](https://b2files.173114.xyz/blogimg/20201104192419.png)

请求查看方式如下：

```
GET book/_settings
```

也可以同时查看多个索引信息：

```
GET book,test/_settings
```

也可以查看所有索引信息：

```
GET book,test/_settings
```

### 2.5 删除索引

head 插件可以删除索引：

![img](https://b2files.173114.xyz/blogimg/20201104192729.png)

请求删除如下：

```
DELETE test
```

删除一个不存在的索引会报错。

### 5.6 索引打开/关闭

关闭索引：

```
POST book/_close
```

打开索引：

```
POST book/_open
```

当然，可以同时关闭/打开多个索引，多个索引用 , 隔开，或者直接使用 _all 代表所有索引。

### 2.7 复制索引

索引复制，只会复制数据，不会复制索引配置。

```
POST _reindex
{
  "source": {"index":"book"},
  "dest": {"index":"book_new"}
}
```

复制的时候，可以添加查询条件。

### 2.8 索引别名

可以为索引创建别名，如果这个别名是唯一的，该别名可以代替索引名称。

```
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "book",
        "alias": "book_alias"
      }
    }
  ]
}
```

添加结果如下：

![img](https://b2files.173114.xyz/blogimg/20201104193751.png)

将 add 改为 remove 就表示移除别名：

```
POST /_aliases
{
  "actions": [
    {
      "remove": {
        "index": "book",
        "alias": "book_alias"
      }
    }
  ]
}
```

查看某一个索引的别名：

```
GET /book/_alias
```

查看某一个别名对应的索引（book_alias 表示一个别名）：

```
GET /book_alias/_alias
```

可以查看集群上所有可用别名：

```
GET /_alias
```

## 6.ElasticSearch 文档基本操作

### 6.1创建文档

首先新建一个索引 blog

然后向索引添加一个文档

```
PUT blog/_doc/1
{
  "title":"ElasticSearch 文档基本操作",
  "data":"2021-04-09",
  "content":"### 6.1创建文档首先新建一个索引 blog"
}
```

1 表示新建文档的id

添加成功后响应的json如下：

```
{
  "_index" : "blog",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 1,
  "result" : "created",
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "_seq_no" : 0,
  "_primary_term" : 1
}

```

- _index 表示文档的索引。
- _type 表示文档的类型。
- _id 表示文档的id。
- _version 表示文档的版本(更新文档，版本会自动+1，针对一个文档的更新)。
- result 表示执行结果。
- _shards 表示分片信息。
- `_seq_no`  `_primary_term` 这两个也是版本控制用的(针对当前index)

添加成功后可以添加查看的文档：

![image-20210409174420672](https://b2files.173114.xyz/blogimg/image-20210409174420672.png)

添加文档是也可以不指定id，此时系统会默认给出一个id，如果不指定id，则需要使用POST请求，而不能使用PUT请求

```
{
  "error" : "Incorrect HTTP method for uri [/blog/_doc?pretty=true] and method [PUT], allowed: [POST]",
  "status" : 405
}
```

```
{
"_index": "blog",
"_type": "_doc",
"_id": "5zULtngB3KliN6uQB99S",
"_version": 1,
"_score": 1,
"_source": {
"title": "666",
"data": "2021-04-09",
"content": "### 6.1创建文档首先新建一个索引 blog"
}
}
```

### 6.2获取文档

Es 中提供了GET API来查看存储在es中的文档。使用方式如下

```
GET blog/_doc/5zULtngB3KliN6uQB99S
```

上面的命令表示获取id为 5zULtngB3KliN6uQB99S 的文档。

如果获取不存在的文档，会返回如下信息

```
{
  "_index" : "blog",
  "_type" : "_doc",
  "_id" : "2",
  "found" : false
}
```

如果仅仅只是想探测某个文档是否存在，可以使用head请求：

不存在的响应

![image-20210409181128130](https://b2files.173114.xyz/blogimg/image-20210409181128130.png)

存在的响应

![image-20210409181136903](https://b2files.173114.xyz/blogimg/image-20210409181136903.png)

也可以批量获取文档

```
GET blog/_mget
{
  "ids":["1","5zULtngB3KliN6uQB99S"]
}
```

GET 请求携带了请求体？

某些特定请求，例如JS的HTTP请求库是不允许存在GET请求有请求体的，实际上在RFC7231文档中，并没有规定GET请求的请求体改如何处理，这造成了一定程度的混乱，有的HTTP服务器支持GET请求携带请求体，有的HTTP服务器则不支持。虽然ES工程师倾向于使用GET做查询，但是为了保证兼容性，ES同时也支持使用POST，例如上面的的批量查询案例也可以使用POST请求。

### 6.3文档更新

文档更新一次，version就会自增1。

可以直接更新整个文档

```
PUT blog/_doc/5zULtngB3KliN6uQB99S
{
  "title":"666"
}
```

这总方式，更新的文档会覆盖掉原有的文档

只想更新文档字段，可以通过脚本来实现

```
POST blog/_update/1
{
  "script": {
    "lang":"painless",
    "source":"ctx._source.title=params.title",
    "params":{
      "title":"666666"
    }
  }
}
```

更新的请求格式：POST{index}/_update/{id}

在脚本中lang表示脚本语言,painless是es内置的一种脚本语言，source表示具体执行的脚本，ctx是一个上下文对象，通过ctx可以访问到`_source`、`_title`等。

也可以通过同样的方式向文档中添加字段

```
POST blog/_update/1
{
  "script": {
    "lang": "painless",
    "source": "ctx._source.tags=[\"java\",\"php\"]"
  }
}
```

成功后的文档如下

```
{
  "_index" : "blog",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 3,
  "_seq_no" : 2,
  "_primary_term" : 1,
  "found" : true,
  "_source" : {
    "title" : "666666",
    "data" : "2021-04-09",
    "content" : "### 6.1创建文档首先新建一个索引 blog",
    "tags" : [
      "java",
      "php"
    ]
  }
}

```

## 7.ElasticSearch 文档路由

es 是一个分布式系统，当我们存储一个文档到 es 上之后，这个文档实际上是被存储到 master 节点中的某一个主分片上。

例如新建一个索引，该索引有两个分片，0个副本，如下：

![image-20210412181413857](https://b2files.173114.xyz/blogimg/image-20210412181413857.png)

接下来，向该索引中保存一个文档：

```
PUT blog/_doc/a
{
  "title":"a"
}
```

文档保存成功后，可以查看该文档被保存到哪个分片中去了：

```
GET _cat/shards/blog?v
```

查看结果如下：

```
index shard prirep state   docs store ip        node
blog  1     p      STARTED    0  208b 127.0.0.1 master
blog  0     p      STARTED    0  208b 127.0.0.1 slave02
```

从这个结果中，可以看出，文档被保存到分片 0 中。

那么 es 中到底是按照什么样的规则去分配分片的？

es 中的路由机制是通过哈希算法，将具有相同哈希值的文档放到一个主分片中，分片位置的计算方式如下：

shard=hash(routing) % number_of_primary_shards

routing 可以是一个任意字符串，es 默认是将文档的 id 作为 routing 值，通过哈希函数根据 routing 生成一个数字，然后将该数字和分片数取余，取余的结果就是分片的位置。

默认的这种路由模式，最大的优势在于负载均衡，这种方式可以保证数据平均分配在不同的分片上。但是他有一个很大的劣势，就是查询时候无法确定文档的位置，此时它会将请求广播到所有的分片上去执行。另一方面，使用默认的路由模式，后期修改分片数量不方便。

当然开发者也可以自定义 routing 的值，方式如下：

```
PUT blog/_doc/d?routing=javaboy
{
 "title":"d"
}
```

如果文档在添加时指定了 routing，则查询、删除、更新时也需要指定 routing。

```
GET blog/_doc/d?routing=javaboy
```

自定义 routing 有可能会导致负载不均衡，这个还是要结合实际情况选择。

典型场景：

对于用户数据，我们可以将 userid 作为 routing，这样就能保证同一个用户的数据保存在同一个分片中，检索时，同样使用 userid 作为 routing，这样就可以精准的从某一个分片中获取数据。

## 8.ElasticSearch 并发的处理方式：锁和版本控制

当我们使用 es 的 API 去进行文档更新时，它首先读取原文档出来，然后对原文档进行更新，更新完成后再重新索引整个文档。不论你执行多少次更新，最终保存在 es 中的是最后一次更新的文档。但是如果有两个线程同时去更新，就有可能出问题。

要解决问题，就是锁。

### 8.1 锁

**悲观锁**

很悲观，每一次去读取数据的时候，都认为别人可能会修改数据，所以屏蔽一切可能破坏数据完整性的操作。关系型数据库中，悲观锁使用较多，例如行锁、表锁等等。

**乐观锁**

很乐观，每次读取数据时，都认为别人不会修改数据，因此也不锁定数据，只有在提交数据时，才会检查数据完整性。这种方式可以省去锁的开销，进而提高吞吐量。

在 es 中，实际上使用的就是乐观锁。

### 8.2 版本控制

**es6.7之前**

在 es6.7 之前，使用 version+version_type 来进行乐观并发控制。根据前面的介绍，文档每被修改一个，version 就会自增一次，es 通过 version 字段来确保所有的操作都有序进行。

version 分为内部版本控制和外部版本控制。

#### 8.2.1 内部版本

es 自己维护的就是内部版本，当创建一个文档时，es 会给文档的版本赋值为 1。

每当用户修改一次文档，版本号就回自增 1。

如果使用内部版本，es 要求 version 参数的值必须和 es 文档中 version 的值相当，才能操作成功。

#### 8.2.2 外部版本

也可以维护外部版本。

在添加文档时，就指定版本号：

```
PUT blog/_doc/1?version=200&version_type=external
{
  "title":"2222"
}
```

以后更新的时候，版本要大于已有的版本号。

- version_type=external 或者 version_type=external_gt 表示以后更新的时候，版本要大于已有的版本号。
- version_type=external_gte 表示以后更新的时候，版本要大于等于已有的版本号。

#### 8.2.3 最新方案（Es6.7 之后）

现在使用 `if_seq_no` 和 `if_primary_term` 两个参数来做并发控制。

`seq_no` 不属于某一个文档，它是属于整个索引的（version 则是属于某一个文档的，每个文档的 version 互不影响）。现在更新文档时，使用 `seq_no` 来做并发。由于 `seq_no` 是属于整个 index 的，所以任何文档的修改或者新增，`seq_no` 都会自增。

现在就可以通过 `seq_no` 和 `primary_term` 来做乐观并发控制。

```
PUT blog/_doc/2?if_seq_no=5&if_primary_term=1
{
  "title":"6666"
}
```

## es倒排索引

倒排索引是 es 中非常重要的索引结构，是从**文档词项到文档 ID** 的一个映射过程。

### 8.1 "正排索引"

我们在关系型数据库中见到的索引，就是“正排索引”。

关系型数据库中的索引如下，假设我有一个博客表：

![image-20210413103142558](https://b2files.173114.xyz/blogimg/image-20210413103142558.png)

我们可以针对这个表建立索引（正排索引）：

![image-20210413103153966](https://b2files.173114.xyz/blogimg/image-20210413103153966.png)

当我们通过 id 或者标题去搜索文章时，就可以快速搜到。

但是如果我们按照文章内容的关键字去搜索，就只能去内容中做字符匹配了。为了提高查询效率，就要考虑使用倒排索引。

### 8.2 倒排索引

倒排索引就是以内容的关键字建立索引，通过索引找到文档 id，再进而找到整个文档。

![image-20210413103208875](https://b2files.173114.xyz/blogimg/image-20210413103208875.png)

一般来说，倒排索引分为两个部分：

- 单词词典（记录所有的文档词项，以及词项到倒排列表的关联关系）
- 倒排列表（记录单词与对应的关系，由一系列倒排索引项组成，倒排索引项指：文档 id、词频（TF）（词项在文档中出现的次数，评分时使用）、位置（Position，词项在文档中分词的位置）、偏移（记录词项开始和结束的位置））

当我们去索引一个文档时，就回建立倒排索引，搜索时，直接根据倒排索引搜索。

## 9.ElasticSearch 动态映射与静态映射

映射就是 Mapping，它用来定义一个文档以及文档所包含的字段该如何被存储和索引。所以，它其实有点类似于关系型数据库中表的定义。

### 9.1 映射分类

**动态映射**

顾名思义，就是自动创建出来的映射。es 根据存入的文档，自动分析出来文档中字段的类型以及存储方式，这种就是动态映射。

举一个简单例子，新建一个索引，然后查看索引信息：

![image-20210413114335205](https://b2files.173114.xyz/blogimg/image-20210413114335205.png)

在创建好的索引信息中，可以看到，mappings 为空，这个 mappings 中保存的就是映射信息。

现在我们向索引中添加一个文档，如下：

```
PUT blog/_doc/1
{
  "title":"1111",
  "date":"2020-11-11"
}
```

文档添加成功后，就会自动生成 Mappings：

![image-20210413132456894](https://b2files.173114.xyz/blogimg/image-20210413132456894.png)

可以看到，date 字段的类型为 date，title 的类型有两个，text 和 keyword。

默认情况下，文档中如果新增了字段，mappings 中也会自动新增进来。

有的时候，如果希望新增字段时，能够抛出异常来提醒开发者，这个可以通过 mappings 中 dynamic 属性来配置。

dynamic 属性有三种取值：

- true，默认即此。自动添加新字段。
- false，忽略新字段。
- strict，严格模式，发现新字段会抛出异常。

具体配置方式如下，创建索引时指定 mappings（这其实就是静态映射）：

```
PUT blog
{
  "mappings": {
    "dynamic":"strict",
    "properties": {
      "title":{
        "type": "text"
      },
      "age":{
        "type":"long"
      }
    }
  }
}
```

然后向 blog 中索引中添加数据：

```
PUT blog/_doc/2
{
  "title":"1111",
  "date":"2020-11-11",
  "age":99
}
```

在添加的文档中，多出了一个 date 字段，而该字段没有预定义，所以这个添加操作就回报错：

```
{
  "error" : {
    "root_cause" : [
      {
        "type" : "strict_dynamic_mapping_exception",
        "reason" : "mapping set to strict, dynamic introduction of [date] within [_doc] is not allowed"
      }
    ],
    "type" : "strict_dynamic_mapping_exception",
    "reason" : "mapping set to strict, dynamic introduction of [date] within [_doc] is not allowed"
  },
  "status" : 400
}
```

动态映射还有一个日期检测的问题。

例如新建一个索引，然后添加一个含有日期的文档，如下：

```
PUT blog/_doc/1
{
  "remark":"2020-11-11"
}
```

添加成功后，remark 字段会被推断是一个日期类型。

![image-20210413132716160](https://b2files.173114.xyz/blogimg/image-20210413132716160.png)

此时，remark 字段就无法存储其他类型了。

```
PUT blog/_doc/1
{
  "remark":"javaboy"
}
```

此时报错如下：

```
{
  "error" : {
    "root_cause" : [
      {
        "type" : "mapper_parsing_exception",
        "reason" : "failed to parse field [remark] of type [date] in document with id '1'. Preview of field's value: 'javaboy'"
      }
    ],
    "type" : "mapper_parsing_exception",
    "reason" : "failed to parse field [remark] of type [date] in document with id '1'. Preview of field's value: 'javaboy'",
    "caused_by" : {
      "type" : "illegal_argument_exception",
      "reason" : "failed to parse date field [javaboy] with format [strict_date_optional_time||epoch_millis]",
      "caused_by" : {
        "type" : "date_time_parse_exception",
        "reason" : "Failed to parse with all enclosed parsers"
      }
    }
  },
  "status" : 400
}
```

要解决这个问题，可以使用静态映射，即在索引定义时，将 remark 指定为 text 类型。也可以关闭日期检测。

```
PUT blog
{
  "mappings": {
    "date_detection": false
  }
}
```

此时日期类型就回当成文本来处理。

**静态映射**

略。

### 9.2 类型推断

es 中动态映射类型推断方式如下：

![image-20210413133939545](https://b2files.173114.xyz/blogimg/image-20210413133939545.png)

## 10.ElasticSearch 四种字段类型详解

### 10.1 核心类型

#### 10.1.1 字符串类型

- string：这是一个已经过期的字符串类型。在 es5 之前，用这个来描述字符串，现在的话，它已经被 text 和 keyword 替代了。
- text：如果一个字段是要被全文检索的，比如说博客内容、新闻内容、产品描述，那么可以使用 text。用了 text 之后，字段内容会被分析，在生成倒排索引之前，字符串会被分词器分成一个个词项。text 类型的字段不用于排序，很少用于聚合。这种字符串也被称为 analyzed 字段。
- keyword：这种类型适用于结构化的字段，例如标签、email 地址、手机号码等等，这种类型的字段可以用作过滤、排序、聚合等。这种字符串也称之为 not-analyzed 字段。

#### 10.1.2 数字类型

![image-20210413142752714](https://b2files.173114.xyz/blogimg/image-20210413142752714.png)

- 在满足需求的情况下，优先使用范围小的字段。字段长度越短，索引和搜索的效率越高。
- 浮点数，优先考虑使用 scaled_float。通过缩放因子（底层将一个浮点数变为整数和一个缩放倍数，用来节省空间）将浮点数缩放，更好的空间利用

在使用scaled_float时，需要制定缩放因子scaled_float

scaled_float 举例：

```
PUT product
{
  "mappings": {
    "properties": {
      "name":{
        "type": "text"
      },
      "price":{
        "type": "scaled_float",
        "scaling_factor": 100
      }
    }
  }
}
```

#### 10.1.3 日期类型

由于 JSON 中没有日期类型，所以 es 中的日期类型形式就比较多样：

- 2020-11-11 或者 2020-11-11 11:11:11
- 一个从 1970.1.1 零点到现在的一个秒数或者毫秒数。

es 内部将时间转为 UTC，然后将时间按照 millseconds-since-the-epoch 的长整型来存储。

自定义日期类型：

```
PUT product
{
  "mappings": {
    "properties": {
      "date":{
        "type": "date"
      }
    }
  }
}
```

这个能够解析出来的时间格式比较多。

```
PUT product/_doc/1
{
  "date":"2020-11-11"
}

PUT product/_doc/2
{
  "date":"2020-11-11T11:11:11Z"
}


PUT product/_doc/3
{
  "date":"1604672099958"
}
```

上面三个文档中的日期都可以被解析，内部存储的是毫秒计时的长整型数。

#### 10.1.4 布尔类型（boolean）

JSON 中的 “true”、“false”、true、false 都可以。

#### 10.1.5 二进制类型（binary）

二进制接受的是 base64 编码的字符串，默认不存储，也不可搜索。

#### 10.1.6 范围类型

- integer_range
- float_range
- long_range
- double_range
- date_range
- ip_range

定义的时候，指定范围类型即可：

```
PUT product
{
  "mappings": {
    "properties": {
      "date":{
        "type": "date"
      },
      "price":{
        "type":"float_range"
      }
    }
  }
}
```

插入文档的时候，需要指定范围的界限：

```
PUT product
{
  "mappings": {
    "properties": {
      "date":{
        "type": "date"
      },
      "price":{
        "type":"float_range"
      }
    }
  }
}
```

指定范围的时，可以使用 gt、gte、lt、lte。

### 10.2 复合类型

#### 10.2.1 数组类型

es 中没有专门的数组类型。默认情况下，任何字段都可以有一个或者多个值。需要注意的是，数组中的元素必须是**同一种类型。**

添加数组是，数组中的**第一个元素**决定了整个数组的类型。

#### 10.2.2 对象类型（object）

由于 JSON 本身具有层级关系，所以文档包含内部对象。内部对象中，还可以再包含内部对象。

```
PUT product/_doc/2
{
  "date":"2020-11-11T11:11:11Z",
  "ext_info":{
    "address":"China"
  }
}
```

#### 10.2.3 嵌套类型（nested）

nested 是 object 中的一个特例。

如果使用 object 类型，假如有如下一个文档：

```
{
  "user":[
    {
      "first":"Zhang",
      "last":"san"
    },
    {
      "first":"Li",
      "last":"si"
    }
    ]
}
```

由于 Lucene 没有内部对象的概念，所以 es 会将对象层次扁平化，将一个对象转为字段名和值构成的简单列表。即上面的文档，最终存储形式如下：

```
{
"user.first":["Zhang","Li"],
"user.last":["san","si"]
}
```

扁平化之后，用户名之间的关系没了。这样会导致如果搜索 Zhang si 这个人，会搜索到。

此时可以 nested 类型来解决问题，nested 对象类型可以保持数组中每个对象的独立性。nested 类型将数组中的每一饿对象作为独立隐藏文档来索引，这样每一个嵌套对象都可以独立被索引。

{
{
"user.first":"Zhang",
"user.last":"san"
},{
"user.first":"Li",
"user.last":"si"
}
}

**优点**

文档存储在一起，读取性能高。

**缺点**

更新父或者子文档时需要更新更个文档。

### 10.3 地理类型

使用场景：

- 查找某一个范围内的地理位置
- 通过地理位置或者相对中心点的距离来聚合文档
- 把距离整个到文档的评分中
- 通过距离对文档进行排序

#### 10.3.1 geo_point

geo_point 就是一个坐标点，定义方式如下：

```
PUT people
{
  "mappings": {
    "properties": {
      "location":{
        "type": "geo_point"
      }
    }
  }
}
```

创建时指定字段类型，存储的时候，有四种方式：

```
//object
PUT people/_doc/1
{
  "location":{
    "lat": 34.27,
    "lon": 108.94
  }
}
//字符串
PUT people/_doc/2
{
  "location":"34.27,108.94"
}
//经纬度的hash值
PUT people/_doc/3
{
  "location":"uzbrgzfxuzup"
}
//数组 经度在前，纬度在后
PUT people/_doc/4
{
  "location":[108.94,34.27]
}
```

注意，使用数组描述，先经度后纬度。

地址位置转 geo_hash：http://www.csxgame.top/#/

#### 10.3.2 geo_shape

![image-20210413165810514](https://b2files.173114.xyz/blogimg/image-20210413165810514.png)

指定 geo_shape 类型：

```
PUT people
{
  "mappings": {
    "properties": {
      "location":{
        "type": "geo_shape"
      }
    }
  }
}
```

添加文档时需要指定具体的类型：

```
PUT people/_doc/1
{
  "location":{
    "type":"point",
    "coordinates": [108.94,34.27]
  }
}
```

如果是 linestring，如下：

```
PUT people/_doc/2
{
  "location":{
    "type":"linestring",
    "coordinates": [[108.94,34.27],[100,33]]
  }
}
```

### 10.4 特殊类型

#### 10.4.1 IP

存储 IP 地址，类型是 ip：

```
PUT blog
{
  "mappings": {
    "properties": {
      "address":{
        "type": "ip"
      }
    }
  }
}
```

添加文档：

```
PUT blog/_doc/1
{
  "address":"192.168.91.1"
}
```

搜索文档：

```
GET blog/_search
{
  "query": {
    "term": {
      "address": "192.168.0.0/16"
    }
  }
}
```

#### 10.4.2 token_count

用于统计字符串分词后的词项个数。

```
PUT blog
{
  "mappings": {
    "properties": {
      "title":{
        "type": "text",
        "fields": {
          "length":{
            "type":"token_count",
            "analyzer":"standard"
          }
        }
      }
    }
  }
}
```

相当于新增了 title.length 字段用来统计分词后词项的个数。

添加文档：

```
PUT blog/_doc/1
{
  "title":"zhang san"
}
```

可以通过 token_count 去查询：

```
GET blog/_search
{
  "query": {
    "term": {
      "title.length": 2
    }
  }
}
```

## 11.ElasticSearch 23 种映射参数详解

### 11.1 analyzer

定义文本字段的分词器。默认对索引和查询都是有效的。

假设不用分词器，我们先来看一下索引的结果，创建一个索引并添加一个文档：

```
PUT blog

PUT blog/_doc/1
{
  "title":"定义文本字段的分词器。默认对索引和查询都是有效的。"
}
```

查看词条向量（term vectors）

```
GET blog/_termvectors/1
{
  "fields": ["title"]
}
```

查看结果如下：

```
{
  "_index" : "blog",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 1,
  "found" : true,
  "took" : 0,
  "term_vectors" : {
    "title" : {
      "field_statistics" : {
        "sum_doc_freq" : 22,
        "doc_count" : 1,
        "sum_ttf" : 23
      },
      "terms" : {
        "义" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 1,
              "start_offset" : 1,
              "end_offset" : 2
            }
          ]
        },
        "分" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 7,
              "start_offset" : 7,
              "end_offset" : 8
            }
          ]
        },
        "和" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 15,
              "start_offset" : 16,
              "end_offset" : 17
            }
          ]
        },
        "器" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 9,
              "start_offset" : 9,
              "end_offset" : 10
            }
          ]
        },
        "字" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 4,
              "start_offset" : 4,
              "end_offset" : 5
            }
          ]
        },
        "定" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 0,
              "start_offset" : 0,
              "end_offset" : 1
            }
          ]
        },
        "对" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 12,
              "start_offset" : 13,
              "end_offset" : 14
            }
          ]
        },
        "引" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 14,
              "start_offset" : 15,
              "end_offset" : 16
            }
          ]
        },
        "效" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 21,
              "start_offset" : 22,
              "end_offset" : 23
            }
          ]
        },
        "文" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 2,
              "start_offset" : 2,
              "end_offset" : 3
            }
          ]
        },
        "是" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 19,
              "start_offset" : 20,
              "end_offset" : 21
            }
          ]
        },
        "有" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 20,
              "start_offset" : 21,
              "end_offset" : 22
            }
          ]
        },
        "本" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 3,
              "start_offset" : 3,
              "end_offset" : 4
            }
          ]
        },
        "查" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 16,
              "start_offset" : 17,
              "end_offset" : 18
            }
          ]
        },
        "段" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 5,
              "start_offset" : 5,
              "end_offset" : 6
            }
          ]
        },
        "的" : {
          "term_freq" : 2,
          "tokens" : [
            {
              "position" : 6,
              "start_offset" : 6,
              "end_offset" : 7
            },
            {
              "position" : 22,
              "start_offset" : 23,
              "end_offset" : 24
            }
          ]
        },
        "索" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 13,
              "start_offset" : 14,
              "end_offset" : 15
            }
          ]
        },
        "认" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 11,
              "start_offset" : 12,
              "end_offset" : 13
            }
          ]
        },
        "词" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 8,
              "start_offset" : 8,
              "end_offset" : 9
            }
          ]
        },
        "询" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 17,
              "start_offset" : 18,
              "end_offset" : 19
            }
          ]
        },
        "都" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 18,
              "start_offset" : 19,
              "end_offset" : 20
            }
          ]
        },
        "默" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 10,
              "start_offset" : 11,
              "end_offset" : 12
            }
          ]
        }
      }
    }
  }
}
```

可以看到，默认情况下，中文就是一个字一个字的分，这种分词方式没有任何意义。如果这样分词，查询就只能按照一个字一个字来查，像下面这样：

```
GET blog/_search
{
  "query": {
    "term": {
      "title": "定"
    }
  }
}
```

无意义！！！

所以，我们要根据实际情况，配置合适的分词器。

给字段设定分词器：

```
PUT blog
{
  "mappings": {
    "properties": {
      "title":{
        "type":"text",
        "analyzer": "ik_smart"
      }
    }
  }
}
```

存储文档：

```
PUT blog/_doc/1
{
  "title":"定义文本字段的分词器。默认对索引和查询都是有效的。"
}
```

查看词条向量：

```
GET blog/_termvectors/1
{
  "fields": ["title"]
}
```

查询结果如下：

```
{
  "_index" : "blog",
  "_type" : "_doc",
  "_id" : "1",
  "_version" : 1,
  "found" : true,
  "took" : 1,
  "term_vectors" : {
    "title" : {
      "field_statistics" : {
        "sum_doc_freq" : 12,
        "doc_count" : 1,
        "sum_ttf" : 13
      },
      "terms" : {
        "分词器" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 4,
              "start_offset" : 7,
              "end_offset" : 10
            }
          ]
        },
        "和" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 8,
              "start_offset" : 16,
              "end_offset" : 17
            }
          ]
        },
        "字段" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 2,
              "start_offset" : 4,
              "end_offset" : 6
            }
          ]
        },
        "定义" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 0,
              "start_offset" : 0,
              "end_offset" : 2
            }
          ]
        },
        "对" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 6,
              "start_offset" : 13,
              "end_offset" : 14
            }
          ]
        },
        "文本" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 1,
              "start_offset" : 2,
              "end_offset" : 4
            }
          ]
        },
        "有效" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 11,
              "start_offset" : 21,
              "end_offset" : 23
            }
          ]
        },
        "查询" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 9,
              "start_offset" : 17,
              "end_offset" : 19
            }
          ]
        },
        "的" : {
          "term_freq" : 2,
          "tokens" : [
            {
              "position" : 3,
              "start_offset" : 6,
              "end_offset" : 7
            },
            {
              "position" : 12,
              "start_offset" : 23,
              "end_offset" : 24
            }
          ]
        },
        "索引" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 7,
              "start_offset" : 14,
              "end_offset" : 16
            }
          ]
        },
        "都是" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 10,
              "start_offset" : 19,
              "end_offset" : 21
            }
          ]
        },
        "默认" : {
          "term_freq" : 1,
          "tokens" : [
            {
              "position" : 5,
              "start_offset" : 11,
              "end_offset" : 13
            }
          ]
        }
      }
    }
  }
}
```

然后就可以通过词去搜索了：

```
GET blog/_search
{
  "query": {
    "term": {
      "title": "索引"
    }
  }
}
```

### 11.2 search_analyzer

查询时候的分词器。默认情况下，如果没有配置 search_analyzer，则查询时，首先查看有没有 search_analyzer，有的话，就用 search_analyzer 来进行分词，如果没有，则看有没有 analyzer，如果有，则用 analyzer 来进行分词，否则使用 es 默认的分词器。

### 11.3 normalizer

normalizer 参数用于**解析前（索引或者查询）**的标准化配置。

比如，在 es 中，对于一些我们不想切分的字符串，我们通常会将其设置为 keyword，搜索时候也是使用整个词进行搜索。如果在索引前没有做好数据清洗，导致大小写不一致，例如 javaboy 和 JAVABOY，此时，我们就可以使用 normalizer 在索引之前以及查询之前进行文档的标准化。

先来一个反例，创建一个名为 blog 的索引，设置 author 字段类型为 keyword：

```
PUT blog
{
  "mappings": {
    "properties": {
      "author":{
        "type": "keyword"
      }
    }
  }
}
```

添加两个文档：

```
PUT blog/_doc/1
{
  "author":"javaboy"
}

PUT blog/_doc/2
{
  "author":"JAVABOY"
}
```

然后进行搜索：

```
GET blog/_search
{
  "query": {
    "term": {
      "author": "JAVABOY"
    }
  }
}
```

大写关键字可以搜到大写的文档，小写关键字可以搜到小写的文档。

如果使用了 normalizer，可以在索引和查询时，分别对文档进行预处理。

normalizer 定义方式如下：

```
PUT blog
{
  "settings": {
    "analysis": {
      "normalizer":{
        "my_normalizer":{
          "type":"custom",
          "filter":["lowercase"]
        }
      }
    }
  }, 
  "mappings": {
    "properties": {
      "author":{
        "type": "keyword",
        "normalizer":"my_normalizer"
      }
    }
  }
}
```

在 settings 中定义 normalizer，然后在 mappings 中引用。

测试方式和前面一致。此时查询的时候，大写关键字也可以查询到小写文档，因为无论是索引还是查询，都会将大写转为小写。

### 11.4 boost

boost 参数可以设置字段的权重。

默认权重为1

boost 有两种使用思路，一种就是在定义 mappings 的时候使用，在指定字段类型时使用；另一种就是在查询时使用。

实际开发中建议使用后者，前者有问题：如果不重新索引文档，权重无法修改。

只支持 term 查询 (不支持prefix，range，fuzzy查询)

mapping 中使用 boost（不推荐）：7.12出现提示将在8.0移除

```
PUT blog
{
  "mappings": {
    "properties": {
      "content":{
        "type": "text",
        "boost": 2
      }
    }
  }
}
```

另一种方式就是在查询的时候，指定 boost

```
PUT blog
{
  "mappings": {
    "properties": {
      "content":{
        "type": "text"
        , "analyzer": "ik_smart"
      }
    }
  }
}
```

```
POST blog/_doc
{
  "content":"你好测试的人,你好测试的人,你好测试的人"
}
```

```
GET blog/_search
{
  "query": {
    "match": {
      "content": {
        "query": "你好",
        "boost": 2
      }
    }
  }
}
```

**为何在建索引时加权重是一个不好的行为**？

1.如果不重新索引文档，权重无法修改。

2.在查询时可以调整权重而不需要重新索引

3.在索引添加权重会占用一个字节的空间，`This reduces the resolution of the field length normalization factor which can lead to lower quality relevance calculations.`(这一段没看懂)

### 11.5 coerce

coerce 用来清除脏数据，默认为 true。

比如一个数字 5 ，一般是integer，但是可能是String “5”，也可能是是浮点数 float 5.0, 甚至 "5.0"String

```
PUT blog
{
  "mappings": {
    "properties": {
      "number_one":{
        "type": "integer"
      },
      "number_two":{
        "type": "integer",
        "coerce": false
      }
    }
  }
}

PUT blog/_doc/1
{
  "number_one":"10"
}

PUT blog/_doc/2
{
  "number_two":"10"
}
```

可以通过update mapping api 让coerce 更新已有的字段

同样可以在建索引时全局禁用coercion并启用部分

```
PUT my-index-000001
{
  "settings": {
    "index.mapping.coerce": false
  },
  "mappings": {
    "properties": {
      "number_one": {
        "type": "integer",
        "coerce": true
      },
      "number_two": {
        "type": "integer"
      }
    }
  }
}

PUT my-index-000001/_doc/1
{ 
"number_one": "10" 
} 

PUT my-index-000001/_doc/2
{ 
"number_two": "10" 
}
```

### 11.6 copy_to

将多个字段的值复制到一个字段中

```
PUT my-index-000001
{
  "mappings": {
    "properties": {
      "first_name": {
        "type": "text",
        "copy_to": "full_name" 
      },
      "last_name": {
        "type": "text",
        "copy_to": "full_name" 
      },
      "full_name": {
        "type": "text"
      }
    }
  }
}

PUT my-index-000001/_doc/1
{
  "first_name": "John",
  "last_name": "Smith"
}

GET my-index-000001/_search
{
  "query": {
    "match": {
      "full_name": { 
        "query": "John Smith",
        "operator": "and"
      }
    }
  }
}
```

### 11.7 doc_values 和 fielddata

es 中的搜索主要是用到倒排索引，doc_values 参数是为了加快排序、聚合操作而生的。当建立倒排索引的时候，会额外增加列式存储映射。

doc_values 默认是开启的，如果确定某个字段不需要排序或者不需要聚合，那么可以关闭 doc_values。

大部分的字段在索引时都会生成 doc_values，除了 text。text 字段在查询时会生成一个 fielddata 的数据结构，fieldata 在字段首次被聚合、排序的时候生成。

| doc_value          | fielddata                      |
| ------------------ | ------------------------------ |
| 索引时创建         | 使用时动态创建                 |
| 磁盘               | 内存                           |
| 不占用内存         | 不占用磁盘                     |
| 索引速度稍微低一点 | 文档很多时，动态创建慢，占内存 |

doc_values 默认开启，fielddata 默认关闭。

doc_values 演示：

```
PUT users

PUT users/_doc/1
{
  "age":100
}

PUT users/_doc/2
{
  "age":99
}

PUT users/_doc/3
{
  "age":98
}

PUT users/_doc/4
{
  "age":101
}

GET users/_search
{
  "query": {
    "match_all": {}
  },
  "sort":[
    {
      "age":{
        "order": "desc"
      }
    }
    ]
}
```

由于 doc_values 默认时开启的，所以可以直接使用该字段排序，如果想关闭 doc_values ，如下：

```
PUT users
{
  "mappings": {
    "properties": {
      "age":{
        "type": "integer",
        "doc_values": false
      }
    }
  }
}

PUT users/_doc/1
{
  "age":100
}

PUT users/_doc/2
{
  "age":99
}

PUT users/_doc/3
{
  "age":98
}

PUT users/_doc/4
{
  "age":101
}

GET users/_search
{
  "query": {
    "match_all": {}
  },
  "sort":[
    {
      "age":{
        "order": "desc"
      }
    }
    ]
}
```

### 11.8 dynamic

当对包含新字段的文档建立索引时，ElasticSearch会将字段动态添加到文档或文档中的内部对象。

内部对象从其父对象或映射类型继承动态设置。在类型级别禁用了动态映射，因此不会动态的添加新的顶级字段。

dynamic 可选参数

| param | description |
| ---- | ---- |
| true | 默认 |
| runtime | 新字段作为运行时字段添加到映射中。未建立索引，而是在查询时从_source加载 |
| false | 新字段会被忽略，不能被索引和搜索，但仍会出现在返回的匹配的_source字段中，不会添加到映射中，必须显式添加新字段 |
| strict | 如果检测到新字段，会引发异常并拒绝，必须显式添加新字段 |

### 11.9 enabled

es 默认会索引所有的字段，但是有的字段可能只需要存储，不需要索引。此时可以通过 enabled 字段来控制：

只能应用于顶级映射定义和对象字段。仍然可以从_source字段中检索JSON，但无法搜索或以其他任何方式存储；

已经存在的字段和顶级映射无法更新enabled

可以将非对象字段添加到禁用字段

```
PUT my-index-000001
{
  "mappings": {
    "properties": {
      "session_data": {
        "type": "object",
        "enabled": false
      }
    }
  }
}

PUT my-index-000001/_doc/session_1
{
  "session_data": "foo bar" 
}
```

返回的结果为

```
{
  "_index" : "my-index-000001",
  "_type" : "_doc",
  "_id" : "session_1",
  "_version" : 1,
  "result" : "created",
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "_seq_no" : 0,
  "_primary_term" : 1
}
```

### 11.10 format

日期格式。format 可以规范日期格式，而且一次可以定义多个 format。

```
PUT users
{
  "mappings": {
    "properties": {
      "birthday":{
        "type": "date",
        "format": "yyyy-MM-dd||yyyy-MM-dd HH:mm:ss"
      }
    }
  }
}

PUT users/_doc/1
{
  "birthday":"2020-11-11"
}

PUT users/_doc/2
{
  "birthday":"2020-11-11 11:11:11"
}
```

- 多个日期格式之间，使用 || 符号连接，注意没有空格。
- 如果用户没有指定日期的 format，默认的日期格式是 `strict_date_optional_time||epoch_mills`

另外，所有的日期格式，可以在 https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-date-format.html 网址查看。

### 11.11 ignore_above

igbore_above 用于指定分词和索引的字符串最大长度，超过最大长度的话，该字段将不会被索引，这个字段只适用于 keyword 类型。

```
PUT blog
{
  "mappings": {
    "properties": {
      "title":{
        "type": "keyword",
        "ignore_above": 10
      }
    }
  }
}

PUT blog/_doc/1
{
  "title":"javaboy"
}

PUT blog/_doc/2
{
  "title":"javaboyjavaboyjavaboy"
}

GET blog/_search
{
  "query": {
    "term": {
      "title": "javaboyjavaboyjavaboy"
    }
  }
}
```

### 10.12 ignore_malformed

ignore_malformed 可以忽略不规则的数据，该参数默认为 false。

```
PUT users
{
  "mappings": {
    "properties": {
      "birthday":{
        "type": "date",
        "format": "yyyy-MM-dd||yyyy-MM-dd HH:mm:ss"
      },
      "age":{
        "type": "integer",
        "ignore_malformed": true
      }
    }
  }
}

PUT users/_doc/1
{
  "birthday":"2020-11-11",
  "age":99
}

PUT users/_doc/2
{
  "birthday":"2020-11-11 11:11:11",
  "age":"abc"
}


PUT users/_doc/2
{
  "birthday":"2020-11-11 11:11:11aaa",
  "age":"abc"
}
```

### 10.13 include_in_all

这个是针对 `_all` 字段的，但是在 es7 中，该字段已经被废弃了。

### 10.14 index

index 属性指定一个字段是否被索引，该属性为 true 表示字段被索引，false 表示字段不被索引。

```
PUT users
{
  "mappings": {
    "properties": {
      "age":{
        "type": "integer",
        "index": false
      }
    }
  }
}

PUT users/_doc/1
{
  "age":99
}

GET users/_search
{
  "query": {
    "term": {
      "age": 99
    }
  }
}
```

- 如果 index 为 false，则不能通过对应的字段搜索。

### 10.15 index_options

index_options 控制索引时哪些信息被存储到倒排索引中（用在 text 字段中），有四种取值：

| index_options | 备注                                            |
| ------------- | ----------------------------------------------- |
| docs          | 只存储文档编号，默认                            |
| freqs         | 在doc基础上，存储词项频率                       |
| positions     | 在freqs基础上，存储词项偏移位置                 |
| offsets       | 在positions基础上，存储词项开始和结束的字符位置 |

```
//这段没怎么懂

PUT my-index-000001
{
  "mappings": {
    "properties": {
      "text": {
        "type": "text",
        "index_options": "offsets"
      }
    }
  }
}

PUT my-index-000001/_doc/1
{
  "text": "Quick brown fox"
}

GET my-index-000001/_search
{
  "query": {
    "match": {
      "text": "brown fox"
    }
  },
  "highlight": {
    "fields": {
      "text": {} 
    }
  }
}

```

### 10.16 norms

norms 对字段评分有用，text 默认开启 norms，如果不是特别需要，不要开启 norms。

### 10.17 null_value

在 es 中，值为 null 的字段不索引也不可以被搜索，null_value 可以让值为 null 的字段显式的可索引、可搜索：

```
PUT users
{
  "mappings": {
    "properties": {
      "name":{
        "type": "keyword",
        "null_value": "javaboy_null"  /*这个里面的value有什么意义呢*/
      }
    }
  }
}

PUT users/_doc/1
{
  "name":null,
  "age":99
}

GET users/_search
{
  "query": {
    "term": {
      "name": "javaboy_null"
    }
  }
}
```

### 10.18 position_increment_gap

被解析的 text 字段会将 term 的位置考虑进去，目的是为了支持近似查询和短语查询，当我们去索引一个含有多个值的 text 字段时，会在各个值之间添加一个假想的空间，将值隔开，这样就可以有效避免一些无意义的短语匹配，间隙大小通过 position_increment_gap 来控制，默认是 100。

```
PUT my-index-000001/_doc/1
{
  "names": [ "John Abraham", "Lincoln Smith"]
}

GET my-index-000001/_search
{
  "query": {
    "match_phrase": {
      "names": {
        "query": "Abraham Lincoln" 
      }
    }
  }
}

GET my-index-000001/_search
{
  "query": {
    "match_phrase": {
      "names": {
        "query": "Abraham Lincoln",
        "slop": 101 
      }
    }
  }
}
```

This phrase query matches our document, even though `Abraham` and `Lincoln` are in separate strings, because `slop` > `position_increment_gap`.

两个get请求两种返回

```
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  }
}
```

```
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.010358453,
    "hits" : [
      {
        "_index" : "my-index-000001",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.010358453,
        "_source" : {
          "names" : [
            "John Abraham",
            "Lincoln Smith"
          ]
        }
      }
    ]
  }
}
```

可以在映射中指定`position_increment_gap`

```
PUT my-index-000001
{
  "mappings": {
    "properties": {
      "names": {
        "type": "text",
        "position_increment_gap": 0 
      }
    }
  }
}

PUT my-index-000001/_doc/1
{
  "names": [ "John Abraham", "Lincoln Smith"]
}

GET my-index-000001/_search
{
  "query": {
    "match_phrase": {
      "names": "Abraham Lincoln" 
    }
  }
}
```

### 10.19 properties

可以在查询，聚合等中使用点表示法来引用内部字段：

```
GET my-index-000001/_search
{
  "query": {
    "match": {
      "manager.name": "Alice White"
    }
  },
  "aggs": {
    "Employees": {
      "nested": {
        "path": "employees"
      },
      "aggs": {
        "Employee Ages": {
          "histogram": {
            "field": "employees.age",
            "interval": 5
          }
        }
      }
    }
  }
}
```

### 10.20 similarity

similarity 指定文档的评分模型，默认有三种：

| similarity | 备注                     |
| ---------- | ------------------------ |
| BM25       | es和lucene默认的评分模型 |
| classic    | TF/IDF评分               |
| boolean    | boolean模型评分          |

### 10.21 store

默认情况下，字段会被索引，也可以搜索，但是不会存储，虽然不会被存储的，但是 `_source` 中有一个字段的备份。如果想将字段存储下来，可以通过配置 store 来实现。

```
PUT my-index-000001
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "store": true 
      },
      "date": {
        "type": "date",
        "store": true 
      },
      "content": {
        "type": "text"
      }
    }
  }
}

PUT my-index-000001/_doc/1
{
  "title":   "Some short title",
  "date":    "2015-01-01",
  "content": "A very long content field..."
}

GET my-index-000001/_search
{
  "stored_fields": [ "title", "date" ] 
}
```

### 10.22 term_vectors

term_vectors 是通过分词器产生的信息，包括：

- 一组 terms
- 每个 term 的位置
- term 的首字符/尾字符与原始字符串原点的偏移量

term_vectors 取值：

| 取值                            | 备注                          |
| ------------------------------- | ----------------------------- |
| no                              | 不存储信息，默认              |
| yes                             | term被存储                    |
| with_positions                  | 在yes的基础上增加位置信息     |
| with_offset                     | 在yes的基础上增加偏移信息     |
| with_positions_offsets          | term，positons，offsets都存储 |
| with_positions_payloads         |                               |
| with_positions_offsets_payloads |                               |

- 设置 with_postions_offsets将使字段索引大小翻倍

### 11.23 fields

fields 参数可以让同一字段有多种不同的索引方式。例如：

```
PUT blog
{
  "mappings": {
    "properties": {
      "title":{
        "type": "text",
        "fields": {
          "raw":{
            "type":"keyword"
          }
        }
      }
    }
  }
}

PUT blog/_doc/1
{
  "title":"javaboy"
}

GET blog/_search
{
  "query": {
    "term": {
      "title.raw": "javaboy"
    }
  }
}
```

## 12.映射模板

## 13.ElasticSearch 搜索数据导入

1. 下载脚本**bookdata.json**。
链接: https://pan.baidu.com/s/12Gj5aovYKI5g2X8pPJZtLw 提取码: a5h4 
2. 创建索引：


```
   PUT books
   {
     "mappings": {
       "properties": {
         "name":{
           "type": "text",
           "analyzer": "ik_max_word"
         },
         "publish":{
           "type": "text",
           "analyzer": "ik_max_word"
         },
         "type":{
           "type": "text",
           "analyzer": "ik_max_word"
         },
         "author":{
           "type": "keyword"
         },
         "info":{
           "type": "text",
           "analyzer": "ik_max_word"
         },
         "price":{
           "type": "double"
         }
       }
     }
   }
```

执行如下脚本导入命令：

```
curl -XPOST "http://localhost:9200/books/_bulk?pretty" -H "content-type:application/json" --data-binary @bookdata.json
```

## 14.ElasticSearch 搜索入门

搜索分为两个过程：

1. 当向索引中保存文档时，默认情况下，es 会保存两份内容，一份是 `_source` 中的数据，另一份则是通过分词、排序等一系列过程生成的倒排索引文件，倒排索引中保存了词项和文档之间的对应关系。
2. 搜索时，当 es 接收到用户的搜索请求之后，就会去倒排索引中查询，通过的倒排索引中维护的倒排记录表找到关键词对应的文档集合，然后对文档进行评分、排序、高亮等处理，处理完成后返回文档。

### 14.1 简单搜索

查询文档：

```
GET books/_search
{
  "query": {
    "match_all": {}
  }
}
```

查询结果如下：

```
{
  "took" : 19,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 38,
      "relation" : "eq"
    },
    "max_score" : 4.217799,
    "hits" : [
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "279",
        "_score" : 4.217799,
        "_source" : {
          "name" : "计算机应用基础",
          "publish" : "高等教育出版社",
          "type" : "计算机理论、基础知识",
          "author" : "张宇，赖麟",
          "info" : "《计算机应用基础》是国家精品课程“计算机文件基础”的配套教材。全书按照工学结合人才培养模式的要求，以培养能力为目标，基于工作过程组织课程；以典型的工作任务为载体，采用任务驱动的方式来构造知识和技能平台，强调理论和训练一体化，做到“教、学、做”相结合，让学生对知识有整体认识，即按照“先行后知、先学后教”的思想编写。全书内容包括：计算机基础知识、WnwsXP操作系统、McsfOffc2003办公自动化软件、计算机网络基础。《计算机应用基础》的显著特点是以学生为主体，通过实际工作过程中的典型工作任务来训练学生，培养学生解决和处理实际问题的能力，将被动学习转变为主动学习，突出学生能力的培养，更加符合职业技术教育的特点和规律。《计算机应用基础》适合作为普通高等院校和高职高专院校“计算机应用基础”课程的教材，也可作为计算机初学者的入门参考书。",
          "price" : 29
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "298",
        "_score" : 3.8557193,
        "_source" : {
          "name" : "高等学校大学计算机基础课程系列教材：大学计算机基础教程",
          "publish" : "高等教育出版社",
          "type" : "大学教材",
          "author" : "",
          "info" : "本书作为高等学校非计算机专业计算机基础课程群（1+X）第一门课程的主教材，主要介绍计算机基础知识和应用技能。本书共包含7章：计算机基础知识、操作系统用户界面及使用、办公自动化软件及使用、多媒体技术基础及应用、网络技术基础及应用、网页设计与制作、数据库技术基础及应用。每章都结合通用的软件版本进行讲解，同时为了帮助学生加深对所学知识的理解，还配备了大量习题。作为国家精品课程主讲教材，本书配有丰富的教学资源，包括多媒体教学课件、课程实验系统、上机练习和考试评价系统、教学素材等计算机辅助教学软件，还有功能完善的教学专用网站。本书可作为高等学校学生学习第一门计算机课程的教材，也可作为计算机爱好者的自学读本。",
          "price" : 22
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "789",
        "_score" : 3.58548,
        "_source" : {
          "name" : "高等学校文科计算机课程系列教材：计算机平面设计技术（CorelDRAW与Photoshop）（附光盘）",
          "publish" : "高等教育出版社",
          "type" : "大学教材",
          "author" : "",
          "info" : "《计算机平面设计技术――CDRAW与Ps》是根据教育部高等学校文科类专业计算机课程教学基本要求（美术类）而编写的。《计算机平面设计技术――CDRAW与Ps》系统全面地介绍了平面设计艺术专业最常用、最基本、最普及、最成熟的两个应用软件――CDRAW与Ps，结合实际的设计案例，讲授平面图形的造型方法与技巧、图像的处理方法与技巧、跨程序编辑的方法和意义等知识与技术。教材浓缩了其重要的工具和功能的使用方法，可作为平面设计专业的计算机应用基础课程的教材，也可作为学习计算机平面设计技术的参考。",
          "price" : 28
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "282",
        "_score" : 3.4969957,
        "_source" : {
          "name" : "计算机文化基础（Windows XP＋Office2003）",
          "publish" : "高等教育出版社",
          "type" : "计算机理论、基础知识",
          "author" : "赵秀英",
          "info" : "《计算机文化基础(WnwsXP+Offc2003",
          "price" : 0
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "783",
        "_score" : 3.3814218,
        "_source" : {
          "name" : "计算机科学与技术丛书：现代语音编码技术",
          "publish" : "科学出版社",
          "type" : "电子与通信",
          "author" : "",
          "info" : "本书全面、系统地阐述了现代语音编码的原理、技术及应用。　本书分为12章，第一章介绍现代语音编码的基础知识和基本概念，第二章阐述标量量化和矢量量化原理，这两章是语音编码的入门知识；第三章至第七章讨论广泛应用的几种重要的现代语音编码技术原理、系统组成、实用技术及编码标准，是本书的重点；第八章至第十章介绍目前语音编码的最新的一些研究课题及其进展；第十一章、第十二章讨论语音编码的今后发展趋势和方向。主要内容有：语音编码导论、量化原理、时域波形编码技术、频域波形编码技术、变换域波形编码技术、参数编码技术、混合编码技术、极低速率语音编码、宽频带高音质声频编码、第三代移动通信的语音编码、信源-信道联合编码、软件无线电技术在语音编码中的应用。　本书内容丰富、取材新颖、阐述清晰、结构合理、实用性强，包含有最近二十几年来现代语音编码技术的许多新成果和新进展，是一本很好的关于语音编码原理、技术及应用的教科书和参考书。",
          "price" : 31
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "465",
        "_score" : 3.3506408,
        "_source" : {
          "name" : "国家精品课程主讲教材・高等学校大学计算机基础课程系列教材：大学计算机基础实践教程",
          "publish" : "高等教育出版社",
          "type" : "大学教材",
          "author" : "詹国华",
          "info" : "《大学计算机基础实践教程》作为高等学校非计算机专业计算机基础课程群（1+X）第一门课程主教材《大学计算机基础教程》的配套实验教材，精心设计了一组综合性、应用性实验，注重实践技能的培养和理论知识的渗透。《大学计算机基础实践教程》共分7章：硬件连接和汉字输入实验、Wnws操作实验、办公软件操作实验、多媒体基础实验、因特网操作实验、网页设计与制作实验、Accss数据库操作实验。作为国家精品课程主讲教材的配套用书，《大学计算机基础实践教程》提供了丰富的教学资源，包括多媒体教学课件、课程实验系统、上机练习和考试评价系统、教学素材等计算机辅助教学软件，还有功能完善的课程教学网站。《大学计算机基础实践教程》可作为高等学校学生学习第一门计算机基础课程的配套教材，也可作为计算机爱好者的自学读本。",
          "price" : 17
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "429",
        "_score" : 3.1717708,
        "_source" : {
          "name" : "微型计算机原理与接口技术（第2版）",
          "publish" : "高等教育出版社",
          "type" : "计算机组织与体系结构",
          "author" : "尹建华",
          "info" : "《微型计算机原理与接口技术》以In系列微处理器为背景，以16位微处理器8086为核心，追踪In主流系列高性能微型计算机萼术的发展方向，全面讲述微型计算机系统的基本组成、工作原理、硬件接口技术和典型应用，在此基础上介绍80386，80486和Pn等高档微处理器的发展和特点。使学生系统掌握汇编语言程序设计的基本方法和硬件接口技术，建立微型计算机系统的整体概念，并且使之具有微型计算机软件及硬件初步开发、设计的能力。为使于教师授课和学生学习，《微型计算机原理与接口技术》配备了多媒体CAI课件。全书共11章。主要内容包括：微型计算机基础知识、80x86CPU、微型计算机指令系统、汇编语言程序设计、存储器及其与CPU的接口、输入／输出接口及中断技术、总线和总线标准、常用可编程并行数字接口芯片及其应用、串行通信接口及总线标准、模拟接口技术、常用外设和人机交互接口。《微型计算机原理与接口技术》可作为高等学校工科非计算机专业微型计算机原理及应用课程的教材，也可供从事微型计算机硬件和软件设计的工程技术人员参考。",
          "price" : 54
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "70",
        "_score" : 2.9018917,
        "_source" : {
          "name" : "计算机基础课程系列教材：数据库技术及应用 SQL Server",
          "publish" : "高等教育出版社",
          "type" : "数据库",
          "author" : "李雁翎",
          "info" : "SQLSv是一种典型的数据库管理系统，是目前深受广大用户欢迎的数据库应用开发平台。它适应网络技术环境，支持客户／服务器模式，能够满足创建各种类型数据库的需求，因此是目前高等学校讲授大型数据库管理系统的首选软件平台。《数据库技术及应用――SQLSv》以培养学生利用数据库技术对数据和信息进行管理、加工和利用的意识与能力为目标，以数据库原理和技术为知识讲授核心，建构教材的体例。《数据库技术及应用――SQLSv》分为上、下两篇。上篇为基础篇，主要介绍与数据库相关的基本概念，数据库设计方法，SQLSv-体系结构，数据库对象管理，T―SQL语言及应用，存储过程和触发器的使用技术。下篇为应用篇，主要介绍安全管理技术，数据备份、恢复及转换技术，ADO数据对象，VB／SQLSv的应用程序开发方法及实例。《数据库技术及应用――SQLSv》体系完整，结构清晰，实例丰富，图文并茂，精编精讲，易读易懂。全书体例创新，由一组系统化的、围绕一个数据库应用系统的相关例子贯穿始终，特色鲜明，具有普遍适用性。《数据库技术及应用――SQLSv》可作为高等学校本、专科学生的教科书，也可作为学习数据库应用技术读者的自学用书。为了方便教师教学和学生自主学习，《数据库技术及应用――SQLSv》配有《数据库技术及应用――习题与实验指导（SQLSv）》和电子教案、例题、实验软件的电子文档以及相关的教学网站，网址为：／／c.cncs.c／c／nx。",
          "price" : 22
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "116",
        "_score" : 2.9018917,
        "_source" : {
          "name" : "全国计算机等级考试一级B教程（2010年版）",
          "publish" : "高等教育出版社",
          "type" : "计算机考试",
          "author" : "",
          "info" : "《全国计算机等级考试一级B教程（2010年版）》由教育部考试中心组织，在全国计算机等级考试委员会指导下由有关专家按照《全国计算机等级考试一级B考试大纲（2007年版）》的要求而编写，内容包括计算机基础知识、WnwsXP操作系统、W2003的使用、Exc2003的使用、因特网的基础知识和简单应用等。由教育部考试中心组织和实施的计算机等级考试，是一种客观、公正、科学的专门测试计算机应用人员的计算机知识与技能的全国范围的等级考试。它面向社会，服务于社会。《全国计算机等级考试一级B教程（2010年版）》除了可以作为计算机等级考试的教材外，还可作为学习计算机基础知识的参考书。",
          "price" : 33
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "138",
        "_score" : 2.821856,
        "_source" : {
          "name" : "全国计算机等级考试三级教程：PC技术（2010年版）",
          "publish" : "高等教育出版社",
          "type" : "考试认证",
          "author" : "",
          "info" : "《全国计算机等级考试三级教程：PC技术(2010年版",
          "price" : 0
        }
      }
    ]
  }
}
```

```
GET books/_search
{
  "query": {
    "match_all": {}
  }
}
```

hits 中就是查询结果，total 是符合查询条件的文档数。

简单搜索可以简写为：

```
GET books/_search
```

简单搜索默认查询 10 条记录。

### 14.2 词项查询

即 term 查询，就是根据**词**去查询，查询指定字段中包含给定单词的文档，term 查询不被解析，只有搜索的词和文档中的词**精确匹配**，才会返回文档。应用场景如：人名、地名等等。

查询 name 字段中包含 **十一五** 的文档。

```
GET books/_search
{
  "query": {
    "term": {
      "name": "十一五"
    }
  }
}
```

### 14.3 分页

默认返回前 10 条数据，es 中也可以像关系型数据库一样，给一个分页参数：

```
GET books/_search
{
  "query": {
    "term": {
      "name": "十一五"
    }
  },
  "size": 10,
  "from": 10
}
```

### 14.4 过滤返回字段

如果返回的字段比较多，又不需要这么多字段，此时可以指定返回的字段：

```
GET books/_search
{
  "query": {
    "term": {
      "name": "十一五"
    }
  },
  "size": 10,
  "from": 10,
  "_source": ["name","author"]
}
```

此时，返回的字段就只有 name 和 author 了。

```
{
  "took" : 7,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 142,
      "relation" : "eq"
    },
    "max_score" : 1.7939949,
    "hits" : [
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "323",
        "_score" : 1.7416272,
        "_source" : {
          "author" : "徐春祥",
          "name" : "普通高等教育十一五国家级规划教材・医学化学"
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "476",
        "_score" : 1.7416272,
        "_source" : {
          "author" : "陈后金，胡健，薛健",
          "name" : "普通高等教育“十一五”国家级规划教材：信号与系统"
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "480",
        "_score" : 1.7416272,
        "_source" : {
          "author" : "余家荣",
          "name" : "普通高等教育“十一五”国家级规划教材：复变函数"
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "494",
        "_score" : 1.7416272,
        "_source" : {
          "author" : "徐美银",
          "name" : "全国高职高专教育“十一五”规划教材：经济学原理"
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "498",
        "_score" : 1.7416272,
        "_source" : {
          "author" : "",
          "name" : "普通高等教育“十一五”国家级规划教材：组合学讲义"
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "502",
        "_score" : 1.7416272,
        "_source" : {
          "author" : "卞毓宁",
          "name" : "全国高职高专教育十一五规划教材：统计学概论"
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "614",
        "_score" : 1.7416272,
        "_source" : {
          "author" : "陈洪亮，张峰，田社平",
          "name" : "普通高等教育“十一五”国家级规划教材：电路基础"
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "13",
        "_score" : 1.69223,
        "_source" : {
          "author" : "胡立勇，丁艳锋",
          "name" : "普通高等教育“十一五”国家级规划教材：作物栽培学"
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "65",
        "_score" : 1.69223,
        "_source" : {
          "author" : "",
          "name" : "普通高等教育“十一五”国家级规划教材：有机化学"
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "87",
        "_score" : 1.69223,
        "_source" : {
          "author" : "",
          "name" : "普通高等教育“十一五”国家级规划教材：美术设计基础"
        }
      }
    ]
  }
}
```

### 14.5 最小评分

有的文档得分特别低，说明这个文档和我们查询的关键字相关度很低。我们可以设置一个最低分，只有得分超过最低分的文档才会被返回。

```
GET books/_search
{
  "query": {
    "term": {
      "name": "十一五"
    }
  },
  "min_score":1.75,
  "_source": ["name","author"]
}
```

得分低于 1.75 的文档将直接被舍弃。

### 14.6 高亮

查询关键字高亮：

```
GET books/_search
{
  "query": {
    "term": {
      "name": "十一五"
    }
  },
  "min_score":1.75,
  "_source": ["name","author"],
  "highlight": {
    "fields": {
      "name": {}
    }
  }
}
```

## 15.ElasticSearch 全文查询

### 15.1 match query

match query 会对查询语句进行分词，分词后，如果查询语句中的任何一个词项被匹配，则文档就会被索引到。

```
GET books/_search
{
  "query": {
    "match": {
      "name": "美术计算机"
    }
  }
}
```

这个查询首先会对 `美术计算机` 进行分词，分词之后，再去查询，只要文档中包含一个分词结果，就回返回文档。换句话说，**默认词项之间是 OR 的关系**，如果想要修改，也可以改为 AND。

```
GET books/_search
{
  "query": {
    "match": {
      "name": {
        "query": "美术计算机",
        "operator": "and"
      }
    }
  }
}
```

此时就会要求文档中必须同时包含 **美术** 和 **计算机** 两个词。

### 15.2 match_phrase query

match_phrase query 也会对查询的关键字进行分词，但是它分词后有两个特点：

- 分词后的词项顺序必须和文档中词项的顺序一致
- 所有的词都必须出现在文档中

示例如下：

```
GET books/_search
{
  "query": {
    "match_phrase": {
        "name": {
          "query": "十一五计算机",
          "slop": 7
        }
    }
  }
}
```

query 是查询的关键字，会被分词器进行分解，分解之后去倒排索引中进行匹配。

slop 是指关键字之间的最小距离，但是注意不是关键字之间间隔的字数。文档中的字段被分词器解析之后，解析出来的词项都包含一个 position 字段表示词项的位置，查询短语分词之后 的 position 之间的间隔要满足 slop 的要求。

### 15.3 match_phrase_prefix query

这个类似于 match_phrase query，只不过这里多了一个通配符，match_phrase_prefix 支持最后一个词项的前缀匹配，但是由于这种匹配方式效率较低，因此大家作为了解即可。

```
GET books/_search
{
  "query": {
    "match_phrase_prefix": {
      "name": "计"
    }
  }
}
```

这个查询过程，会自动进行单词匹配，会自动查找以**计**开始的单词，默认是 50 个，可以自己控制：

```
GET books/_search
{
  "query": {
    "match_phrase_prefix": {
      "name": {
        "query": "计",
        "max_expansions": 3
      }
    }
  }
}
```

match_phrase_prefix 是针对分片级别的查询，假设 max_expansions 为 1，可能返回多个文档，但是只有一个词，这是我们预期的结果。有的时候实际返回结果和我们预期结果并不一致，原因在于这个查询是分片级别的，不同的分片确实只返回了一个词，但是结果可能来自不同的分片，所以最终会看到多个词。

### 15.4 multi_match query

match 查询的升级版，可以指定多个查询域：

```
GET books/_search
{
  "query": {
    "multi_match": {
      "query": "java",
      "fields": ["name","info"]
    }
  }
}
```

这种查询方式还可以指定字段的权重：

```
GET books/_search
{
  "query": {
    "multi_match": {
      "query": "阳光",
      "fields": ["name^4","info"]
    }
  }
}
```

这个表示关键字出现在 name 中的权重是出现在 info 中权重的 4 倍。

### 15.5 query_string query

query_string 是一种紧密结合 Lucene 的查询方式，在一个查询语句中可以用到 Lucene 的一些查询语法：

```
GET books/_search
{
  "query": {
    "query_string": {
      "default_field": "name",
      "query": "(十一五) AND (计算机)"
    }
  }
}
```

### 15.6 simple_query_string

这个是 query_string 的升级，可以直接使用 +、|、- 代替 AND、OR、NOT 等。

```
GET books/_search
{
  "query": {
    "simple_query_string": {
      "fields": ["name"],
      "query": "(十一五) + (计算机)"
    }
  }
}
```

查询结果和 query_string。

## 16.ElasticSearch词项查询

### 16.1 term query

词项查询。词项查询不会分析查询字符，直接拿查询字符去倒排索引中比对。

```
GET books/_search
{
  "query": {
    "term": {
      "name": "程序设计"
    }
  }
}
```

### 16.2 terms query

词项查询，但是可以给多个关键词。

```
GET books/_search
{
  "query": {
    "terms": {
      "name": ["程序","设计","java"]
    }
  }
}
```

### 16.3 range query

范围查询，可以按照日期范围、数字范围等查询。

range query 中的参数主要有四个：

- gt
- lt
- gte
- lte

案例：

```
GET books/_search
{
  "query": {
    "range": {
      "price": {
        "gte": 10,
        "lt": 20
      }
    }
  },
  "sort": [
    {
      "price": {
        "order": "desc"
      }
    }
  ]
}
```

### 16.4 exists query

exists query 会返回指定字段中至少有一个非空值的文档：

```
GET books/_search
{
  "query": {
    "exists": {
      "field": "javaboy"
    }
  }
}
```

**注意，空字符串也是有值。null 是空值。**

### 16.5 prefix query

前缀查询，效率略低，除非必要，一般不太建议使用。

给定关键词的前缀去查询：

```
GET books/_search
{
  "query": {
    "prefix": {
      "name": {
        "value": "大学"
      }
    }
  }
}
```

### 16.6 wildcard query

wildcard query 即通配符查询。支持单字符和多字符通配符：

- ？表示一个任意字符。
- `*` 表示零个或者多个字符。

查询所有姓张的作者的书：

```
GET books/_search
{
  "query": {
    "wildcard": {
      "author": {
        "value": "张*"
      }
    }
  }
}
```

查询所有姓张并且名字只有两个字的作者的书：

```
GET books/_search
{
  "query": {
    "wildcard": {
      "author": {
        "value": "张?"
      }
    }
  }
}
```

### 16.7 regexp query

支持正则表达式查询。

查询所有姓张并且名字只有两个字的作者的书：

```
GET books/_search
{
  "query": {
    "regexp": {
      "author": "张."
    }
  }
}
```

### 16.8 fuzzy query

在实际搜索中，有时我们可能会打错字，从而导致搜索不到，在 match query 中，可以通过 fuzziness 属性实现模糊查询。

fuzzy query 返回与搜索关键字相似的文档。怎么样就算相似？以LevenShtein 编辑距离为准。编辑距离是指将一个字符变为另一个字符所需要更改字符的次数，更改主要包括四种：

- 更改字符（javb--〉java）
- 删除字符（javva--〉java）
- 插入字符（jaa--〉java）
- 转置字符（ajva--〉java）

为了找到相似的词，模糊查询会在指定的编辑距离中创建搜索关键词的所有可能变化或者扩展的集合，然后进行搜索匹配。

```
GET books/_search
{
  "query": {
    "fuzzy": {
      "name": "javba"
    }
  }
}
```

### 16.9 ids query

根据指定的 id 查询。

```
GET books/_search
{
  "query": {
    "ids":{
      "values":  [1,2,3]
    }
  }
}
```

## 17.ElasticSearch 复合查询

### 17.1 constant_score query

当我们不关心检索词项的频率（TF）对搜索结果排序的影响时，可以使用 constant_score 将查询语句或者过滤语句包裹起来。一般来说词项出现次数多会靠前？

```
GET books/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "term": {
          "name": "java"
        }
      },
      "boost": 1.5
    }
  }
}
```

### 17.2 bool query

bool query 可以将任意多个简单查询组装在一起，有四个关键字可供选择，四个关键字所描述的条件可以有一个或者多个。

- must：文档必须匹配 must 选项下的查询条件。
- should：文档可以匹配 should 下的查询条件，也可以不匹配。
- must_not：文档必须不满足 must_not 选项下的查询条件。
- filter：类似于 must，但是 filter 不评分，只是过滤数据。

例如查询 name 属性中必须包含 java，同时书价不在 [0,35] 区间内，info 属性可以包含 程序设计 也可以不包含程序 设计：

```
GET books/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "name": {
              "value": "java"
            }
          }
        }
      ],
      "must_not": [
        {
          "range": {
            "price": {
              "gte": 0,
              "lte": 35
            }
          }
        }
      ],
      "should": [
        {
          "match": {
            "info": "程序设计"
          }
        }
      ]
    }
  }
}
```

这里还涉及到一个关键字，`minmum_should_match` 参数。

`minmum_should_match` 参数在 es 官网上称作最小匹配度。在之前学习的 `multi_match` 或者这里的 should 查询中，都可以设置 `minmum_should_match` 参数。

假设我们要做一次查询，查询 name 中包含 语言程序设计 关键字的文档：

```
GET books/_search
{
  "query": {
    "match": {
      "name": "语言程序设计"
    }
  }
}
```

在这个查询过程中，首先会进行分词，分词方式如下：

```
GET books/_analyze
{
  "text": ["语言程序设计"],
  "analyzer": "ik_max_word"
}
```

分词后的 term 会构造成一个 should 的 bool query，每一个 term 都会变成一个 term query 的子句。换句话说，上面的查询和下面的查询等价：

```
GET books/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "term": {
            "name": {
              "value": "语言"
            }
          }
        },
        {
          "term": {
            "name": {
              "value": "程序设计"
            }
          }
        },
        {
          "term": {
            "name": {
              "value": "程序"
            }
          }
        },
        {
          "term": {
            "name": {
              "value": "设计"
            }
          }
        }
      ]
    }
  }
}
```

在这两个查询语句中，都是文档只需要包含词项中的任意一项即可，文档就回被返回，在 match 查询中，可以通过 operator 参数设置文档必须匹配所有词项。

如果想匹配一部分词项，就涉及到一个参数，就是 `minmum_should_match`，即最小匹配度。即至少匹配多少个词。

```
GET books/_search
{
  "query": {
    "match": {
      "name": {
        "query": "语言程序设计",
        "operator": "and"
      }
    }
  }
}

GET books/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "term": {
            "name": {
              "value": "语言"
            }
          }
        },
        {
          "term": {
            "name": {
              "value": "程序设计"
            }
          }
        },
        {
          "term": {
            "name": {
              "value": "程序"
            }
          }
        },
        {
          "term": {
            "name": {
              "value": "设计"
            }
          }
        }
      ],
      "minimum_should_match": "50%"
    }
  },
  "from": 0,
  "size": 70
}
```

50% 表示词项个数的 50%。

如下两个查询等价（参数 4 是因为查询关键字分词后有 4 项）：

```
GET books/_search
{
  "query": {
    "match": {
      "name": {
        "query": "语言程序设计",
        "minimum_should_match": 4
      }
    }
  }
}
GET books/_search
{
  "query": {
    "match": {
      "name": {
        "query": "语言程序设计",
        "operator": "and"
      }
    }
  }
}
```

### 17.3 dis_max query

假设现在有两本书：

```
PUT blog
{
  "mappings": {
    "properties": {
      "title":{
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "content":{
        "type": "text",
        "analyzer": "ik_max_word"
      }
    }
  }
}

POST blog/_doc
{
  "title":"如何通过Java代码调用ElasticSearch",
  "content":"松哥力荐，这是一篇很好的解决方案"
}

POST blog/_doc
{
  "title":"初识 MongoDB",
  "content":"简单介绍一下 MongoDB，以及如何通过 Java 调用 MongoDB，MongoDB 是一个不错 NoSQL 解决方案"
}
```

现在假设搜索 **Java解决方案** 关键字，但是不确定关键字是在 title 还是在 content，所以两者都搜索：

```
GET blog/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "title": "java解决方案"
          }
        },
        {
          "match": {
            "content": "java解决方案"
          }
        }
      ]
    }
  }
}
```

搜索结果如下：

```
{
  "took" : 882,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.1972204,
    "hits" : [
      {
        "_index" : "blog",
        "_type" : "_doc",
        "_id" : "HhK653gBeADYd85qxnL3",
        "_score" : 1.1972204,
        "_source" : {
          "title" : "如何通过Java代码调用ElasticSearch",
          "content" : "松哥力荐，这是一篇很好的解决方案"
        }
      },
      {
        "_index" : "blog",
        "_type" : "_doc",
        "_id" : "HxK753gBeADYd85qCnLy",
        "_score" : 1.1069256,
        "_source" : {
          "title" : "初识 MongoDB",
          "content" : "简单介绍一下 MongoDB，以及如何通过 Java 调用 MongoDB，MongoDB 是一个不错 NoSQL 解决方案"
        }
      }
    ]
  }
}
```

要理解这个原因，我们需要来看下 should query 中的评分策略：

1. 首先会执行 should 中的两个查询
2. 对两个查询结果的评分求和
3. 对求和结果乘以匹配语句总数
4. 在对第三步的结果除以所有语句总数

反映到具体的查询中：

**前者**

1. title 中 包含 java，假设评分是 1.1
2. content 中包含解决方案，假设评分是 1.2
3. 有得分的 query 数量，这里是 2
4. 总的 query 数量也是 2

最终结果：`（1.1+1.2）*2/2=2.3`

**后者**

1. title 中 不包含查询关键字，没有得分
2. content 中包含解决方案和 java，假设评分是 2
3. 有得分的 query 数量，这里是 1
4. 总的 query 数量也是 2

最终结果：`2*1/2=1`

在这种查询中，title 和 content 相当于是相互竞争的关系，所以我们需要找到一个最佳匹配字段。

为了解决这一问题，就需要用到 dis_max query（disjunction max query，分离最大化查询）：匹配的文档依然返回，但是只将最佳匹配的评分作为查询的评分。

```
GET blog/_search
{
  "query": {
    "dis_max": {
      "queries": [
        {
          "match": {
            "title": "java解决方案"
          }
        },
        {
          "match": {
            "content": "java解决方案"
          }
        }
        ]
    }
  }
}
```

查询结果如下：

```
{
  "took" : 14,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.1069256,
    "hits" : [
      {
        "_index" : "blog",
        "_type" : "_doc",
        "_id" : "HxK753gBeADYd85qCnLy",
        "_score" : 1.1069256,
        "_source" : {
          "title" : "初识 MongoDB",
          "content" : "简单介绍一下 MongoDB，以及如何通过 Java 调用 MongoDB，MongoDB 是一个不错 NoSQL 解决方案"
        }
      },
      {
        "_index" : "blog",
        "_type" : "_doc",
        "_id" : "HhK653gBeADYd85qxnL3",
        "_score" : 0.62177753,
        "_source" : {
          "title" : "如何通过Java代码调用ElasticSearch",
          "content" : "松哥力荐，这是一篇很好的解决方案"
        }
      }
    ]
  }
}
```

在 dis_max query 中，还有一个参数 `tie_breaker`（取值在0～1），在 dis_max query 中，是完全不考虑其他 query 的分数，只是将最佳匹配的字段的评分返回。但是，有的时候，我们又不得不考虑一下其他 query 的分数，此时，可以通过 `tie_breaker` 来优化 dis_max query。`tie_breaker` 会将其他 query 的分数，乘以 `tie_breaker`，然后和分数最高的 query 进行一个综合计算。

### 17.4 function_score query

场景：例如想要搜索附近的肯德基，搜索的关键字是肯德基，但是我希望能够将评分较高的肯德基优先展示出来。但是默认的评分策略是没有办法考虑到餐厅评分的，他只是考虑相关性，这个时候可以通过 function_score query 来实现。

准备两条测试数据：

```
PUT blog
{
  "mappings": {
    "properties": {
      "title":{
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "votes":{
        "type": "integer"
      }
    }
  }
}

PUT blog/_doc/1
{
  "title":"Java集合详解",
  "votes":100
}

PUT blog/_doc/2
{
  "title":"Java多线程详解，Java锁详解",
  "votes":10
}
```

现在搜索标题中包含 java 关键字的文档：

```
GET blog/_search
{
  "query": {
    "match": {
      "title": "java"
    }
  }
}
```

查询结果如下：

```
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 0.22534126,
    "hits" : [
      {
        "_index" : "blog",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 0.22534126,
        "_source" : {
          "title" : "Java多线程详解，Java锁详解",
          "votes" : 10
        }
      },
      {
        "_index" : "blog",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.21799318,
        "_source" : {
          "title" : "Java集合详解",
          "votes" : 100
        }
      }
    ]
  }
}
```

默认情况下，id 为 2 的记录得分较高，因为他的 title 中包含两个 java。

如果我们在查询中，希望能够充分考虑 votes 字段，将 votes 较高的文档优先展示，就可以通过 function_score 来实现。

具体的思路，就是在旧的得分基础上，根据 votes 的数值进行综合运算，重新得出一个新的评分。

具体有几种不同的计算方式：

- weight
- random_score
- script_score
- field_value_factor

**weight**

weight 可以对评分设置权重，就是在旧的评分基础上乘以 weight，他其实无法解决我们上面所说的问题。具体用法如下：

```
GET blog/_search
{
  "query": {
    "function_score": {
      "query": {
        "match": {
          "title": "java"
        }
      },
      "functions": [
        {
          "weight": 10
        }
      ]
    }
  }
}
```

查询结果如下：

```
{
  "took" : 11,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 2.2534127,
    "hits" : [
      {
        "_index" : "blog",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 2.2534127,
        "_source" : {
          "title" : "Java多线程详解，Java锁详解",
          "votes" : 10
        }
      },
      {
        "_index" : "blog",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 2.1799319,
        "_source" : {
          "title" : "Java集合详解",
          "votes" : 100
        }
      }
    ]
  }
}
```

可以看到，此时的评分，在之前的评分基础上`*`10

**random_score**

`random_score` 会根据 uid 字段进行 hash 运算，生成分数，使用 `random_score` 时可以配置一个种子，如果不配置，默认使用当前时间。

```
GET blog/_search
{
  "query": {
    "function_score": {
      "query": {
        "match": {
          "title": "java"
        }
      },
      "functions": [
        {
          "random_score": {}
        }
      ]
    }
  }
}
```

**script_score**

自定义评分脚本。假设每个文档的最终得分是旧的分数加上votes。查询方式如下：

```
GET blog/_search
{
  "query": {
    "function_score": {
      "query": {
        "match": {
          "title": "java"
        }
      },
      "functions": [
        {
          "script_score": {
            "script": {
              "lang": "painless",
              "source": "_score + doc['votes'].value"
            }
          }
        }
      ]
    }
  }
}
```

现在，最终得分是 `(oldScore+votes)*oldScore`。

**多了`，` 都会提示错误**

如果不想乘以 oldScore，查询方式如下：

```
GET blog/_search
{
  "query": {
    "function_score": {
      "query": {
        "match": {
          "title": "java"
        }
      },
      "functions": [
        {
          "script_score": {
            "script": {
              "lang": "painless",
              "source": "_score + doc['votes'].value"
            }
          }
        }
      ],
      "boost_mode": "replace"
    }
  }
}
```

通过 `boost_mode` 参数，可以设置最终的计算方式。该参数还有其他取值：

- multiply：分数相乘
- sum：分数相加
- avg：求平均数
- max：最大分
- min：最小分
- replace：不进行二次计算

**field_value_factor**

这个的功能类似于 `script_score`，但是不用自己写脚本。

假设每个文档的最终得分是旧的分数乘以votes。查询方式如下：

```
GET blog/_search
{
  "query": {
    "function_score": {
      "query": {
        "match": {
          "title": "java"
        }
      },
      "functions": [
        {
          "field_value_factor": {
            "field": "votes"
          }
        }
      ]
    }
  }
}
```

默认的得分就是`oldScore*votes`。

还可以利用 es 内置的函数进行一些更复杂的运算：

```
GET blog/_search
{
  "query": {
    "function_score": {
      "query": {
        "match": {
          "title": "java"
        }
      },
      "functions": [
        {
          "field_value_factor": {
            "field": "votes",
            "modifier": "sqrt"
          }
        }
      ],
      "boost_mode": "replace"
    }
  }
}
```

此时，最终的得分是（sqrt(votes)）。

modifier 中可以设置内置函数，其他的内置函数还有：

| 参数名     | 含义                    |
| ---------- | ----------------------- |
| none       | 默认的，不进行任何计算  |
| log        | 对字段值取对数          |
| log1p      | 字段值+1 然后取对数     |
| log2p      | 字段值+2 然后取对数     |
| ln         | 取字段值的自然对数      |
| ln1p       | 字段值+1 然后取自然对数 |
| ln2p       | 字段值+2 然后取自然对数 |
| sqrt       | 字段值求平方根          |
| square     | 字段值的平方            |
| reciprocal | 倒数                    |

另外还有个参数 factor ，影响因子。字段值先乘以影响因子，然后再进行计算。以 sqrt 为例，计算方式为 `sqrt(factor*votes)`：

```
GET blog/_search
{
  "query": {
    "function_score": {
      "query": {
        "match": {
          "title": "java"
        }
      },
      "functions": [
        {
          "field_value_factor": {
            "field": "votes",
            "modifier": "sqrt",
            "factor": 10
          }
        }
      ],
      "boost_mode": "replace"
    }
  }
}
```

还有一个参数 `max_boost`，控制计算结果的范围：

```
GET blog/_search
{
  "query": {
    "function_score": {
      "query": {
        "match": {
          "title": "java"
        }
      },
      "functions": [
        {
          "field_value_factor": {
            "field": "votes"
          }
        }
      ],
      "boost_mode": "sum",
      "max_boost": 100
    }
  }
}
```

`max_boost` 参数表示 functions 模块中，最终的计算结果上限。如果超过上限，就按照上线计算。

### 17.5 boosting query

boosting query 中包含三部分：

- positive：得分不变
- negative：降低得分
- negative_boost：降低的权重

```
GET books/_search
{
  "query": {
    "boosting": {
      "positive": {
        "match": {
          "name": "java"
        }
      },
      "negative": {
        "match": {
          "name": "2008"
        }
      },
      "negative_boost": 0.5
    }
  }
}
```

查询结果如下：

```
{
  "took" : 15,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 4.5299835,
    "hits" : [
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "549",
        "_score" : 4.5299835,
        "_source" : {
          "name" : "全国计算机等级考试笔试＋上机全真模拟：二级Java语言程序设计（最新版）",
          "publish" : "高等教育出版社",
          "type" : "考试认证",
          "author" : "",
          "info" : "为了更好地服务于考生，引导考生尽快掌握考试大纲中要求的知识点和技能，顺利通过计算机等级考试，根据最新的考试大纲，高等教育出版社组织长期从事计算机等级考试命题研究和培训工作的专家编写了这套“笔试+上机考试全真模拟”，全面模拟考试真题，让考生在做题的同时全面巩固复习考点，提前熟悉考试环境，在短时间内冲刺过关。本书内容包括20套笔试模拟题和20套上机模拟题，还给出了参考答案和解析，尤其适合参加计算机等级考试的考生考前实战演练。",
          "price" : 30
        }
      },
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "86",
        "_score" : 2.5018067,
        "_source" : {
          "name" : "全国计算机等级考试2级教程：Java语言程序设计（2008年版）",
          "publish" : "高等教育出版社",
          "type" : "计算机考试",
          "author" : "",
          "info" : "由国家教育部考试中心推出的计算机等级考试是一种客观、公正、科学的专门测试计算机应用人员的计算机知识与技能的全国性考试，它面向社会，服务于社会。本书在教育部考试中心组织下、在全国计算机等级考试委员会指导下，由有关专家执笔编写而成。本书按照《全国计算机等级考试二级Java语言程序设计考试大纲（2007年版）》的要求编写，内容包括：Java体系结构、基本数据类型、流程控制语句、类、数组和字符串操作、输入输出及文件操作、图形用户界面编写、线程和串行化技术、A程序设计以及应用开发工具和安装使用等。本书是参加全国计算机等级考试二级Java语言程序设计的考生的良师益友，是教育部考试中心指定教材，也可作为欲学习Java编程的读者的参考书。",
          "price" : 37
        }
      }
    ]
  }
}
```

可以看到，id 为 86 的文档满足条件，因此它的最终得分在旧的分数上`*0.5`。

## 18.ElasticSearch 嵌套查询

关系型数据库中有表的关联关系，在 es 中，我们也有类似的需求，例如订单表和商品表，在 es 中，这样的一对多一般来说有两种方式：

- 嵌套文档（nested）
- 父子文档

### 18.1 嵌套文档

假设：有一个电影文档，每个电影都有演员信息：

```
PUT movies
{
  "mappings": {
    "properties": {
      "actors":{
        "type": "nested"
      }
    }
  }
}

PUT movies/_doc/1
{
  "name":"霸王别姬",
  "actors":[
    {
      "name":"张国荣",
      "gender":"男"
    },
    {
      "name":"巩俐",
      "gender":"女"
    }
    ]
}
```

注意 actors 类型要是 nested，具体原因参考 10.2.3 小节。

**缺点**

查看文档数量：

```
GET _cat/indices?v
```

查看结果如下：

![image-20210419181937314](https://b2files.173114.xyz/blogimg/20210419181937.png)

添加了1个文档，显示存了3个

这是因为 nested 文档在 es 内部其实也是独立的 lucene 文档，只是在我们查询的时候，es 内部帮我们做了 join 处理，所以最终看起来就像一个独立文档一样。因此这种方案性能并不是特别好。

### 18.2 嵌套查询

这个用来查询嵌套文档：

```
GET movies/_search
{
  "query": {
    "nested": {
      "path": "actors",
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "actors.name": "张国荣"
              }
            },
            {
              "match": {
                "actors.gender": "男"
              }
            }
          ]
        }
      }
    }
  }
}
```

### 18.3 父子文档

相比于嵌套文档，父子文档主要有如下优势：

- 更新父文档时，不会重新索引子文档
- 创建、修改或者删除子文档时，不会影响父文档或者其他的子文档。
- 子文档可以作为搜索结果独立返回。

例如学生和班级的关系：

```
PUT stu_class
{
  "mappings": {
    "properties": {
      "name":{
        "type": "keyword"
      },
      "s_c":{
        "type": "join",
        "relations":{
          "class":"student"
        }
      }
    }
  }
}
```

`s_c` 表示父子文档关系的名字，可以自定义。join 表示这是一个父子文档。relations 里边，class 这个位置是 parent，student 这个位置是 child。

接下来，插入两个父文档：

```
PUT stu_class/_doc/1
{
  "name":"一班",
  "s_c":{
    "name":"class"
  }
}
PUT stu_class/_doc/2
{	
  "name":"二班",
  "s_c":{
    "name":"class"
  }
}
```

再来添加三个子文档：

```
PUT stu_class/_doc/3?routing=1
{
  "name":"zhangsan",
  "s_c":{
    "name":"student",
    "parent":1
  }
}
PUT stu_class/_doc/4?routing=1
{
  "name":"lisi",
  "s_c":{
    "name":"student",
    "parent":1
  }
}
PUT stu_class/_doc/5?routing=2
{
  "name":"wangwu",
  "s_c":{
    "name":"student",
    "parent":2
  }
}
```

首先大家可以看到，子文档都是独立的文档。特别需要注意的地方是，子文档需要和父文档在同一个分片上，所以 routing 关键字的值为父文档的 id。另外，name 属性表明这是一个子文档。

父子文档需要注意的地方：

1. 每个索引只能定义一个 join filed
2. 父子文档需要在同一个分片上（查询，修改需要routing）
3. 可以向一个已经存在的 join filed 上新增关系

### 18.4 has_child query

通过子文档查询父文档使用 `has_child` query。

```
GET stu_class/_search
{
  "query": {
    "has_child": {
      "type": "student",
      "query": {
        "match": {
          "name": "wangwu"
        }
      }
    }
  }
}
```

查询 wangwu 所属的班级。

### 18.5 has_parent query

通过父文档查询子文档：

```
GET stu_class/_search
{
  "query": {
    "has_parent": {
      "parent_type": "class",
      "query": {
        "match": {
          "name": "二班"
        }
      }
    }
  }
}
```

查询二班的学生。但是大家注意，**这种查询没有评分。**

可以使用 parent id 查询子文档：

```
GET stu_class/_search
{
  "query": {
    "parent_id":{
      "type":"student",
      "id":1
    }
  }
}
```

通过 parent id 查询，默认情况下使**用相关性计算分数**。

### 18.6 小结

整体上来说：

1. 普通子对象实现一对多，会损失子文档的边界，子对象之间的属性关系丢失。
2. nested 可以解决第 1 点的问题，但是 nested 有两个缺点：更新主文档的时候要全部更新，不支持子文档属于多个主文档。
   1. 父子文档解决 1、2 点的问题，但是它主要适用于**写多读少**的场景。

## 19.ElasticSearch 地理位置查询

### 19.1 数据准备

创建一个索引：

```
PUT geo
{
  "mappings": {
    "properties": {
      "name":{
        "type": "keyword"
      },
      "location":{
        "type": "geo_point"
      }
    }
  }
}
```

准备一个 geo.json 文件：

```
{"index":{"_index":"geo","_id":1}}
{"name":"西安","location":"34.288991865037524,108.9404296875"}
{"index":{"_index":"geo","_id":2}}
{"name":"北京","location":"39.926588421909436,116.43310546875"}
{"index":{"_index":"geo","_id":3}}
{"name":"上海","location":"31.240985378021307,121.53076171875"}
{"index":{"_index":"geo","_id":4}}
{"name":"天津","location":"39.13006024213511,117.20214843749999"}
{"index":{"_index":"geo","_id":5}}
{"name":"杭州","location":"30.259067203213018,120.21240234375001"}
{"index":{"_index":"geo","_id":6}}
{"name":"武汉","location":"30.581179257386985,114.3017578125"}
{"index":{"_index":"geo","_id":7}}
{"name":"合肥","location":"31.840232667909365,117.20214843749999"}
{"index":{"_index":"geo","_id":8}}
{"name":"重庆","location":"29.592565403314087,106.5673828125"}
```

最后，执行如下命令，批量导入 geo.json 数据：

```
curl -XPOST "http://localhost:9200/geo/_bulk?pretty" -H "content-type:application/json" --data-binary @geo.json
```

可能用到的工具网站：

http://geojson.io/#map=6/32.741/116.521

### 19.2 geo_distance query

给出一个中心点，查询距离该中心点指定范围内的文档：

```
GET geo/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match_all": {}
        }
      ],
      "filter": [
        {
          "geo_distance": {
            "distance": "600km",
            "location": {
              "lat": 34.288991865037524,
              "lon": 108.9404296875
            }
          }
        }
      ]
    }
  }
}
```

以(34.288991865037524,108.9404296875) 为圆心，以 600KM 为半径，这个范围内的数据。

### 19.3 geo_bounding_box query

在某一个矩形内的点，通过两个点锁定一个矩形：

```
GET geo/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match_all": {}
        }
      ],
      "filter": [
        {
          "geo_bounding_box": {
            "location": {
              "top_left": {
                "lat": 32.0639555946604,
                "lon": 118.78967285156249
              },
              "bottom_right": {
                "lat": 29.98824461550903,
                "lon": 122.20642089843749
              }
            }
          }
        }
      ]
    }
  }
}
```

以南京经纬度作为矩形的左上角，以舟山经纬度作为矩形的右下角，构造出来的矩形中，包含上海和杭州两个城市。

### 19.4 geo_polygon query

在某一个多边形范围内的查询。

```
GET geo/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match_all": {}
        }
      ],
      "filter": [
        {
          "geo_polygon": {
            "location": {
              "points": [
                {
                  "lat": 31.793755581217674,
                  "lon": 113.8238525390625
                },
                {
                  "lat": 30.007273923504556,
                  "lon":114.224853515625
                },
                {
                  "lat": 30.007273923504556,
                  "lon":114.8345947265625
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```

给定多个点，由多个点组成的多边形中的数据。	

es7.12出现提示 #! Deprecated field [geo_polygon] used, replaced by [[geo_shape] query where polygons are defined in geojson or wkt]

### 19.5 geo_shape query

`geo_shape` 用来查询图形，针对 `geo_shape`，两个图形之间的关系有：相交、包含、不相交。

新建索引：

```
PUT geo_shape
{
  "mappings": {
    "properties": {
      "name":{
        "type": "keyword"
      },
      "location":{
        "type": "geo_shape"
      }
    }
  }
}
```

然后添加一条线：

```
PUT geo_shape/_doc/1
{
  "name":"西安-郑州",
  "location":{
    "type":"linestring",
    "coordinates":[
      [108.9404296875,34.279914398549934],
      [113.66455078125,34.768691457552706]
      ]
  }
}
```

接下来查询某一个图形中是否包含该线：

```
GET geo_shape/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "match_all": {}
        }
      ],
      "filter": [
        {
          "geo_shape": {
            "location": {
              "shape": {
                "type": "envelope",
                "coordinates": [
                  [
            106.5234375,
            36.80928470205937
          ],
          [
            115.33447265625,
            32.24997445586331
          ]
                ]
              },
              "relation": "within"
            }
          }
        }
      ]
    }
  }
}
```

relation 属性表示两个图形的关系：

- within 包含
- intersects 相交
- disjoint 不相交

## 20.ElasticSearch 特殊查询

### 20.1 more_like_this query

`more_like_this` query 可以实现基于内容的推荐，给定一篇文章，可以查询出和该文章相似的内容。

```
GET books/_search
{
  "query": {
    "more_like_this": {
      "fields": [
        "info"
      ],
      "like": "大学战略",
      "min_term_freq": 1,
      "max_query_terms": 12
    }
  }
}
```

- fields：要匹配的字段，可以有多个
- like：要匹配的文本
- min_term_freq：词项的最低频率，默认是 2。**特别注意，这个是指词项在要匹配的文本中的频率，而不是 es 文档中的频率**
- max_query_terms：query 中包含的最大词项数目
- min_doc_freq：最小的文档频率，搜索的词，至少在多少个文档中出现，少于指定数目，该词会被忽略
- max_doc_freq：最大文档频率
- analyzer：分词器，默认使用字段的分词器
- stop_words：停用词列表
- minmum_should_match

### 20.2 script query

脚本查询，例如查询所有价格大于 200 的图书：

```
GET books/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "script": {
            "script": {
              "lang": "painless",
              "source": "if(doc['price'].size()!=0){doc['price'].value > 200}"
            }
          }
        }
      ]
    }
  }
}
```

### 20.3 percolate query

percolate query 译作渗透查询或者反向查询。

- 正常操作：根据查询语句找到对应的文档 query->document
- percolate query：根据文档，返回与之匹配的查询语句，document->query

应用场景：

- 价格监控
- 库存报警
- 股票警告
- ...

例如阈值告警，假设指定字段值大于阈值，报警提示。

percolate mapping 定义：

```
PUT log
{
  "mappings": {
    "properties": {
      "threshold":{
        "type": "long"
      },
      "count":{
        "type": "long"
      },
      "query":{
        "type":"percolator"
      }
    }
  }
}
```

percolator 类型相当于 keyword、long 以及 integer 等。

插入文档：

```
PUT log/_doc/1
{
  "threshold":10,
  "query":{
    "bool":{
      "must":{
        "range":{
          "count":{
            "gt":10
          }
        }
      }
    }
  }
}
```

最后查询：

```
GET log/_search
{
  "query": {
    "percolate": {
      "field": "query",
      "documents": [
        {
          "count":3
        },
        {
          "count":6
        },
        {
          "count":90
        },
        {
          "count":12
        },
        {
          "count":15
        }
        ]
    }
  }
}
```

查询结果中会列出不满足条件的文档。

查询结果中的 `_percolator_document_slot` 字段表示文档的 position，从 0 开始计。

## 21.ElasticSearch 搜索高亮与排序

### 21.1 搜索高亮

普通高亮，默认会自动添加 em 标签：

```
GET books/_search
{
  "query": {
    "match": {
      "name": "大学"
    }
  },
  "highlight": {
    "fields": {
      "name": {}
    }
  }
}
```

正常来说，我们见到的高亮可能是红色、黄色之类的。

可以自定义高亮标签：

```
GET books/_search
{
  "query": {
    "match": {
      "name": "大学"
    }
  },
  "highlight": {
    "fields": {
      "name": {
        "pre_tags": ["<strong>"],
        "post_tags": ["</strong>"]
      }
    }
  }
}
```

有的时候，虽然我们是在 name 字段中搜索的，但是我们希望 info 字段中，相关的关键字也能高亮：

```
GET books/_search
{
  "query": {
    "match": {
      "name": "大学"
    }
  },
  "highlight": {
    "require_field_match": "false", 
    "fields": {
      "name": {
        "pre_tags": ["<strong>"],
        "post_tags": ["</strong>"]
      },
      "info": {
        "pre_tags": ["<strong>"],
        "post_tags": ["</strong>"]
      }
    }
  }
}
```

**require_field_match**

By default, only fields that contains a query match are highlighted. Set `require_field_match` to `false` to highlight all fields. Defaults to `true`.

### 21.2 排序

排序很简单，默认是按照查询文档的相关度来排序的，即（`_score` 字段）：

```
GET books/_search
{
  "query": {
    "term": {
      "name": {
        "value": "java"
      }
    }
  }
}
```

等价于：

```
GET books/_search
{
  "query": {
    "term": {
      "name": {
        "value": "java"
      }
    }
  },
  "sort": [
    {
      "_score": {
        "order": "desc"
      }
    }
  ]
}
```

match_all 查询只是返回所有文档，不评分，默认按照添加顺序返回，可以通过 `_doc` 字段对其进行排序：

```
GET books/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "_doc": {
        "order": "desc"
      }
    }
  ],
  "size": 20
}
```

es 同时也支持多字段排序。

```
GET books/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "price": {
        "order": "asc"
      }
    },
    {
      "_doc": {
        "order": "desc"
      }
    }
  ],
  "size": 20
}
```

## 22.ElasticSearch 指标聚合

### 22.1 Max Aggregation

统计最大值。例如查询价格最高的书：

```
GET books/_search
{
  "aggs": {
    "max_price": {
      "max": {
        "field": "price"
      }
    }
  }
}
```

```
GET books/_search
{
  "aggs": {
    "max_price": {
      "max": {
        "field": "price",
        "missing": 1000
      }
    }
  }
}
```

如果某个文档中缺少 price 字段，则设置该字段的值为 1000。

也可以通过脚本来查询最大值：

```
GET books/_search
{
  "aggs": {
    "max_price": {
      "max": {
        "script": {
          "source": "if(doc['price'].size()!=0){doc.price.value}"
        }
      }
    }
  }
}
```

使用脚本时，可以先通过 `doc['price'].size()!=0` 去判断文档是否有对应的属性。

### 22.2 Min Aggregation

统计最小值，用法和 Max Aggregation 基本一致：

```
GET books/_search
{
  "aggs": {
    "min_price": {
      "min": {
        "field": "price",
        "missing": 1000
      }
    }
  }
}
```

脚本：

```
GET books/_search
{
  "aggs": {
    "min_price": {
      "min": {
        "script": {
          "source": "if(doc['price'].size()!=0){doc.price.value}"
        }
      }
    }
  }
}
```

### 22.3 Avg Aggregation

统计平均值：

```
GET books/_search
{
  "aggs": {
    "avg_price": {
      "avg": {
        "field": "price"
      }
    }
  }
}

GET books/_search
{
  "aggs": {
    "avg_price": {
      "avg": {
        "script": {
          "source": "if(doc['price'].size()!=0){doc.price.value}"
        }
      }
    }
  }
}
```

### 22.4 Sum Aggregation

求和：

```
GET books/_search
{
  "aggs": {
    "sum_price": {
      "sum": {
        "field": "price"
      }
    }
  }
}

GET books/_search
{
  "aggs": {
    "sum_price": {
      "sum": {
        "script": {
          "source": "if(doc['price'].size()!=0){doc.price.value}"
        }
      }
    }
  }
}
```

### 22.5 Cardinality Aggregation

cardinality aggregation 用于基数统计。类似于 SQL 中的 distinct count(0)：

text 类型是分析型类型，默认是不允许进行聚合操作的，如果相对 text 类型进行聚合操作，需要设置其 fielddata 属性为 true，这种方式虽然可以使 text 类型进行聚合操作，但是无法满足精准聚合，如果需要精准聚合，可以设置字段的子域为 keyword。

**方式一：**

重新定义 books 索引：

```
PUT books
{
  "mappings": {
    "properties": {
      "name":{
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "publish":{
        "type": "text",
        "analyzer": "ik_max_word",
        "fielddata": true
      },
      "type":{
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "author":{
        "type": "keyword"
      },
      "info":{
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "price":{
        "type": "double"
      }
    }
  }
}
```

定义完成后，重新插入数据（参考之前的视频）。

接下来就可以查询出版社的总数量：

```
GET books/_search
{
  "aggs": {
    "publish_count": {
      "cardinality": {
        "field": "publish"
      }
    }
  }
}
```

这种聚合方式可能会不准确。可以将 publish 设置为 keyword 类型或者设置子域为 keyword。

```
PUT books
{
  "mappings": {
    "properties": {
      "name":{
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "publish":{
        "type": "keyword"
      },
      "type":{
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "author":{
        "type": "keyword"
      },
      "info":{
        "type": "text",
        "analyzer": "ik_max_word"
      },
      "price":{
        "type": "double"
      }
    }
  }
}
```

对比查询结果可知，使用 fileddata 的方式，查询结果不准确。

### 22.6 Stats Aggregation

基本统计，一次性返回 count、max、min、avg、sum：

```
GET books/_search
{
  "aggs": {
    "stats_query": {
      "stats": {
        "field": "price"
      }
    }
  }
}
```

### 22.7 Extends Stats Aggregation

高级统计，比 stats 多出来：平方和、方差、标准差、平均值加减两个标准差的区间：

```
GET books/_search
{
  "aggs": {
    "es": {
      "extended_stats": {
        "field": "price"
      }
    }
  }
}
```

### 22.8 Percentiles Aggregation

百分位统计。

```
GET books/_search
{
  "aggs": {
    "p": {
      "percentiles": {
        "field": "price",
        "percents": [
          1,
          5,
          10,
          15,
          25,
          50,
          75,
          95,
          99
        ]
      }
    }
  }
}
```

### 22.9 Value Count Aggregation

可以按照字段统计文档数量（包含指定字段的文档数量）：

```
GET books/_search
{
  "aggs": {
    "count": {
      "value_count": {
        "field": "price"
      }
    }
  }
}
```

## 23.ElasticSearch 桶聚合（bucket）

### 23.1 Terms Aggregation

Terms Aggregation 用于分组聚合，例如，统计各个出版社出版的图书总数量:

```
GET books/_search
{
  "aggs": {
    "NAME": {
      "terms": {
        "field": "publish",
        "size": 20
      }
    }
  }
}
```

在 terms 分桶的基础上，还可以对每个桶进行指标聚合。

统计不同出版社所出版的图书的平均价格：

```
GET books/_search
{
  "aggs": {
    "NAME": {
      "terms": {
        "field": "publish",
        "size": 20
      },
      "aggs": {
        "avg_price": {
          "avg": {
            "field": "price"
          }
        }
      }
    }
  }
}
```

### 23.2 Filter Aggregation

过滤器聚合。可以将符合过滤器中条件的文档分到一个桶中，然后可以求其平均值。

例如查询书名中包含 java 的图书的平均价格：

```
GET books/_search
{
  "aggs": {
    "NAME": {
      "filter": {
        "term": {
          "name": "java"
        }
      },
      "aggs": {
        "avg_price": {
          "avg": {
            "field": "price"
          }
        }
      }
    }
  }
}
```

### 23.3 Filters Aggregation

多过滤器聚合。过滤条件可以有多个。

例如查询书名中包含 java 或者 office 的图书的平均价格：

```
GET books/_search
{
  "aggs": {
    "NAME": {
      "filters": {
        "filters": [
          {
            "term":{
              "name":"java"
            }
          },{
            "term":{
              "name":"office"
            }
          }
          ]
      },
      "aggs": {
        "avg_price": {
          "avg": {
            "field": "price"
          }
        }
      }
    }
  }
}
```

### 23.4 Range Aggregation

按照范围聚合，在某一个范围内的文档数统计。

例如统计图书价格在 0-50、50-100、100-150、150以上的图书数量：

```
GET books/_search
{
  "aggs": {
    "NAME": {
      "range": {
        "field": "price",
        "ranges": [
          {
            "to": 50
          },{
            "from": 50,
            "to": 100
          },{
            "from": 100,
            "to": 150
          },{
            "from": 150
          }
        ]
      }
    }
  }
}
```

### 23.5 Date Range Aggregation

Range Aggregation 也可以用来统计日期，但是也可以使用 Date Range Aggregation，后者的优势在于可以使用日期表达式。

造数据：

```
PUT blog/_doc/1
{
  "title":"java",
  "date":"2018-12-30"
}
PUT blog/_doc/2
{
  "title":"java",
  "date":"2020-12-30"
}
PUT blog/_doc/3
{
  "title":"java",
  "date":"2022-10-30"
}
```

统计一年前到一年后的博客数量：

```
GET blog/_search
{
  "aggs": {
    "NAME": {
      "date_range": {
        "field": "date",
        "ranges": [
          {
            "from": "now-12M/M",
            "to": "now+1y/y"
          }
        ]
      }
    }
  }
}
```

- 12M/M 表示 12 个月。
- 1y/y 表示 1年。
- d 表示天

### 23.6 Date Histogram Aggregation

时间直方图聚合。

例如统计各个月份的博客数量

```
GET blog/_search
{
  "aggs": {
    "NAME": {
      "date_histogram": {
        "field": "date",
        "calendar_interval": "month"
      }
    }
  }
}
```

### 23.7 Missing Aggregation

空值聚合。

统计所有没有 price 字段的文档：

```
GET books/_search
{
  "aggs": {
    "NAME": {
      "missing": {
        "field": "price"
      }
    }
  }
}
```

### 23.8 Children Aggregation

可以根据父子文档关系进行分桶。

查询子类型为 student 的文档数量：

```
GET stu_class/_search
{
  "aggs": {
    "NAME": {
      "children": {
        "type": "student"
      }
    }
  }
}
```

### 23.9 Geo Distance Aggregation

对地理位置数据做统计。

例如查询(34.288991865037524,108.9404296875)坐标方圆 600KM 和 超过 600KM 的城市数量。

```
GET geo/_search
{
  "aggs": {
    "NAME": {
      "geo_distance": {
        "field": "location",
        "origin": "34.288991865037524,108.9404296875",
        "unit": "km", 
        "ranges": [
          {
            "to": 600
          },{
            "from": 600
          }
        ]
      }
    }
  }
}
```

### 23.10 IP Range Aggregation

IP 地址范围查询。

```
GET blog/_search
{
  "aggs": {
    "NAME": {
      "ip_range": {
        "field": "ip",
        "ranges": [
          {
            "from": "127.0.0.5",
            "to": "127.0.0.11"
          }
        ]
      }
    }
  }
}
```

## 24.ElasticSearch 管道聚合 类似于linux的 | 管道符

管道聚合相当于在之前聚合的基础上，再次聚合。

### 24.1 Avg Bucket Aggregation

计算聚合平均值。例如，统计每个出版社所出版图书的平均值，然后再统计所有出版社的平均值：

```
GET books/_search
{
  "aggs": {
    "book_count": {
      "terms": {
        "field": "publish",
        "size": 3
      },
      "aggs": {
        "book_avg": {
          "avg": {
            "field": "price"
          }
        }
      }
    },
    "avg_book":{
      "avg_bucket": {
        "buckets_path": "book_count>book_avg"
      }
    }
  }
}
```

### 24.2 Max Bucket Aggregation

统计每个出版社所出版图书的平均值，然后再统计平均值中的最大值：

```
GET books/_search
{
  "aggs": {
    "book_count": {
      "terms": {
        "field": "publish",
        "size": 3
      },
      "aggs": {
        "book_avg": {
          "avg": {
            "field": "price"
          }
        }
      }
    },
    "avg_book":{
      "max_bucket": {
        "buckets_path": "book_count>book_avg"
      }
    }
  }
}
```

### 24.3 Min Bucket Aggregation

统计每个出版社所出版图书的平均值，然后再统计平均值中的最小值：

```
GET books/_search
{
  "aggs": {
    "book_count": {
      "terms": {
        "field": "publish",
        "size": 3
      },
      "aggs": {
        "book_avg": {
          "avg": {
            "field": "price"
          }
        }
      }
    },
    "avg_book":{
      "min_bucket": {
        "buckets_path": "book_count>book_avg"
      }
    }
  }
}
```

### 24.4 Sum Bucket Aggregation

统计每个出版社所出版图书的平均值，然后再统计平均值之和：

```
GET books/_search
{
  "aggs": {
    "book_count": {
      "terms": {
        "field": "publish",
        "size": 3
      },
      "aggs": {
        "book_avg": {
          "avg": {
            "field": "price"
          }
        }
      }
    },
    "avg_book":{
      "sum_bucket": {
        "buckets_path": "book_count>book_avg"
      }
    }
  }
}
```

### 24.5 Stats Bucket Aggregation

统计每个出版社所出版图书的平均值，然后再统计平均值的各种数据：

```
GET books/_search
{
  "aggs": {
    "book_count": {
      "terms": {
        "field": "publish",
        "size": 3
      },
      "aggs": {
        "book_avg": {
          "avg": {
            "field": "price"
          }
        }
      }
    },
    "avg_book":{
      "stats_bucket": {
        "buckets_path": "book_count>book_avg"
      }
    }
  }
}
```

### 24.6 Extended Stats Bucket Aggregation

```
GET books/_search
{
  "aggs": {
    "book_count": {
      "terms": {
        "field": "publish",
        "size": 3
      },
      "aggs": {
        "book_avg": {
          "avg": {
            "field": "price"
          }
        }
      }
    },
    "avg_book":{
      "extended_stats_bucket": {
        "buckets_path": "book_count>book_avg"
      }
    }
  }
}
```

### 24.7 Percentiles Bucket Aggregation

```
GET books/_search
{
  "aggs": {
    "book_count": {
      "terms": {
        "field": "publish",
        "size": 3
      },
      "aggs": {
        "book_avg": {
          "avg": {
            "field": "price"
          }
        }
      }
    },
    "avg_book":{
      "percentiles_bucket": {
        "buckets_path": "book_count>book_avg"
      }
    }
  }
}
```

## 25.ElasticSearch Java Api 概览

Java操作Es的方案:

### 1.直接使用Http请求

以 HttpUrlConnection 为例，请求方式如下：

```
public class HttpRequestTest {
    public static void main(String[] args) throws IOException {
        URL url = new URL("http://localhost:9200/books/_search?pretty=true");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        if (con.getResponseCode() == 200) {
            BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String str = null;
            while ((str = br.readLine()) != null) {
                System.out.println(str);
            }
        }
    }
}
```

弊端：需要自己组装请求参数，自己去解析响应的json

### 2.Java Low Level REST Client

从字面上来理解，这个叫做低级客户端。

它允许通过 Http 与一个 Elasticsearch 集群通信。将请求的 JSON 参数拼接和响应的 JSON 字符串解析留给用户自己处理。低级客户端最大的优势在于兼容所有的 ElasticSearch 的版本（因为它的 API 并没有封装 JSON 操作，所有的 JSON 操作还是由开发者自己完成），同时低级客户端要求 JDK 为 1.7 及以上。

低级客户端主要包括如下一些功能：

- 最小的依赖
- 跨所有可用节点的负载均衡
- 节点故障和特定响应代码时的故障转移
- 连接失败重试（是否重试失败的节点取决于它失败的连续次数；失败次数越多，客户端在再次尝试同一节点之前等待的时间越长）
- 持久连接
- 跟踪请求和响应的日志记录
- 可选自动发现集群节点

Java Low Level REST Client 的操作其实比较简单，松哥后面会录制一个视频和大家分享相关操作。

### 3.Java High Level REST Client

从字面上来理解，这个叫做高级客户端，也是目前使用最多的一种客户端。它其实有点像之前的 TransportClient。

这个所谓的高级客户端它的内部其实还是基于低级客户端，只不过针对 ElasticSearch 它提供了更多的 API，将请求参数和响应参数都封装成了相应的 API，开发者只需要调用相关的方法就可以拼接参数或者解析响应结果。

Java High Level REST Client 中的每个 API 都可以同步或异步调用，同步方法返回一个响应对象，而异步方法的名称则以 Async 为后缀结尾，异步请求一般需要一个监听器参数，用来处理响应结果。

相对于低级客户端，高级客户端的兼容性就要差很多（因为 JSON 的拼接和解析它已经帮我们做好了）。高级客户端需要 JDK1.8 及以上版本并且依赖版本需要与 ElasticSearch 版本相同（主版本号需要一致，次版本号不必相同）。

举个简单例子：

7.0 客户端能够与任何 7.x ElasticSearch 节点进行通信，而 7.1 客户端肯定能够与 7.1，7.2 和任何后来的 7.x 版本进行通信，但与旧版本的 ElasticSearch 节点通信时可能会存在不兼容的问题。

### 4.其他

ElasticSearch 的 Java 客户端

- TransportClient

- Jest

- Spring Data Elasticsearch

- Java Low Level REST Client

- Java High Level REST Client

**TransportClient**

官方已经不再推荐使用 TransportClient，并且表示会在 ElasticSearch8.0 中完全移除相关支持。

**Jest**

Jest 提供了更流畅的 API 和更容易使用的接口，并且它的版本是遵循 ElasticSearch 的主版本号的，这样可以确保客户端和服务端之间的兼容性。

早期的 ElasticSearch 官方客户端对 RESTful 支持不够完美， Jest 在一定程度上弥补了官方客户端的不足，但是随着近两年官方客户端对 RESTful 功能的增强，Jest 早已成了明日黄花，最近的一次更新也停留在 2018 年 4 月，所以 Jest 小伙伴们也不必花时间去学了，知道曾经有过这么一个东西就行了。

**Spring Data Elasticsearch**

Spring Data 是 Spring 的一个子项目。用于简化数据库访问，支持NoSQL 和关系数据存储。其主要目标是使数据库的访问变得方便快捷。Spring Data 具有如下特点：

Spring Data 项目支持 NoSQL 存储：

- MongoDB （文档数据库）
- Neo4j（图形数据库）
- Redis（键/值存储）
- Hbase（列族数据库）
- ElasticSearch

Spring Data 项目所支持的关系数据存储技术：

- JDBC
- JPA

## 26.ElasticSearch普通HTTP请求

以 HttpUrlConnection 为例，请求方式如下：

```
public class HttpRequestTest {
    public static void main(String[] args) throws IOException {
        URL url = new URL("http://localhost:9200/books/_search?pretty=true");
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        if (con.getResponseCode() == 200) {
            BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            String str = null;
            while ((str = br.readLine()) != null) {
                System.out.println(str);
            }
        }
    }
}
```

弊端：需要自己组装请求参数，自己去解析响应的json

## 27.ElasticSearch Java Low Level REST Client

首先创建一个普通的 Maven 工程，添加如下依赖：

```
<dependencies>
    <dependency>
        <groupId>org.elasticsearch.client</groupId>
        <artifactId>elasticsearch-rest-client</artifactId>
        <version>7.10.0</version>
    </dependency>
</dependencies>
```

然后添加如下代码，发起一个简单的查询请求：

```java
public class LowLevelTest {
    public static void main(String[] args) throws IOException {
        //1.构建一个 RestClient 对象
        RestClientBuilder builder = RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        );
        //2.如果需要在请求头中设置认证信息等，可以通过 builder 来设置
//        builder.setDefaultHeaders(new Header[]{new BasicHeader("key","value")});
        RestClient restClient = builder.build();
        //3.构建请求
        Request request = new Request("GET", "/books/_search");
        //添加请求参数
        request.addParameter("pretty","true");
        //4.发起请求，发起请求有两种方式，可以同步，可以异步
        //这种请求发起方式，会阻塞后面的代码
        Response response = restClient.performRequest(request);
        //5.解析 response，获取响应结果
        BufferedReader br = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
        String str = null;
        while ((str = br.readLine()) != null) {
            System.out.println(str);
        }
        br.close();
        //最后记得关闭 RestClient
        restClient.close();
    }
}
```

这个查询请求，是一个同步请求，在请求的过程中，后面的代码会被阻塞，如果不希望后面的代码被阻塞，可以使用异步请求。

```java
public class LowLevelTest2 {
    public static void main(String[] args) throws IOException {
        //1.构建一个 RestClient 对象
        RestClientBuilder builder = RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        );
        //2.如果需要在请求头中设置认证信息等，可以通过 builder 来设置
//        builder.setDefaultHeaders(new Header[]{new BasicHeader("key","value")});
        RestClient restClient = builder.build();
        //3.构建请求
        Request request = new Request("GET", "/books/_search");
        //添加请求参数
        request.addParameter("pretty","true");
        //4.发起请求，发起请求有两种方式，可以同步，可以异步
        //异步请求
        restClient.performRequestAsync(request, new ResponseListener() {
            //请求成功的回调
            @Override
            public void onSuccess(Response response) {
                //5.解析 response，获取响应结果
                try {
                    BufferedReader br = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
                    String str = null;
                    while ((str = br.readLine()) != null) {
                        System.out.println(str);
                    }
                    br.close();
                    //最后记得关闭 RestClient
                    restClient.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            //请求失败的回调
            @Override
            public void onFailure(Exception e) {

            }
        });
    }
}
```

开发者在请求时，也可以携带 JSON 参数。

```java
public class LowLevelTest3 {
    public static void main(String[] args) throws IOException {
        //1.构建一个 RestClient 对象
        RestClientBuilder builder = RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        );
        //2.如果需要在请求头中设置认证信息等，可以通过 builder 来设置
//        builder.setDefaultHeaders(new Header[]{new BasicHeader("key","value")});
        RestClient restClient = builder.build();
        //3.构建请求
        Request request = new Request("GET", "/books/_search");
        //添加请求参数
        request.addParameter("pretty","true");
        //添加请求体
        request.setEntity(new NStringEntity("{\"query\": {\"term\": {\"name\": {\"value\": \"java\"}}}}", ContentType.APPLICATION_JSON));
        //4.发起请求，发起请求有两种方式，可以同步，可以异步
        //异步请求
        restClient.performRequestAsync(request, new ResponseListener() {
            //请求成功的回调
            @Override
            public void onSuccess(Response response) {
                //5.解析 response，获取响应结果
                try {
                    BufferedReader br = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
                    String str = null;
                    while ((str = br.readLine()) != null) {
                        System.out.println(str);
                    }
                    br.close();
                    //最后记得关闭 RestClient
                    restClient.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            //请求失败的回调
            @Override
            public void onFailure(Exception e) {

            }
        });
    }
}
```

## 28.Java High Level REST Client

### 28.1 索引管理

#### 28.1.1 创建索引

首先创建一个普通的 Maven 项目，然后引入 high level rest client 依赖：

```
<dependencies>
    <dependency>
        <groupId>org.elasticsearch.client</groupId>
        <artifactId>elasticsearch-rest-high-level-client</artifactId>
        <version>7.10.0</version>
    </dependency>
</dependencies>
```

需要注意，依赖的版本和 Es 的版本要对应。

创建一个索引：

```
public class HighLevelTest {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        //删除已经存在的索引
        DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest("blog");
        client.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);
        //创建一个索引
        CreateIndexRequest blog1 = new CreateIndexRequest("blog");
        //配置 settings，分片、副本等信息
        blog1.settings(Settings.builder().put("index.number_of_shards", 3).put("index.number_of_replicas", 2));
        //配置字段类型，字段类型可以通过 JSON 字符串、Map 以及 XContentBuilder 三种方式来构建
        //json 字符串的方式
        blog1.mapping("{\"properties\": {\"title\": {\"type\": \"text\"}}}", XContentType.JSON);
        //执行请求，创建索引
        client.indices().create(blog1, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

mapping 的配置，还有另外两种方式：

第一种，通过 map 构建 mapping：

```
public class HighLevelTest {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        //删除已经存在的索引
        DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest("blog");
        client.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);
        //创建一个索引
        CreateIndexRequest blog1 = new CreateIndexRequest("blog");
        //配置 settings，分片、副本等信息
        blog1.settings(Settings.builder().put("index.number_of_shards", 3).put("index.number_of_replicas", 2));
        //配置字段类型，字段类型可以通过 JSON 字符串、Map 以及 XContentBuilder 三种方式来构建
        //json 字符串的方式
//        blog1.mapping("{\"properties\": {\"title\": {\"type\": \"text\"}}}", XContentType.JSON);
        //map 的方式
        Map<String, String> title = new HashMap<>();
        title.put("type", "text");
        Map<String, Object> properties = new HashMap<>();
        properties.put("title", title);
        Map<String, Object> mappings = new HashMap<>();
        mappings.put("properties", properties);
        blog1.mapping(mappings);
        //执行请求，创建索引
        client.indices().create(blog1, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

第二种，通过 XContentBuilder 构建 mapping：

```
public class HighLevelTest {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        //删除已经存在的索引
        DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest("blog");
        client.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);
        //创建一个索引
        CreateIndexRequest blog1 = new CreateIndexRequest("blog");
        //配置 settings，分片、副本等信息
        blog1.settings(Settings.builder().put("index.number_of_shards", 3).put("index.number_of_replicas", 2));
        //配置字段类型，字段类型可以通过 JSON 字符串、Map 以及 XContentBuilder 三种方式来构建
        //json 字符串的方式
//        blog1.mapping("{\"properties\": {\"title\": {\"type\": \"text\"}}}", XContentType.JSON);
        //map 的方式
//        Map<String, String> title = new HashMap<>();
//        title.put("type", "text");
//        Map<String, Object> properties = new HashMap<>();
//        properties.put("title", title);
//        Map<String, Object> mappings = new HashMap<>();
//        mappings.put("properties", properties);
//        blog1.mapping(mappings);
        //XContentBuilder 方式
        XContentBuilder builder = XContentFactory.jsonBuilder();
        builder.startObject();
        builder.startObject("properties");
        builder.startObject("title");
        builder.field("type", "text");
        builder.endObject();
        builder.endObject();
        builder.endObject();
        blog1.mapping(builder);
        //执行请求，创建索引
        client.indices().create(blog1, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

还可以给索引配置别名：

```
public class HighLevelTest {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        //删除已经存在的索引
        DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest("blog");
        client.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);
        //创建一个索引
        CreateIndexRequest blog1 = new CreateIndexRequest("blog");
        //配置 settings，分片、副本等信息
        blog1.settings(Settings.builder().put("index.number_of_shards", 3).put("index.number_of_replicas", 2));
        //配置字段类型，字段类型可以通过 JSON 字符串、Map 以及 XContentBuilder 三种方式来构建
        //json 字符串的方式
//        blog1.mapping("{\"properties\": {\"title\": {\"type\": \"text\"}}}", XContentType.JSON);
        //map 的方式
//        Map<String, String> title = new HashMap<>();
//        title.put("type", "text");
//        Map<String, Object> properties = new HashMap<>();
//        properties.put("title", title);
//        Map<String, Object> mappings = new HashMap<>();
//        mappings.put("properties", properties);
//        blog1.mapping(mappings);
        //XContentBuilder 方式
        XContentBuilder builder = XContentFactory.jsonBuilder();
        builder.startObject();
        builder.startObject("properties");
        builder.startObject("title");
        builder.field("type", "text");
        builder.endObject();
        builder.endObject();
        builder.endObject();
        blog1.mapping(builder);
        //配置别名
        blog1.alias(new Alias("blog_alias"));
        //执行请求，创建索引
        client.indices().create(blog1, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

如果觉得调 API 太麻烦，也可以直接上 JSON：

```
public class HighLevelTest2 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        //删除已经存在的索引
        DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest("blog");
        client.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);
        //创建一个索引
        CreateIndexRequest blog1 = new CreateIndexRequest("blog");
        //直接同构 JSON 配置索引
            blog1.source("{\"settings\": {\"number_of_shards\": 3,\"number_of_replicas\": 2},\"mappings\": {\"properties\": {\"title\": {\"type\": \"keyword\"}}},\"aliases\": {\"blog_alias_javaboy\": {}}}", XContentType.JSON);
        //执行请求，创建索引
        client.indices().create(blog1, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

另外还有一些其他的可选配置：

```
public class HighLevelTest2 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        //删除已经存在的索引
        DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest("blog");
        client.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);
        //创建一个索引
        CreateIndexRequest blog1 = new CreateIndexRequest("blog");
        //直接同构 JSON 配置索引
        blog1.source("{\"settings\": {\"number_of_shards\": 3,\"number_of_replicas\": 2},\"mappings\": {\"properties\": {\"title\": {\"type\": \"keyword\"}}},\"aliases\": {\"blog_alias_javaboy\": {}}}", XContentType.JSON);
        //请求超时时间，连接所有节点的超时时间
        blog1.setTimeout(TimeValue.timeValueMinutes(2));
        //连接 master 节点的超时时间
        blog1.setMasterTimeout(TimeValue.timeValueMinutes(1));
        //执行请求，创建索引
        client.indices().create(blog1, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

前面所有的请求都是同步的，会阻塞的，也可以异步：

```
public class HighLevelTest2 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        //删除已经存在的索引
        DeleteIndexRequest deleteIndexRequest = new DeleteIndexRequest("blog");
        client.indices().delete(deleteIndexRequest, RequestOptions.DEFAULT);
        //创建一个索引
        CreateIndexRequest blog1 = new CreateIndexRequest("blog");
        //直接同构 JSON 配置索引
        blog1.source("{\"settings\": {\"number_of_shards\": 3,\"number_of_replicas\": 2},\"mappings\": {\"properties\": {\"title\": {\"type\": \"keyword\"}}},\"aliases\": {\"blog_alias_javaboy\": {}}}", XContentType.JSON);
        //请求超时时间，连接所有节点的超时时间
        blog1.setTimeout(TimeValue.timeValueMinutes(2));
        //连接 master 节点的超时时间
        blog1.setMasterTimeout(TimeValue.timeValueMinutes(1));
        //执行请求，创建索引
//        client.indices().create(blog1, RequestOptions.DEFAULT);
        //异步创建索引
        client.indices().createAsync(blog1, RequestOptions.DEFAULT, new ActionListener<CreateIndexResponse>() {
            //请求成功
            @Override
            public void onResponse(CreateIndexResponse createIndexResponse) {
                //关闭 client
                try {
                    client.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            //请求失败
            @Override
            public void onFailure(Exception e) {

            }
        });
        //关闭 client
//        client.close();
    }
}
```

#### 28.1.2 查询索引是否存在

```
public class HighLevelTest3 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        GetIndexRequest blog = new GetIndexRequest("blog2");
        boolean exists = client.indices().exists(blog, RequestOptions.DEFAULT);
        System.out.println("exists = " + exists);
        //关闭 client
        client.close();
    }
}
```

#### 28.1.3 关闭/打开索引

关闭：

```
public class HighLevelTest4 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        CloseIndexRequest blog = new CloseIndexRequest("blog");
        CloseIndexResponse close = client.indices().close(blog, RequestOptions.DEFAULT);
        List<CloseIndexResponse.IndexResult> indices = close.getIndices();
        for (CloseIndexResponse.IndexResult index : indices) {
            System.out.println("index.getIndex() = " + index.getIndex());
        }
        //关闭 client
        client.close();
    }
}
```

触发warning["the default value for the ?wait_for_active_shards parameter will change from '0' to 'index-setting' in version 8; specify '?wait_for_active_shards=index-setting' to adopt the future default behaviour, or '?wait_for_active_shards=0' to preserve today's behaviour"]

打开：

```
public class HighLevelTest4 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        OpenIndexRequest blog = new OpenIndexRequest("blog");
        client.indices().open(blog, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

#### 28.1.4 索引修改

```
public class HighLevelTest5 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        UpdateSettingsRequest request = new UpdateSettingsRequest("blog");
        request.settings(Settings.builder().put("index.blocks.write", true).build());
        client.indices().putSettings(request, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

#### 28.1.5 克隆索引

被克隆的索引需要是只读索引，可以通过 28.1.4 小节中的方式设置索引为只读。

```
public class HighLevelTest6 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        ResizeRequest request = new ResizeRequest("blog2", "blog");
        client.indices().clone(request, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

#### 28.1.6 查看索引

```
public class HighLevelTest7 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        GetSettingsRequest request = new GetSettingsRequest().indices("blog");
        //设置需要互殴去的具体的参数，不设置则返回所有参数
        request.names("index.blocks.write");
        GetSettingsResponse response = client.indices().getSettings(request, RequestOptions.DEFAULT);
        ImmutableOpenMap<String, Settings> indexToSettings = response.getIndexToSettings();
        System.out.println(indexToSettings);
        String s = response.getSetting("blog", "index.number_of_replicas");
        System.out.println(s);
        //关闭 client
        client.close();
    }
}
```

#### 28.1.7 Refresh & Flush

Es 底层依赖 Lucene，而 Lucene 中有 reopen 和 commit 两种操作，还有一个特殊的概念叫做 segment。

Es 中，基本的存储单元是 shard，对应到 Lucene 上，就是一个索引，Lucene 中的索引由 segment 组成，每个 segment 相当于 es 中的倒排索引。每个 es 文档创建时，都会写入到一个新的 segment 中，删除文档时，只是从属于它的 segment 处标记为删除，并没有从磁盘中删除。

Lucene 中：

reopen 可以让数据搜索到，但是不保证数据被持久化到磁盘中。

commit 可以让数据持久化。

Es 中：

默认是每秒 refresh 一次（Es 中文档被索引之后，首先添加到内存缓冲区，refresh 操作将内存缓冲区中的数据拷贝到新创建的 segment 中，这里是在内存中操作的）。

flush 将内存中的数据持久化到磁盘中。一般来说，flush 的时间间隔比较久，默认 30 分钟。

```
public class HighLevelTest8 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        RefreshRequest request = new RefreshRequest("blog");
        client.indices().refresh(request, RequestOptions.DEFAULT);
        FlushRequest flushRequest = new FlushRequest("blog");
        client.indices().flush(flushRequest, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

#### 28.1.9 索引别名

索引的别名类似于 MySQL 中的视图。

##### 28.1.9.1 添加别名

添加一个普通的别名：

```
public class HighLevelTest9 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        IndicesAliasesRequest indicesAliasesRequest = new IndicesAliasesRequest();
        IndicesAliasesRequest.AliasActions aliasAction = new IndicesAliasesRequest.AliasActions(IndicesAliasesRequest.AliasActions.Type.ADD);
        aliasAction.index("books").alias("books_alias");
        indicesAliasesRequest.addAliasAction(aliasAction);
        client.indices().updateAliases(indicesAliasesRequest, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

添加一个带 filter 的别名：

```
public class HighLevelTest9 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        IndicesAliasesRequest indicesAliasesRequest = new IndicesAliasesRequest();
        IndicesAliasesRequest.AliasActions aliasAction = new IndicesAliasesRequest.AliasActions(IndicesAliasesRequest.AliasActions.Type.ADD);
        aliasAction.index("books").alias("books_alias2").filter("{\"term\": {\"name\": \"java\"}}");
        indicesAliasesRequest.addAliasAction(aliasAction);
        client.indices().updateAliases(indicesAliasesRequest, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

现在，books 索引将存在两个别名，其中，books_alias2 自动过滤 name 中含有 java 的文档。

##### 28.1.9.2 删除别名

```
public class HighLevelTest9 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        IndicesAliasesRequest indicesAliasesRequest = new IndicesAliasesRequest();
        IndicesAliasesRequest.AliasActions aliasAction = new IndicesAliasesRequest.AliasActions(IndicesAliasesRequest.AliasActions.Type.REMOVE);
        aliasAction.index("books").alias("books_alias");
        indicesAliasesRequest.addAliasAction(aliasAction);
        client.indices().updateAliases(indicesAliasesRequest, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

第二种移除方式：

```
public class HighLevelTest9 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        DeleteAliasRequest deleteAliasRequest = new DeleteAliasRequest("books", "books_alias2");
        client.indices().deleteAlias(deleteAliasRequest, RequestOptions.DEFAULT);
        //关闭 client
        client.close();
    }
}
```

##### 28.1.9.3 判断别名是否存在

```
public class HighLevelTest9 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        GetAliasesRequest books_alias = new GetAliasesRequest("books_alias");
        //指定查看某一个索引的别名，不指定，则会搜索所有的别名
        books_alias.indices("books");
        boolean b = client.indices().existsAlias(books_alias, RequestOptions.DEFAULT);
        System.out.println(b);
        //关闭 client
        client.close();
    }
}
```

##### 28.1.9.4 获取别名

```
public class HighLevelTest9 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        GetAliasesRequest books_alias = new GetAliasesRequest("books_alias");
        //指定查看某一个索引的别名，不指定，则会搜索所有的别名
        books_alias.indices("books");
        GetAliasesResponse response = client.indices().getAlias(books_alias, RequestOptions.DEFAULT);
        Map<String, Set<AliasMetadata>> aliases = response.getAliases();
        System.out.println("aliases = " + aliases);
        //关闭 client
        client.close();
    }
}
```

### 29.1 添加文档

```
public class DocTest01 {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        //构建一个 IndexRequest 请求，参数就是索引名称
        IndexRequest request = new IndexRequest("book");
        //给请求配置一个 id，这个就是文档 id。如果指定了 id，相当于 put book/_doc/id ，也可以不指定 id，相当于 post book/_doc
//        request.id("1");
        //构建索引文本，有三种方式：JSON 字符串、Map 对象、XContentBuilder
        request.source("{\"name\": \"三国演义\",\"author\": \"罗贯中\"}", XContentType.JSON);
        //执行请求，有同步和异步两种方式
        //同步
        IndexResponse indexResponse = client.index(request, RequestOptions.DEFAULT);
        //获取文档id
        String id = indexResponse.getId();
        System.out.println("id = " + id);
        //获取索引名称
        String index = indexResponse.getIndex();
        System.out.println("index = " + index);
        //判断文档是否添加成功
        if (indexResponse.getResult() == DocWriteResponse.Result.CREATED) {
            System.out.println("文档添加成功");
        }
        //判断文档是否更新成功（如果 id 已经存在）
        if (indexResponse.getResult() == DocWriteResponse.Result.UPDATED) {
            System.out.println("文档更新成功");
        }
        ReplicationResponse.ShardInfo shardInfo = indexResponse.getShardInfo();
        //判断分片操作是否都成功
        if (shardInfo.getTotal() != shardInfo.getSuccessful()) {
            System.out.println("有存在问题的分片");
        }
        //有存在失败的分片
        if (shardInfo.getFailed() > 0) {
            //打印错误信息
            for (ReplicationResponse.ShardInfo.Failure failure : shardInfo.getFailures()) {
                System.out.println("failure.reason() = " + failure.reason());
            }
        }

        //异步
//        client.indexAsync(request, RequestOptions.DEFAULT, new ActionListener<IndexResponse>() {
//            @Override
//            public void onResponse(IndexResponse indexResponse) {
//
//            }
//
//            @Override
//            public void onFailure(Exception e) {
//
//            }
//        });
        client.close();
    }
}
```

演示分片存在问题的情况。由于我只有三个节点，但是在创建索引时，设置需要三个副本，此时的节点就不够用：

```
PUT book
{
  "settings": {
    "number_of_replicas": 3,
    "number_of_shards": 3  
  }
}
```

创建完成后，再次执行上面的添加代码，此时就会打印出 `有存在问题的分片`。

构建索引信息，有三种方式：

```
//构建索引文本，有三种方式：JSON 字符串、Map 对象、XContentBuilder
//request.source("{\"name\": \"三国演义\",\"author\": \"罗贯中\"}", XContentType.JSON);
//Map<String, String> map = new HashMap<>();
//map.put("name", "水浒传");
//map.put("author", "施耐庵");
//request.source(map).id("99");
XContentBuilder jsonBuilder = XContentFactory.jsonBuilder();
jsonBuilder.startObject();
jsonBuilder.field("name", "西游记");
jsonBuilder.field("author", "吴承恩");
jsonBuilder.endObject();
request.source(jsonBuilder);
```

默认情况下，如果 request 中包含有 id 属性，则相当于 `PUT book/_doc/1` 这样的请求，如果 request 中不包含 id 属性，则相当于 `POST book/_doc`，此时 id 会自动生成。对于前者，如果 id 已经存在，则会执行一个更新操作。也就是 es 的具体操作，会自动调整。

当然，也可以直接指定操作。例如，指定为添加文档的操作：

```
//构建一个 IndexRequest 请求，参数就是索引名称
IndexRequest request = new IndexRequest("book");
XContentBuilder jsonBuilder = XContentFactory.jsonBuilder();
jsonBuilder.startObject();
jsonBuilder.field("name", "西游记");
jsonBuilder.field("author", "吴承恩");
jsonBuilder.endObject();
request.source(jsonBuilder).id("99");
//这是一个添加操作，不要自动调整为更新操作
request.opType(DocWriteRequest.OpType.CREATE);
//执行请求，有同步和异步两种方式
//同步
IndexResponse indexResponse = client.index(request, RequestOptions.DEFAULT);
```

### 29.2 获取文档

根据 id 获取文档：

```
public class GetDoc {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        GetRequest request = new GetRequest("book", "98");
        GetResponse response = client.get(request, RequestOptions.DEFAULT);
        System.out.println("response.getId() = " + response.getId());
        System.out.println("response.getIndex() = " + response.getIndex());
        if (response.isExists()) {
            //如果文档存在
            long version = response.getVersion();
            System.out.println("version = " + version);
            String sourceAsString = response.getSourceAsString();
            System.out.println("sourceAsString = " + sourceAsString);
        }else{
            System.out.println("文档不存在");
        }
        client.close();
    }
}
```

### 29.3 判断文档是否存在

判断文档是否存在和获取文档的 API 是一致的。只不过在判断文档是否存在时，不需要获取 source。

```
public class ExistsDoc {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        GetRequest request = new GetRequest("book", "99");
        request.fetchSourceContext(new FetchSourceContext(false));
        boolean exists = client.exists(request, RequestOptions.DEFAULT);
        System.out.println("exists = " + exists);
        client.close();
    }
}
```

### 29.4 删除文档

删除 id 为 99 的文档：

```
public class DeleteDoc {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        DeleteRequest request = new DeleteRequest("book", "99");
        DeleteResponse response = client.delete(request, RequestOptions.DEFAULT);
        System.out.println("response.getId() = " + response.getId());
        System.out.println("response.getIndex() = " + response.getIndex());
        System.out.println("response.getVersion() = " + response.getVersion());
        ReplicationResponse.ShardInfo shardInfo = response.getShardInfo();
        if (shardInfo.getTotal() != shardInfo.getSuccessful()) {
            System.out.println("有分片存在问题");
        }
        if (shardInfo.getFailed() > 0) {
            for (ReplicationResponse.ShardInfo.Failure failure : shardInfo.getFailures()) {
                System.out.println("failure.reason() = " + failure.reason());
            }
        }
        client.close();
    }
}
```

删除文档的响应和添加文档成功的响应类似，可以对照着理解。

### 29.4 更新文档

通过脚本更新：

```
public class UpdateDoc {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        UpdateRequest request = new UpdateRequest("book", "1");
        //通过脚本更新
        Map<String, Object> params = Collections.singletonMap("name", "三国演义666");
        Script inline = new Script(ScriptType.INLINE, "painless", "ctx._source.name=params.name", params);
        request.script(inline);
        UpdateResponse response = client.update(request, RequestOptions.DEFAULT);
        System.out.println("response.getId() = " + response.getId());
        System.out.println("response.getIndex() = " + response.getIndex());
        System.out.println("response.getVersion() = " + response.getVersion());
        if (response.getResult() == DocWriteResponse.Result.UPDATED) {
            System.out.println("更新成功!");
        }
        client.close();
    }
}
```

通过 JSON 更新：

```
public class UpdateDoc {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        UpdateRequest request = new UpdateRequest("book", "1");
        request.doc("{\"name\": \"三国演义\"}", XContentType.JSON);
        UpdateResponse response = client.update(request, RequestOptions.DEFAULT);
        System.out.println("response.getId() = " + response.getId());
        System.out.println("response.getIndex() = " + response.getIndex());
        System.out.println("response.getVersion() = " + response.getVersion());
        if (response.getResult() == DocWriteResponse.Result.UPDATED) {
            System.out.println("更新成功!");
        }
        client.close();
    }
}
```

当然，这个 JSON 字符串也可以通过 Map 或者 XContentBuilder 来构建：

Map:

```
public class UpdateDoc {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        UpdateRequest request = new UpdateRequest("book", "1");
        Map<String, Object> docMap = new HashMap<>();
        docMap.put("name", "三国演义888");
        request.doc(docMap);
        UpdateResponse response = client.update(request, RequestOptions.DEFAULT);
        System.out.println("response.getId() = " + response.getId());
        System.out.println("response.getIndex() = " + response.getIndex());
        System.out.println("response.getVersion() = " + response.getVersion());
        if (response.getResult() == DocWriteResponse.Result.UPDATED) {
            System.out.println("更新成功!");
        }
        client.close();
    }
}
```

XContentBuilder:

```
public class UpdateDoc {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        UpdateRequest request = new UpdateRequest("book", "1");
        XContentBuilder jsonBuilder = XContentFactory.jsonBuilder();
        jsonBuilder.startObject();
        jsonBuilder.field("name", "三国演义666");
        jsonBuilder.endObject();
        request.doc(jsonBuilder);
        UpdateResponse response = client.update(request, RequestOptions.DEFAULT);
        System.out.println("response.getId() = " + response.getId());
        System.out.println("response.getIndex() = " + response.getIndex());
        System.out.println("response.getVersion() = " + response.getVersion());
        if (response.getResult() == DocWriteResponse.Result.UPDATED) {
            System.out.println("更新成功!");
        }
        client.close();
    }
}
```

也可以通过 upsert 方法实现文档不存在时就添加文档：

```
public class UpdateDoc {
    public static void main(String[] args) throws IOException {
        RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
                new HttpHost("localhost", 9200, "http"),
                new HttpHost("localhost", 9201, "http"),
                new HttpHost("localhost", 9202, "http")
        ));
        UpdateRequest request = new UpdateRequest("book", "99");
        XContentBuilder jsonBuilder = XContentFactory.jsonBuilder();
        jsonBuilder.startObject();
        jsonBuilder.field("name", "三国演义666");
        jsonBuilder.endObject();
        request.doc(jsonBuilder);
        request.upsert("{\"name\": \"红楼梦\",\"author\": \"曹雪芹\"}", XContentType.JSON);
        UpdateResponse response = client.update(request, RequestOptions.DEFAULT);
        System.out.println("response.getId() = " + response.getId());
        System.out.println("response.getIndex() = " + response.getIndex());
        System.out.println("response.getVersion() = " + response.getVersion());
        if (response.getResult() == DocWriteResponse.Result.UPDATED) {
            System.out.println("更新成功!");
        } else if (response.getResult() == DocWriteResponse.Result.CREATED) {
            System.out.println("文档添加成功");
        }
        client.close();
    }
}
```