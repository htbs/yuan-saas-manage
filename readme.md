# 元识商家管理端

## 项目结构

```
src/
├── app/              # Next.js App Router 核心
│   ├── layout.tsx        # 根布局
│   ├── page.tsx          # 首页
│   ├── global.css        # 全局样式
│   └── (routes)/         # 路由分组
│       ├── dashboard/
│       │   ├── layout.tsx
│       │   └── page.tsx
│       └── ...
│
├── components/       # UI 组件库
│   ├── layout/         # 布局相关组件 (Header, Footer, Sidebar)
│   └── ui/             # 通用、可复用的基础 UI 组件 (Button, Input, Modal)
│       └── Button/
│           ├── Button.tsx
│           ├── Button.module.css
│           └── Button.types.ts  # 【组件类型】与组件并列的类型声明
│
├── features/         # ✨ 功能模块 (业务逻辑的核心)
│   └── decorate/             # 路由组件（decorate）的功能模块
│       ├── api/              # 该功能相关的 API 请求
│       │   └── useGetUser.ts # 该功能模块的api请求
│       │   └── types.ts      # api请求的类型
│       ├── components/       # 该功能独有的组件
│       │   └── A组件
│       │       └── A.tsx     # A组件
│       │       └── useA.ts   # A组件的hooks
│       │       └── types.ts  # 该组件hooks的类型
│       │   └── B组件
│       │       └── B.tsx     # B组件
│       │       └── useB.ts   # B组件的hooks
│       │       └── types.ts  # 该组件hooks的类型
│       ├── hooks/          # 该功能相关的 Hooks
│       │   └── useDecorate.ts
│       │   └── types.ts    # 该功能hooks的类型
│       └── types/          # 该功能相关的类型
│           └── index.ts     
│
├── hooks/            # 🏠 全局通用的自定义 Hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── index.ts          # 统一导出
│
├── lib/              # 第三方库配置或工具函数 (如: axios, date-fns)
│   └── utils.ts
│
├── services/         # API 服务层 (封装 fetch 或 axios 实例)
│   ├── api.ts
│   └── types.ts        # API 相关的通用请求/响应类型
│
├── store/            # 全局状态管理 (Zustand, Redux, etc.)
│   ├── userStore.ts
│   └── types.ts        # Store 相关的类型
│── styles/                   # 👈 全局样式目录
│    ├── _variables.css        # CSS 变量 (颜色, 字体大小, 间距等)
│    ├── _mixins.css           # 如果使用 PostCSS 或 Sass
│    └── _utilities.css
└── types/            # 🌐 全局 TypeScript 类型声明
    ├── global.d.ts     # 全局环境类型 (如: window 对象扩展)
    ├── common.types.ts # 项目范围内的通用共享类型
    └── index.ts        # 统一导出
```

---

## **React 前端团队代码规范**

### **前言**

本规范旨在通过建立一套清晰、统一的编码标准，提升我们团队的代码质量、可读性和长期可维护性。它不是为了限制创造力，而是为了构建一个“自解释”的代码库——任何人都可以快速理解任何代码，从而极大地提高协作效率和项目稳定性。让我们共同遵循并完善这份规范，打造卓越的工程文化。

---

### **1. 命名规范 (The Language of Code)**

清晰的命名是代码可读性的基石。所有命名必须使用有意义的完整英文单词，严禁使用拼音、无意义缩写。本章节中的示例以表格形式呈现，更为直观。

#### **1.1 变量 & State (Variables)**

