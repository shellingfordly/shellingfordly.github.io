---
title: Vue基础学习笔记
date: 2019-10-14
tags:
  - vue
---

# vue

<span>
&nbsp;&nbsp;&nbsp;&nbsp;
Vue 是一套用于构建用户界面的渐进式框架。
Vue 被设计为可以自底向上逐层应用。
Vue 的核心库只关注视图层，便于与第三方库或既有项目整合。
当与现代化的工具链以及各种支持类库结合使用时，Vue 也完全能够为复杂的单页应用提供驱动。
</span>

---

<!-- more -->

# 初始 VUE

- 在 html 中引入 Vue

```html
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
```

## 声明

```html
<div id="app">{{ message }}</div>

<script>
  let app = new Vue({
    // 根节点  活动范围  作用范围
    el: "#app",
    // DOM中可以获取到的  数据
    data: {
      message: "Hello Vue!",
    },
  });
</script>
```

## 双向数据绑定

```js
let data = {};
let temp = {};

// 给data对象添加属性a
Object.defineProperty(data, "a", {
  // 定义属性能否被遍历
  enumerable: true, // 默认false 不可遍历
  // 定义属性能否被删除
  configurable: true, // 默认false 不可删
  // 定义属性能否被重新设置
  writable: false, // 默认false 不可重写
  // 给a赋值
  value: "a属性的值",
  // 当获取a属性时，会触发get回调函数
  get() {
    // 若在get中只写data.a，不return的话，获取a属性的值时也会堆栈溢出
    // return data.a;

    // 返回中间变量的值
    return temp.a;
  },
  // 当设置a属性时，会触发set回调函数
  set(value) {
    // 默认参数value---为给data属性赋的值
    /*
			data.a = "xxx" 设置属性值会调用data的set函数
			如果这样写的话，此时又会再次调用set函数，然后无限递归的调用下去
			但是只有递没有归，最后会堆栈溢出报错
			data.a = value;
		*/

    // 因此借助一个中间变量来避免堆栈溢出
    temp.a = value;
  },
});

data.a = "设置新的a属性的值";
```

### 模拟 Vue 双向数据绑定

```html
<input id='inp'/>
<script type="text/javascript">
let data = {};
let temp = {};
Object.defineProperty(data,'a',{
	get(){
		return temp.a
	},
	set(value){
		temp.a = value;
		// 设置data.a的值时，改变文本框内容 --- model影响视图
		inp.value = value
	}
})
// input --- 文本框输入数据时，就会触发回调函数
inp.addEventListener('input',function(){
	// 视图文本框输入时，改变data.a的值 --- 视图影响model
	data.a = this.value
})
</scirpt>
```

---

# API

## 指令

### v-text

- 数据以文本形式显示

```html
<span v-text="msg"></span>
<!-- 和下面的一样 -->
<span>{{msg}}</span>
```

### v-html

- 自动解析字符串数据，以 html 形式呈现

```html
<div id="app">
  <div v-html="html"></div>
</div>
<script>
  let app = new Vue({
    el: "#app",
    data: {
      html: "<p>这是一个p标签</p>",
    },
  });
</script>
```

### v-show

- 是否隐藏元素 -- 切换元素的 **display** CSS 属性
  - 为真显示，为假隐藏

```html
<h1 v-show="true">Hello!</h1>
```

### v-if

- 是否渲染元素 -- 元素存在或不存在

```html
<h1 v-if="true">Hello!</h1>
```

### v-if 和 v-show

- v-if 元素 存在 或者 不存在
- v-show 元素存在 -- 显示 或者 隐藏

### v-else

- 跟 v-if 或 v-else-if 组合是使用
- 前一兄弟元素必须有 v-if 或 v-else-if
- 不可单独出现

```html
<div v-if="Math.random() > 0.5">Now you see me</div>
<div v-else>Now you don't</div>
```

### v-else-if

- 跟 v-if 或 v-else-if 组合是使用
- 前一兄弟元素必须有 v-if 或 v-else-if
- 不可单独出现

