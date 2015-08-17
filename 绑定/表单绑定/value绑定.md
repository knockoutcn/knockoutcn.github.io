# value 绑定

```value``` 绑定将 view model 的属性绑定到DOM元素的值上。常用于 ```<input>```,``` <select> ```和 ```<textarea>```标签中。

当用户在表单中更改元素的值，view model的值会自动更新。反过来，view model的值发生变化，表单中元素的值也会发生变化。

注意：如果使用 checkbox 或者 radio 标签，请使用 checked 绑定来读写DOM元素的 checked状态，而不是使用 ```value``` 绑定。

## 例子

```html
<p>Login name: <input data-bind="value: userName" /></p>
<p>Password: <input type="password" data-bind="value: userPassword" /></p>
 
<script type="text/javascript">
    var viewModel = {
        userName: ko.observable(""),        // Initially blank
        userPassword: ko.observable("abc"), // Prepopulate
    };
</script>
```

## 参数

knockout 会用参数的值重写元素的 ```value``` 值。

如果参数是 observable 值，那么当参数发生变化的时候，绑定会更新元素的值。如果参数不是一个 observable ，只会在第一次初始化的时候设置元素的值，以后就不会在更新元素了。

如果参数不是 number 或 string（比如object或者array），那么会被转化成 string类型 ```yourParameter.toString()``` 

无论何时用户编辑表单中得值，KO会更新 view model中属性的值。 页面上当表单中的值被修改并且元素失去焦点，KO就会修改view model中的值。 但是你可以使用 ```valueUpdate```属性来触发KO更新。

### 附加参数

#### ```valueUpdate```

如果绑定中包含参数 ```valueUpdate```，那么除了 ```change```事件之外，KO也会触发更新。参数值如下：

+ ```"input"``` - ```<input>```和```<textarea>``` 的值改变的时候会触发更新view model。（IE 9+支持）

+ ```"keyup"``` -   释放键盘是更新view model。

+ ```"keypress"``` - 按下键盘是更新view model。和```"keyup"```不一样，用户按着键盘一直不松手的话，会持续触发更新view model。

+ ```"afterkeydown"``` - 按下一个字符就更新 view model 。它的原理是捕获浏览器的 keydown 事件，然后一步处理。在一些移动端浏览器可能不起作用。

#### ```valueAllowUnset``` 

只有在 ``` <select> ```元素上使用，在其他元素上使用没有效果。

## 注意1 ： 立即更新来自input中的值

如果你用```<input type="text" /> ``` 或者 ```<textarea> ```，想立马更新 view model 的值，那么使用 ```textInput```绑定吧，因为它比 value 绑定的 valueUpdate 浏览器兼容性更好。

## 注意2 ： 和下拉框组合使用（```<select>```元素）

knockout支持下拉框。```value``` 绑定和```option``` 绑定一起使用，来读写任意js对象的值。，而不仅仅是string类型的变量。具体细节可以参照 ```option``` 绑定。

```<select>```元素,你也可以使用value绑定而不使用option绑定。这是```option``` 选项需呀使用 ```foreach```或者```temlate```绑定来实现。你甚至可以嵌套使用 ```<optgroup>``` 。

### ```<select>```元素```valueAllowUnset```

通常当你在```<select>```元素上使用 ```value```绑定的时候，通常是指定某个option被选中。但是如果你设置一个在list中不存在的值怎么办呢？knockout会默认重写你的值，把它重设为下拉框中任何一个已经被选中的值，这样做是为了阻止模型和视图不同步。

然而，有时候我们不想knockout这种默认行为。如果你想让knockout允许你输入一个在 ```<select>```中不存在的值，那么就需要指定 ```valueAllowUnset: true```。这样，只要有不匹配的值，```<select>```就没有被选中的值，通常是个空值。 用户再选中存在的值，```<select>```的值就正常表现了。例如：

```html
<p>
    Select a country:
    <select data-bind="options: countries,
                       optionsCaption: 'Choose one...',
                       value: selectedCountry,
                       valueAllowUnset: true"></select>
</p>
 
<script type="text/javascript">
    var viewModel = {
        countries: ['Japan', 'Bolivia', 'New Zealand'],
        selectedCountry: ko.observable('Latvia')
    };
</script>
```
```selectedCountry```的值是 ```Latvia```,因为```countries```中不存在，那么```<select>```的值是个空值。

如果 ```valueAllowUnset``` 没有被设置为 true，那么knockout就会用 ```undefined```来重写 ```selectedCountry```。

## 注意3 ： 更新observable和non-observable属性的值

如果使用 ```value``` 绑定把observable属性绑定到DOM元素上，knockout会建立一个双向绑定，这样一个改变会影响另一个值。

但是，如果使用 ```value``` 绑定把一个non-observable属性绑定到DOM元素上，那么knockout会像下面那样做：

+ 如果non-observable是一个简单属性，比如说事view model上的普通属性，那么knockout只会在初始化的绑定一次。

+ 如果不是简单属性，比如说是一个函数或者一个复杂的表达式，也只会绑定一次。

例子

```html
<!-- Two-way binding. Populates textbox; syncs both ways. -->
<p>First value: <input data-bind="value: firstValue" /></p>
 
<!-- One-way binding. Populates textbox; syncs only from textbox to model. -->
<p>Second value: <input data-bind="value: secondValue" /></p>
 
<!-- No binding. Populates textbox, but doesn't react to any changes. -->
<p>Third value: <input data-bind="value: secondValue.length > 8" /></p>
 
<script type="text/javascript">
    var viewModel = {
        firstValue: ko.observable("hello"), // Observable
        secondValue: "hello, again"         // Not observable
    };
</script>
```

## 注意 4 ： checked 属性使用 value绑定

请不要使用 ```value``` 对 ```<input type='checkbox'>``` 或者 ```<input type='radio'>``` 进行绑定，要使用 ```checked```绑定。如果一定要使用的话，相当于 ```checked``` 绑定的 ```checkedValue```参数。

 




