| 类别           | 规则                                    | 错误示例                                                | 正确示例                                                     | 理由                                              |
| :------------- | :-------------------------------------- | :------------------------------------------------------ | :----------------------------------------------------------- | :------------------------------------------------ |
| **数组/列表**  | 必须以 `List` 结尾。                    | `const [users, setUsers] = useState([]);`               | `const [userList, setUserList] = useState<User[]>([]);`      | 一目了然，知道这是一个列表数据。                  |
| **Tree 数据**  | 树形结构数据源以 `TreeList` 结尾。      | `const [tree, setTree] = useState([]);`                 | `const [deptTreeList, setDeptTreeList] = useState<Node[]>([]);` | 精准描述数据结构，避免与普通列表混淆。            |
| **选项数据**   | Select/Radio/Checkbox 数据以 `Options` 结尾。 | `const status = [{label:'启用',value:1}];`              | `const statusOptions = useMemo(() => [...], []);`            | 清晰表明这是用于表单选项的数据。                  |
| **加载状态**   | 必须以 `Loading` 结尾。                 | `const [loading, setLoading] = useState(false);`        | `const [tableLoading, setTableLoading] = useState(false);`   | 精准定位是哪个部分的加载状态。                    |
| **可见性状态** | 必须以 `Visible` 或 `Open` 结尾。       | `const [show, setShow] = useState(false);`              | `const [editModalVisible, setEditModalVisible] = useState(false);` | 明确是控制 UI 元素的显示/隐藏。                   |
| **当前项**     | 必须以 `current` 或 `cur` 为前缀。      | `const [item, setItem] = useState(null);`               | `const [currentUser, setCurrentUser] = useState<User \| null>(null);` | 明确表示这是当前上下文中正在操作的单个对象。      |
| **选中项**     | 必须以 `selected` 为前缀。              | `const [checks, setChecks] = useState([]);`             | `const [selectedIds, setSelectedIds] = useState<number[]>([]);` | 明确表示这是用户通过交互（勾选/点击）选择的结果。 |
| **Ref 引用**   | 必须以 `Ref` 结尾。                     | `const container = useRef(null);`                       | `const mapContainerRef = useRef<HTMLDivElement>(null);`      | 明确表明这是一个 Ref 对象，而非普通变量。         |

#### **1.2 函数与组件 (Functions & Components)**

| 类别         | 规则                                                         | 错误示例                                                     | 正确示例                                                     | 理由                                     |
| :----------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :--------------------------------------- |
| **组件命名** | 必须使用大驼峰 (PascalCase)。                                | `function userItem() {}`                                     | `function UserItem() {}`                                     | React 组件的标准命名约定。               |
| **事件处理** | 内部实现的方法以 `handle` 开头；作为 Props 传递的回调以 `on` 开头。 | `<Button onClick={submit} />`                                | `<Button onClick={handleSubmit} />` <br/> `<UserForm onSuccess={onFormSuccess} />` | 区分是“处理事件的函数”还是“监听事件的属性”。 |
| **Hook 命名** | 必须以 `use` 开头 (驼峰命名)。                               | `function getWindowSize() {}`                                | `function useWindowSize() {}`                                | React Hooks 官方约定，用于 Linter 检查。 |
| **声明风格** | 组件和 Hooks 优先使用 `function` 关键字声明，普通工具函数可用箭头函数。 | `const UserList = () => {}`                                  | `export function UserList() {}`                              | 声明式函数提升了可读性，且在调试堆栈中名称更清晰。 |

#### **1.3 TypeScript 类型**

| 类别          | 规则                      | 错误示例                   | 正确示例                                                  | 理由                      |
| :------------ | :------------------------ | :------------------------- | :-------------------------------------------------------- | :------------------------ |
| **通用**      | 大驼峰 (PascalCase)。     | `type user = {}`           | `interface User {}` `type UserType = {}`                  | 行业标准，易于识别。      |
| **Props**     | 组件 Props 以 `Props` 结尾。 | `interface UserParams {}`  | `interface UserCardProps { user: User; }`                 | 明确这是组件的属性定义。  |
| **枚举**      | 必须以 `Enum` 结尾。      | `enum Status { Active=1 }` | `enum UserStatusEnum { ACTIVE = 1 }`                      | 明确这是一个枚举类型。    |
| **HTTP 请求** | 必须以 `ReqParams` 结尾。 | `interface GetUsers {}`    | `interface GetUserListReqParams { page: number; }`        | 清晰定义 API 的输入参数。 |
| **HTTP 响应** | 必须以 `ResInfo` 结尾。   | `type UserData = {}`       | `interface UserListResInfo { id: number; name: string; }` | 清晰定义 API 的输出数据。 |

---

### **2. React Hooks & 组件最佳实践**

#### **2.1 状态管理与 Custom Hooks**

**规则 2.1.1：业务逻辑必须抽离到 Custom Hooks 中，组件只做 UI 渲染和逻辑编排。**

