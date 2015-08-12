# attr 绑定

## 作用

attr绑定提供一个通用的方法来给DOM绑定动态添加改变attr的属性值。


## 示例

```html
<a data-bind="attr: { href: url, title: details ,target:target }">
    Report
</a>

var viewModel = {
        url: ko.observable("http://codepen.io/wikieswan/blog/the-css-binding"),
        details: ko.observable("Report including final year-end statistics"),
        target:ko.observable('_blank')
    };
    ko.applyBindings(viewModel);
```

a标签会根据js中的值绑定上对应的值。

## 参数说明

```data-bind``` 接受一个js对象作为参数，这个对象的属性名是attr的值，属性名的值是attr的值。


## 注意1 绑定的attr属性名是js合法的变量名称

如果你需要绑定属性 ```data-something``` ,你不可以像下面这样写

```html
<div data-bind="attr: { data-something: someValue }">...</div>
```

因为 ```data-something``` 不是合法的js变量。解决方案是用引号括起来，像下面这样：

```html
<div data-bind="attr: { 'data-something': someValue }">...</div>
```

## 注意2 旧版本浏览器中的js保留字

在老版本的浏览器（ie8以下），使用js中的保留字作为DOM属性名，会导致程序出错。解决方式也是给属性名加上引号。像下面这样写：

```html
<input data-bind="attr: { 'for': someValue }" />
```