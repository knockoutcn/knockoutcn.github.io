---
layout: post
title: "style bind"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}
# style 绑定

## 作用

```style``` 绑定可以对DOM元素的```style```属性值进行动态的添加和移除。如果你不想改变元素的```style```属性，而是想通过 CSS的 ```class```属性来改变样式，那么可以参考 [css绑定](https://github.com/knockoutcn/knockoutcn.github.io/issues/5)

## 样例

	<div data-bind="style: { color: currentProfit() < 0 ? 'red' : 'black' }">
	   Profit Information
	</div>
	 
	<script type="text/javascript">
	    var viewModel = {
	        currentProfit: ko.observable(150000) // Positive value, so initially black
	    };
	    viewModel.currentProfit(-50); // Causes the DIV's contents to go red
	</script>

代码中文字的颜色样式根据 ```currentProfit```变量的值取 ```red``` 或者 ```black```。

## 参数

参数对象的属性名是需要设置的style属性，参数属性对应的值是要给style属性设置的值。```data-bind```的参数结构是

	style:{
		color:'#ccc',
		background : '#fff',
		fontWeight ： someValue 
		....
	}

如果一次设置多个style属性值，可以用逗号间隔每个属性值，像下面这样：

	<div data-bind="style: { color: currentProfit() < 0 ? 'red' : 'black', fontWeight: isSevere() ? 'bold' : '' }">...</div>


	<script type="text/javascript">
	    var viewModel = {
	        currentProfit: ko.observable(1) ,
	        isSevere : false 
	    };
	    
	</script>

在js代码中，对于用```ko.observable()```绑定的参数，会和页面上进行联动变化；否则只会在第一次执行的时候页面DOM的style发生变化，之后这个变量发生变化，都不会引起页面style的变化。

通常可以用js表达式或者函数作为参数，KO会计算出结果然后决定DOM的style属性。

## 注意 绑定的style属性名不是js合法的变量名称

如果你绑定 ```font-weight```  或者  ```text-decoration```这样的style属性，或者其他类似的不是js合法变量的属性，那么你就必须用对应的js属性来代替。例如：

 错误写法 ： ```{ font-weight: someValue }``` ； 正确写法 ```{ fontWeight: someValue }```

 错误写法 ： ```{ text-decoration: someValue }``` ； 正确写法 ```{ textDecoration: someValue }```