* **理由：** 保持组件（View 层）的纯粹性，解决 React 组件“面条代码”问题，使逻辑可复用、可测试。

* **错误示例 (在组件中堆砌逻辑):**

  ```tsx
  export function UserManagement() {
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
       // ...获取用户逻辑
       fetch('/api/users').then(...)
    }, []);
  
    return <div>...</div>;
  }
  ```

* **正确示例 (通过 Hook 管理状态):**

  ```typescript
  // hooks/useUserManager.ts
  export function useUserManager() {
    const [userList, setUserList] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    
    const fetchUsers = useCallback(async () => { /* ... */ }, []);
    
    return { userList, loading, fetchUsers };
  }
  ```

  ```tsx
  // UserManagement.tsx
  export function UserManagement() {
    const { userList, fetchUsers } = useUserManager();
    
    useEffect(() => {
      fetchUsers();
    }, [fetchUsers]); // 依赖清晰
    
    return <UserList data={userList} />;
  }
  ```

**规则 2.1.2：Hook 返回的“写操作”函数，应封装具体意图，而非直接暴露 `setState`。**

* **理由：** 避免 UI 层直接操纵底层状态，保证状态变更的可预测性。

* **错误示例:**

  ```typescript
  // 暴露了底层的 setUserList，UI层可以随意覆盖数据
  return { userList, setUserList };
  ```

* **正确示例:**

  ```typescript
  // 封装了业务动作
  const addUser = (user: User) => setUserList(prev => [user, ...prev]);
  return { userList, addUser };
  ```

#### **2.2 React 核心 API 使用**

**规则 2.2.1：非 UI 渲染相关的可变对象（如定时器 ID、Cesium Viewer、Map 实例），必须使用 `useRef`。**

* **理由：** 此类对象的变更不需要触发组件重渲染 (`re-render`)。将其放入 `useState` 会导致性能问题和无限循环渲染风险。

* **错误示例:**

  ```tsx
  // 错误！Cesium Viewer 很大，且不应作为响应式状态
  const [viewer, setViewer] = useState<Viewer | null>(null);
  ```

* **正确示例:**

  ```tsx
  // 正确！viewer 只是一个引用，变更不触发 UI 更新
  const viewerRef = useRef<Viewer | null>(null);
  ```

**规则 2.2.2：严格管理 `useEffect` 的依赖数组。**

* **理由：** 遗漏依赖是 React Hooks 中最常见的 Bug 来源（闭包陷阱）。必须配置 `eslint-plugin-react-hooks` 规则为 error。

* **规则：** 如果你发现自己试图欺骗 linter（通过 `// eslint-disable-next-line`），通常意味着你的逻辑结构有问题，或者应该使用 `useRef` 来保持最新的值。

#### **2.3 组件设计**

**规则 2.3.1：独立的业务弹窗必须是组件，通过 Props 控制显隐。**

* **理由：** 保持父组件 JSX 整洁。

* **错误示例:**

  ```tsx
  // 父组件
  return (
    <>
      <Button onClick={() => setOpen(true)}>打开</Button>
      {isOpen && (
        <Dialog>
           {/* 大量的弹窗内容堆砌在这里 */}
        </Dialog>
      )}
    </>
  )
  ```

* **正确示例:**

  ```tsx
  // 父组件
  return (
    <>
      <Button onClick={() => setEditModalVisible(true)}>打开</Button>
      <UserEditModal 
        visible={editModalVisible} 
        onClose={() => setEditModalVisible(false)} 
      />
    </>
  )
  ```

**规则 2.3.2：受控组件（Controlled Components）必须遵循 `value` (或 `xxx`) + `onChange` (或 `onXxx`) 的规范。**

* **理由：** 符合 React 单向数据流的标准实践。

* **正确示例:**

  ```tsx
  <CustomInput value={text} onChange={handleTextChange} />
  ```

**规则 2.3.3：复杂表单状态应聚合管理，避免碎片化 `useState`。**

* **理由：** 减少重渲染次数，简化重置逻辑。

* **错误示例:**

  ```tsx
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState('');
  ```

* **正确示例:**

  ```tsx
  const [formData, setFormData] = useState({ name: '', age: 0, email: '' });
  // 或者使用 useReducer (当逻辑更复杂时)
  ```

