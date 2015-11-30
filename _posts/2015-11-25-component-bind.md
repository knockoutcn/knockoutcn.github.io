---
layout: post
title: "component bind"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

# 组件绑定 component 

```component ``` 组件绑定把一个特定功能的组件注入到绑定元素中去，还可以向组件中传递参数。

## 组件绑定的示例

### 视图层代码

	<h4>First instance, without parameters</h4>
	<div data-bind='component: "message-editor"'></div>
	 
	<h4>Second instance, passing parameters</h4>
	<div data-bind='component: {
	    name: "message-editor",
	    params: { initialText: "Hello, world!" }
	}'></div>

### 视图模型层代码 

	ko.components.register('message-editor', {
	    viewModel: function(params) {
	        this.text = ko.observable(params && params.initialText || '');
	    },
	    template: 'Message: <input data-bind="value: text" /> '
	            + '(length: <span data-bind="text: text().length"></span>)'
	});
	 
	ko.applyBindings();

提示：在开发环境中，需要从外部加载组件文件，而不是在代码中注册它们。[详细了解请猛戳](https://github.com/knockoutcn/knockoutcn.github.io/issues/17)

## API

有两种方式来使用 ```component ```  组件绑定。

### 1 快捷方式

传递一个组件的名称，那么这个组件就被注入到元素中去了。
例如：

	<div data-bind='component: "my-component"'></div>

快捷方式的值也可以是一个观察者。这个例子中，如果绑定组件发生变化，它会处理旧组件，然后注入新的变化之后的组件。例如

	<div data-bind='component: observableWhoseValueIsAComponentName'></div>


### 2 完整方式

用下面的属性可以把参数传递到组件中。

+ ```name``` -- 需要引入的组件的名称。再次说明，它是可以被观察的。
+ ```params``` --- 传递到组件中的参数对象。```key-value ```的方式可以传递多个值对象；参数是被组件视图模型的构造函数接受的。

例子

	<div data-bind='component: {
	    name: "shopping-cart",
	    params: { mode: "detailed-list", items: productsList }
	}'></div>

## 组件的生命周期

当一个组件绑定注入了一个组件

+ 1.视图模型的工厂函数和模板需要组件的加载

+ 2.组件模板被备份并注入到绑定的元素中

+ 3.如果组件有视图模型，那么它会被实例化

+ 4.视图模型会被绑定到视图上

+ 5.组件是活动的

+ 6.组件被关闭，它的视图模型被处理

## 注意1： 只有模板的组件

组件通常都有视图模型，但它们不是必须有的。一个组件可以只有模板。

这种情况下，传递的参数会直接传递到模板中进行使用。例如：

	ko.components.register('special-offer', {
	    template: '<div class="offer-box" data-bind="text: productName"></div>'
	});

...会像下面那样使用：

	<div data-bind='component: {
	     name: "special-offer-callout",
	     params: { productName: someProduct.name }
	}'></div>

...更简单的用法 ，可以看 [自定义元素](http://knockoutjs.com/documentation/component-custom-elements.html).

## 注意2：不带包含元素使用组件绑定

	<!-- ko component: "message-editor" -->
	<!-- /ko -->

和其他虚拟元素绑定一样的用法。

## 注意3： 向组件传递标记

绑定组件的元素可能包含更多的标记，例如：

	<div data-bind="component: { name: 'my-special-list', params: { items: someArrayOfPeople } }">
	    <!-- Look, here's some arbitrary markup. By default it gets stripped out
	         and is replaced by the component output. -->
	    The person <em data-bind="text: name"></em>
	    is <em data-bind="text: age"></em> years old.
	</div>

虽然绑定组件的元素内部的DOM节点会被剥离，默认并不会绑定，但是这些DOM不会消失。他们会被组件引用（例子中的```my-special-list```），组件的输出中会包含他们。

它的使用场景：组件表现出绑定元素内的UI元素。比如：表格、列表、对话框或者tab set
，这些都需要注入和绑定任意标签到一个公共的结构中。

## dispose 内存管理

你的视图模型类中可能含有一个```dispose ```函数。如果有的话，只要组件被关闭并从DOM中移除（比如相应的组件被从```foreach```中移除或者```if```的绑定之变成了```false```），KO就会调用这个```dispose ```函数。 

必须使用 ```dispose ``` 来释放任何没有被垃圾回收器资源。例如:

+ ```setInterval ``` 的回调函数在显示清除之前是一直存在于内存中的。
  
  要使用 ```clearInterval(handle)``` 来清除回调函数，否则视图模型会一直驻留在内存中。

+ ```ko.computed```  属性在显示释放前，会一直从它的依赖那里接收通知。
  
  如果依赖是一个外部对象，```ko.computed``` 属性需要调用 ```.dispose()``` ，否则它（也可能是视图模型对象）会一直驻留在内存中。

+ 在显示释放之前，对于观察者的订阅会一直存在。
  
  如果对一个外部对象订阅，那么订阅者需要调用 ```.dispose()``` ，否则订阅者的回调函数（也可能是视图模型对象）会一直驻留在内存中。

+ ```createViewModel ``` 函数在外部DOM元素上手动创建的事件句柄需要移除。
  
  当然我们不需要关心释放任何事件以标准KO绑定创建的句柄，当元素被移除时，KO会自动取消注册他们。

例子

	var someExternalObservable = ko.observable(123);
	 
	function SomeComponentViewModel() {
	    this.myComputed = ko.computed(function() {
	        return someExternalObservable() + 1;
	    }, this);
	 
	    this.myPureComputed = ko.pureComputed(function() {
	        return someExternalObservable() + 2;
	    }, this);
	 
	    this.mySubscription = someExternalObservable.subscribe(function(val) {
	        console.log('The external observable changed to ' + val);
	    }, this);
	 
	    this.myIntervalHandle = window.setInterval(function() {
	        console.log('Another second passed, and the component is still alive.');
	    }, 1000);
	}
	 
	SomeComponentViewModel.prototype.dispose = function() {
	    this.myComputed.dispose();
	    this.mySubscription.dispose();
	    window.clearInterval(this.myIntervalHandle);
	    // this.myPureComputed doesn't need to be manually disposed.
	}
	 
	ko.components.register('your-component-name', {
	    viewModel: SomeComponentViewModel,
	    template: 'some template'
	});
