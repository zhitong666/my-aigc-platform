# Day2 核心问题解析（TS+React）

本文档整理Day2学习中遇到的3个核心问题，包含详细解析、代码示例及底层原理，适配React+TS实战场景，助力理解资深前端必备知识点。

## 一、联合类型（|）和交叉类型（&）的详细解释

### 1. 联合类型（A | B）

#### 核心定义

联合类型表示“满足其中一个类型即可”，本质是「多选一」的关系，变量的类型可以是A，也可以是B，还可以是A和B的子类型。

注意：联合类型的变量，只能访问所有类型共有的属性和方法，否则会报错（TS类型检查机制）。

#### 代码示例

```typescript
// 定义两个基础类型
type A = { name: string; age: number }
type B = { name: string; gender: string }

// 联合类型：A | B，满足A或B即可
type UnionType = A | B

// 合法场景：满足A类型
const obj1: UnionType = { name: '张三', age: 18 } ✅
// 合法场景：满足B类型
const obj2: UnionType = { name: '李四', gender: 'male' } ✅
// 合法场景：同时满足A和B（属于联合类型的子集）
const obj3: UnionType = { name: '王五', age: 20, gender: 'female' } ✅

// 报错：缺少所有类型共有的name属性
const obj4: UnionType = { age: 18, gender: 'male' } ❌
```

#### 使用场景

- 状态管理：如请求状态 `loading | success | error`

- 角色区分：如用户角色 `user | admin | guest`

- 参数类型：如函数参数可接受多种类型 `string | number`

### 2. 交叉类型（A & B）

#### 核心定义

交叉类型表示“必须同时满足所有类型”，本质是「合并」的关系，变量的类型需要包含A和B的所有属性和方法，是所有类型的“并集”（非数学意义上的交集）。

#### 代码示例

```typescript
// 定义两个基础类型
type A = { name: string; age: number }
type B = { name: string; gender: string }

// 交叉类型：A & B，必须同时满足A和B的所有属性
type IntersectionType = A & B

// 合法场景：包含A和B的所有属性
const obj: IntersectionType = {
  name: '张三',
  age: 18,
  gender: 'male'
} ✅

// 报错：缺少A的age属性
const obj2: IntersectionType = { name: '李四', gender: 'female' } ❌
// 报错：缺少B的gender属性
const obj3: IntersectionType = { name: '王五', age: 20 } ❌
```

#### 使用场景

- 类型合并：如合并多个对象类型，生成更完整的业务类型

- 扩展属性：如给基础类型添加额外属性，`BaseType & { extra: string }`

- 组件Props组合：如合并多个Props类型，适配复杂组件

#### 核心总结

- 联合类型（|）：或关系，满足一个即可，访问范围取“交集”

- 交叉类型（&）：且关系，必须全部满足，类型结构取“并集”

## 二、interface 和 type 的关系与区别（全方位解析）

### 1. 共同点

- 都可以描述对象、函数的结构，用于TS类型约束

- 都支持扩展（interface用extends，type用交叉类型&）

- 都能配合泛型使用，实现类型复用

### 2. 核心区别（资深前端必考）

|对比维度|interface（接口）|type（类型别名）|
|---|---|---|
|定义范围|只能描述对象、函数、类的结构，无法定义基础类型（如string、number）|范围更广，可定义任意类型（基础类型、联合、交叉、映射类型等）|
|重复定义|可以重复定义，会自动合并所有属性（支持增量扩展）|不可以重复定义，重复定义会直接报错（类型不可重复声明）|
|扩展方式|使用extends关键字扩展，支持多继承（interface A extends B, C）|使用交叉类型&扩展，type A = B & C|
|类实现|可以被class实现（class Person implements User）|无法被class实现（type定义的类型不能作为接口被实现）|
|高级特性|不支持映射类型、条件类型、infer推导|支持映射类型、条件类型、infer推导（核心优势）|
|声明合并|支持（重复声明自动合并）|不支持（重复声明报错）|
### 3. 代码示例（对比）

#### 示例1：重复定义

```typescript
// interface 重复定义，自动合并 ✅
interface User { name: string }
interface User { age: number }
// 最终User类型：{ name: string; age: number }

// type 重复定义，报错 ❌
type User = { name: string }
type User = { age: number }
// 报错：Duplicate identifier 'User'
```

#### 示例2：扩展方式

