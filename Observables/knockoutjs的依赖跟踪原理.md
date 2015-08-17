# knockoutjs的依赖跟踪是如何实现的

初学者可以不需要知道，但是更高级的开发者想知道为什么我们让所有knockout作用域链会自动跟踪依赖以及自动完成正确的UI更新。

其实原理很简单也很可爱哦。追踪算法大致如下：

 + 1 每当你声明一个 ```computed observable```对象，knockout会立即调用它的计算函数来获取它的初始化值。
 + 2 当计算函数运行的时候，knockout为每个计算函数读取的```observables```创建一个订阅（包括其他的```computed observable```）。订阅的回调函数用来触发计算函数运行，循环执行这个过程，直到跳转到第一步（处理那些不再运行的任何旧的订阅）。
 + 3 knockout把```computed observable```新的值通知任何订阅者。

 