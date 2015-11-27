---
layout: post
title: "observable 高级用法"
description: ""
category: share
tags: [share]
---
{% include JB/setup %}


observable 函数声明的变量两个特征：

+ 被声明的变量返回是一个函数

+ 实现knockoutjs 双向绑定的关键，是 view 和 viewmodel 双向绑定的桥梁

ps：observable 变量的读写都是以函数的形式。


### observable 变量声明 

	var myViewModel = {
	    personName: ko.observable('Bob'),
	    personAge: ko.observable(123)
	};

### 读 observable

ko.observable 对象都是函数。所以读取对象的值是如下这种方式

	myViewModel.personName();
	//'Bob'

### 写 observable

函数传参的形式

	myViewModel.personName('Mary');
	
### 支持链式方式来修改observable 对象

链式写法可以同时修改多个observable 对象

	 myViewModel.personName('Mary').personAge(50)

## 订阅observable 对象的消息

有这样的场景，需要知道某个 observable 变量什么时候发生变化，并且做一些操作。这时候就用到 subscribe 函数了。


	myViewModel.personName.subscribe(function(newValue) {
	    alert("The person's new name is " + newValue);
	});

上面的代码表示当 	personName 的值发生改变的时候，就出发一个回调函数。

subscribe 函数是knockoutjs 内部工作原理。只有这个消息机制，knockoutjs 才能什么时候进行双向绑定的更新操作。

subscribe 的参数

+ callback 回调函数是当有消息返回是触发

+ target 定义 callback 函数中的 this

+ event 触发通知的事件类型，默认是 change 。 beforeChange change 

订阅是可以终止的。第一次订阅会返回一个变量，然后调用 dispose 函数。如下

	var subscription = myViewModel.personName.subscribe(function(newValue) { /* do stuff */ });
	// ...then later...
	subscription.dispose(); // I no longer want notifications

是不是看着很熟悉，这种形式和dom 事件的侦听和取消侦听一样的。 dispose 函数是用了释放ko对象用的。

如果需要在对象变化前获取事件，可以像下面这样

	myViewModel.personName.subscribe(function(oldValue) {
	    alert("The person's previous name is " + oldValue);
	}, null, "beforeChange");

## 强制 observable 对象每次都触发通知

正常情况下，只有放observable 变量的值真实发生变化时（新老值不一样）才触发通知。如果加上 extend({ notify: 'always' }) 扩展，那么只要修改 observable 对象就触发通知，不管它的值是否发生变化。

	myViewModel.personName.extend({ notify: 'always' });


## 延迟或者抑制 change 通知

正常情况下，只要 observable 发生变化，会立即发出通知。但是如果一个 observable 持续发火说呢过变化，那么就会一直发出通知，这样大量的通知可能会触发性能问题。典型的应用场景是 input 输入框的联想查询，当用户输入间隔300 ms时触发查询，不然会产生大量的ajax 请求。

	// Ensure it notifies about changes no more than once per 50-millisecond period
	myViewModel.personName.extend({ rateLimit: 50 });

那么像这样做就ok了。