```typescript
// interface 扩展（extends）
interface B { age: number }
interface A extends B { name: string }
const obj: A = { name: '张三', age: 18 } ✅

// type 扩展（交叉类型&）
type B = { age: number }
type A = B & { name: string }
const obj: A = { name: '张三', age: 18 } ✅
```

#### 示例3：type 高级特性（interface 做不到）

```typescript
// 映射类型：将类型所有属性转为只读
type Readonly<T> = { readonly [P in keyof T]: T[P] }
type User = { name: string; age: number }
type ReadonlyUser = Readonly<User>
// ReadonlyUser: { readonly name: string; readonly age: number }

// 条件类型 + infer：提取函数返回值类型
type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any
type Fn = () => string
type FnReturn = ReturnType<Fn> // FnReturn: string
```

### 4. 最佳实践（工作中怎么用）

- 描述对象、组件Props、API返回数据 → 用 **interface**（支持合并，适配业务迭代）

- 定义基础类型、联合/交叉类型、工具类型（映射、条件） → 用 **type**（范围广，支持高级特性）

- 组件Props推荐用interface，工具函数/泛型工具推荐用type

## 三、React 源码层面：setState 两种写法的区别

### 问题核心

setMessages(prev => [...prev, newMsg]) 是否可以写成 setMessages([...messages, newMsg])？为什么？

### 结论

语法上可以运行，但在异步、闭包、批量更新场景下会出现BUG，**推荐使用函数式更新（prev => ...）**。

### React 源码层面解析（核心原理）

React 内部维护了一个 `updateQueue`（状态更新队列），所有setState的更新都会被加入这个队列，等待批量处理（React的批量更新机制）。

#### 1. 写法一：函数式更新（推荐）

```typescript
setMessages(prev => [...prev, newMsg])
```

核心逻辑：

- 传入的是一个**回调函数**，React会从 `updateQueue` 中取出「最新的状态值」，作为回调函数的参数（prev）。

- 无论更新是同步还是异步，回调函数都能拿到「当前最新的状态」，避免闭包旧值问题。

- 多次连续调用时，会依次基于上一次的最新状态更新，不会覆盖。

#### 2. 写法二：直接传新值（不推荐）

```typescript
setMessages([...messages, newMsg])
```

核心逻辑：

- 传入的是一个「新状态值」，这个值依赖于当前渲染闭包中的 `messages`（旧状态快照）。

- React的setState是「异步批量更新」，闭包中的 `messages` 不会立即更新，多次连续调用时，会重复使用同一个旧值。

- 会导致状态丢失、更新不生效等BUG。

### 经典BUG复现（可亲自测试）

```typescript
// 写法二：直接传新值（有BUG）
const addThreeMessages = () => {
  setMessages([...messages, { id: '1', content: '消息1' }])
  setMessages([...messages, { id: '2', content: '消息2' }])
  setMessages([...messages, { id: '3', content: '消息3' }])
}
// 点击一次，只会添加1条消息（三次都用了同一个闭包旧值）

// 写法一：函数式更新（无BUG）
const addThreeMessages = () => {
  setMessages(prev => [...prev, { id: '1', content: '消息1' }])
  setMessages(prev => [...prev, { id: '2', content: '消息2' }])
  setMessages(prev => [...prev, { id: '3', content: '消息3' }])
}
// 点击一次，添加3条消息（每次都拿到最新状态）
```

### 源码级核心原因

1. React的状态更新是「异步批量处理」，setState调用后，不会立即更新state，而是加入更新队列，等待合适时机批量执行。

2. 直接传新值时，依赖的是「当前渲染周期的闭包值」，这个值在批量更新完成前不会变化，导致多次更新复用旧值。

3. 函数式更新时，React会将回调函数加入更新队列，执行时从队列中获取最新状态，确保每次更新都基于最新值。

### 最终最佳实践

**只要新状态依赖旧状态，必须使用函数式更新！**

- 适用场景：添加、删除、修改数组/对象（依赖旧状态的操作）

- 优势：避免闭包旧值BUG、适配并发模式、批量更新安全、符合React官方规范

## 总结

本文档3个问题均为React+TS核心知识点，是资深前端必备的基础储备：

1. 联合类型（|）是“或”，交叉类型（&）是“且”，对应不同业务场景；

2. interface侧重对象/组件结构描述，type侧重灵活的类型组合与工具类型；

3. React setState函数式更新，是避免闭包和批量更新BUG的关键。


# React setState 源码级解析（第2、3点详细拆解）

