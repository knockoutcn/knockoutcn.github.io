---
layout: post
title: "template bind"
description: ""
category: knockoutjs API
tags: [knockoutjs API]
---
{% include JB/setup %}

# 模板绑定

## 作用

模板绑定 ```template ``` 用渲染模板的结果来填充相关的DOM元素。模板是构建负责UI结构（可能是重复的或者嵌套的代码块）的一种简单、方便的方式，就想视图模型对象的一个函数。

有两种方式来使用模板：

+ 本地模板是支撑  ```foreach```, ```if```, ```with```和其他控制流绑定的机制。控制流绑定的内部机制：控制流绑定获取HTML标签，然后用把它当做一个模板用数据来渲染。这个特征是KO内建机制，不需要依赖其他库。
+ 基于字符串的模板是联系KO和某个第三方模板引擎的桥梁。KO会吧模型属性传递给外部的模板引擎，然后把结果注入到HTML文件流中。下面的例子来展示使用 ```jquery.tmpl ``` 和 Underscore 模板引擎 。


## 参数 

### 1 快捷方式 

如果你仅应用一个字符串值，KO会把它当成一个要渲染模板的ID。当前模型对象是渲染模板需要的数据。

### 2 完整方式 

下面是传递js对象的属性：

+ ```name``` - 包含模板的DOM元素的id
+ ```nodes``` - 直接传递一个DOM节点数组作为一个模板。这样会生成一个非观察者数组对象。需要说明的是，这些元素如果有父元素的话，会被从他们当前父元素中移除。如果你已经使用了 ```name``` 属性，这个属性会被忽略。
+ ```data``` - 渲染模板的数据。如果省略这个参数，KO会查找 ```foreach``` 参数，或者使用当前数据模型。
+ ```if``` - 如果有这个属性，那么模板只有当js表达式的结果是 ```true``` （或者是非 ```false``` ）的时候才会被渲染。这样可以避免把一个值为null的对象渲染到一个模板上。
+ ```foreach``` - 只是KO以循环模式渲染模板。
+ ```as``` - 和```foreach``` 结合使用，定义别名。
+ ```afterRender```, ```afterAdd```, 或者 ```beforeRemove``` - 渲染DOM时的回调函数。

## 注意1 渲染一个有名字的模板

通常，当使用控制流绑定（```foreach```, ```with```, ```if```,等）时，就不需要为模板命名：这些模板会被隐式的定义并以匿名方式标记到DOM元素中。但是如果你想的话。你可以把模板放到几个相互分离的元素中然后用name关联他们。

	<h2>Participants</h2>
	Here are the participants:
	<div data-bind="template: { name: 'person-template', data: buyer }"></div>
	<div data-bind="template: { name: 'person-template', data: seller }"></div>
	 
	<script type="text/html" id="person-template">
	    <h3 data-bind="text: name"></h3>
	    <p>Credits: <span data-bind="text: credits"></span></p>
	</script>
	 
	<script type="text/javascript">
	     function MyViewModel() {
	         this.buyer = { name: 'Franklin', credits: 250 };
	         this.seller = { name: 'Mario', credits: 5800 };
	     }
	     ko.applyBindings(new MyViewModel());
	</script>

需要为模板命名的情况很少，但是使用的时候它会减少重复代码的使用。

## 注意2 为命名模板使用“foreach”选项

下面使用模板的方式和```foreach```绑定等效：

	<h2>Participants</h2>
	Here are the participants:
	<div data-bind="template: { name: 'person-template', foreach: people }"></div>
	 
	<script type="text/html" id="person-template">
	    <h3 data-bind="text: name"></h3>
	    <p>Credits: <span data-bind="text: credits"></span></p>
	</script>
	 
	 function MyViewModel() {
	     this.people = [
	         { name: 'Franklin', credits: 250 },
	         { name: 'Mario', credits: 5800 }
	     ]
	 }
	 ko.applyBindings(new MyViewModel());

等价于```foreach```下面这样的写法:

	<div data-bind="foreach: people">
	    <h3 data-bind="text: name"></h3>
	    <p>Credits: <span data-bind="text: credits"></span></p>
	</div>

## 注意3 使用 “as”给“foreach” 的项目起别名

当嵌套使用```foreach```模板时，在层次结构中获取更高层次的项目是很有用的。一种做法是使用```$parent```或者其他的[绑定上下文](https://github.com/knockoutcn/knockoutcn.github.io/issues/11).

然而一个更简单、更优雅的方式是用```as```为循环迭代项目起个别名。例如：

	<ul data-bind="template: { name: 'employeeTemplate',
                                  foreach: employees,
                                  as: 'employee' }"></ul>

用```as```起的别名``` 'employee' ``` ，现在在```foreach ```循环中，就可以用```employee ```来访问相关的employee 对象了。

