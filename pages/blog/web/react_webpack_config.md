---
title: react脚手架项目webpack@4.44.2配置less，antd按需加载，路径别名
date: 2021-08-25
tags:
  - react
  - webpack
  - less
---

# react 脚手架项目 webpack@4.44.2 配置 less，antd 按需加载，路径别名

### antd 按需加载

1. 需要安装 babel-plugin-import，less，less-loader
2. 在 webpack.config.js 的 **oneOf** 后面添加 less 配置

```js
{
	test: lessRegex,
    exclude: lessModuleRegex,
    use: getStyleLoaders({
    	importLoaders: 3,
	    sourceMap: isEnvProduction
    		? shouldUseSourceMap
	    	: isEnvDevelopment,
		},
        'less-loader'
	),
	sideEffects: true,
},
{
	test: lessModuleRegex,
    use: getStyleLoaders({
    	importLoaders: 3,
   	 	sourceMap: isEnvProduction
   	 		? shouldUseSourceMap
            : isEnvDevelopment,
            modules: {
            	getLocalIdent: getCSSModuleLocalIdent,
            },
		},
        'less-loader'
	),
},
```

3. 在 webpack.config.js 中的 getStyleLoaders 方法后面添加此段

```js
if (preProcessor === "less-loader") {
	loaders.push({
		loader: require.resolve(preProcessor),
		options: {
			modifyVars: { //自定义主题
			'primary-color': ' #1890ff ',
		},
		javascriptEnabled: true,
	})
}

```

### 配置路径别名

1. 找到 webpack.config.js 中的 alias 配置

```js
alias: {
	'react-native': 'react-native-web',
	...(isEnvProductionProfile && {
		'react-dom$': 'react-dom/profiling',
		'scheduler/tracing': 'scheduler/tracing-profiling',
	}),
	...(modules.webpackAliases || {}),
	'@': resolve(__dirname, '../src')
},
```

2. 如果是 ts 项目需要在 tsconfig.json 文件中添加声明

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```
