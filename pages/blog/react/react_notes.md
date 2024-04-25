---
title: React学习笔记
date: 2022-04-26 16:02:59
tags:
  - react
---

# react

---

## 声明周期

## setState

- 异步

- 每次取到的值都是老的值

```js
this.setState({
  count: this.state.count + 1,
});
this.setState({
  count: this.state.count + 1,
});
```

- 每次获取到的都是最新值

```js
this.setState((state) => {
  return { count: state.count + 1 };
});
this.setState((state) => {
  return { count: state.count + 1 };
});
```

- 改变的属性和改变前没有关系则使用对象，有关系则使用函数形式更好

> 官方说明：

1. updater 函数中接收的 state 和 props 都保证为最新。updater 的返回值会与 state 进行浅合并。

2. setState()的第二个参数为可选的回调函数，它将在 setState 完成合并并重新渲染组件后执行。通常，我们建议使用 componentDidUpdate() 来代替此方式。

- 在原生的事件函数/Promise/setTimeOut 中，setState 是同步的，并且不会合并处理

## key

- 没有 key 值时将会原地复用
- <span style="color: red">vue 有没有这个问题？</span>

## 组件通信

### 父子通信

- props

```jsx
class Parent extends React.Component{
    xxx = ()=>{
        console.log("父组件函数")
    }
    <div>
        // 父传子
        <Son xxx={this.xxx} />
    </div>
}

class Son extends React.Component{
    state = { msg: '子组件数据' }

    sendmsg = ()=>{
        // 子穿父
        this.props.xxx(this.state.msg)
    }
    <div>
        <button onClick={this.sendmsg}>点击</button>
    </div>
}
```

### 兄弟组件通信

- PubSub

```jsx
class Parent extends React.Component{
    xxx = ()=>{
        console.log("父组件函数")
    }
    <div>
        <Son1 xxx={this.xxx} />
        <Son2 xxx={this.xxx} />
    </div>
}

class Son1 extends React.Component{
    state = { msg: 'son1组件数据' }
    sendmsg = (){
        PubSub.publish('xxx', this.state.msg) // 触发xxx事件
    }
    <div>
        <button onClick={this.sendmsg}>点击</button>
    </div>
}

class Son2 extends React.Component{
    componentDidMount(){
        PubSub.subscribe('xxx', (msg)=>{ // 订阅xxx事件
            console.log(msg)
        })
    }
    <div>
        <button onClick={this.sendmsg}>点击</button>
    </div>
}
```

### 观察者模式

```js
class EventBus {
  constructor() {
    this.bus = document.createElement("fakeelement");
  }

  addEventListener(event, callback) {
    this.bus.addEventListener(event, callback);
  }

  removeEventListener(event, callback) {
    this.bus.removeEventListener(event, callback);
  }

  dispatchEvent(event, detail = {}) {
    this.bus.dispatchEvent(new CustomEvent(event, { detail }));
  }
}

export default new EventBus();
```

- 使用

```js
import EventBus from './EventBus'
class ComponentA extends React.Component {
  componentDidMount() {
      EventBus.addEventListener('myEvent', this.handleEvent)
  }
  componentWillUnmount() {
      EventBus.removeEventListener('myEvent', this.handleEvent)
  }

  handleEvent = (e) => {
      console.log(e.detail.log)  //i'm zach
  }
}
class ComponentB extends React.Component {
  sendEvent = () => {
      EventBus.dispatchEvent('myEvent', {log: "i'm zach"}))
  }

  render() {
      return <button onClick={this.sendEvent}>Send</button>
  }
}
```

### EventBus

```js
function EventBus() {
  const subscriptions = {};
  this.subscribe = (eventType, callback) => {
    const id = Symbol("id");
    if (!subscriptions[eventType]) subscriptions[eventType] = {};
    subscriptions[eventType][id] = callback;
    return {
      unsubscribe: function unsubscribe() {
        delete subscriptions[eventType][id];
        if (
          Object.getOwnPropertySymbols(subscriptions[eventType]).length === 0
        ) {
          delete subscriptions[eventType];
        }
      },
    };
  };

  this.publish = (eventType, arg) => {
    if (!subscriptions[eventType]) return;

    Object.getOwnPropertySymbols(subscriptions[eventType]).forEach((key) =>
      subscriptions[eventType][key](arg)
    );
  };
}
export default EventBus;
```

## CSSTransition

- timeout 动画执行时间，毫秒数
- className 修改类名
- appear 第一次是否触发
- in
- onEnter 入场时触发回调
- onEntering 入场中触发回调
- onEntered 入场结束时触发回调
- onExit 退场时触发回调
- onExiting 退场中触发回调
- onExited 退场结束时触发回调