```html
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else-if="type === 'C'">C</div>
<div v-else>Not A/B/C</div>
```

### v-for

- 多次渲染元素或者模板快
- 用法

```html
<div v-for="item in items">{{ item.text }}</div>
```

- items 可以是数组、对象、字符串

### v-on

- 绑定事件监听器(例如点击事件，鼠标移入移出事件等)
- 简写 **@**

```html
<button v-on:click="doThis"></button> <button @click="doThis"></button>
```

- @click=fn 和 @click=fn() 的区别
  - 前者默认传入 \$event
  - 后者必须手动传入 \$event，才能在回调中使用事件对象

#### 事件修饰符

- .stop 阻止冒泡
- .capture 当某事件触发时，会先执行设置 capture 的事件
- .self 只有当事件是从侦听器绑定的元素本身触发时才触发回调

```html
<!-- 1. 点击grandson时，默认会冒泡，即执行顺序为grandson--son--parent -->
<div @click="parent">
  parent
  <div @click="son">
    son
    <div @click="grandson">grandson</div>
  </div>
</div>
<!-- 2. 当parent添加了capture，点击grandson时，执行顺序为parent--grandson--son -->
<div @click.capture="parent">
  parent
  <div @click="son">
    son
    <div @click="grandson">grandson</div>
  </div>
</div>
<!-- 3. 当grandson添加了stop，点击grandson时，只执行grandson，不冒泡 -->
<div @click="parent">
  parent
  <div @click="son">
    son
    <div @click.stop="grandson">grandson</div>
  </div>
</div>
<!--
4. 当son添加了self，
	点击grandson时，执行顺序为grandson--parent，不执行son
	点击son时，执行顺序为son--parent
-->
<div @click="parent">
  parent
  <div @click.self="son">
    son
    <div @click.stop="grandson">grandson</div>
  </div>
</div>
```

- .once 只触发一次回调(例如点击一次之后再点击不再触发)
- .prevent 阻止默认行为(例如 阻止 submit 默认刷新页面，阻止 a 标签跳转页面)

### v-bind

- 动态地绑定一个或多个特性
- v-bind:class 可缩写为 :class
- 绑定特性的值可以使用 数组 或者 对象
  - 绑定的数据为对象时，red 为类名，isRed 判断是否绑定
    - isRed 为真，给 div 绑定类名 red；反之不绑定
  - 绑定的数据为数组时，将为 div 绑定数组中的 所有数据项 的类名

```html
<div :class="{ red: isRed }"></div>
<div :class="[classA, classB]"></div>
<div :class="[classA, { classB: isB, classC: isC }]"></div>
```

### v-model

- 在表单控件或者组件上创建双向绑定
  - 双向绑定：代码中的数据可以改变视图的渲染，视图的变化可以改变代码中的数据
- 限制
  - \<input\>
  - \<select\>
  - \<textarea\>
  - 组件(components)

```html
<!-- 在input中出入输入数据后，msg会获取到input中的数据，也就是value值 -->
<div id="app">
	<input v-model="msg"></input>
</div>
<script>
let app = new Vue({
  el: '#app',
  data: {
    msg: ''
  }
})
</script>
```

#### 修饰符

- .lazy 取代 input 监听 change 事件
  - 在 input 中输入时，不会立即响应到代码上，改变 msg 的值
  - 而是等到 input 失去焦点时将所有数据全部付给 msg
- .number 输入字符串转为有效的数字
- .trim 输入首尾空格过滤
  - 过滤 input 中输入的数据的前后空格
  - 中间空格不会被过滤(例如"i love you")

```html
<input v-model.lazy ="msg"></input>
<input v-model.number ="msg"></input>
<input v-model.trim ="msg"></input>
```

### v-once

- 只渲染元素和组件一次
- 随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过
- 可以用于优化更新性能

### v-cloak

- 隐藏在响应时间中页面加载的还未渲染数据的原状态

