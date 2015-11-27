---
layout: post
title: "writable computed observables"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

正常情况下，computed observable 的值是其他 observable 对象计算得来的，computed observable 是只读的。 但是有办法让 computed observable 变量可写。你只需要在回调函数中实现一些写操作的方法就可以了。

你可以像使用正常 observable 对象那样使用一个可写的 computed observable 对象。读写规则都是自己实现的。还可以用链式写法给多个 observable 对象赋值。

可写的 computed observable 对象有强大的特征，用途广泛。

## 例子1

回顾经典例子 first name + last name = full name ，你可以把等式倒过来，让 fullname 可写，那么当修改了 fullname ，那么 firstname lastname 都会发生变化。

	<div>First name: <span data-bind="text: firstName"></span></div>
	<div>Last name: <span data-bind="text: lastName"></span></div>
	<div class="heading">Hello, <input data-bind="textInput: fullName"/></div>


	function MyViewModel() {
	    this.firstName = ko.observable('Planet');
	    this.lastName = ko.observable('Earth');
	 
	    this.fullName = ko.pureComputed({
	        read: function () {
	            return this.firstName() + " " + this.lastName();
	        },
	        write: function (value) {
	            var lastSpacePos = value.lastIndexOf(" ");
	            if (lastSpacePos > 0) { // Ignore values with no space character
	                this.firstName(value.substring(0, lastSpacePos)); // Update "firstName"
	                this.lastName(value.substring(lastSpacePos + 1)); // Update "lastName"
	            }
	        },
	        owner: this
	    });
	}
	 
	ko.applyBindings(new MyViewModel());


## 例子2  checkbox 级联

	<div class="heading">
	    <input type="checkbox" data-bind="checked: selectedAllProduce" title="Select all/none"/> Produce
	</div>
	<div data-bind="foreach: produce">
	    <label>
	        <input type="checkbox" data-bind="checkedValue: $data, checked: $parent.selectedProduce"/>
	        <span data-bind="text: $data"></span>
	    </label>
	</div>

	function MyViewModel() {
	    this.produce = [ 'Apple', 'Banana', 'Celery', 'Corn', 'Orange', 'Spinach' ];
	    this.selectedProduce = ko.observableArray([ 'Corn', 'Orange' ]);
	    this.selectedAllProduce = ko.pureComputed({
	        read: function () {
	            // Comparing length is quick and is accurate if only items from the
	            // main array are added to the selected array.
	            return this.selectedProduce().length === this.produce.length;
	        },
	        write: function (value) {
	            this.selectedProduce(value ? this.produce.slice(0) : []);
	        },
	        owner: this
	    });
	}
	ko.applyBindings(new MyViewModel());

例子3 值转化

有时候，值需要进行转化，例如钱的数额表示，需要加前缀并取两位小数。

	<div>Enter bid price: <input data-bind="textInput: formattedPrice"/></div>
	<div>(Raw value: <span data-bind="text: price"></span>)</div>

	function MyViewModel() {
	    this.price = ko.observable(25.99);
	 
	    this.formattedPrice = ko.pureComputed({
	        read: function () {
	            return '$' + this.price().toFixed(2);
	        },
	        write: function (value) {
	            // Strip out unwanted characters, parse as float, then write the 
	            // raw data back to the underlying "price" observable
	            value = parseFloat(value.replace(/[^\.\d]/g, ""));
	            this.price(isNaN(value) ? 0 : value); // Write to underlying storage
	        },
	        owner: this
	    });
	}
	 
	ko.applyBindings(new MyViewModel());

## 例子4 过滤和校验用户输入

例子1 中，我们把用户输入的值根据空格分成两部分，得到用户输入的值对应的 firstname lastname 。更深入的想下，如果用户这是后加入一些校验逻辑，那么可以做的事情就更多了。


	<div>Enter a numeric value: <input data-bind="textInput: attemptedValue"/></div>
	<div class="error" data-bind="visible: !lastInputWasValid()">That's not a number!</div>
	<div>(Accepted value: <span data-bind="text: acceptedNumericValue"></span>)</div>

	function MyViewModel() {
	    this.acceptedNumericValue = ko.observable(123);
	    this.lastInputWasValid = ko.observable(true);
	 
	    this.attemptedValue = ko.pureComputed({
	        read: this.acceptedNumericValue,
	        write: function (value) {
	            if (isNaN(value))
	                this.lastInputWasValid(false);
	            else {
	                this.lastInputWasValid(true);
	                this.acceptedNumericValue(value); // Write to underlying storage
	            }
	        },
	        owner: this
	    });
	}
	 
	ko.applyBindings(new MyViewModel());


注意，这个例子只是为了说明可写的 computed observable 有这种特征，但是实际上并不适合在生产中这么做。这种情况下用jquery更方便哦。



























