---
layout: post
title: "click bind"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

# click 绑定

```click``` 绑定会添加事件处理句柄，这样当DOM元素被点击的时候，会触发绑定的js函数。常用的地方有```button```, ```input```, ```a```标签。通常绑定在显示出来的DOM元素上。

## 例子

	<div>
	    You've clicked <span data-bind="text: numberOfClicks"></span> times
	    <button data-bind="click: incrementClickCounter">Click me</button>
	</div>
	 
	<script type="text/javascript">
	    var viewModel = {
	        numberOfClicks : ko.observable(0),
	        incrementClickCounter : function() {
	            var previousCount = this.numberOfClicks();
	            this.numberOfClicks(previousCount + 1);
	        }
	    };
	</script>

每次点击按钮，都会触发模型的 ```incrementClickCounter()```  函数。这个函数会改变视图模型的状态，这样UI就会更新。

## 参数

 + 绑定到元素 ```click``` 事件的函数
 + 可以引用任何js函数 - 它可以不是视图模型上得函数对象。
 + 可以引用任何对象的函数 - 像这样写 ```click: someObject.someFunction```

## 注意1 ： 把当前条目作为参数传递到句柄函数

 当触发句柄，Knockout 支持把当前模型的值作为第一个参数。如果你逐一对集合每一个条目渲染UI的适合，这会很有用的， 这样点击的时候，你就可以知道那个条目被点击了。例如：

	<ul data-bind="foreach: places">
	    <li>
	        <span data-bind="text: $data"></span>
	        <button data-bind="click: $parent.removePlace">Remove</button>
	    </li>
	</ul>
	 
	 <script type="text/javascript">
	     function MyViewModel() {
	         var self = this;
	         self.places = ko.observableArray(['London', 'Paris', 'Tokyo']);
	 
	         // The current item will be passed as the first parameter, so we know which place to remove
	         self.removePlace = function(place) {
	             self.places.remove(place)
	         }
	     }
	     ko.applyBindings(new MyViewModel());
	</script>

有两点需要指出来：

 + 如果在嵌套绑定上下文中，比如 ```foreach```或```with```中， 你的句柄函数是在根视图模型中或者在父级上下文中， 你需要用 ``` $parent ```或者 ```$root ```来制定句柄函数。

 + 在视图模型中用 ```self```（或者其他变量）来缓存 ```this```来避免 ```this```混乱。


## 注意2：获取事件对象，或者传递更多的参数

在一些场景下，你可能需要获取你点击的DOM事件对象。Knockout 会把事件对象作为第二个参数传递给函数，例如：

	<button data-bind="click: myFunction">
	    Click me
	</button>
	 
	 <script type="text/javascript">
	    var viewModel = {
	        myFunction: function(data, event) {
	            if (event.shiftKey) {
	                //do something different when user has shift key down
	            } else {
	                //do normal action
	            }
	        }
	    };
	    ko.applyBindings(viewModel);
	</script>

如果你需要传递更多的参数，一个方式是用function关键字包裹句柄函数包，在function关键字中传递参数，例如：

	<button data-bind="click: function(data, event) { myFunction('param1', 'param2', data, event) }">
	    Click me
	</button>

现在knockout 就会把data和event对象传递到你的function关键字中，这样句柄函数就可以获得这些参数。

另外，如果不想在view中写function关键字，你可以使用 ```bind``` 函数来实现传参，例如：

	<button data-bind="click: myFunction.bind($data, 'param1', 'param2')">
	    Click me
	</button>

## 注意3 ： 允许默认的click操作

默认情况下，knockout会阻止click事件的默认行为。直白的说，就是你在```a```标签上使用 ```click``` 绑定，浏览器只会触犯绑定的函数，而不会跳转到```a```标签的 ```href```属性。默认情况下这是很有用的，因为当使用 ```click``` 绑定的适合，通常只是使用```a```的样式而不是用它的链接属性。

然而，如果你不想让默认click行为被阻止，那么只要在```click```句柄函数中返回```true```就可以了。

## 阻止事件冒泡

默认情况下，knockout 会允许click事件继续冒泡到更高层次的事件句柄中的。 例如，如果你的元素和它的父级元素都绑定 ```click``` 事件，那么两个绑定函数句柄都会被触发。 如果有必要，你可以通过引用一个叫 ```clickBubble``` 的额外的绑定，并且传递```false```值来阻止事件冒泡，例如：

	<div data-bind="click: myDivHandler">
	    <button data-bind="click: myButtonHandler, clickBubble: false">
	        Click me
	    </button>
	</div>

通常情况下，```myButtonHandler```会先触发，然后click会向上冒泡到 ```myDivHandler``` 函数。 然而，```clickBubble: false``` 绑定会阻止冒泡的过程。

