### css 类名

- .enter 动画刚入场时
- .enter-active 动画入场中
- .enter-done 动画入场结束时
- .exit 动画刚退场时
- .exit-active 动画退场中
- .exit-done 动画退场结束时

### TransitionGroup

```jsx
<TransitionGroup>
  <CSSTransition></CSSTransition>
  <CSSTransition></CSSTransition>
</TransitionGroup>
```

## 脚手架

## 路由

- 路由组件中的 props 下存在的属性
  - history 存放跳转路径的方法
  - location 存放数据
  - match 解析路径得到的数据

### NavLink 和 Route

- 默认是模糊匹配
- 加上 exact 精准匹配

```jsx
<NavLink to='/home'>首页</NavLink>
// /home会匹配/和/home
<Route path="/home" component={Home}></Route>
<Route path="/" component={Root}></Route>
```

- Switch 中的 Route 都是精准匹配
- '/home'将无法匹配到'/'

```jsx
<NavLink to='/home'>首页</NavLink>
<Switch>
  <Route path="/home" component={Home}></Route>
  <Route path="/" component={Root}></Route>
</Switch>
```

#### Route 的三种渲染方式

- 方式
  - children 不管 location 是否匹配都会渲染
  - component
  - render
- 优先级 children>component>render
- 特性
  - 互斥的，只会渲染其中一个

### Redirect

- 路径的重定向
- 当前路径匹配不到时走 Redirect 设置的路径

```jsx
<NavLink to='/home'>首页</NavLink>
<Switch>
  <Route path="/home" component={Home}></Route>
  <Route path="/" component={Root}></Route>
  <Redirect to="/home"></Redirect>
</Switch>
```

### history

- this.props.history.push
- this.props.history.replace
- goForward 前进到回到刚才回退前的路径
- goBack 返回历史记录中的上一个路径
- go(num) 前进 num 次回退历史记录的路径

#### push

push 跳转路径是在原来的历史记录中叠加，回退时能回到 push 前的路径

#### replace

replace 跳转路径是替换当前的路径，上一次的路径直接被覆盖，无法回退到 replac 前的路径

## Redux

- store.js
  - createStore 创建仓库
  - applyMiddleware 使用中间件
  - thunk 异步处理事件

```js
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer";
export default createStore(reducer, applyMiddleware(thunk));
```

- reducer.js

```js
export default function (state = 0, action){
  switch(action.type) {
    case 'ADD': return state + action.data
    default return state
  }
}
```

- action.js
  - dispatch 发起动作
  - 同步动作返回对象
  - 异步动作返回函数
    - dispatch 为 thunk 中间件默认传入
    - 在返回的函数中做异步请求

```js
export function addAtion (value) => { type: 'ADD', data: velue }
export function addAsyncAtion (value) {
  return dispatch => {
    setTimeout(()=>{
      dispatch(addAtion(value))
    }, 2000)
  }
}
```

## react-redux

- reducer.js 返回多个 reducer

```js
import { combineReducers } from "redux";
function number(state = 0, action) {
  return state;
}
function sum(state = 0, action) {
  return state;
}
export default combineReducers({
  number,
  sum,
});
```

- 组件中接收

```js
export default connect(
  (state) => ({
    number,
    sum,
  }),
  {
    addFn,
    deleteFn,
  }
)(App);
```

## 高阶组件

- 接收一个组件，返回一个处理后的组件

```jsx
function HighComponent(BaseComponent) {
  return class extends Component {
    state = { value: "" };
    handleChange = (e) => {
      this.setState({ value: e.target.value });
    };
    render() {
      const props = {
        value: this.state.value,
        onChange: this.handleChange,
        ...this.props, // 将创建的组件的属性传递到Base组件中
      };
      return <BaseComponent {...props} />;
    }
  };
}
function Demo() {
  return <input type="text" {...this.props} />;
}
const Test = HighComponent(Demo);
<Test data={data} />;
```

- 函数组件写法
- 使用装饰器写法

```jsx
function HighComponent(BaseComponent) {
  return function (props) {
    return (
      <div>
        <p>高阶组件装饰</p>
        <BaseComponent {...props} />
      </div>
    );
  };
}
@HighComponent
class Demo extends Component {
  render() {
    return <div>{this.props.data}</div>;
  }
}
<Demo data={data} />;
```

### 反向继承

