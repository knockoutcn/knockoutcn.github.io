---
layout: post
title: "knockoutjs 如何处理 select 元素的change事件"
description: ""
category: share
tags: [share]
---
{% include JB/setup %}

关于knockoutjs 如何处理 select 元素的change事件，看到群里一直有人在提问，这里做一次小结。

## 思路：

每次用户操作select，选择了某一项，那么select的值会发生变化，并且新的值是用户选择的值。那么我只要知道select的值变化情况，就知道select的change事件了。

## 代码实现

既然有思路了，那就写code吧

	<p>
        Destination country:
        <select data-bind="options: availableCountries,value: country"></select>
    </p>

	<script type="text/javascript">
		
	    var viewModel = {
	        country: ko.observable(),
	        availableCountries: ko.observableArray(['France', 'Germany', 'Spain'])
	    };
	    ko.applyBindings(viewModel);

	    viewModel.country.subscribe(function(newValue) {
	        alert("The select's new name is " + newValue);
	    });

	</script>


把上面的代码拷贝到你的文本编辑器中，记得引入knockoutjs，就可以查看效果了。可以看到，每次选择select，并发生变化，都会alert选择的值。	

## 代码解读

那么上面代码怎么运行的呢？

可以看到，我给 select绑定了两个值，分别是 options和 value，前者是用来绑定要展示的select option，后者是记录select的值的。每次选择select，那么select的值会发生变化，那么我跟踪select的value变化就可以了。

那么是如何跟踪select值的变化的呢？

subscribe 这个函数，针对observable，你可以指定一个订阅，当 observable 变量发生变化，就会对外发送消息，这时候注册subscribe订阅的地方就可以收到变化的通知了。


完。