# Webpack

webpack 是一个现代 JavaScript 应用程序的**静态模块打包器**(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个bundle。

Webpack思想：一切皆模块

- js/ts
- jsx/vue
- css/sass/less/stylus
- svg/png/jpg/gif...
- ttf/otf/woff/eot

所有项目中使用到的依赖文件都被视为模块，webpack做的就是把这些模块进行处理，进行一系列的转换、压缩、合成、混淆操作，把项目文件打包成最原始的静态资源。





### 简单体验

创建目录结构

```shell
mkdir webpack-demo
cd webpack-demo

npm init -y

mkdir dist src
```

在dist目录下创建index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<script src="main.js"></script>
<body>
    
</body>

</html>
```

在src目录下创建index.js

```javascript
//使用ES7代码，方便等会演示babel使用
function timeout(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

async function asyncPrint(value, time) {
    await timeout(time);
    console.log(value);
}

asyncPrint("hello,world", 5000);
```

安装webpack

```shell
//全局安装
npm install webpack webpack-cli -g
//局部安装，写入开发环境依赖
npm install webpack webpack-cli -D
```

执行webpack

```shell
//以下代码生效基于webpack4零配置，只用于演示

//如果为全局环境安装
webpack
//如果为局部安装
npx webpack
//此处未加mode选项，应该会有warning，默认mode为production

//增加mode后
webpack --mode development || production
npx webpack --mode development || production
```

webpack会默认src/index.js文件为入口，dist/main.js为出口打包

### 正式开始

项目目录下创建webpack.config.js

```javascript
//常用配置模块
module.exports = {
    devtool: ''
    mode: 'development'      // 模式配置
    entry: '',               // 入口文件
    output: {},              // 出口文件
    module: {},              // 处理对应模块
    plugins: [],             // 对应的插件
    devServer: {}            // 开发服务器配置
}
```

babel转换es6+代码

npm install

```
devtool:'none'   //在开发者模式下，默认开启sourcemap,将其关闭
devtool:'source-map'   //开启映射打包会变慢
devtool:'inline-source-map'    //不单独生成.map文件，会将生成的映射文件以base64的形式插入到打包后的js文件的底部
devtool:'cheap-inline-source-map'   //代码出错提示不用精确显示第几行的第几个字符出错，只显示第几行出错，会提高一些性能
devtool:'cheap-module-inline-source-map'   //不仅管自己的业务代码出错，也管第三方模块和loader的一些报错
devtool:'eval'   //执行效率最快，性能最好，但是针对比较复杂的代码的情况下，提示内容不全面
devtool: 'cheap-module-eval-source-map'   //在开发环境推荐使用，提示比较全，打包速度比较快
devtool: 'cheap-module-source-map'   //在生产环境中推荐使用，提示效果会好一些
```

