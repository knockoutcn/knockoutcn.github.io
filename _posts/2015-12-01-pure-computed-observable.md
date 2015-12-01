---
layout: post
title: "pure computed observable"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

在大部分应用中， pure computed observable，Knockout 3.2.0引入，的性能和内存使用比 computed observable 要好很多。这是因为当pure computed observable 没有订阅者的时候，它不包含对它依赖的订阅，特点：

+ 防止内存泄露 ：在应用中，当 computed observable 对象没有引用了但是它的依赖对象仍然存在，这种情况下应该释放 computed observable 的内存。

+ 减少计算开销 ： 如果 computed observable 没有被观察（在其他地方使用），那么就不进行重新计算。


 pure computed observable 根据它是否有变化的订阅者，在两种状态间切换：

 + 1 如果它没有变化的订阅者，它就休眠。当进入 sleeping 状态，它会释放掉所有对依赖的订阅。这个期间，它不会订阅任何 在计算函数中的 observable 对象（但是它仍然追踪这些 observable 对象）。在休眠期间，当computed observable 的值被读取，如果它的任何依赖发生变化它自动被计算一次。

 + 2 当它又任何变化的订阅者，它就从 sleeping 状态转换成 listening 状态。当进入 listening 状态，它会立即订阅它的依赖。在这样状态， pure computed observable就和 computed observable 一样。