```html
<style>
  [v-cloak] {
    display: none;
  }
</style>
<div v-cloak></div>
```

---

## 生命周期钩子

### beforeCreate

- 此时 vue 实例中，data 没有数据
- 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用

![img](/images/blog/old/1.jpg)

### created

- 此时的 vue 实例中，data 已经有数据了，但是数据没有挂载到跟节点上
- 此时并没有根节点，所以节点以及数据还没有挂载到视图中
- 在实例创建完成后被立即调用
- 在这一步，实例已完成以下的配置：
  - 数据观测 (data observer)
  - 属性和方法的运算
  - watch/event 事件回调
- 然而，挂载阶段还没开始，\$el 属性目前不可见

![img](/images/blog/old/2.jpg)

### beforeMount

- 此时根节点已经存在，但是数据还没有挂载到根节点
- 在挂载开始之前被调用：相关的 render 函数首次被调用

![img](/images/blog/old/4.jpg)

### mounted

- el 被新创建的 vm.\$el 替换，并挂载到实例上去之后调用该钩子
- 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.\$el 也在文档内
- **注意** mounted 不会承诺所有的子组件也都一起被挂载
  - 如果你希望等到整个视图都渲染完毕
  - 可以用 vm.\$nextTick
- 此时数据已经挂载到根节点上了

![img](/images/blog/old/3.jpg)

### beforeUpdata

- 数据更新时调用，发生在虚拟 DOM 打补丁之前
- 这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器
- 在数据改变之前触发

![img](/images/blog/old/5.jpg)

### updatea

- 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子
- 当这个钩子被调用时，组件 DOM 已经更新
- 在数据改变之后

![img](/images/blog/old/6.jpg)

### activated

- 当组件被缓存，不再重新渲染时，其他几个生命周期函数不再被触发
- 此时 activated 和 deactivated 钩子能够被触发
- 当组件被展示的时候触发

### deactivated

- 当组件被缓存，不再重新渲染时，其他几个生命周期函数不再被触发
- 此时 activated 和 deactivated 钩子能够被触发
- 当组件没有被展示的时候触发

## 组件

### keep-alive

- 存放在 keep-alive 里的组件，其余的六个生命周期函数不再被触发
- 只能触发 activated 和 deactivated 钩子
- 因此数据的更新以及其他操作需要在 activated 和 deactivated 中完成
- 原来写在 created 中的处理需要写到 activated 中去

### transition

- 为元素/组件添加过渡效果
- name, 用于自动生成 css 过渡类名, 默认类名"v"
- 使用

```html
<div id="demo">
  <button v-on:click="show = !show">Toggle</button>
  <transition name="fade">
    <p v-if="show">hello</p>
  </transition>
</div>
<script>
  new Vue({
    el: "#demo",
    data: {
      show: true,
    },
  });
</script>
<style>
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s;
  }
  .v-enter,
  .v-leave-to {
    opacity: 0;
  }
</style>
```

- 使用 all 对所有属性都执行过渡动画

```
<style>
.v-enter-active, .v-leave-active {
  transition: all .5s;
}
.v-enter, .v-leave-to {
	left: 100px;
  opacity: 0;
}
</style>
```

#### 过渡类名

- -enter 进入过渡的开始状态
- v-enter-active 进入过渡的过程时间
- v-leave-active 离开过渡的过程时间
- v-leave-to 离开过渡的结束状态

## 实例属性

### vm.\$data

- Vue 实例观察的数据对象
- Vue 实例代理了对其 data 对象属性的访问

```js
let vm = Vue({
  el: "#app",
  data: {
    a: 1,
    b: 2,
  },
});
// 完全相等
vm.$data.a = vm.a;
vm.$data.b = vm.b;
```

### vm.\$el

- Vue 实例使用的根 DOM 元素
- 根节点(例如上面的"#app"获取到的 DOM 元素)

### vm.\$root

- 当前组件树的根 Vue 实例
- 如果当前实例没有父实例，此实例将会是其自己

