---
title: "Sklearn机器学习包对iris数据集建模并可视化"
description: "Sklearn机器学习包对iris数据集建模并可视化"
publishDate: 2021-04-25T14:30:00+08:00
updatedDate: "2025-03-09T14:30:00+08:00"
tags: ["Vue"]
# coverImage:
#   src: "./cover.png"
#   alt: "Astro build wallpaper"
# ogImage: "/social-card.png"
draft: false
---




## 一. 决策树分析鸢尾花

Sklearn机器学习包中，决策树实现类是DecisionTreeClassifier，能够执行数据集的多类分类。输入参数为两个数组X[n_samples,n_features]和y[n_samples],X为训练数据，y为训练数据的标记数据。
DecisionTreeClassifier构造方法为：

```python
sklearn.tree.DecisionTreeClassifier(criterion='gini', splitter='best'
    ,max_depth=None, min_samples_split=2, min_samples_leaf=1
    ,max_features=None, random_state=None, min_density=None
    ,compute_importances=None, max_leaf_nodes=None)
```

鸢尾花数据集使用决策树的代码如下：

```python
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier
import numpy as np

# 使用sklearn自带的数据集
iris = load_iris()
#把一部分数据集作为训练，一部分作为预测，这里使用70%的训练，30%的进行预测，其中70%的训练集为0-40、50-90、100-140行，30%的预测集40-50、90-100、140-150行。同时输出准确率、召回率等
# 训练集
train_data = np.concatenate((iris.data[0:40, :], iris.data[50:90, :], iris.data[100:140, :]), axis=0)
train_target = np.concatenate((iris.target[0:40], iris.target[50:90], iris.target[100:140]), axis=0)
# 测试集
test_data = np.concatenate((iris.data[40:50, :], iris.data[90:100, :], iris.data[140:150, :]), axis=0)
test_target = np.concatenate((iris.target[40:50], iris.target[90:100], iris.target[140:150]), axis=0)

# 训练
clf = DecisionTreeClassifier()
clf.fit(train_data, train_target)
predict_target = clf.predict(test_data)
print(predict_target)

# 预测结果与真实结果比对
print(sum(predict_target == test_target))

from sklearn import metrics

# 输出准确率 召回率 F值
print(metrics.classification_report(test_target, predict_target))
print(metrics.confusion_matrix(test_target, predict_target))
X = test_data
L1 = [n[0] for n in X]
print(L1)
L2 = [n[1] for n in X]
print(L2)

import matplotlib as matplotlib
import matplotlib.pyplot as plt
import matplotlib.style as style

style.use("Solarize_Light2")
# plt.scatter中
# c:表示的是颜色，也是一个可选项。默认是蓝色'b',表示的是标记的颜色，或者可以是一个表示颜色的字符，或者是一个长度为n的表示颜色的序列等等，感觉还没用到过现在不解释了。但是c不可以是一个单独的RGB数字，也不可以是一个RGBA的序列。可以是他们的2维数组（只有一行）。
# marker表示标记符号 默认为o
plt.scatter(L1, L2, c=predict_target, marker='o')  # cmap=plt.cm.Paired
plt.title("DecisionTreeClassifier")
plt.show()

```

输出结果如下：

```
[0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2]
30
              precision    recall  f1-score   support
           0       1.00      1.00      1.00        10
           1       1.00      1.00      1.00        10
           2       1.00      1.00      1.00        10
    accuracy                           1.00        30   准确度
   macro avg       1.00      1.00      1.00        30	宏平均
weighted avg       1.00      1.00      1.00        30 	加权平均
[[10  0  0]
 [ 0 10  0]
 [ 0  0 10]]
[5.0, 4.5, 4.4, 5.0, 5.1, 4.8, 5.1, 4.6, 5.3, 5.0, 5.5, 6.1, 5.8, 5.0, 5.6, 5.7, 5.7, 6.2, 5.1, 5.7, 6.7, 6.9, 5.8, 6.8, 6.7, 6.7, 6.3, 6.5, 6.2, 5.9]
[3.5, 2.3, 3.2, 3.5, 3.8, 3.0, 3.8, 3.2, 3.7, 3.3, 2.6, 3.0, 2.6, 2.3, 2.7, 3.0, 2.9, 2.9, 2.5, 2.8, 3.1, 3.1, 2.7, 3.2, 3.3, 3.0, 2.5, 3.0, 3.4, 3.0]
```

绘制出的图形如下：

![image-20210416001841244](https://b2files.173114.xyz/blogimg/image-20210416001841244.png)

- x轴为测试集第一列数据，y轴为第二列数据

## 二. Kmeans聚类分析鸢尾花

KMeans聚类鸢尾花的代码如下，它则不需要类标（属于某一类鸢尾花），而是根据数据之间的相似性，按照“物以类聚，人以群分”进行聚类。

```python
# -*- coding: utf-8 -*-
from sklearn.datasets import load_iris
from sklearn.cluster import KMeans

iris = load_iris()
clf = KMeans()
clf.fit(iris.data, iris.target)
print(clf)
predicted = clf.predict(iris.data)

# 获取花卉两列数据集
X = iris.data
L1 = [x[0] for x in X]
print(L1)
L2 = [x[1] for x in X]
print(L2)

import numpy as np
import matplotlib.pyplot as plt

# s:是一个实数或者是一个数组大小为(n,)，这个是一个可选的参数。
# cmap:Colormap实体或者是一个colormap的名字，cmap仅仅当c是一个浮点数数组的时候才使用。如果没有申明就是image.cmap
plt.scatter(L1, L2, c=predicted, marker='s', s=200, cmap=plt.cm.Paired)
plt.title("Iris")
plt.show()
```

输出结果为：

![image-20210416002545067](https://b2files.173114.xyz/blogimg/image-20210416002545067.png)

