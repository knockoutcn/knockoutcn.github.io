---
layout: post
title: "computeed observable"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

computeed observable 的作用就是计算一些 observable 变量，然后把返回值作为一个 observable对象，提供给UI使用。这样当 computeed observable 依赖的 observable 变量发生变化的时候，它会自动计算新的值。

有这样一个对象，firstName lastName ，

	function AppViewModel() {
	    this.firstName = ko.observable('Bob');
	    this.lastName = ko.observable('Smith');
	}

但是UI需要展示 fullName ，就可以这么做，

	function AppViewModel() {
	    // ... leave firstName and lastName unchanged ...
	 
	    this.fullName = ko.computed(function() {
	        return this.firstName() + " " + this.lastName();
	    }, this);
	}

这样在UI就可以这么写了

	The name is <span data-bind="text: fullName"></span>

这样，只要 firstName lastName 发生变化，那么 fullName就会重新计算。


## 管理 this

ko.computed 第二个参数是 this 定义了计算 observable 时的 this 。如果不传递 this 参数 ，knockoutjs 就不能 找到 this.firstName() this.lastName() 。通常传递的this 就是你的 viewmodel 引用 。 如果不传递 this ，ko.computed 中计算时就用它自己作用域的 this 而不是 viewmodel 的了。

为了避免 this 混论，我们有一个公约，就是用 一个变量，比如 self 来缓存 this。

	function AppViewModel() {
	    var self = this;
	 
	    self.firstName = ko.observable('Bob');
	    self.lastName = ko.observable('Smith');
	    self.fullName = ko.computed(function() {
	        return self.firstName() + " " + self.lastName();
	    });
	}

这样，及时不向ko.computed 传递第二个参数 this ，因为用了 self 缓存了 this ，那么也不会引起 this混乱 。


## pure computed observable 

如果是简单的计算并返回 observable 对象的值，那么请使用 ko.pureComputed 来代替 ko.computed 。

例如

	this.fullName = ko.pureComputed(function() {
	    return this.firstName() + " " + this.lastName();
	}, this);

因为使用了 pureComputed ，那么knockoutjs 可以更高效的管理内存。（计算时不会去直接修改其他对象或者状态）
如果没有其他代码在内存中以来这个 pureComputed 对象，那么knockoutjs 就是自动释放这部分内存。[know more](http://knockoutjs.com/documentation/computed-pure.html)

## 强制 computed observable 一直发出通知

如果 computed 返回一个原始类型的值(a number, string, boolean, or null)，只有当值真正发生变化时才会发出通知。可以用 extend({ notify: 'always' }) 来强制通知 。

	myViewModel.fullName = ko.pureComputed(function() {
	    return myViewModel.firstName() + " " + myViewModel.lastName();
	}).extend({ notify: 'always' });


## 延迟或者抑制通知

	// Ensure updates no more than once per 50-millisecond period
	myViewModel.fullName.extend({ rateLimit: 50 });

## 判断某个属性是否在 computed observable 中

有时候，你需要知道你用的对象是否是一个 computed observable 对象，可以使用  ko.isComputed 函数。

	for (var prop in myObject) {
	    if (myObject.hasOwnProperty(prop) && !ko.isComputed(myObject[prop])) {
	        result[prop] = myObject[prop];
	    }
	}

knockoutjs 还提供其他类似功能的接口函数

+ ko.isObservable 如果是 observable 、 observable 数组 或者 computed observable 就返回 true

+ ko.isWritableObservable 如果是 observable 、 observable 数组 或者 可写的 computed observable 就返回 true （它的另一个别名 ko.isWriteableObservable）


## 仅仅在 UI 上使用 computed observable

可以像下面这样定义

	function AppViewModel() {
	    // ... leave firstName and lastName unchanged ...
	 
	    this.fullName = function() {
	        return this.firstName() + " " + this.lastName();
	    };
	}

那么UI可以这样写

	The name is <span data-bind="text: fullName()"></span>


knockoutjs 会自动加上 computed observable ，当相关的UI元素被移除的时候，会释放变量内存。





