```jsx
class BaseComponent extends Component {
  state = {
    value: "基础组件的默认数据",
  };
  render() {
    return <div>{this.state.value}</div>;
  }
}

function ReverseInheritance() {
  return class extends BaseComponent {
    render() {
      // 返回父组件的render函数执行结果
      return super.render();
    }
  };
}

const Demo = ReverseInheritance();
```

## Hook 函数

- 使用条件
  - 只能在函数的最外层调用 hook，不能在循环、条件判断、自函数中调用
  - 只能在函数中调用

### useState

- useState 的顺序不能改变，否则会报错

```jsx
import { useState } from "react";
function User() {
  const [value, setValue] = useState("hook数据");
  const [value1, setValue1] = useState("hook数据1");
  function hanldeClick() {
    setValue("修改hook数据");
  }

  return (
    <div>
      <h1>User</h1>
      <p>{value}</p>
      <button onClick={hanldeClick}>修改value</button>
    </div>
  );
}
```

### useRef

- 创建标记对象

### useEffect(()=>{ return }, [])

- 合并了类组件的生命周期函数
- 当 render 渲染之后执行，dom 已经生成，此时执行时间时间类似 componentDidMount
- 数据变化时，先执行 useEffect 的回调函数，在执行 render 渲染，此时执行时间类似 componentDidUpdate
- 第一次进入组件的时候就会执行
- 做数据处理和操作 DOM 元素

- 返回函数，作用类似 componentDidUnmount
  - 返回的函数会先于 useEffect 的回调函数执行，清除定时器
  - 不过现在即使不写返回函数清除定时器，也不会出现颜色一直变的问题，可能是 react 的 useEffect 内部做了处理？

```jsx
import { useState, useEffect } from "react";
function About() {
  const [background, setColor] = useState("red");
  useEffect(() => {
    const timer = setTimeout(() => {
      const color = "#" + Math.random().toString(16).slice(2, 8);
      setColor(color);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  });
  return <div style={{ width: 100, height: 100, background }}></div>;
}
```

- 第二个参数 数组
  - 限制 useEffect 执行的时机
  - 当传递的数据变化时，执行 useEffect，若没有，则不执行
  - 传空数组，useEffect 的回调只会执行一次，因为没有关联改变的数据去触发它，此时相当于 componentDidMount 钩子

```jsx
import { useState, useEffect } from "react";
function About() {
  const [background, setColor] = useState("red");
  useEffect(() => {
    setTimeout(() => {
      const color = "#" + Math.random().toString(16).slice(2, 8);
      setColor(color);
    }, 1000);
  }, []);
  return <div style={{ width: 100, height: 100, background }}></div>;
}
```

### useReeducer(reducer, state)

- reducer 函数不会初始化

```jsx
import { useReducer } from "react";
const state = 0;
function reducer(state, action) {
  switch (action.type) {
    case "add":
      return state + action.data;
    case "minus":
      return state - action.data;
  }
}
export default function SetTimeout() {
  const [count, dispatch] = useReducer(reducer, state);
  function add() {
    dispatch({ type: "add", data: 1 });
  }
  function minus() {
    dispatch({ type: "minus", data: 1 });
  }
  return (
    <div>
      <p>{count}</p>
      <button onClick={add}>add</button>
      <button onClick={minus}>minus</button>
    </div>
  );
}
```

### useMemo(()=>{ return }, [])

- 类似 vue 的计算属性 computed
- 当依赖项发生改变时才会重新执行函数
- 避免每次 render 时产生不必要的开销

```js
import { useMemo, useState } from "react";

export function UseFunComponent() {
  let [len, setLen] = useState(5);
  let [other, setOther] = useState(0);

  const memoData = useMemo(() => {
    console.log("memoData");
    let count = 0;
    for (let i = 1; i <= len; i++) {
      count++;
    }
    return count;
  }, [len]);

  function fnData() {
    console.log("fnData");
    let count = 0;
    for (let i = 1; i <= len; i++) {
      count++;
    }
    return count;
  }

  return (
    <div>
      <p>与len无关的数据：{other} </p>
      <p>
        与len有关的数据： {fnData()} - {memoData}
      </p>
      {/* 不使用useMemo，不管什么数据的改变都会导致fnData函数重新执行 */}
      <p>函数执行返回的数据: {fnData()}</p>
      {/* 无关数据变化不会重新执行memoData的计算函数； */}
      <p>使用useMemo返回的数据: {memoData}</p>
      <button
        onClick={() => {
          setOther(other++);
        }}
      >
        改变与len无关的数据
      </button>
      <button
        onClick={() => {
          setLen(len++);
        }}
      >
        改变与len有关的数据
      </button>
    </div>
  );
}
```

### useCallback

### 自定义 hook 函数

