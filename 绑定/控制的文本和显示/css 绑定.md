# css 绑定

## 作用

 css 可以实现给指定DOM元素增加或者移除一个或者多个class。例如当参数值发生变化的时候，根据需要，给页面元素高亮成红色。

## 示例1 静态class

```html
<div data-bind="css: { profitWarning: currentProfit() < 0 }">
       Profit Information
    </div>
```

```javascript
var viewModel = {
        currentProfit: ko.observable(150000) // Positive value, so initially we don't apply the "profitWarning" class
    };
    viewModel.currentProfit(-50); // Causes the "profitWarning" class to be applied

    ko.applyBindings(viewModel);
```

```css
.profitWarning{
  color:#f00;
}
```

当currentProfit 的值小于0的时候，元素会加上profitWarning 这个class

## 示例2 动态class

```html
<div data-bind="css: profitStatus">
     Profit Information
  </div>
```

```javascript
var viewModel = {
        currentProfit: ko.observable(150000)
    };
 
    // Evalutes to a positive value, so initially we apply the "profitPositive" class
    viewModel.profitStatus = ko.pureComputed(function() {
        return this.currentProfit() < 0 ? "profitWarning" : "profitPositive";
    }, viewModel);
 
    // Causes the "profitPositive" class to be removed and "profitWarning" class to be added
    viewModel.currentProfit(-50);
    ko.applyBindings(viewModel);
```

```css
.profitWarning{
  color:#f00;
}
.profitPositive{
  color:#ff0;
}
```
当currentProfit是正值的时候，元素会绑定profitPositive  class，否则绑定profitWarning class

## 参数说明

### 主要参数

如果你使用静态的CSS class，然后传递一个属性名是CSS类名的javascript对象，根据是否加上CSS类的需求，把它们的值设置为true或者false。

可以一次设置多个CSS 类。例如，如果数据模型中有一个属性<b>isSevere</b>


```html
<div data-bind="css: { profitWarning: currentProfit() < 0, majorHighlight: isSevere }">
```

用引号括起来多个CSS类，可以实现根据同一个条件来设置多个CSS 类。例如


```html
<div data-bind="css: { profitWarning: currentProfit() < 0, 'major highlight': isSevere }">
```


非boolean 会被转化为boolean 型。例如0和null被转化为false；数字21或者非空对象被转化为true。

如果参数是一个observable 参数，当参数值发生改变的时候，绑定元素会添加或者移除CSS类。如果不是，那么直会在第一次绑定的时候添加或者移除CSS类，之后不会改变。

如果你想用动态的CSS类，（所谓动态是指参数去不同的值，元素会绑定不同的CSS类），你需要传递一个字符串，这个字符串用来表示将要添加到DOM上的CSS类名。

如果参数是一个observable参数，绑定的时候会移除DOM原先的所有CSS类，然后根据参数的值给元素添加新的CSS类。

通常，可以使用任意的javascript函数或者表达式作为参数。knockout会计算结果，然后根据逻辑决定添加或者移除CSS类。


### 其他参数

无

注意 不能使用不合法的javascript变量名作为CSS类名

如果你想使用<b>my-class</b>类名，你不能像下面这样写：

```html
<div data-bind="css: { my-class: someValue }"></div>
```

因为这时<b>my-class</b>不是合法的标示符。解决方案很简单，用引号括起来就可以了。这样CSS类名变成了一个简单的字符串文本，对于javascript对象来说这就是合法的属性名了。换句话说，javascript语言本身不支持带'-'的属性名。
例如

```html
	<div data-bind="css: { 'my-class': someValue }"></div>
```
