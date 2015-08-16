# event 绑定

```event```绑定允许为特殊的事件添加事件句柄，这样DOM元素上绑定的事件被触发了之后，js函数就会执行。它适用任何事件类型，比如 ```keypress```, ```mouseover``` 或 ```mouseout```。

例子

```html
<div>
    <div data-bind="event: { mouseover: enableDetails, mouseout: disableDetails }">
        Mouse over me
    </div>
    <div data-bind="visible: detailsEnabled">
        Details
    </div>
</div>
 
<script type="text/javascript">
    var viewModel = {
        detailsEnabled: ko.observable(false),
        enableDetails: function() {
            this.detailsEnabled(true);
        },
        disableDetails: function() {
            this.detailsEnabled(false);
        }
    };
    ko.applyBindings(viewModel);
</script>
```

## 参数

 + 传递一个js对象，对象的属性名对应事件名，并且对象值对应绑定到事件上的函数。
 + 可以引用任何js函数 - 它可以不是视图模型上得函数对象。
 + 可以引用任何对象的函数 - 像这样写 ```event : { mouseover: someObject.someFunction }```

## 注意事项参照 ```click```绑定。



