## Context

- createContext() 创建 Context 对象

```js
import { createContext } from "react";
export const Context = createContext();
export const Provider = Context.Provider;
export const Provider = Context.Provider;
```

- 使用

```js
import FnContext from "./components/fnContext";
import ClassContext from "./components/classContext";
import { Context, Provider } from "./hook";
export default function Home() {
  const data = "home组件的数据";
  return (
    <div>
      <p>Context应用：</p>
      <Provider value={data}>
        函数组件接收：
        <FnContext />
      </Provider>
      <hr />
      <Provider value={data}>
        类组件接收：
        <ClassContext />
      </Provider>
    </div>
  );
}
```

### useContext

- 必须使用函数组件接收

```jsx
import { useContext } from "react";
import { Context } from "../../hook/context";
export default function UseContext() {
  const data = useContext(Context);
  return <div>useContext接收数据----{data}</div>;
}
```

### contextType

- 必须使用类组件接收

```js
import { Component } from "react";
import { Context } from "../../hook/context";
export default class UseContext extends Component {
  static contextType = Context;
  render() {
    return <div>contextType接收数据 ---- {this.context}</div>;
  }
}
```

### Consumer

```js
import { Consumer } from "../../hook/context";
export default function ContextConsumer() {
  return (
    <div>
      <Consumer>{(data) => <span>Consumer接收数据 ----{data}</span>}</Consumer>
    </div>
  );
}
```

## 性能优化

## PureComponent

> 数据不发生变化时不重新渲染组件

- 只能用于 class 组件
- 浅比较，对象下的属性无法比较

继承 PureComponent 之后，点击 button 只会执行一次；若继承 Component 每次 setState 都会执行 render 重新渲染，需要在 shouldComponentUpdate 钩子中处理

```jsx
import { PureComponent } from "react";
export default class OptimizationComponent extends PureComponent {
  state = { count: 0 };
  add = () => {
    this.setState(
      {
        count: 100,
      },
      () => {
        console.log("count:", this.state.count);
      }
    );
  };
  render() {
    console.log("render");
    const { count } = this.state;
    return (
      <div>
        <button onClick={this.add}>count: {count}</button>
      </div>
    );
  }
}
```

继承 Component 使用 shouldComponentUpdate 优化；当新的值与老的值不相等时才执行 render 函数重新渲染组件

```jsx
import { PureComponent } from "react";
export default class OptimizationComponent extends PureComponent {
  state = { count: 0 };
  add = () => {
    this.setState(
      {
        count: 100,
      },
      () => {
        console.log("count:", this.state.count);
      }
    );
  };
  shouldComponentUpdate(nextProps, nextState) {
    // 新的props，新的state
    return nextState.count !== this.state.count;
  }
  render() {
    console.log("render");
    const { count } = this.state;
    return (
      <div>
        <button onClick={this.add}>count: {count}</button>
      </div>
    );
  }
}
```

## memo

### React.memo()

- PureComponent 是对 class 组件的性能优化，每次会对 props 进行浅比较，同时还可以在 shouldComponentUpdate 中进行深层次的控制
- React.memo 这个 HOC 是对 Function Component 提供的，areEqual 参数相当于 shouldComponentUpdate 的作用

1. 使用方式

- areEqual 判断两次 props 是否不同，不传 areEqual 则对 props 进行浅比较

```js
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```

2. 性能优化

- Parent Component

```js
// Parent Component
export default (props = {}) => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  return (
    <>
      <button onClick={()=>{setCount1(count1+1)})}>count1: {count} </button>
      <button onClick={()=>{setCount2(count2+1)}}>count2: {number} </button>
      <Son  count1={count1} count2={count2} /> <hr />
      <MemoSon count1={count1} count2={count2} />
    </>
  );
}
```

- Son Component

```js
export default (props = {}) => {
  console.log(`Son Component`);
  return <div>count1: {props.count1}</div>;
};
```

- MemoSon Component

```js
const isEqual = (prevProps, nextProps) => {
  if (prevProps.count2 !== nextProps.count2) {
    return false;
  }
  return true;
};

export default memo((props = {}) => {
  console.log(`--- memo re-render ---`);
  return <div>count2: {props.count2}</div>;
}, isEqual);
```

总结：count1、count2 的变化都会导致 Son 组件的重新渲染，而 MemoSon 只有在 count2 发生变化时才会重新渲染

### useMemo()

React.memo 始终包装整个组件，并且需要手动比较具体的 props，而某些时候我们只想要 template 进行 re-render，而不是整个组件 re-render，useMemo 可以实现局部 Pure 功能

