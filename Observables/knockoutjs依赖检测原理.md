http://www.knockmeout.net/2014/05/knockout-dependency-detection.html

## 问题
 + 1 对于一个 computed observable ，当computed改变，KO如何知道哪个依赖应该触发一次重新计算？
 + 2 怎么使依赖每次发生改变，computed 被重新计算？
 + 3 对于绑定来说，依赖如何被追踪的？

## 为 computed 处理依赖

knockout 有个 中间层对象，它给所有的 computed/observables 订阅者发出信号，并且分辨当前的 computed 是可以被计算的，它在依赖上设置一个订阅。

 + knockout内部有一个对象 ```ko.dependencyDetection``` ，它在对依赖订阅感兴趣的部分和可以被获取的依赖之间充当了媒介。我们把这个对象称作 依赖追踪者（dependency tracker）

 + 下面代码展示依赖追踪过程，依赖追踪者向当前对依赖感兴趣的某个对象发出信号。

 ```javascript
//一些 observables 
var test = ko.observable("one"),
    test2 = ko.observable("two"),
    test3 = ko.observable("three");


//computed 内部会开始追踪依赖，并且当任何observable 被调用的时候，它都会收到通知
ko.dependencyDetection.begin({
    callback: function(subscribable, internalId) {
        console.log("original context: " + internalId + " was accessed");
    }
});

```

```javascript
//access an observable
test();

//output:
//original context: 1 was accessed
```

任何对 observable或者computed的调用都会通知依赖追踪者。每个observable或者computed都有一个唯一的 id。



















