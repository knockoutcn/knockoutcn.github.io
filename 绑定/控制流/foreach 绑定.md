# foreach 绑定

## 作用 

``` foreach ``` 绑定可以循环遍历一个数组对象,访问到每一个对象.

把数组设置成可观察的数组对象,那么每当数组中有值发生变化,绑定的UI层对应的DOM会立马作出反应，而不影响其他的元素。
相比数组每次发生变化就重新生成整个``` foreach ```输出要快的很多。

当然，你可以把``` foreach ```配合```if```或者 ```with``使用.

## 样例 1 遍历一个数组

这个例子使用 ```foreach```遍历一个数组每一行来生成一个只读的表格

```html
<table>
    <thead>
        <tr><th>First name</th><th>Last name</th></tr>
    </thead>
    <tbody data-bind="foreach: people">
        <tr>
            <td data-bind="text: firstName"></td>
            <td data-bind="text: lastName"></td>
        </tr>
    </tbody>
</table>
 
<script type="text/javascript">
    ko.applyBindings({
        people: [
            { firstName: 'Bert', lastName: 'Bertington' },
            { firstName: 'Charles', lastName: 'Charlesforth' },
            { firstName: 'Denise', lastName: 'Dentiste' }
        ]
    });
</script>
```

## 样例 2 动态添加或者移除

下面的例子展示了一个可观察的数组对象会和UI的变化保持同步

view层

```html
<h4>People</h4>
<ul data-bind="foreach: people">
    <li>
        Name at position <span data-bind="text: $index"> </span>:
        <span data-bind="text: name"> </span>
        <a href="#" data-bind="click: $parent.removePerson">Remove</a>
    </li>
</ul>
<button data-bind="click: addPerson">Add</button>
```

model层

```javascript
function AppViewModel() {
    var self = this;
 
    self.people = ko.observableArray([
        { name: 'Bert' },
        { name: 'Charles' },
        { name: 'Denise' }
    ]);
 
    self.addPerson = function() {
        self.people.push({ name: "New at " + new Date() });
    };
 
    self.removePerson = function() {
        self.people.remove(this);
    }
}
 
ko.applyBindings(new AppViewModel());
```

## 参数
传递一个你需要循环输出的数组对象,循环遍历数组的每一行并完成绑定DOM.

另外,传递的js对象有一个属性叫```data```,它指向你要遍历的数组对象.这个数组对象还有其他的属性,比如有
```afterAdd ```或者```includeDestroyed ```.下面有详细的介绍.


如果传递的数组参数是一个可观察的对象,那么```foreach  ```绑定的DOM会和数组对象实现同步变化.

## 注意1 用```$data```获取数组的每一个元素

下面的例子用 ```$data```可以访问到数组中的每一个元素.

```html
<ul data-bind="foreach: months">
    <li>
        The current item is: <b data-bind="text: $data"></b>
    </li>
</ul>
 
<script type="text/javascript">
    ko.applyBindings({
        months: [ 'Jan', 'Feb', 'Mar', 'etc' ]
    });
</script>
```

但是如果数组元素中的对象不是像上面的那样的简单值类型,而是引用类型的值,那么你可以
用特殊的上下文属性```$data```.```$data```表示```foreach```代码块中一个"当前被循环访问到的对象". 

对于上面的例2中的代码,你可以在绑定对象上加上```$data```前缀,就像下面这样

```html
<td data-bind="text: $data.firstName"></td>
```

```$data```前缀不是必须加的,因为```firstName ```会按照默认的方式去计算上下文.

## 注意2 用$index, $parent,和其他上下文属性

你可以看到上面的例子中使用了```$index```来访问当前数组的索引值.```$index```是一个观察者,会随着当前索引对象的变化而变化.(比如新增了一行或者删除了某一行,索引值就会发生变化).


相似的,你可以用 ```$parent```来访问```foreach```循环之外的数据对象.比如:

```html
<h1 data-bind="text: blogPostTitle"></h1>
<ul data-bind="foreach: likes">
    <li>
        <b data-bind="text: name"></b> 
        likes the blog post 
        <b data-bind="text: $parent.blogPostTitle"></b>
    </li>
