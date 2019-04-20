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

webpack的默认配置比较方便，但是对于不同的项目，我们往往需要高度的可定制性，这时候就需要我们自己写配置文件。

在项目目录下创建webpack.config.js

```javascript
//常用配置模块
module.exports = {
    entry: '',               // 入口文件
    output: {},              // 出口文件
    devtool: '',
    mode: '',                // 模式配置
    module: {},              // 处理对应模块
    plugins: [],             // 对应的插件
    devServer: {}            // 开发服务器配置
    optimization: {},        //压缩和模块分离
    resolve: {}              //模块如何解析，路径别名
}
```

### 入口(entry)与出口(output)

- 单入口单出口

  ```javascript
  module.exports = {
      entry: "./src/index.js",
      output: {
          path: path.resolve('dist'),
          filename: 'main.js'
      }
  }
  ```

  写好配置文件后再次

  ```
  npx webpack --mode development || production
  ```

  效果不变。

  借用npm script，在package.json中scripts属性增加script如下

  ```json
  {
  	"scripts": {
      	"dev": "npx webpack --mode development",
      	"build": "npx webpack --mode production"
      }
  }
  ```

  npx webpack --mode development --> npm run dev

  npx webpack --mode production --> npm run build

- 多入口与多出口

  多入口多出口：多页面应用(MPA)，打包多个js文件，不同页面分别引入。

  单入口多出口：**单页面应用(SPA)**，借助内置splitChunksPlugins模块进行代码分割，方便分离公共模块以及懒加载。

### 模式(mode)

```javascript
module.exports = {
    mode: 'development' || 'production'
}
```

mode写入配置文件后，执行webpack时就不用再带mode选项

- development

  开发模式，即写代码的时候，在此模式下，为了提高开发效率，我们需要**提高编译速度，配置热更新和跨域，以及快速debug**。

- production

  生产模式，即项目上线后，在此模式下，我们要**打包一份可部署代码，需要对代码进行压缩，拆分公共代码以及第三方js库**。

理解这两种模式容易，关键是根据不同的模式对webpack做不同的配置，因为不同模式下我们对代码的需求不一样。

开发项目时，通常会写两套不同的配置，一套用于开发环境，一套用于生产环境，两套不同配置包括三个配置文件，分别为

- 基础配置文件webpack.config.js（包含开发与生产环境下都需要的配置）
- 开发环境配置文件webpack.dev.js
- 生产环境配置文件webpack.prod.js

**以基础配置文件为入口，根据环境变量判断当前环境，使用webpack-merge插件融合相应环境配置文件。**

```javascript
//webpack.config.js
const path = require('path');
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev.js');
const prodConfig = require('./webpack.prod.js');

const commonConfig = {
    output: {
        path: path.resolve('dist')
    }
}

module.exports = (env) => {
    if(env && env.production) {
        return merge(commonConfig, prodConfig);
    } else {
        return merge(commonConfig, devConfig);
    }
}

//webpack.dev.js
module.exports = {
    mode: 'development',
    output: {
        filename: '[name].js',
    }
}

//webpack.prod.js
module.exports = {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js'
    }
}
```

对scripts字段改写如下

```json
{
	"scripts": {
    	"dev": "npx webpack",
    	"build": "npx webpack --env.production"
    }
}
```

### devtool（错误映射）

```javascript
devtool:'none'   //在开发者模式下，默认开启sourcemap,将其关闭
devtool:'source-map'   //开启映射打包会变慢
devtool:'inline-source-map'    //不单独生成.map文件，会将生成的映射文件以base64的形式插入到打包后的js文件的底部
devtool:'cheap-inline-source-map'   //代码出错提示不用精确显示第几行的第几个字符出错，只显示第几行出错，会提高一些性能
devtool:'cheap-module-inline-source-map'   //不仅管自己的业务代码出错，也管第三方模块和loader的一些报错
devtool:'eval'   //执行效率最快，性能最好，但是针对比较复杂的代码的情况下，提示内容不全面
devtool: 'cheap-module-eval-source-map'   //在开发环境推荐使用，提示比较全，打包速度比较快
devtool: 'cheap-module-source-map'   //在生产环境中推荐使用，提示效果会好一些
```