#### **2.4 Context 与副作用边界**

**规则 2.4.1：Context Provider 必须在组件树 (JSX) 中显式定义，Hook 仅用于消费 (Consumer)。**

* **理由：** 依赖注入关系必须在组件树中可视化。

* **错误示例 (在 Hook 内部尝试 Provider - 这在 React 中通常行不通，但作为概念错误指出):**
    *   *注：React Hook 无法渲染 JSX，此规则强调不要试图在逻辑层混淆 Provider 和 Consumer 的职责。*

**规则 2.4.2：副作用 (`useEffect`) 应尽量靠近数据源。**

* **规则：** 如果一个 Hook 负责获取数据，那么 `useEffect` 应该在该 Hook 内部。组件只负责调用 Hook 并展示数据。
*   **例外：** 对于需要用户交互触发的逻辑（如“点击开始轮询”），Hook 应暴露 `start/stop` 函数，由组件在事件处理中调用，而不是在 Hook 内部自动 `useEffect` 挂载即运行（除非是专门的 `useAutoPolling`）。

---

### **3. TypeScript 使用规范**

**规则 3.1：严禁使用 `any` 类型。**

*   **理由：** `any` 传染性极强，会破坏整个项目的类型安全。遇到复杂类型应使用泛型或 `unknown` 配合类型断言。

**规则 3.2：类型定义文件分离。**

* **规则：** 组件/Hook 的 Props 和内部类型定义如果超过 10 行，应抽离到同级目录的 `types.ts` 或 `interface.ts` 中。

* **正确示例:**

  ```typescript
  // components/UserCard/types.ts
  export interface UserCardProps { ... }
  
  // components/UserCard/index.tsx
  import type { UserCardProps } from './types';
  export const UserCard: React.FC<UserCardProps> = (props) => { ... }
  ```

---

### **4. 领域特定模式 (Cesium/WebGL)**

**规则 4.1：三维场景效果封装为 `class`，但在 React 中通过 `useRef` 持有。**

* **理由：** Cesium/Three.js 是命令式的，Class 适合管理其复杂状态；React 是声明式的，通过 `Ref` 桥接两者。

* **正确示例:**

  ```typescript
  // logic/HighlightEffect.ts
  export class HighlightEffect {
    constructor(private viewer: Cesium.Viewer) {}
    render() { /*...*/ }
    destroy() { /*...*/ }
  }
  ```

  ```tsx
  // components/MapComponent.tsx
  export function MapComponent() {
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const effectRef = useRef<HighlightEffect | null>(null);
  
    useEffect(() => {
      if (!viewerRef.current) return;
      
      // 初始化效果
      effectRef.current = new HighlightEffect(viewerRef.current);
      effectRef.current.render();
  
      // 清理函数
      return () => {
        effectRef.current?.destroy();
      };
    }, []);
    
    return <div ref={mapContainerRef} />;
  }
  ```

---

### **5. 代码质量与风格**

**规则 5.1：杜绝魔法值 (Magic Numbers/Strings)。**

* **理由：** 维护噩梦。必须使用枚举 (Enum) 或常量 (Const) 替代。

* **正确示例:**

  ```typescript
  if (order.status === OrderStatusEnum.COMPLETED) { /* ... */ }
  ```

**规则 5.2：表单重置与不可变数据。**

* **理由：** React 依赖引用变化检测更新。
* **规则：** 修改对象/数组状态时，必须创建新副本（使用 Spread Operator `...` 或 `immer`）。重置表单时，建议使用 `lodash-es/cloneDeep` 确保切断引用。

**规则 5.3：优先使用 `lodash-es` 等工具库处理复杂数据操作。**

* **理由：** 减少手写工具函数的 Bug，提升代码健壮性。

**规则 5.4：必须使用全等操作符 (`===`, `!==`)。**

* **理由：** 避免 JavaScript 隐式类型转换带来的诡异 Bug。

**规则 5.5：Hook 与组件必须写 JSDoc 注释。**

* **理由：** 配合 TS 提供强大的智能提示。

* **正确示例:**

  ```typescript
  /**
   * 用户管理 Hook
   * @returns {Object} 包含用户列表和操作方法
   */
  export function useUserManager() { ... }
  ```