---
layout: post
title: "checked bind"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

## 作用 

用viewmodel 控制checkbox或者 radio 的选中状态。双向绑定。

## checkbox 例子

	<p>Send me spam: <input type="checkbox" data-bind="checked: wantsSpam" /></p>
	 
	<script type="text/javascript">
	    var viewModel = {
	        wantsSpam: ko.observable(true) // Initially checked
	    };
	 
	    // ... then later ...
	    viewModel.wantsSpam(false); // The checkbox becomes unchecked
	</script>


## 添加 checkbox 数组绑定



	<p>Send me spam: <input type="checkbox" data-bind="checked: wantsSpam" /></p>
	<div data-bind="visible: wantsSpam">
	    Preferred flavors of spam:
	    <div><input type="checkbox" value="cherry" data-bind="checked: spamFlavors" /> Cherry</div>
	    <div><input type="checkbox" value="almond" data-bind="checked: spamFlavors" /> Almond</div>
	    <div><input type="checkbox" value="msg" data-bind="checked: spamFlavors" /> Monosodium Glutamate</div>
	</div>
	 
	<script type="text/javascript">
	    var viewModel = {
	        wantsSpam: ko.observable(true),
	        spamFlavors: ko.observableArray(["cherry","almond"]) // Initially checks the Cherry and Almond checkboxes
	    };
	 
	    // ... then later ...
	    viewModel.spamFlavors.push("msg"); // Now additionally checks the Monosodium Glutamate checkbox
	</script>


## 添加 radio 按钮例子 

	<p>Send me spam: <input type="checkbox" data-bind="checked: wantsSpam" /></p>
	<div data-bind="visible: wantsSpam">
	    Preferred flavor of spam:
	    <div><input type="radio" name="flavorGroup" value="cherry" data-bind="checked: spamFlavor" /> Cherry</div>
	    <div><input type="radio" name="flavorGroup" value="almond" data-bind="checked: spamFlavor" /> Almond</div>
	    <div><input type="radio" name="flavorGroup" value="msg" data-bind="checked: spamFlavor" /> Monosodium Glutamate</div>
	</div>
	 
	<script type="text/javascript">
	    var viewModel = {
	        wantsSpam: ko.observable(true),
	        spamFlavor: ko.observable("almond") // Initially selects only the Almond radio button
	    };
	 
	    // ... then later ...
	    viewModel.spamFlavor("msg"); // Now only Monosodium Glutamate is checked
	</script>

## 参数

### 主要参数

ko 根据参数的值设置元素的选中状态。元素原先的选择状态都会被重置。绑定的方式和你要绑定的元素是有关系的。

+ checkbox ，ko 根据参数的值为 true 或者 false 来设置元素是都选中，如果参数不是 bool 类型，ko做弱类型转换。这意味着非0数字和非null对象和非空字符串被转换成 true；0，null，undefined和空字符串会转换成 false。

当用户选择或者取消选中checkbox时，KO会设置 viewmodel对应的属性值为 true或者 false。


特别注明，如果参数是一个数组，那么如果DOM的value值等于数组的元素，那么就会被选中，否则不选中。当用户选中或者取消checkbox时，KO会添加或者移除数组中的元素值。

+ radio 只有当参数的值等于 radio 的 value 属性值或者使用 checkedValue 参数，KO才会设置元素选中状态。

当用户切换了 radio， KO会让 viewmodel 的值属性值等于用户选择的 radio 的值。

### 其他参数

+ checkedValue

如果使用 checkedValue 绑定，那么 checked 绑定就根据 checkedValue来设置而不是使用元素的 value值来设置了。 如果绑定的对象不是一个字符串或者动态设置绑定的值，那么可以使用 checkedValue 参数。

例子

	<!-- ko foreach: items -->
	    <input type="checkbox" data-bind="checkedValue: $data, checked: $root.chosenItems" />
	    <span data-bind="text: itemName"></span>
	<!-- /ko -->
	 
	<script type="text/javascript">
	    var viewModel = {
	        items: ko.observableArray([
	            { itemName: 'Choice 1' },
	            { itemName: 'Choice 2' }
	        ]),
	        chosenItems: ko.observableArray()
	    };
	</script>