### vm.\$children

- 当前实例的直接子组件
- 需要注意 \$children 并不保证顺序，也不是响应式的

### vm.\$refs

- 一个对象，持有注册过 ref 特性 的所有 DOM 元素和组件实例

---

## 实例方法 / 数据

### vm.\$set

- 使用 vm.\$set(对象，属性，值)
- 全局 Vue.set 的别名
- 可以为 Vue 实例 vm 绑定一个响应式的属性
  - 如果是普通的属性添加不是响应式的

```js
vm.$data.abc = 1;
```

### vm.\$mount

- 手动地挂载一个未挂载 el 的实例

```js
let vm = Vue({
  // el: "#app",
  data: {
    a: 1,
    b: 2,
  },
  // 和el的作用相同
}).$mount("app");
```

### vm.\$destroy()

- 完全销毁一个实例
- 清理它与其它实例的连接，解绑它的全部指令及事件监听器。
- 触发 beforeDestroy 和 destroyed 的钩子

### vm.\$nextTick( [callback] )

- 将回调延迟到下次 DOM 更新循环之后执行
- 在修改数据之后立即使用它，然后等待 DOM 更新

## 特性

### key

- 遍历组件时需要给组件绑定 key 值，不然报黄色警告

### ref

- 给元素或者子组件注册引用信息
- 引用信息在父组件的\$refs 对象上
- ref 是作为渲染结果被创建的，在初始渲染时不能访问
- \$refs 也不是响应式的，不能用来在模板中做数据绑定
- 可以用它来直接操作某个元素或子组件
  - 例如使聚焦一个 input 框

```js
this.$refs.usernameInput.focus();
```

---

# 实际操作

## 全局 API

### directive()

- 注册自定义指令
- 获取全局指令

```js
new Vue({
  // 疑问：el是作用范围app还是input元素
  el: "",
  data: {},
  directive: {
    // 存放自定义指令
    focus(el) {
      // 在input框中加入 v-focus 直接使用
      el.focus(); // 让元素获取焦点
    },
  },
});
```

### watch

- 监控数据变化
- 形式
  - 普通监控：当数组中某个对象的属性值发生变化时，检测不到
  - 深度监控：可以监控到数据发生的一切变化

```js
new Vue({
	watch: {
		// 普通监控
		arr(){
			consolo.log("监控到了arr数组发生了变化")
		},
		// 深度监控
		msg(){
			handler(){
				consolo.log("监控到了arr数组发生了变化")
			},
			deep: true // 为true时深度监控
		}
	}
})
```

## 组件

### 子组件生命周期

![img](/images/blog/old/7.jpg)

## 数据传输

### 父子传输

#### props

> 父组件向子组件传递数据

- 专门用来存放父组件传入的数据
- 两个方式

```html
<!-- 要做父组件中调用的子组件元素标签上绑定:sonA='fatherA'，否则是无效的 -->
<son :sonA="fatherA"></son>
<script>
  let son = {
    // 对象
    props: {
      sonA: {
        type: String, // 校验数据类型
        required: true, // 校验是否有传值给啊
        default: "1", // 设置默认值
        validator(value) {
          // 对sonA校验，符合要求不报错，反之报错
          return value > 1;
        },
      },
    },
    // 数组
    // 没有校验，直接接收父组件传来的值
    props: ["sonA"],
  };
</script>
```

#### emit 发射事件

> 子组件向父组件传递数据

- 子组件在触发某事件(如 click)时，执行(sonFn)函数，向父组件发射某个(xxx)事件
- 父组件在子组件(son)上绑定这个(xxx)事件；当子组件执行(sonFn)函数时，父组件执行(fatherFn)函数
- 在(fatherFn)函数中默认参数为子组件传递的数据