</ul>
```
## 注意3 使用 'as' 来给 'foreach'的元素起'别名'

在注意1中,我们说了用 ```$data``` 可以访问到数组循环的当前值.在一些情况下,可以用```as```来给数组对象重命名.
比如:

```html
<ul data-bind="foreach: { data: people, as: 'person' }"></ul>
```

这样在```foreach```循环内部,就可以用```person```来访问当前遍历到的数组对象.```as```的应用场景是嵌套循环.
例子:

```html
<ul data-bind="foreach: { data: categories, as: 'category' }">
    <li>
        <ul data-bind="foreach: { data: items, as: 'item' }">
            <li>
                <span data-bind="text: category.name"></span>:
                <span data-bind="text: item"></span>
            </li>
        </ul>
    </li>
</ul>
 
<script>
    var viewModel = {
        categories: ko.observableArray([
            { name: 'Fruit', items: [ 'Apple', 'Orange', 'Banana' ] },
            { name: 'Vegetables', items: [ 'Celery', 'Corn', 'Spinach' ] }
        ])
    };
    ko.applyBindings(viewModel);
</script>
```

Tip:注意在使用```as```命名别名的时候,使用一个文本来表示别名
(e.g.,``` as: 'category'```,而不是``` as: category```).因为后者js会认为它是一个js变量.


## 注意 4 不带元素的绑定

有时候你希望循环输出的绑定不绑定到某个元素上,比如你想生成下面的这段代码

```html
<ul>
    <li class="header">Header item</li>
    <!-- The following are generated dynamically from an array -->
    <li>Item A</li>
    <li>Item B</li>
    <li>Item C</li>
</ul>
```
可以使用不带包裹的控制流语法,这种是基于注释标签的.例如:

```html
<ul>
    <li class="header">Header item</li>
    <!-- ko foreach: myItems -->
        <li>Item <span data-bind="text: $data"></span></li>
    <!-- /ko -->
</ul>
 
<script type="text/javascript">
    ko.applyBindings({
        myItems: [ 'A', 'B', 'C' ]
    });
</script>
```

``` <!-- ko --> ```和``` <!-- /ko --> ````备注标签是一对开始结束标签,称作虚拟标签.KO会理解这样的虚拟元素语法,
并且会像真是元素一样完成绑定.


## 注意5 数组的变化是怎么被检测并被处理的

当你修改model层中的数组对象的时候(比如添加,移动,或者删除),```foreach```绑定会使用高效的差异比对算法来计算出那些发生了变化,然后来更新DOM.这意味着KO的```foreach```可以处理任意组合和同时发生的变化.

当你新增数组对象,```foreach```会生成一个新的模板备份,插入到现在的DOM中.

当你删除数组对象,```foreach```就移除了对应的DOM元素.

当你重新排序数组对象,```foreach```也会改变DOM的顺序.

需要指出的是,对于重新排序的情况,如果数组很大,会带来大量的更待DOM元素顺序的操作,严重影响性能.这时候KO会用删除原来的元素然后生成新的DOM的原来来实现.想知道这个事情会发生的边界吗?自己去试试吧!!!

## 注意6 被销毁的实体是默认隐藏的

有时候你想删除一个数组对象,但是又不想丢失数组中记录的数据.这就是非破坏性删除.
[详细点击](http://knockoutjs.com/documentation/observableArrays.html#destroy-and-destroyall)

默认情况下,KO的```foreach```绑定会跳过(或者隐藏)任何数组中被标记被删除的元素.如果你想让被标记被销毁的元素也被
显示出来,那么使用```includeDestroyed ```.例如

<div data-bind='foreach: { data: myArray, includeDestroyed: true }'>
    ...
</div>

## 注意7 对生成的DOM元素进行后处理或者动画处理

KO提供了```afterRender/afterAdd/beforeRemove/beforeMove/afterMove```这些回调函数来进行后处理.例如


```html
<ul data-bind="foreach: { data: myItems, afterAdd: yellowFadeIn }">
    <li data-bind="text: $data"></li>
</ul>
 
<button data-bind="click: addItem">Add</button>
 
<script type="text/javascript">
    ko.applyBindings({
        myItems: ko.observableArray([ 'A', 'B', 'C' ]),
        yellowFadeIn: function(element, index, data) {
            $(element).filter("li")
                      .animate({ backgroundColor: 'yellow' }, 200)
                      .animate({ backgroundColor: 'white' }, 800);
        },
        addItem: function() { this.myItems.push('New item'); }
    });
</script>
```