在webpack.dev.js和webpack.prod.js中分别加入devtool

```javascript
//webpack.dev.js
module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map'
    output: {
        filename: '[name].js',
    }
}

//webpack.prod.js
module.exports = {
    mode: 'production',
    devtool: 'cheap-module-source-map'
    output: {
        filename: '[name].[contenthash].js'
    }
}
```

### plugins（插件）

插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。想要使用一个插件，你只需要 `require()` 它，然后把它添加到 `plugins` 数组中。多数插件可以通过选项(option)自定义。你也可以在一个配置文件中因为不同目的而多次使用同一个插件，这时需要通过使用 `new` 操作符来创建它的一个实例。**（抄自官方）**

在我看来，plugins的主要作用有：

- 让打包过程更便捷
- 开发环境对打包进行优化，加快打包速度
- 生产环境压缩代码

##### 两个简单插件示例

- html-webpack-plugin

  这个插件可以在打包完成后自动生成index.html文件，并将打包生成的js、css文件引入。

  ```shell
  npm install html-webpack-plugin -D
  ```

  新建public文件夹并创建index.html作为模板文件

  在webpack.config.js中

  ```javascript
  const path = require('path');
  const merge = require('webpack-merge');
  const HtmlWepackPlugin = require('html-webpack-plugin');
  const devConfig = require('./webpack.dev.js');
  const prodConfig = require('./webpack.prod.js');
  
  const commonConfig = {
      output: {
          path: path.resolve('dist')
      },
      plugins: [
          new HtmlWepackPlugin({
              template: 'public/index.html',
          }),
      ]
      
  }
  
  module.exports = (env) => {
      if(env && env.production) {
          return merge(commonConfig, prodConfig);
      } else {
          return merge(commonConfig, devConfig);
      }
  }
  ```


- clean-webpack-plugin

  自动清除上次打包生成的dist文件

  ```shell
  npm install clean-webpack-plugin -D
  ```

  在webpack.prod.js中

  ```javascript
  const CleanWepackPlugin = require('clean-webpack-plugin');
  module.exports = {
      mode: 'production',
      devtool: 'cheap-module-source-map'
      output: {
          filename: '[name].[contenthash].js'
      },
  	plugins: [
      	new CleanWepackPlugin()
  	]
  }
  ```

### loader（文件预处理）

loader让 webpack 能够处理非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。**（抄自官方）**

在我看来，loader的主要作用有：

- 处理图片、字体等资源
- 处理css、预编译sass/less/stylus
- 把ES6+代码转义为ES5

下面会引入css、图片依赖，为使目录结构清晰，分别打包进单独文件夹

#### 加载CSS

```shell
npm install css-loader style-loader -D
npm install mini-css-extract-plugin -D
```

在配置文件中加入loader

注意：

- use字段下如果有多个loader，从后至前依次执行
- 开发环境下使用css-loader和style-loader会把CSS写进JS，然后JS添加样式，写在内联style里
- 生产环境下借助webpack4的mini-css-extract-plugin把CSS文件单独分离，link引入，同时使用optimize-css-assets-webpack-plugin压缩CSS代码

```javascript
//webpack.prod.js
const CleanWepackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'cheap-module-source-map'
    output: {
        filename: 'js/[name].[contenthash].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }   //文件打包至dist/css目录下，需配置publicPath，以防等会引入图片出错
                    },
                    'css-loader',
                ]
            }
        ]
    },
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    },
	plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:8].css'
        }),
    	new CleanWepackPlugin()
	]
}

//webpack.dev.js
module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map'
    output: {
        filename: 'js/[name].js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            }
        ]
    },
}
```

