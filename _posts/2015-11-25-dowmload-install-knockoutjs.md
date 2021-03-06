---
layout: post
title: "下载和安装"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

# 下载和安装


Knockout是在以下三个功能上建立起来的：

+ 1.监控属性和依赖跟踪

+ 2.声明式绑定

+ 3.模板

  这一节，你讲学到3个功能中的第一个。 在这之前， 我们先来解释一下MVVM模式和view model的概念。

## MVVM and View Models

Model-View-View Model (MVVM) 是一种构建用户界面的设计模式。它描述了如果把一个复杂的UI分成三部分：

+  A model： 你的应用程序存储的数据。这个数据表示对象和业务领域的操作(比如银行业务-可以执行转账)，并且它独立于任何UI。当你使用KO的时候，model通常指的是利用ajax从服务器端读取和写入进去的数据模型。

+ A view model: 一些纯粹的代码表示UI层面的数据和操作。例如，你正在实现列表编辑，你的视图模型就是列表项目对象和增删改查操作方法。

  注意这不是UI本身：它不包含任何按钮的概念或者显示风格。它也不是持续数据模型 – 包含用户正在使用的未保存数据。使用KO的时候，你的view models是不包含任何HTML知识的纯JavaScript 对象。保持view model抽象可以保持简单，以便你能管理更复杂的行为。

+ view: 一个可见的，交互式的，表示view model状态的UI。 从view model显示数据，发送命令到view model（例如：当用户click按钮的时候） ，任何view model状态改变的时候更新。