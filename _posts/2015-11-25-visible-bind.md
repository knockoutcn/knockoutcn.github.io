---
layout: post
title: "visible bind"
description: "knockoutjs API"
category: 
tags: [knockoutjs API]
---
{% include JB/setup %}


# 1 visible 绑定


作用

visible 根据变量值的true或者false来控制DOM元素的显示或者隐藏。 

示例

	<div data-bind="visible: shouldShowMessage">
	    You will see this message only when "shouldShowMessage" holds a true value.
	</div>

    var viewModel = {
        shouldShowMessage: ko.observable(true) // Message initially visible
    };
    //viewModel.shouldShowMessage(false); // ... now it's hidden
    viewModel.shouldShowMessage(true); // ... now it's visible again
    ko.applyBindings(viewModel);


参数说明

主要参数

参数值为类似false值（eg，false、0、null、undefined）把yourElement.style.display设置为none，元素就隐藏了。

参数值为类似true值（eg，true、非null 的对象），则元素会显示。

如果参数是一个observable 变量，无论参数的值什么时候发生变化，元素的visible属性也会发生改变的。如果参数不是一个observable 变量，那么只会在第一次绑定的时候控制元素的visible属性，之后元素的visible属性不会发生变化。

其他参数

无

注意 使用函数或者表达式控制元素的显示或者隐藏

可以是用javascript函数或者表达式作为参数；knockout会运行函数或者表达式，用返回值来作为参数，从而觉得元素的显示或者隐藏。

e.g.


    <div data-bind="visible: myValues().length > 0">
      You will see this message only when 'myValues' has at least one member.
    </div>

	var viewModel = {
        myValues: ko.observableArray([]) // Initially empty, so message hidden
    };
    viewModel.myValues.push("some value"); // Now visible
    ko.applyBindings(viewModel);

依赖

无
