---
layout: post
title: "enalble bind"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

# enable 绑定
 
```enable```绑定，只有当参数值为``true```时，才会把DOM元素设置为 enable 。通常适用于类似 ```input```, ```select```, 和 ```textarea```元素。

例子

	<p>
	    <input type='checkbox' data-bind="checked: hasCellphone" />
	    I have a cellphone
	</p>
	<p>
	    Your cellphone number:
	    <input type='text' data-bind="value: cellphoneNumber, enable: hasCellphone" />
	</p>
	 
	<script type="text/javascript">
	    var viewModel = {
	        hasCellphone : ko.observable(false),
	        cellphoneNumber: ""
	    };
	</script>

当checkbox选中的时候，input可用。

## 参数

 + 控制DOM元素是否可用的值
 + 非```bool```型值被当转义成bool型。```0```，```null```会当做```false```，```21```和非空对象被当做 ```true```。

 ## 注意: 使用任意js表达式

 可以使用任何js表达式来控制元素的enable属性

	<button data-bind="enable: parseAreaCode(viewModel.cellphoneNumber()) != '555'">
	    Do something
	</button>











