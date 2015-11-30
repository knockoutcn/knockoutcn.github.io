---
layout: post
title: "textInput bind"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

## 作用

textInput 绑定以双向绑定的方式把 viewmodel 的值和 input 或者 textarea 输入框进行关联。和 value 绑定不一样的是，对于用户任意输入， textInput 绑定会立即更新，包括自动补齐、拖拽和剪切板事件等。

## 例子

	<p>Login name: <input data-bind="textInput: userName" /></p>
	<p>Password: <input type="password" data-bind="textInput: userPassword" /></p>
	 
	ViewModel:
	<pre data-bind="text: ko.toJSON($root, null, 2)"></pre>
	 
	<script>
	    ko.applyBindings({
	        userName: ko.observable(""),        // Initially blank
	        userPassword: ko.observable("abc")  // Prepopulate
	    });
	</script>


## 参数

可以是 observable 对象或者是非 observable 变量。如果参数不是数值或者字符串类型的，就ko会调用 yourParameter.toString() 方法 。

无论什么时候用户编辑输入框的值，ko 都会更新 viewmodel 中的属性值。 当输入框的值被用户或者DOM事件修改，KO 会去更新 viewmodel的值。


## 注 1：

尽管 value bind 也可以实现双向绑定，当时如果想立即更新，你应该使用 textInput 。原因如下：

### 立即更新

value bind ，默认情况下，当用户离开输入框（失去焦点）才更新 viewmodel的值。

textInput 会立即更新 viewmodel ，只要用户按下键盘或者其他方式输入文本（复制黏贴或者拖拽）


### 浏览器事件怪异处理

多种浏览器对不寻常的文本输入（复制黏贴、拖拽、自动补齐等）事件处理不一致。 value bind 不能在所有的浏览器上兼容这些场景。


记住，不要把 value bind 和 textInput 一块使用，否则不起作用。
















