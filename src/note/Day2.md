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
> （注：文档部分内容可能由 AI 生成）