```html
<div id="app">
  <son @xxx="fatherFn"></son>
</div>
<template id="son">
  <div>
    <button @click="fn">发送数据</button>
  </div>
</template>
<script>
  let son = {
    template: "#son",
    data() {
      return {
        msg: "这是子组件的数据",
      };
    },
    methods: {
      sonFn() {
        this.$emit("xxx", this.msg);
      },
    },
  };
  let vm = new Vue({
    el: "#app",
    components: {
      son,
    },
    methods: {
      fatherFn(value) {
        // value 子组件的数据
        console.log(value);
      },
    },
  });
</script>
```

#### 插槽传递

> 子组件向父组件传递数据

- 通过子组件的插槽来向父组件传递数据
- 通过 **:** 向父组件传递一个对象
  - 子组件在 slot 中设置属性；one 为属性名，onemsg 为属性值
  - 父组件通过 slot-scope 属性定义接收数据的变量名

```html
<div id="app">
  <son>
    <template slot-scope="result">
      <p>{{result.one}}</p>
      <p>{{result.two}}</p>
    </template>
  </son>
</div>
<template id="son">
  <div>
    <slot :one="onemsg" :two="twomsg"></slot>
  </div>
</template>
<script>
  let son = {
    template: "#son",
    data() {
      return {
        onemsg: "第一条数据",
        twomsg: "第二条数据",
      };
    },
  };
  let vm = new Vue({
    el: "#app",
    components: {
      son,
    },
  });
</script>
```

### 兄弟传输

#### 事件车

> 子组件的所有兄弟组件都可以通过事件车获取数据

```html
<div id="app">
  <son1></son1>
  <son2></son2>
</div>
<template id="son1">
  <div @click="fn">son1</div>
</template>
<template id="son2">
  <div>son2</div>
</template>
<script>
  // 类似子组件给父组件传值，通过发射事件传输
  // 由于son2的this.$on()是不可能被son1的this.$emit()发射的事件触发的
  // 所以需要定义一个中间vue实例来完成，发射事件，与订阅接收
  // 在eventBus内部处理两个组件的数据
  let eventBus = new Vue();

  let son1 = {
  	template: "#son1",
  	data(){
  		returen {msg:"我是son1要发生给son2的数据"}
  	},
  	methods: {
  		fn(){
  			// 点击执行fn，发射一个事件xxx，并传输相应的值
  			eventBus.$emit("xxx",this.msg)
  		}
  	}
  }
  let son2 = {
  	template: "#son2",
  	created(){
  		// $on 订阅一个事件xxx，触发后执行回调喊出，并接收传过来的值
  		eventBus.$on('xxx',(value)=>{
  			console.log(value) // son1的msg
  			console.log("这里是son2，被son1触发了")
  		})
  	}
  }
</script>
```

#### vuex 的全局仓库

> 不止是兄弟之间，任何组件都可以拿到仓库中的数据

### 获取视图更新数据时

> 在调用 methods 中的方法改变数据时，此时是无法从视图中获取到更新后的数据的；
> 此时视图还没有更新数据，原因是因为 vue 的生命周期；若想要在 methods 这里要到数据，
> 则应该使用 nextTick 函数，视图更新后才执行回调

```html
<div id="app">{{text}}</div>
<script>
  new Vue({
  	el: "#app",
  	data: {
  		text: "原来的信息"
  	},
  	methods: {
  		this.text = "更新后的信息"
  		this.$nextTick(()=>{
  			console.log("app.innerText")
  		})
  	}
  })
</script>
```

### 数据计算

- computed 存放着 data 中需要稍加处理的数据，组件中与 data 中的数据一样直接调用
  - 不会因为视图更新而执行 get 函数
  - 只能 get，不能 set；想要设置 computed 中的数据需要自动添加 set 函数
- methods 存放方法，当然组件也可以调用函数对数据处理并返回；但这是没有必要的，因为在每次视图重新渲染时函数就会被再次调用，而数据并不需要没有都重新计算

### 按键修饰符

```html
<!-- 按enter键触发 -->
<input @keyup.enter="fn" ></input>
<!-- 按alt键和enter键触发 -->
<input @keyup.alt.enter="fn" ></input>
```

