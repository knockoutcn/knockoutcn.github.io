---
layout: post
title: "submit bind"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

# submit 绑定

```submit``` 绑定添加事件句柄这样的话当DOM元素被提交的时候，绑定的js函数会被触发。通常只在 ```form``` 元素中使用。

当在form中使用```submit``` 绑定时，knockout会阻止浏览器默认的submit行为。换句话说，浏览器会调用句柄函数但是不会把form提交到服务器。 这种默认的设定很有用，因为当使用```submit``` 绑定时，通常是你把form当做视图模型的界面来使用，而不是作为一个正常的 HTML from表单。如果你想让form正常的提交，在```submit``` 绑定的函数中 返回一个 ```true```。

例子

	<form data-bind="submit: doSomething">
	    ... form contents go here ...
	    <button type="submit">Submit</button>
	</form>
	 
	<script type="text/javascript">
	    var viewModel = {
	        doSomething : function(formElement) {
	            // ... now do something
	        }
	    };
	</script>

例子的说明：knockout把form元素作为参数传递给句柄函数。你可以忽略这个参数，也可以用下面的方式使用它，例如：

 + 从form元素中提取data或者状态
 + 使用类似```jquery validation```库触发UI层的验证，大致代码如下; ```if ($(formElement).valid()) { /* do something */ }```

## 为什么不在submit的按钮上绑定一个 click 句柄

不用```submit```绑定的话，可以在 submit 按钮上用```click```绑定。然而，```submit``` 的优势是它也会捕捉其他方式来提交form，例如，按下 enter 键触发。

## 参数

 + 绑定到```submit``` 上得js函数
 + 可以引用任何js函数 - 它可以不是视图模型上得函数对象。
 + 视图模型上的函数可以简写属性名，例如，可以使用```submit: doSomething```，而不需要使用 ```submit: viewModel.doSomething```（当然这样写也是可以的）

 ## 注意

 更多参数传递方式信息，查看 [click 绑定]

 