1. 基本用法

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

返回一个 memoized 值，只有当依赖项[a,b]发生变化时，才会重新计算这个 memoized 值，否则不会重新渲染。

传入 useMemo 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 useEffect 的适用范畴，而不是 useMemo。

如果没有提供依赖项[a,b]，则每次都会重新计算 memoized 值

2. 性能优化

- UseMemoSon Component

```js
export default (props = {}) => {
  console.log(`--- component re-render ---`);
  return useMemo(() => {
    console.log(`--- useMemo re-render ---`);
    return (
      <div>
        <p>count2: {props.count2}</p>
      </div>
    );
  }, [props.count2]);
};
```

总结：useMemo 包装的是 return 部分的渲染逻辑，当 count1 发生变化是，会触发函数组件的重新渲染，打印 component re-render，但不会触发 return 返回函数的 re-render，只有在 count2 发生变化时才会打印 useMemo re-render

- 感谢 [ai 哟](https://zhuanlan.zhihu.com/p/105940433)

## 组件库

### antd

- 按需加载

## 问题

### useEffect

在 useEffect 中进行异步获取数据，并使用 useState 设置数据时会导致内存泄露

```
Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
```

- 原因：由于异步的 setState，如果此时此组件已经被销毁，但当异步结束时会去执行回调中 setState，改变数据的状态，因此造成了内存泄漏的风险。
- 解决方法：需要在组件销毁时去清楚组件内部一些还在等待执行的回调
  - useEffect 的返回参数是一个函数，此函数会在组件被销毁时执行，因此可以提前定义一个变量 unmounted，当组件销毁时改变 unmounted 的状态，异步回调内部根据 unmounted 的状态来确定是否要操作数据

```js
useEffect(() => {
  let unmounted = false;
  update(unmounted);
  return () => {
    unmounted = true;
  };
}, []);
```

### 在一个非路由组件中怎么使用 navigation 比较优雅

### 在一个组件中多次更改一个 useState 创建的值

```js
const [data, setData] = useState(0);

setData(1);
setData(2);
```

### 函数组件请求数据

问题：在函数组件中请求数据，API.UserListAll 被一直不停的调用

```js
export default function UserPower() {
  const [tableData, setTableData] = useState([]);
  window.API.UserListAll({
    offset: 0,
    count: 100,
  }).then((users) => {
    setTableData(users);
  });

  return <>{tableData}</>;
}
```

自我猜测：setTableData 改变了渲染用到的数据，因此再次触发 UserPower render，无限循环。
思考: 怎么在函数组件中只请求第一次，函数组件没有生命周期，难道只能用 class 组件来写吗

解决方法：

方案一：使用 useEffect

```js
useEffect(() => {
  setLoading(true);
  (async () => {
    const res = await window.API.UserListAll<API.RequestData, API.UserInfo[]>({
      offset: 0,
      count: 100,
    });
    setTableData(data);
    setLoading(false);
  })();
}, []);
```

### 自定义 hook 函数一直被执行问题

1. 场景

自定义 hook 中获取数据，到父组件中初始化数据，在子孙组件中使用

2. 问题

自定义 hook 函数会被循环执行

- 自定义 useContext

```ts
import { useState } from "react";
import { createContext } from "react";
import { API } from "/src/api";
export const Context = createContext(0);
export function useContext(): [number, (id: number) => Promise<void>] {
  const [state, setState] = useState<StateModel>(0);
  const setData = async (id: number) => {
    const res = await API({
      id,
    });
    setState(res);
  };
  return [state, setData];
}
```

- 父组件 Parent 中使用自定义 hook 创建初始数据

```tsx
import { Context } from "./hooks/useContext";
import { useEffect } from "react";
export function Parent() {
  // useContext会被循环执行，导致接口一直被请求
  const [state, setState] = useContext(0);
  useEffect(() => {
    setState(0);
  }, []);
  return (
    <Context.Provider value={state}>
      <Son1 />
      <Son2 />
    </Context.Provider>
  );
}
```

- 子组件 Son1 中使用 context

```tsx
import { Context } from "./hooks/useContext";
import { useEffect, useContext } from "react";
export function Son1() {
  const context = useContext(Context);
  useEffect(() => {
    setState(0);
  }, []);
  return <div>Son1 context: {context}</div>;
}
```

- 子组件 Son2 中使用 context

```tsx
import { Context } from "./hooks/useContext";
import { useEffect, useContext } from "react";
export function Son2() {
  const context = useContext(Context);
  useEffect(() => {
    setState(0);
  }, []);
  return <div>Son2 context: {context}</div>;
}
```