在嵌套```foreach ```循环中，这样做很有有用，因为这样你可以明确的访问更高层的任意被命名的对象。下面有个复杂的例子，展示在渲染模板```month```时，season ```是如何被访问到的。

	<ul data-bind="template: { name: 'seasonTemplate', foreach: seasons, as: 'season' }"></ul>
	 
	<script type="text/html" id="seasonTemplate">
	    <li>
	        <strong data-bind="text: name"></strong>
	        <ul data-bind="template: { name: 'monthTemplate', foreach: months, as: 'month' }"></ul>
	    </li>
	</script>
	 
	<script type="text/html" id="monthTemplate">
	    <li>
	        <span data-bind="text: month"></span>
	        is in
	        <span data-bind="text: season.name"></span>
	    </li>
	</script>
	 
	<script>
	    var viewModel = {
	        seasons: ko.observableArray([
	            { name: 'Spring', months: [ 'March', 'April', 'May' ] },
	            { name: 'Summer', months: [ 'June', 'July', 'August' ] },
	            { name: 'Autumn', months: [ 'September', 'October', 'November' ] },
	            { name: 'Winter', months: [ 'December', 'January', 'February' ] }
	        ])
	    };
	    ko.applyBindings(viewModel);
	</script>

小提示：给```as```传参时，要使用字符串，例如```as: 'season'```，而不是``` as: season``` ，这是因为你为一个新的变量传递一个名称，而不是读取一个已经存在的变量。

## 注意4 使用“afterRender”, “afterAdd”, 和 “beforeRemove”

有时候在生成模板后需要运行自定义的业务逻辑。

通常最好的方式是编写自定义绑定，但是也可以```afterRender```。

传递一个函数引用，在渲染解说或者重新渲染你的模板时，KO会调用它。如果你使用```foreach```,当每一个项目被添加到你的观察者上时，KO会调用一次```afterRender```。例如

	<div data-bind='template: { name: "personTemplate",
                            data: myData,
                            afterRender: myPostProcessingLogic }'> </div>

...然后在你的视图模型上定义一个函数

```javascript
viewModel.myPostProcessingLogic = function(elements) {
    // "elements" is an array of DOM nodes just rendered by the template
    // You can add custom post-processing logic here
}
```

如果使用```foreach ```，仅仅想获取那些被添加或者被移除的元素的通知，可以使用```afterAdd``` 和 ```beforeRemove``` 。详细请看 [foreach 绑定](https://github.com/knockoutcn/knockoutcn.github.io/issues/9)

## 注意5 动态选择使用哪一种模板

如果你有多个命名的模板，你可以为```name```选项传递一个观察者。当观察者的值发生变化，利用模板，元素的内容会重新被渲染。另外你可以传递一个回调函数来决定使用哪一个模板。如果你使用```foreach```模板模式，KO会为数组里每一个项目执行一次回调函数，并把项目的值作为唯一的参数传递给回调函数。否则，```data ```的值会被传递给回调函数，或者把整个视图模型传递给回调函数。

例如：

	<ul data-bind='template: { name: displayMode,
	                           foreach: employees }'> </ul>
	 
	<script>
	    var viewModel = {
	        employees: ko.observableArray([
	            { name: "Kari", active: ko.observable(true) },
	            { name: "Brynn", active: ko.observable(false) },
	            { name: "Nora", active: ko.observable(false) }
	        ]),
	        displayMode: function(employee) {
	            // Initially "Kari" uses the "active" template, while the others use "inactive"
	            return employee.active() ? "active" : "inactive";
	        }
	    };
	 
	    // ... then later ...
	    viewModel.employees()[1].active(true); // Now "Brynn" is also rendered using the "active" template.
	</script>

如果你的函数指向一个观察者变量，那么只要这些观察者的值发生变化，绑定会就更新。这样就用模板重新渲染数据了。

如果你的函数接受第二个参数，那么它就是整个绑定的上下文。你可以使用```$parent```或者其他任何上下文变量来动态选择模板。例如，你可以像下面这样修改上面的代码：

```javascript
displayMode: function(employee, bindingContext) {
    // Now return a template name string based on properties of employee or bindingContext
}
```


## 注意6 使用jQuery.tmpl-外部的模板引擎

在绝大多数情况下，```foreach```, ```with```, ```if```和其他控制流绑定可以满足你构建UI应用的所有需求。但是如果你想使用第三方模板库，比如 [Underscore template engine](http://documentcloud.github.io/underscore/#template) 或者 [jquery.tmpl](http://api.jquery.com/jquery.tmpl/), KO也会支持。

我们介绍KO中使用[jquery.tmpl](http://api.jquery.com/jquery.tmpl/)。首先需要按照顺序引入库：

	<!-- First jQuery -->     <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
	<!-- Then jQuery.tmpl --> <script src="jquery.tmpl.js"></script>
	<!-- Then Knockout -->    <script src="knockout-x.y.z.js"></script>

然后使用jquery.tmpl作为你的模板引擎：

+ ps：因为 github 的限制，```{{```  ```}}``` 在Jekyll 不作为文本显示，所以下面代码加了空格，实际书写请忽略


	<h1>People</h1>
	<div data-bind="template: 'peopleList'"></div>
	 
	<script type="text/html" id="peopleList">
	    { {each people} }
	        <p>
	            <b>${name}</b> is ${age} years old
	        </p>
	    { {/each} }
	</script>
	 
	<script type="text/javascript">
	    var viewModel = {
	        people: ko.observableArray([
	            { name: 'Rod', age: 123 },
	            { name: 'Jane', age: 125 },
	        ])
	    }
	    ko.applyBindings(viewModel);
	</script>


``` { {each ...} } ``` 和 ```${ ... } ```都是jquery.tmpl语法。


## 注意7 使用 Underscore.js 模板引擎

	<script type="text/html" id="peopleList">
	    <% _.each(people(), function(person) { %>
	        <li>
	            <b><%= person.name %></b> is <%= person.age %> years old
	        </li>
	    <% }) %>
	</script>

