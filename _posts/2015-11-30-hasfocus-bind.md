---
layout: post
title: "hasFocus bind"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

## 作用

hasFocus 绑定，关联了 DOM 元素的焦点状态和viewmodel 中的属性值。 它是一个双向绑定。

## 例子1

	<input data-bind="hasFocus: isSelected" />
	<button data-bind="click: setIsSelected">Focus programmatically</button>
	<span data-bind="visible: isSelected">The textbox has focus</span>

	var viewModel = {
	    isSelected: ko.observable(false),
	    setIsSelected: function() { this.isSelected(true) }
	};
	ko.applyBindings(viewModel);


## 点击编辑

	<p>
	    Name: 
	    <b data-bind="visible: !editing(), text: name, click: edit">&nbsp;</b>
	    <input data-bind="visible: editing, value: name, hasFocus: editing" />
	</p>
	<p><em>Click the name to edit it; click elsewhere to apply changes.</em></p>

	function PersonViewModel(name) {
	    // Data
	    this.name = ko.observable(name);
	    this.editing = ko.observable(false);
	         
	    // Behaviors
	    this.edit = function() { this.editing(true) }
	}
	 
	ko.applyBindings(new PersonViewModel("Bert Bertington"));


## 参数

true 或者 false