### 变异方法

> 能被侦听到的数组发生变化的方法。调用这些方法改变数组时，视图会更新

- push()
- pop()
- shift()
- unshift()
- splice()
- sort()
- reverse()

## 跨域

### 前端设置

> 欺骗后台，实现跨域

```js
// 设置proxyTable属性即可对http://xxx.xxx跨域
proxyTable: {
	'/api': {
		target: 'http://xxx.xxx.',  //目标接口域名
		changeOrigin: true,  //是否跨域
		pathRewrite: {
			'^/api': '/api'   //重写接口
	}
},
```

### 后台设置

```js
app.use("/xxx", (req, res) => {
  // 设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  // 允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  // 跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
});
```

### jsonp 跨域

```html
// 通过script跨域
<script src="http://xxx.xxx/xxx"></script>
<script>
  function fn() {
    // arguments中有后台数据，当然也可以用参数接收
    console.log(arguments);
  }
</script>
// 可以设置回调函数，获取到后台传回来的数据
<script src="http://xxx.xxx/xxx?callback=fn"></script>
```

```js
// 后台 node.js
app.use('/xxx',(req,res)=>{
	// 获取前台传过来的回调函数
	let {callback} = req.query
	// 将obj对象转为json字符串传给前台
	const obj = JSON.stringfy({msg;"后台传给前台的数据"})
	// 通过调用前台的回调函数，将数据传给前台
	res.send(`${callback}(${obj})`)
})
```

- node.js

```js
// 必须写上这行代码，后台才可以获取到数据
app.use(bodyParser.json());
```

### 浏览器跨域

- 在浏览器--快捷方式--目标中设置
  - --disable-web-security
  - --user-data-dir
- 降低浏览器安全等级，不是很好的方式

---

# Vue-Router

## router

### 路由的定义

```js
// 路由和组件的映射表
let routes = [
  { path: "/home", componeent: home },
  { path: "/user", componeent: user },
];
// 实例化路由对象
let router = new VueRouter({
  routes,
});
let vm = new Vue({
  el: "",
  // 注入vue实例
  router,
});
```

### 访问路由的过程

1. 先设置 routes 路由和组件的映射表
2. 实例化路由对象 router 并注入映射表
3. 将 router 注入 vue 实例
4. 在 vue 实例的根节点 el 中添加路由出口 router-view

### router-link

实现路由跳转

```html
<router-link to="/home">home</router-link>
```

#### tag

实现标签的转变

```html
// 浏览器中以p标签渲染 <router-link tag="p" to="/home">home</router-link>
```

#### 动态绑定 :to

- path 指定路由

```html
<router-link :to="{path:'/home'}" to="/home">home</router-link>
```

- name 指定路由
  - 当 path 路由很长时，使用 name 可以减少标签中的代码

```html
<router-link :to="{name:'a22link'}" to="/home">home</router-link>
<script>
  let routes = [
    { path: "/home/article/2019/09/22", name: "a22link", componeent: home },
  ];
</script>
```

- query 查询字符串
  - 发送 query 值时，路由路径使用 path 指定/name 指定都可以
  - 但 params 不行，必须 name 指定

```html
<!-- 在vue实例中的可以通过this.$route获取到query的数据 -->
<!-- 在根节点注入了router实例后，其所有子组件都可以通过this.$route访问到数据 -->
<router-link :to="{path:'/home',query:{a:1}}" to="/home">home</router-link>
```

### 动态路由

- 有很多个路径都可以匹配到这个路径

```html
<router-link :to="{path:'/home/1'}" to="/home">home</router-link>
<script>
  // 通过 /home/1 /home/2 ... 都可以访问到 /home/:id 并渲染home组件
  let routes = [{ path: "/home/:id", componeent: home }];
</script>
```

#### params

- 动态路由参数
- 使用 params 使路由路径必须使用 name 指定

```html
<router-link :to="{name:'homelink',params:{id:1}}" to="/home">home</router-link>
```
