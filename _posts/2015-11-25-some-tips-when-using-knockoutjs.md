---
layout: post
title: "使用knockoutjs的一些注意点"
description: ""
category: share
tags: [share]
---
{% include JB/setup %}


knockoutjs 使用也有一段时间了，总结了一些坑，希望对你有帮助。

## 为什么选择 knockoutjs

市面上有很多mvvm框架，angularjs 、 vuejs ，[我所知道的MVVM框架](https://github.com/RubyLouvre/avalon/issues/480) ，详细了解点击这里。

我选择 knockoutjs 的理由是：

+ knockoutjs 支持市面上所有浏览器，少有的能支持 ie6 这个上古神器的 mvvm 框架，这样生产代码就不需要过多的 hack 来解决头疼的兼容问题 。

+ knockoutjs 是一个纯 mvvm 框架，只做UI，不做其他任何事情。这样我很容易把它集成到现有的工程里 。 对于需要改造的页面，针对性使用就好了 。

+ 可以全站使用，也可以部分页面使用，也可以页面部分区域（div块）使用，单页面应用也可以使用。典型的是有位同学把knockoutjs和backbone结合起来搞了个框架，具体可以去github找下。

+ knockoutjs 是微软团队支持开发的，最早一次commit是 Commits on Jul 5, 2010 。

其实说起来，真正让我使用它还是第一条 -- 兼容性。angularjs react等，尤其是react，里面有很多黑科技，确实很好用，内部项目对浏览器兼容性没有要求的，我还是会选择后两者。

并不是所有页面都需要使用 knockoutjs ，我认为复杂的DOM操作，VIEW变化频繁的站点，使用 knockoutjs会减少大量代码 ，可维护性也强。不满足上面条件的页面，可以用传统方式来操作。

knockoutjs 的缺点

+ 相对其他 mvvm 框架，不够热，相对小众。

+ 写法繁琐，不如angularjs 的 ```{ { } }``` 来的直接。

看了上面，如果觉得你需要使用 knockoutjs ，那我们继续往下看吧。



## knockoutjs 函数对象为主体

knockoutjs 中，函数是第一对象，只要用 使用 ko.observable() 接口进行数据绑定，那么生成的对象就是个函数了，那么接下来使用它都要以函数的形式 。

举个例子 

	Today's message is: <span data-bind="text: myMessage"></span>

	var viewModel = {
	    myMessage: ko.observable() // Initially blank
	};
	viewModel.myMessage("Hello, world!"); // Text appears
	ko.applyBindings(viewModel);

viewModel.myMessage 对象经过 ko.observable() 绑定后，就变成了一个函数 ，这个函数需要一个参数，就是要绑定的值。

这里顺便提一下 foreach 绑定，有些情况是需要在表格第一列显示序列号的，这时候 我们用 $index() ,因为它也是个函数 。

至于不清楚是否是函数的对象，你就先用对象本身，如果报错，再使用函数形式（就是在对象后面加对括号，够直白吧）。

## ko.applyBindings 的小技巧

注意 ko.applyBindings() 函数有两个参数，分别是数据对象和绑定的视图 DOM节点 。默认呢，第二个参数为空，如果不写，就代表绑定到整个html文档上去了，这时候如果你再执行一次 ko.applyBindings 就会报错，因为一个DOM节点只能绑定一次。这种情况，我会给ko.applyBindings 传递第二个参数 —— 绑定的DOM节点 。 这样的好处是，当再次执行绑定，只要DOM节点不一样就不会报错，这在单页面应用开发会很有作用 。


## viewModel 最好用构造函数进行初始化

像上面那个例子 viewModel 是用 var 来声明的，而我一般会选择用构造函数来声明，比如上面代码可以像下面这样改造


	function ViewModel(){
		var self = this;
		self.myMessage = ko.observable() ;
	}
	var viewModel = new ViewModel();
	ko.applyBindings(viewModel,$('body')[0]);


	viewModel.myMessage("Hello, world!"); // Text appears
	
这样写的好处是，一般情况下，我们的视图代码都不会像官方demo那么简单，可能需要大幅代码，这样用构造函数的话，由于js代码中函数第一，声明会优先上升。这样把视图的构造函数放在什么地方都无所谓了。还有就是，构造函数可以传参，初始化值可以在生成对象的时候就传递过去。还有对象的修改不影响构造函数，看着构造函数就很明确视图的结构了。

当然demo的写法也不是不好，只是用构造函数可能更利于代码的组织。

## 对象多值绑定的时候，用 with

当需要绑定一个对象下面多个属性的值的时候，请使用with，它会code看起来更简洁。不如这个例子，

	<h1 data-bind="text: city"> </h1>
	<p data-bind="with: coords">
	    Latitude: <span data-bind="text: latitude"> </span>,
	    Longitude: <span data-bind="text: longitude"> </span>
	</p>
	 
	<script type="text/javascript">
	    ko.applyBindings({
	        city: "London",
	        coords: {
	            latitude:  51.5001524,
	            longitude: -0.1262362
	        }
	    });
	</script>



如果我们不使用 with 的话，需要在视图里面做多个属性的 ko.observable() 函数调用，如果大对象的，想想都疯了。



## 使用自定义过滤函数，让你的代码更优雅

这个是借鉴 angularjs的filter属性，在之前的文章也有提到，这里就简单介绍下。

对于需要过滤处理的后端数据，一般我们是在js代码里面直接过滤，比如把后端数据 long 型数值转换成 1,111,000.00 这种形式。原来的做法:

	<span data-bind="text: amount"></span>

	<script type="text/javascript">
	    function ViewModel(){
			var self = this;
			self.amount = ko.observable() ;
		}
		var viewModel = new ViewModel();
		ko.applyBindings(viewModel,$('body')[0]);

		function longToNumber(val){
			// some codes
		}

		var amount = 1111000;
		var newAmount = longToNumber(amount);
		viewModel.amount(newAmount);

	</script>


如果我们把数据的处理放在 html 代码里面做，代码会更优美点


	<span data-bind="text: $root.longToNumber(amount)"></span>

	<script type="text/javascript">
	    function ViewModel(){
			var self = this;
			self.longToNumber = longToNumber;
			self.amount = ko.observable() ;
		}
		var viewModel = new ViewModel();
		ko.applyBindings(viewModel,$('body')[0]);

		function longToNumber(val){
			// some codes
		}

		var amount = 1111000;
		viewModel.amount(amount);

	</script>


这样，传递原始值，在html过滤，返回正确的值。业务逻辑更清楚了。

## data-bind 关键字传递的是一个JSON对象

如果你足够细心，你会发现，所有的 data-bind 后面跟的都是一个 json 对象，如果不是就报错了。例如 text 绑定，

	<span data-bind="text: amount"></span>

看到	data-bind 后面是一个 {text: amount} 对象。


## 同一个DOM节点绑定多个对象

比如需要在一个按钮上动态绑定显示的文本，同时按钮的点击事件也需要跟着文本变化 ，这就是个典型的同一个DOM节点绑定多个对象。

绑定的方法是在多值绑定之间用逗号分隔。


	<button data-bind="text: btnText,click: btnClick"></button>

	<script type="text/javascript">
	    function ViewModel(){
			var self = this;
			self.btnClick = btnClick;
			self.btnText = ko.observable() ;
		}
		var viewModel = new ViewModel();
		ko.applyBindings(viewModel,$('body')[0]);

		function btnClick(val){
			// some codes
		}

		viewModel.btnText('like me');

	</script>

还是上面说的 data-bind 关键字传递的是一个JSON对象 ，看到现在传递的是 

	{
		text: btnText,
		click: btnClick
	}

## 绑定的属性避免使用js保留字 class 等

因为在老浏览器中，js 保留字作为属性名会报错。

## 学会使用注释绑定（虚拟元素）

	<!-- ko text: name --><!-- /ko -->

虚拟元素绑定的好处是，不会引入多余的DOM元素来影响页面样式，（react就会强制引入span做绑定）。

## foreach 绑定记得使用 as别名

防止引用出错，详细见[foreach 绑定](http://knockoutcn.github.io/knockoutjs%20api/2015/11/25/foreach-bind/)

## 绑定的上下文要弄清楚

绑定的上下文容易导致一些错误，初学者常犯。具体分析看这篇文章——[绑定的上下文](http://knockoutcn.github.io/knockoutjs%20api/2015/11/25/bind-context/)



待续...