核心前提：以下解析基于 React 18 源码（简化核心逻辑，保留与本次问题相关的关键代码，跳过并发模式、优先级调度等复杂分支，聚焦“闭包值”和“函数式更新”的核心差异）。

先明确两个核心概念（源码中高频出现）：

- **updateQueue**：React 内部维护的状态更新队列，所有 setState 触发的更新都会被封装成 Update 对象，加入该队列，等待批量执行。

- **current Fiber**：当前组件的 Fiber 节点，存储着组件的当前状态（state）、更新队列等核心信息，是 React 渲染的最小单元。

## 一、详细解释第2点：直接传新值（setMessages([...messages, newMsg])）的问题

### 核心结论再强调

直接传新值时，依赖的是「当前渲染周期的闭包值」，这个值在批量更新完成前不会变化，导致多次更新复用旧值——本质是“闭包快照”与“React 异步批量更新”的冲突。

### 1. 先理解：什么是“当前渲染周期的闭包值”

当组件渲染时，React 会执行组件函数（函数组件），此时组件内的变量（包括 state、props）会被“快照”下来，存入当前渲染周期的闭包中。只要本次渲染未结束，这个闭包中的值就不会改变。

举个和你 Day2 相关的例子（对应你的代码）：

```typescript
// 组件渲染时，messages 被快照到闭包中（假设此时 messages 是空数组 []）
function App() {
  const [messages, setMessages] = useState<Message[]>([])

  const addThreeMessages = () => {
    // 这里的 messages，始终是“本次渲染闭包中的快照值 []”
    setMessages([...messages, newMsg1]) // 依赖闭包中的 []
    setMessages([...messages, newMsg2]) // 还是依赖闭包中的 []
    setMessages([...messages, newMsg3]) // 依然依赖闭包中的 []
  }
}
```

### 2. 源码层面：为什么闭包值不会立即更新？（关键源码拆解）

我们来看 React 中 setState 的核心源码（简化版，来自 ReactFiberHooks.js），重点看直接传值的处理逻辑：

```javascript
// React 中 useState 的 set 函数核心逻辑（简化）
function dispatchSetState(fiber, queue, action) {
  // 1. 创建一个 Update 对象，封装本次更新的“新值”（这里的 action 就是你传的 [...messages, newMsg]）
  const update = {
    action, // 直接传入的新值，依赖闭包中的 messages
    next: null
  }

  // 2. 将 Update 对象加入当前组件 Fiber 的 updateQueue 队列
  enqueueUpdate(fiber, queue, update)

  // 3. 调度更新（异步批量执行，不会立即更新 state）
  scheduleUpdateOnFiber(fiber)
}
```

关键分析：

- 当你调用 setMessages([...messages, newMsg]) 时，`action` 就是 [...messages, newMsg]，而这个 `messages` 是“当前渲染闭包中的旧值”——因为此时 state 还未被更新（scheduleUpdateOnFiber 是异步调度，不会立即执行）。

- 多次调用 setMessages 时，每次传入的 `action` 都依赖同一个闭包旧值，所以最终 updateQueue 中会加入 3 个相同的 Update 对象（都是基于 [] 生成的），执行时只会生效最后一个，导致“只加一条消息”的 BUG。

### 3. 补充：批量更新为什么会加剧这个问题？

React 有“批量更新”机制（源码中由 batchedUpdates 函数控制），简单说：在同一个事件循环中，多次 setState 不会立即执行，而是被合并成一次更新，批量执行。

对应源码核心逻辑（简化）：

```javascript
// 批量更新核心函数（简化）
function batchedUpdates(fn) {
  // 开启批量更新标记
  isBatchingUpdates = true
  try {
    // 执行你的函数（addThreeMessages 中的三次 setMessages）
    fn()
  } finally {
    // 关闭批量更新标记，执行所有队列中的更新
    isBatchingUpdates = false
    flushSyncUpdates() // 批量执行 updateQueue 中的更新
  }
}
```

也就是说，你的三次 setMessages 都在“批量更新标记”开启期间执行，它们的 Update 对象被依次加入队列，但每次的 action 都依赖同一个闭包旧值，最终批量执行时，只会基于最后一个 Update 对象更新，导致状态丢失。

## 二、详细解释第3点：函数式更新（setMessages(prev => [...prev, newMsg])）的优势

### 核心结论再强调

函数式更新时，React 会将回调函数加入更新队列，执行时从队列中获取最新状态，确保每次更新都基于最新值——本质是“延迟获取状态”，避开闭包快照的问题。

