# DraggableDialog 可拖拽弹窗组件

这是一个基于 React + TypeScript 封装的原生可拖拽、可缩放弹窗组件。不依赖任何第三方拖拽库（如 `react-draggable`），完全通过原生 DOM 事件实现，性能更好且体积轻量。

## ✨ 特性 (Features)

*   **拖拽移动**：鼠标按住 Header 区域即可拖拽移动（光标变为十字/移动图标）。
*   **八向缩放**：支持通过弹窗的 8 个边框/角落调整大小。
*   **窗口控制**：
    *   **最小化**：收起弹窗，高度变为 Header 高度，宽度自动收缩为 `300px`。
    *   **最大化**：全屏铺满，再次点击还原。
    *   **还原记忆**：从最小化或最大化状态还原时，自动恢复之前的尺寸、位置和模式。
*   **屏幕外恢复 (Rescue)**：如果将弹窗拖拽出屏幕可视区域（Header 移出屏幕），弹窗会自动隐藏并在屏幕右下角显示“恢复按钮”，点击即可复位。
*   **Portal 渲染**：使用 `ReactDOM.createPortal` 渲染至 `document.body`，避免被父级 `overflow: hidden` 截断。

## 🛠 参数说明 (Props)

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| **visible** | `boolean` | ✅ | - | 控制弹窗的显示/隐藏 |
| **onClose** | `() => void` | ✅ | - | 点击关闭按钮的回调 |
| **title** | `string` | ✅ | - | 弹窗标题 |
| **children** | `ReactNode` | ✅ | - | 弹窗主体内容 |
| **icon** | `ReactNode` | ❌ | - | 标题左侧的图标（支持 SVG、Emoji 或组件） |
| **footer** | `ReactNode` | ❌ | - | 底部操作栏插槽 |
| **initialWidth** | `number` | ❌ | `500` | 弹窗初始宽度 |
| **initialHeight** | `number` | ❌ | `300` | 弹窗初始高度 |
| **zIndex** | `number` | ❌ | `1000` | 弹窗层级 |

## 📦 安装与引入

该组件为单文件封装，无需 npm 安装。

1. 将组件代码复制到你的项目中，例如 `src/components/DraggableDialog.tsx`。
2. 在需要的页面引入即可。

## 💻 使用示例 (Usage)

```tsx
import React, { useState } from 'react';
import { DraggableDialog } from '@src/components/YsDraggableDialog/YsDraggableDialog'; // 根据你的路径修改

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  // 模拟关闭事件
  const handleClose = () => {
    setIsOpen(false);
  };

  // 模拟提交事件
  const handleSubmit = () => {
    alert('提交成功！');
    setIsOpen(false);
  };

  return (
    <div style={{ padding: '50px' }}>
      <h1>React Draggable Dialog Demo</h1>
      
      <button 
        onClick={() => setIsOpen(true)}
        style={{ padding: '8px 16px', cursor: 'pointer', fontSize: '16px' }}
      >
        打开弹窗
      </button>

      <DraggableDialog
        visible={isOpen}
        title="系统设置"
        onClose={handleClose}
        initialWidth={600}
        initialHeight={400}
        icon={<span>⚙️</span>} // 自定义图标
        footer={
          // 自定义 Footer 内容
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={handleClose}>取消</button>
            <button 
              onClick={handleSubmit} 
              style={{ background: '#1890ff', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px' }}
            >
              确定
            </button>
          </div>
        }
      >
        {/* 这里是弹窗 Body 内容 */}
        <div style={{ lineHeight: '1.6', color: '#333' }}>
          <p>这是一个演示弹窗，具备以下高级功能：</p>
          <ul>
            <li>尝试拖拽顶部的 Header。</li>
            <li>尝试拖拽四周的边框改变大小。</li>
            <li>点击右上角的「最小化」：宽度会变为 300px。</li>
            <li>点击「最大化」：全屏显示。</li>
            <li><strong>特殊测试：</strong>将弹窗用力拖出屏幕外，直到看不见，右下角会出现恢复按钮。</li>
          </ul>
          {/* 模拟长内容滚动 */}
          {Array.from({ length: 5 }).map((_, i) => (
             <p key={i}>内容占位符... {i + 1}</p>
          ))}
        </div>
      </DraggableDialog>
    </div>
  );
};

export default App;
```

## ⚠️ 注意事项

1.  **样式隔离**：组件内部使用了 CSS-in-JS (Style tag) 的方式注入样式，类名使用了较为通用的命名（如 `.resize-handle`），建议确保全局 CSS 没有冲突，或者使用 CSS Modules / Styled Components 对内部样式进行隔离改造。
2.  **Portal**：组件挂载在 `document.body` 上，如果你的应用在 iframe 中运行，请注意上下文环境。