---
layout: post
title: " bind context"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

# 绑定的上下文

绑定的上下文是一个对象，它保存了你可以从你的绑定中获取的数据。当使用绑定的时候，KO会自动创建并管理一个有层次结构的上下文环境。 它的根节点指向你在 js中 ```ko.applyBindings(viewModel)``` 执行绑定锁传递的参数 ```viewModel ``` 。之后每次使用控制流绑定，比如 ```with``` 或者 ```foreach``` 的时候，就会创建一个子绑定的上下文，指向嵌套的视图模型的数据。

绑定的上下文提供下面这些特殊的属性，你可以在任何绑定中使用。


## $parent

指向当前数据模型的父级上下文环境，在根节点上下文环境中，它是 ```undefined ``` 。例子：

	<h1 data-bind="text: name"></h1>
	 
	<div data-bind="with: manager">
	    <!-- Now we're inside a nested binding context -->
	    <span data-bind="text: name"></span> is the
	    manager of <span data-bind="text: $parent.name"></span>
	</div>

## $parents

是一个数组对象，存储了当前对象的所有父级属相。（类似于jquery的parents）

```$parents[0]``` 是直接父级上下文的视图模型（等价于上面的 ```$parent``` ）；

```$parents[1]``` 是祖父级上下文的视图模型；

```$parents[2]``` 是曾祖父级上下文视图模型；

......以此类推吧。

## $root

指向根级上下文环境，就是 ``` ko.applyBindings``` 传递的参数。等同于 ```$parents[$parents.length - 1]``` .

## $component

在组件模板的上下文中， ```$component``` 指向组件的视图模型。特殊情况下是等于 ``` $root``` de 。在嵌套组件中， ```$component``` 指向最近的组件的视图模型。

## $data

指向当前上下文环境中的视图模型。在根级上下文环境中 ```$data``` 和 ```$root ``` 是相等的。 在嵌套绑定上下文中，```$data``` 指向当前数据模型。```$data``` 通常在要获取视图模型本身的时候使用。例子：

	<ul data-bind="foreach: ['cats', 'dogs', 'fish']">
	    <li>The value is <span data-bind="text: $data"></span></li>
	</ul>


## $index(只在```foreach```绑定中使用)

一个从0开始的指向```foreach```的索引值。和其他绑定上下文属性不同的是，```$index``` 是一个观察者并且只要数组对象的选项发生变化，它都会随之更新。

## $parentContext

指向父级的上下文，它和```$parent``` 是不同的。```$parent```指向的是父级的数据，而不是绑定的环境。如果你需要中```foreach``` 内部一行的上下文中获取它外部的索引值，那么就需要用到它。例如```$parentContext.$index``` .在根级上下文它是 ```undefined ``` .

## $rawData

在行级数据模型中指向当前的上下文。通常它和 ``` $data``` 是一样的，但是如果传递给KO的数据模型是包含在一个观察者中的， ``` $data``` 指向的数据模型，而``` $rawData``` 指向这个观察者本身。

## $componentTemplateNodes

在组件模板的上下文中，```$componentTemplateNodes``` 是一个包含所有被传递到组件中的 DOM 节点。这样就很简单的创建一个组件来接受模板，比如说一个表格组件接受模板来定义它的行输出。

下面这些属性在绑定中也是可用的，但是它们不是绑定上下文对象的一部分。

## $context

指向当前绑定的上下文对象。当这些属性可能存在于视图模型中或者你想把上下文对象传递到你视图模型中的一个帮助函数中的时候，如果你想获得上线文对象的属性，那就需要使用 ```$context``` 。

## $element

指向当前绑定的 DOM 节点对象。当你想获得当前元素的一些属性的时候，可以使用它。例子：

	<div id="item1" data-bind="text: $element.id"></div>

## 在自定义绑定中，控制或者修改绑定上下文

在 ```with``` 或者 ```foreach```  中，用户自定义的绑定可以改变它的后代元素的绑定上下文，或者通过扩展绑定上下文对象来提供特殊属性。详细了解，[猛戳这里](http://knockoutjs.com/documentation/custom-bindings-controlling-descendant-bindings.html) 