### 1. 源码层面：函数式更新的处理逻辑（关键源码拆解）

同样看 ReactFiberHooks.js 中 dispatchSetState 的源码，重点看 action 是“函数”时的处理：

```javascript
// React 中 setState 的核心逻辑（补充函数式更新分支）
function dispatchSetState(fiber, queue, action) {
  const update = {
    action, // 此时 action 是你传入的回调函数 (prev => [...prev, newMsg])
    next: null
  }

  enqueueUpdate(fiber, queue, update)
  scheduleUpdateOnFiber(fiber)
}

// 批量执行更新时，处理每个 Update 对象的核心函数（简化）
function processUpdateQueue(queue, currentState) {
  let newState = currentState
  let update = queue.firstUpdate

  // 遍历 updateQueue 中的所有 Update 对象
  while (update) {
    const action = update.action
    // 关键：如果 action 是函数，就调用它，传入“当前最新的 newState”
    if (typeof action === 'function') {
      newState = action(newState) // 这里的 newState 是上一次更新后的最新值
    } else {
      // 如果是直接传值，就用 action 作为新值（对应第2点的问题）
      newState = action
    }
    update = update.next
  }

  // 返回最终更新后的状态，赋值给组件 state
  return newState
}
```

### 2. 逐步拆解函数式更新的执行流程（结合你的代码）

还是以 addThreeMessages 为例，三次调用函数式更新：

```typescript
const addThreeMessages = () => {
  setMessages(prev => [...prev, newMsg1])
  setMessages(prev => [...prev, newMsg2])
  setMessages(prev => [...prev, newMsg3])
}
```

执行流程（对应源码）：

1. 三次调用 setMessages，每次传入的 action 都是“回调函数”，React 会创建 3 个 Update 对象，依次加入 updateQueue（队列顺序：newMsg1 → newMsg2 → newMsg3）。

2. 批量更新触发，执行 processUpdateQueue 函数，开始遍历 updateQueue：
        

   - 第一次遍历：update.action 是 (prev => [...prev, newMsg1])，此时 currentState 是空数组 []，调用函数，newState 变成 [newMsg1]。

   - 第二次遍历：update.action 是 (prev => [...prev, newMsg2])，此时 newState 是 [newMsg1]（上一次更新后的最新值），调用函数，newState 变成 [newMsg1, newMsg2]。

   - 第三次遍历：update.action 是 (prev => [...prev, newMsg3])，此时 newState 是 [newMsg1, newMsg2]，调用函数，newState 变成 [newMsg1, newMsg2, newMsg3]。

3. 最终 newState 被赋值给组件的 messages，三次更新都生效，没有状态丢失。

### 3. 核心差异：“直接传值” vs “函数式更新”（源码层面对比）

| 更新方式           | action 的类型                      | state 取值时机                       | 是否依赖闭包         |
| ------------------ | ---------------------------------- | ------------------------------------ | -------------------- |
| 直接传值（不推荐） | 具体值（如 [...messages, newMsg]） | 调用 setState 时，取“当前闭包快照值” | 依赖，易导致旧值复用 |
| 函数式更新（推荐） | 回调函数（prev => ...）            | 批量执行更新时，取“队列中最新状态”   | 不依赖，避开闭包问题 |

## 三、补充：为什么 React 要这么设计？（源码设计初衷）

从源码设计来看，函数式更新的存在，就是为了解决“闭包导致的状态更新异常”：

1. React 的状态更新是异步的（为了批量优化性能，减少渲染次数），这就导致“调用 setState 时的 state”和“实际更新后的 state”不同步。

2. 闭包的特性是“捕获当前作用域的变量快照”，和 React 异步更新结合，就会出现“旧值复用”的 BUG。

3. 函数式更新通过“延迟执行回调函数”，让 state 的取值时机推迟到“批量更新执行时”，此时能拿到最新的状态，完美解决闭包问题。

## 四、总结（贴合你的实战场景）

结合你 Day2 中写的 messages 状态更新，记住一个核心原则（对应源码逻辑）：

只要新状态依赖旧状态（比如数组添加、删除、修改，对象属性更新），就必须用函数式更新——因为它能从 React 的 updateQueue 中获取最新状态，避开闭包和异步批量更新的坑；如果新状态不依赖旧状态（比如直接赋值 setMessages([])），可以用直接传值的方式。

这也是 React 官方推荐的最佳实践，更是资深前端面试中“React 状态更新”的高频考点（源码层面的理解，能拉开你和普通前端的差距）。