##### 处理scss

```shell
npm install node-sass sass-loader -D

test: /\.css$/  -->  test: /\.s?css$/
use最后加sass-loader即可
```

##### postcss自动添加浏览器前缀

```shell
npm install postcss-loader autoprefixer -D
```

```javascript
//use最后添加loader
{
	loader: 'postcss-loader',
	options: {
    	plugins: [require('autoprefixer')]
    }
}
```

#### 打包图片

##### 在CSS等文件引入图片

```shell
npm install file-loader url-loader -D
```

在webpack.config.js中

```javascript
const path = require('path');
const HtmlWepackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev.js');
const prodConfig = require('./webpack.prod.js');

const commonConfig = {
    output: {
        path: path.resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            outputPath: 'images/'
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new HtmlWepackPlugin({
            template: 'public/index.html',
        }),
    ]
}

module.exports = (env) => {
    if(env && env.production) {
        return merge(commonConfig, prodConfig);
    } else {
        return merge(commonConfig, devConfig);
    }
}
```

url-loader配合file-loader，在options中限制添加limit可以把指定大小图片编码成base64，减少网络请求。

##### html引入图片

```shell
npm install html-withimg-loader -D
```

```javascript
//添加html-withimg-loader
{
	test: /\.html$/,
    use: [
    	{
       		loader: 'html-withimg-loader'
        }
    ]
},
```

字体引入同样使用file-loader，用法无差别，不细说

#### babel——转义ES6+代码

(jsx在此先不提)

babel默认只转换语法,而不转换新的API,如需使用新的API,还需要使用对应的转换插件，例如，默认情况下babel可以将箭头函数，class等语法转换为ES5兼容的形式，但是却不能转换Map，Set，Promise等新的全局对象，这时候就需要使用polyfill去模拟这些新特性。

```shell
npm install babel-loader @babel/core @babel/preset-env -D
npm install @babel/plugin-transform-runtime -D
npm install @babel/runtime --save
npm install @babel/runtime-corejs2 --save
```

在webpack.config.js中

```javascript
const path = require('path');
const HtmlWepackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev.js');
const prodConfig = require('./webpack.prod.js');

const commonConfig = {
    output: {
        path: path.resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: '/node_mudules/',
                use: 'babel-loader',
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-withimg-loader'
                    }
                ]
            },
        ]
    },
    plugins: [
        new HtmlWepackPlugin({
            template: 'public/index.html',
        }),
    ]
}

module.exports = (env) => {
    if(env && env.production) {
        return merge(commonConfig, prodConfig);
    } else {
        return merge(commonConfig, devConfig);
    }
}
```

在项目目录下新建.babelrc文件，写入options

```javascript
//.babelrc
{
    "presets": [
        "@babel/preset-env"
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": "2",
                "helpers": true,
                "regenerator": true,
                "useESModules": true
            }
        ]
    ]
}
```

关于babel的使用，还可以看一下这篇文章<https://www.jianshu.com/p/3b27dfc6785c>。

#### devServer

每次编写完代码后，都要重新npm run dev，为了提高开发效率，我们借助webpack-dev-server配置本地开发服务，主要字段如下：

```javascript
{
	devServer: {
        contentBase: './dist',    //配置开发服务运行时的文件根目录
        port: 3000,       //端口
        hot: true, //是否启用热更新
        open: false,//是否自动打开浏览器
        proxy: {            //配置代理
        	'/api': "http://localhost:8000"
        }
    },
}
```



### 参考文档：

[webpack指南](https://www.webpackjs.com/guides/)

[24 个实例入门并掌握「Webpack4」](<https://juejin.im/post/5cae0f616fb9a068a93f0613#heading-6>)

[从基础到实战 手摸手带你掌握新版Webpack4.0详解 一起读文档](<https://juejin.im/post/5cb36a3ef265da03a1581d6d#heading-26>)





