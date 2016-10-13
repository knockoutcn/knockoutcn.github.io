---
layout: post
title: "how to use ko component"
description: ""
category: share
tags: [share]
---
{% include JB/setup %}

# 如何使用ko的组件

组件化是2016最新的话题，由react掀起的一阵组件风。

前一阵子，刚完成一个移动端项目的开发，使用的技术是 react + redux + react-router + webpack + babel 。。
等 react 全家桶。组件化开发不要太爽的。现在手上有个 pc 项目，需要兼容到 ie6 ，那么必然就选择了 knockoutjs ，那么我就考虑 ko 怎么做组件化开发。

先说说 react redux 是如何组组件化开发的

react 做ui，全站（spa）维护一个 stroe ，切只有一个 store 。 store 里面维护了所有的数据状态，react component 只负责 UI 和 交互。

那么借鉴 react 的做法，Ko 的组件化也可以从这个角度来考虑。

由于我做的ko是项目是mpa，多以可以把每个页面当做一个独立的 vm 。vm里面维护了所有的 store 和 action；
store 指的是 ko的 vm observable 对象， action 是 ko 的 vm 函数。

组件化开发，最重要的是组件间的通信。当然 ko 的组件化通信方式也完全可以参考 react 的组件化通信方式。react redux 组件通信方式是： 根页面作为入口，所有组件作为子组件挂载在入口页面上。子组件的函数都是 callback 形式由父级传递，子组件的所有数据也是由父级传递。组件的原则是值做ui和交互。react 里面有 “Smart” Components vs “Dumb” Components 。他们的区别可以看我这篇文章 [http://vera.ren/react-vera-api-1-0-0](http://vera.ren/react-vera-api-1-0-0)  。

	vm
		someRootObservable
		someRootFunc

	
	<root>
		<compoent-head title="标题文本"/>
		<compoent-input value="someRootObservable" />
		<compoent-button handleClick= 'someRootFunc'/>


那现在我们参考 react 的形式来写ko的组件吧

1 所有的组件都是根页面的子组件，组件允许嵌套 

2 组件所有的动作函数都是从根 vm 以 callback 形式传递进去，所有的组件都是 “Dumb” Components

3 组件用到的所有数据都是从根传递过去的，每个页面只能有一个 vm

说了这么多，看下代码就明白了


	<!DOCTYPE html>
	<html>
	<head>
		<title>ko demo</title>
		<meta charset="utf-8" >
		<style type="text/css">
			body{
				background: #f8f8f8;
			}
			.wrap{
				width: 100%;
			}
			.header{
				width: 100%;
				height: 50px;
				background: #ddd;
				color: #222;
				line-height: 50px;
				text-align: center;

			}
			.label{
				width: 100%;
				height: 50px;
				color: #222;
				line-height: 50px;
				margin: 40px 0;
			}
			.input{
				width: 100%;
				height: 40px;
				margin: 40px 0;
			}
			.input input{
				height: 100%;
				width: 100%;
			}
			.button{
				height: 50px;
				width: 100%;
				margin: 10px 0;
				text-align: center;
				line-height: 50px;
			}
			.button button{
				height: 100%;
				width: 100%;
			}
		</style>
	</head>
	<body>
		
		<div id="root" class="wrap">
			<div data-bind='component: {
			    name: "component-header",
			    params: { 
			    	title: "页面标题"
			    }
			}'></div>
			<div data-bind='component: {
			    name: "component-label",
			    params: { 
			    	text: myInputText
			    }
			}'></div>
			<div data-bind='component: {
			    name: "component-input",
			    params: { 
			    	text: myInputText
			    }
			}'></div>
			<div data-bind='component: {
			    name: "component-button",
			    params: { 
			    	handleClick: handleClick,
			    	text: "确认按钮"
			    }
			}'></div>
		</div>
	</body>
	</html>
	<script type="text/javascript" src="http://knockoutjs.site/assets/lib/knockout-3.3.0.js"></script>
	<script type="text/javascript">
		var vm = {
		    handleClick: function(){
		    	//todo with myInputText
		    	console.log(vm.myInputText())
		    },
		    myInputText: ko.observable('hello')
		};

		ko.components.register('component-header', {
		    viewModel: function(params) {
		        this.title = params.title
		    },
		    template: '<div class="header" data-bind="text: title" ></div>'
		});

		ko.components.register('component-label', {
		    viewModel: function(params) {
		        this.text = params.text
		    },
		    template: '<div class="label" data-bind="text: text" ></div>'
		});

		ko.components.register('component-input', {
		    viewModel: function(params) {
		        this.text = params.text
		    },
		    template: '<div class="input">'
		    		+ '<input data-bind="value: text" />'
		    		+ '</div>'
		});

		ko.components.register('component-button', {
		    viewModel: function(params) {
		        this.handleClick = params.handleClick
		        this.text = params.text
		    },
		    template: '<div class="button" >'
		    		+ '<button data-bind="click: handleClick,text: text"></button'
		    		+ '</div>'
		});

		ko.applyBindings(vm,document.getElementById('root'));
	</script>


拷贝上面的代码，保存成html 直接运行，就可以看到效果了。















