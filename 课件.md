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
    entry: '',               // 入口文件
    output: {},              // 出口文件
    module: {},              // 处理对应模块
    plugins: [],             // 对应的插件
    devServer: {},           // 开发服务器配置
    mode: 'development'      // 模式配置
}
```

