---
layout: post
title: "options bind"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

## 作用

控制下拉框（```<select>```）或者 multi-select 多选择框（```<select size='6'>```）显示哪些选项。这个绑定只适用于```<select>```元素。

options 绑定的值必须是一个数组（或者是 observable 数组），然后```<select>```元素会展示数组中每一个元素。

注意：对于 multi-select ，要设置哪个选项被选中或者获取选中的选项，需要使用 selectedOptions binding 。 对于 single-selec ，也可以使用 value bind 来设置或者获取选中的选项。

### 例子1 Drop-down list

	<p>
	    Destination country:
	    <select data-bind="options: availableCountries"></select>
	</p>
	 
	<script type="text/javascript">
	    var viewModel = {
	        // These are the initial options
	        availableCountries: ko.observableArray(['France', 'Germany', 'Spain'])
	    };
	 
	    // ... then later ...
	    viewModel.availableCountries.push('China'); // Adds another option
	</script>

### 例子2 Multi-select list

	<p>
	    Choose some countries you would like to visit:
	    <select data-bind="options: availableCountries" size="5" multiple="true"></select>
	</p>
	 
	<script type="text/javascript">
	    var viewModel = {
	        availableCountries: ko.observableArray(['France', 'Germany', 'Spain'])
	    };
	</script>


### 例子3 下拉框展示复杂的js 对象，不仅仅是 string

	<p>
	    Your country:
	    <select data-bind="options: availableCountries,
	                       optionsText: 'countryName',
	                       value: selectedCountry,
	                       optionsCaption: 'Choose...'"></select>
	</p>
	 
	<div data-bind="visible: selectedCountry"> <!-- Appears when you select something -->
	    You have chosen a country with population
	    <span data-bind="text: selectedCountry() ? selectedCountry().countryPopulation : 'unknown'"></span>.
	</div>
	 
	<script type="text/javascript">
	    // Constructor for an object with two properties
	    var Country = function(name, population) {
	        this.countryName = name;
	        this.countryPopulation = population;
	    };
	 
	    var viewModel = {
	        availableCountries : ko.observableArray([
	            new Country("UK", 65000000),
	            new Country("USA", 320000000),
	            new Country("Sweden", 29000000)
	        ]),
	        selectedCountry : ko.observable() // Nothing selected by default
	    };
	</script>


### 例子4 下拉框展示复杂的js对象，展示的文本是函数的返回值

	<!-- Same as example 3, except the <select> box expressed as follows: -->
	<select data-bind="options: availableCountries,
	                   optionsText: function(item) {
	                       return item.countryName + ' (pop: ' + item.countryPopulation + ')'
	                   },
	                   value: selectedCountry,
	                   optionsCaption: 'Choose...'"></select>


注意，例子3和4的区别在于 optionsText 属性值得到方式不一样。

## 参数

### 主要参数 

一个数组对象。对数组中每一项，knockoutjs 会添加一个 ```<option>``` ，然后追加在 ```<select>```节点中。```<select>```原先的内容会被移除。

如果参数是一个string类型的简单数组对象，你就不需要添加其他额外的参数。```<select>```会展示出来数组中的每一个对象。如果是一个任意js对象数组（不仅仅是字符串），那么就看下面的  optionsText 和 optionsValue 参数。

如果参数是一个 observable 变量，那么当变量值发生变化的时候，元素的option选项也会发生变化。否则，元素的option只在初始化的时候变化。

### 附加参数

+ optionsCaption 

有的时候，你不想让 selec 元素默认选择某个选项，但是  single-select  下拉框通常会默认选择某个选项，那么我们怎么避免这种情况呢？ 通常的解决方案是在选项中添加一个空的选项，文本类似于“请选择”，然后让它默认选中。

这很容易：添加一个参数叫 optionsCaption ，它的值就是要展示的值。例如

	<select data-bind='options: myOptions, optionsCaption: "Select an item...", value: myChosenValue'></select>

knockoutjs会在selec上添加 "Select an item..." 作为默认选项文本，它的值是 undefined 。那么，如果 变量 myChosenValue 的值是 undefined ，那么默认选项就被选中 。 如果 optionsCaption 是一个 observable 变量，那么它的值还是可以改变的。


+ optionsText

例子3中展示了 optionsText 如何展示js对象数组的文本显示的。你需要决定js对象哪个属性是需要作为文本显示出来的。 

如果你不想简单显示js对象某个属性值，还可以通过函数计算来展示它的返回值。可以看例子4.

+ optionsValue

和 optionsText 相似，你可以用一个任意js数组对象作为参数，然后用 optionsValue 来表示用对象的哪个属性作为选项的值。还可以用一个函数发返回值。

使用 optionsValue 是当更改选项数组值的时候，为了让knockoutjs 可以展示正确的选项。 

+ optionsIncludeDestroyed

有时候，你想把一个数组的入口删除了，但是又不想删除它的内容。这就是非破坏性删除。

默认情况下， options bind 会掉过（ie下是隐藏）任何被标记为销毁的数组入口。如果想展示被销毁的入口，那么就像下面这样添加参数：

	<select data-bind='options: myOptions, optionsIncludeDestroyed: true'></select>

+ optionsAfterRender

如果你想运行一些自定义的逻辑来生成 option 元素，可以使用 optionsAfterRender 回调函数。 看下面的注意2。

+ selectedOptions

对于 multi-select ，你可以用 selectedOptions 来读写选项的状态。

+ valueAllowUnset 

可以查看value bind 。


## 注意1 当设置或者改变选项的时候，选项被保存

当 option bind 改变 select 元素的选项时候，knockoutjs 会让用户的选择不会发生变化。所以，对于 single-select 下拉框，预先选择的选项仍会被选择，对于 multi-select 下拉框，预先选择的选项仍会被选择。（除非你把选中的选项删除了）

这是因为 options bind 依赖 value bind （single-select）和 selectedOptions bind （multi-select ）


## 注意2 程序生成选项

如果你想用程序生成 option ，你可以使用 optionsAfterRender 回调函数。每次 option 元素被插入到列表中，回调函数就会执行一次。需要下面参数：

1 被插入的 option 元素

2 绑定的值或者 undefined

这有一个例子，可以感受下

	<select size=3 data-bind="
	    options: myItems,
	    optionsText: 'name',
	    optionsValue: 'id',
	    optionsAfterRender: setOptionDisable">
	</select>
	 
	<script type="text/javascript">
	    var vm = {
	        myItems: [
	            { name: 'Item 1', id: 1, disable: ko.observable(false)},
	            { name: 'Item 3', id: 3, disable: ko.observable(true)},
	            { name: 'Item 4', id: 4, disable: ko.observable(false)}
	        ],
	        setOptionDisable: function(option, item) {
	            ko.applyBindingsToNode(option, {disable: item.disable}, item);
	        }
	    };
	    ko.applyBindings(vm);
	</script>













