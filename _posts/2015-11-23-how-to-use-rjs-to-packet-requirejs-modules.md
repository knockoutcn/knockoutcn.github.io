---
layout: post
title: "how to use r.js to packet requirejs modules"
description: ""
category: 
tags: []
---
{% include JB/setup %}

这篇文章用来介绍如何用 r.js 给 requirejs 模块打包

## r.js是什么

r.js 是一个requirejs 官方推荐打包工具，它的作用是把零散的 define 模块按照 requirejs 的依赖关系打包到一个js文件中，来解决上线代码请求数过多的问题。除此之外，r.js 还可以对整个项目的代码进行优化，比如对js代码ugly、对css代码压缩、加上浏览器厂商前缀等。

关于打包问题，目前一直有关于 webpacket 和 r.js 打包方式的争论，其实它们的争端在于是否需要把公用模块单独拿出来打包尽量使用304. webpacket的做法是把公用模块打包，这样不同页面公用的模块间会用304加载模块，整体代码量会相对减少。 r.js 是把 requirejs用到的模块都打成一个文件，不去区分是否公用，这样公用的模块就会在不同的js文件中出现，整体代码量会上去，但是整体请求数会下降。
二者都有可取之处，关键看应用场景，是看重请求数的影响还是看重下载的代码量（对应流量）。

这里就先介绍 r.js 的打包方式吧！

直接看代码的同学，[进入这里](https://github.com/wikieswan/rjs-demo)

## 准备材料

	require.js  
	r.js
	node
	gulp

## 项目结构

	www/
		css/
			main.css
		js/
			app/
				index.js
			mod/
				add.js
				minus.js
			pub/	
				ten.js
		lib/
			require.js
		inde.html
	build.js
	gulpfile.js
	package.json
	r.js

工程目录中引入了gulp，引入gulp的目的是为了能在gulpfile中执行build指令，这个不是必须的，但是如果你项目本身就是用的gulp，把build集合到你的gulpfile中会很有用的。记住， gulpfile.js  package.json 这两个文件是非必须的。

## 代码结构简介

项目中index.html作为文件入口，所有的资源引用来自这里。

	//index.html

	<!DOCTYPE html>
	<html>
	<head>
		<title> rjs demo </title>
		<meta charset="utf-8" >
		<link rel="stylesheet" type="text/css" href="css/main.css">
	</head>
	<body>
	 <h2>rjs demo</h2>
	</body>
	</html>
	<script type="text/javascript" src="lib/require.js"></script>

	<!-- 仅仅在开发环境下使用 require.dev.config.js ，打包后删除引用 -->
	<script type="text/javascript" src="js/require.dev.config.js"></script>
	<!-- end of require.dev.config.js -->

	<script type="text/javascript" src="js/app/index.js"></script>

js/require.dev.config.js 是配置文件，requirejs的配置入口。

	//js/require.dev.config.js
	requirejs.config({
	    baseUrl: './js/mod',
	    urlArgs: '1.0.0',
	    paths: {
	        pub : '../pub'
	    },
	    shim: {

	    }
	});


app/ 是业务逻辑代码文件夹
mod/ pub/ 是模块代码文件夹

app/index.js

	//app/index.js
	requirejs(['add','minus','pub/ten'],function(add,minus,ten){
		var a = 1, 
			b = 2;
		var rst0 = add(a,b);
		var rst1 = minus(a,b);
		var rst2 = ten(a);	

		console.log(rst0,rst1,rst2);
	});

可以看出来，index.js引入了 'add','minus','pub/ten' 这三个文件

这里就不罗列这3个文件的代码了，看名字就能看出来，分别是加、减、乘以10。

这时候用浏览器打开，查看浏览器的http请求，可以发现类似下面的形式

	index.html
	main.css
	require.js
	require.dev.config.js
	index.js
	add.js?1.0.0
	minus.js?1.0.0
	ten.js?1.0.0

其中?1.0.0是在配置文件 js/require.dev.config.js 配置的版本号。

## 开始build

上面介绍了requirejs项目的情况，接下来我们就准备打包吧。

打包必须：r.js

这个文件可以去requirejs官网下载。官网提供两种方式打包，分别是命令行配置和文件配置。

命令行配置不利于理解，也不利于代码维护，这里我们就讲文件配置打包方式。

我们再项目的根目录下配置一个buil.js。

	//build.js
	({
	    appDir: './www',
	    baseUrl: 'js/mod',
	    dir: './build',
	    paths: {
	        'pub' : '../pub',
	        'app' : '../app'
	    },
	    modules: [
	        {
	            name: 'app/index'
	        }
	    ],
	    fileExclusionRegExp: /require.dev.config.js/,
	    removeCombined: true,
	    optimizeCss: 'standard'
	})

这里讲解下这几个参数的意义；

	appDir
	待打包项目的根目录

	baseUrl
	js文件的根路径，等价于  js/require.dev.config.js 配置的 baseUrl

	dir
	rjs打包输出路径

	paths
	等价于 js/require.dev.config.js 配置的 paths 。模块（modules）的相对目录。

	shim
	为那些没有使用define()声名依赖关系及设置模块值的模块，配置依赖关系与“浏览器全局”出口的脚本。

	fileExclusionRegExp
	定义打包过滤的规则，把不需要输出的文件过滤掉。

	removeCombined
	是否在打包前清空上次生成的代码

	optimizeCss
	css代码的优化规则，RequireJS Optimizer会自动优化应用程序下的CSS文件。这个参数控制CSS最优化设置。允许的值： “none”, “standard”, “standard.keepLines”, “standard.keepComments”, “standard.keepComments.keepLines”。


在正确配置build.js信息之后，我们需要执行一个命令来打包

	node r.js -o build.js

打包之后，在项目根目录下生成 build/	，build/的结构如下

	css/
		main.css
	js/
		app/
			index.js
	lib/
		require.js
	build.txt	
	index.html	
				
可以看到，js/文件夹下就只有 app/index.js 了。build.txt 里面记录了rjs打包规则。

这时候查看 build/index.html 可以看到请求结果如下

	index.html
	main.css
	require.js
	index.js

其中	 main.css css代码被压缩，index.js 代码合并了所以来的模块代码。

可以发现，这时候 js/require.dev.config.js 这个文件就没有必要引用了。为什么呢？

道理是这样的，js/require.dev.config.js 这个文件存在于开发环境 （www/），当html引入了 app/index.js ，js/require.dev.config.js来告诉网页怎么根据 app/index.js 的引用去找到真实的js模块代码 。

当打包完成之后，所以 app/index.js 依赖的模块都被打包进去了，已经完成了代码的注入了，所以就不需要依赖 js/require.dev.config.js 来寻址其他模块了 ，所以说打包后就不再需要引入了 。

## 结论

可以看到，打包后请求数显著下降了，整个工程的代码也都被优化了。


## 如何在gulp中执行rjs build命令

rjs 的打包命令是 

	node r.js -o build.js

我们只需要在gulpfile.js执行这条语句就好了 。代码如下：


	var gulp = require('gulp')
	var exec = require('child_process').exec;

	gulp.task('rjsBuild', function(cb) {
	    exec('node r.js -o build.js', function (err, stdout, stderr) {
	        console.log(stdout);
	        console.log(stderr);
	        cb(err);
	    });
	    
	});


这里解释下，如果需要在gulpfile.js 中执行任意 node 语句 ，需要引入 require('child_process').exec 模块，这是node 自己的模块，不需要借助其他gulp插件。

## 完






















