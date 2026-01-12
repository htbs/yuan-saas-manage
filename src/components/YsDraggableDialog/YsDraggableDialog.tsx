import React, { useState, useRef, useEffect, ReactNode, CSSProperties } from 'react';
import ReactDOM from 'react-dom';

// --- 图标组件 (SVG) ---
const Icons = {
    Close: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
    Maximize: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>,
    Restore: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M15 9h-4v4"/></svg>, // 简化的缩小/还原图标
    Minimize: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>,
    Move: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M19 9l3 3-3 3M9 19l3 3 3-3M9 12h6M12 9v6"/></svg>,
    Rescue: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0z"/><path d="M12 8v8M8 12h8"/></svg>
};

// --- 类型定义 ---
type DialogMode = 'NORMAL' | 'MAXIMIZED' | 'MINIMIZED' | 'OFFSCREEN';

interface DraggableDialogProps {
    visible: boolean;
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    footer?: ReactNode; // Footer 插槽
    onClose: () => void;
    initialWidth?: number;
    initialHeight?: number;
    zIndex?: number;
}

interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const YsDraggableDialog: React.FC<DraggableDialogProps> = ({
                                                                    visible,
                                                                    title,
                                                                    icon,
                                                                    children,
                                                                    footer,
                                                                    onClose,
                                                                    initialWidth = 500,
                                                                    initialHeight = 300,
                                                                    zIndex = 1000,
                                                                }) => {
    // --- State ---
    // 当前显示模式
    const [mode, setMode] = useState<DialogMode>('NORMAL');

    // 窗口位置和大小
    const [bounds, setBounds] = useState<Bounds>({
        x: (window.innerWidth - initialWidth) / 2,
        y: (window.innerHeight - initialHeight) / 2,
        width: initialWidth,
        height: initialHeight,
    });

    // --- Refs (用于记录状态快照) ---
    const dragRef = useRef({ startX: 0, startY: 0, startBounds: { ...bounds } });
    // 记录最大化/最小化前的位置，用于还原
    const prevBoundsRef = useRef<Bounds | null>(null);
    // 记录初始打开时的位置，用于“飞出屏幕后点击恢复”
    const initialBoundsRef = useRef<Bounds>({ ...bounds });
    // 记录最小化前的模式 ('NORMAL' 或 'MAXIMIZED')
    const preMinimizeModeRef = useRef<DialogMode>('NORMAL');

    // 每次打开时重新初始化位置（可选，这里保留上次关闭的位置，如果需要重置可以在 useEffect[visible] 里处理）
    useEffect(() => {
        if (visible) {
            // 保证初始位置居中
            if (!initialBoundsRef.current) {
                const iBounds = {
                    x: (window.innerWidth - initialWidth) / 2,
                    y: (window.innerHeight - initialHeight) / 2,
                    width: initialWidth,
                    height: initialHeight
                };
                initialBoundsRef.current = iBounds;
                setBounds(iBounds);
            }
        }
    }, [visible, initialWidth, initialHeight]);


    // --- 逻辑处理 ---

    // 1. 拖拽逻辑
    const handleMouseDown = (e: React.MouseEvent) => {
        // 只有在 Normal 或 Minimized 模式下允许拖拽，全屏不可拖拽
        if (mode === 'MAXIMIZED') return;

        e.preventDefault(); // 防止选中文本

        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startBounds: { ...bounds },
        };

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - dragRef.current.startX;
            const deltaY = moveEvent.clientY - dragRef.current.startY;

            setBounds((prev) => ({
                ...prev,
                x: dragRef.current.startBounds.x + deltaX,
                y: dragRef.current.startBounds.y + deltaY,
            }));
        };

        const handleMouseUp = (upEvent: MouseEvent) => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            // --- 核心功能：检查是否拖拽出屏幕 ---
            // 简单的判断逻辑：如果 Header 只有很少一部分还在屏幕内，就算出界
            const { clientX, clientY } = upEvent;
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;

            // 比如：如果鼠标松开时已经在屏幕外很远，或者 Header 几乎看不见了
            // 这里使用简化的判定：如果窗口主体完全移出视口
            // 为了用户体验，我们判定：如果 Header 的中心点移出了屏幕
            // 实际上，只要判断 bounds.y < 0 或者 bounds.y > screenH ...

            // 我们使用当前 bounds 判定
            const currentX = dragRef.current.startBounds.x + (upEvent.clientX - dragRef.current.startX);
            const currentY = dragRef.current.startBounds.y + (upEvent.clientY - dragRef.current.startY);
            // 如果当前是最小化模式，宽度按 300 算，否则按实际宽度算
            const currentW = mode === 'MINIMIZED' ? 300 : dragRef.current.startBounds.width;
            const isOffScreen =
                currentY > screenH - 20 || // 底部出界
                currentX > screenW - 20 || // 右侧出界
                (currentX + currentW) < 20 || // 左侧出界
                currentY < -20; // 顶部出界

            if (isOffScreen) {
                setMode('OFFSCREEN');
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // 2. 缩放逻辑 (Resize)
    const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
        e.stopPropagation();
        e.preventDefault();
        if(mode === 'MAXIMIZED' || mode === 'MINIMIZED') return;

        const startX = e.clientX;
        const startY = e.clientY;
        const startBounds = { ...bounds };

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            const newBounds = { ...startBounds };

            if (direction.includes('e')) newBounds.width = Math.max(200, startBounds.width + deltaX);
            if (direction.includes('s')) newBounds.height = Math.max(150, startBounds.height + deltaY);
            if (direction.includes('w')) {
                const w = Math.max(200, startBounds.width - deltaX);
                newBounds.width = w;
                newBounds.x = startBounds.x + (startBounds.width - w);
            }
            if (direction.includes('n')) {
                const h = Math.max(150, startBounds.height - deltaY);
                newBounds.height = h;
                newBounds.y = startBounds.y + (startBounds.height - h);
            }

            setBounds(newBounds);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // 3. 最大化 / 还原
    const toggleMaximize = () => {
        if (mode === 'MAXIMIZED') {
            // 还原
            setMode('NORMAL');
            if (prevBoundsRef.current) setBounds(prevBoundsRef.current);
        } else {
            // 最大化
            // 记录当前状态
            prevBoundsRef.current = { ...bounds };
            setMode('MAXIMIZED');
            // 不需要手动设置 bounds 为 window宽高，通过 CSS 样式控制更流畅，
            // 但为了统一逻辑，这里也可以重置 bounds，但一般全屏推荐用 CSS fixed定位。
            // 为了题目要求的“全屏状态缩小效果一样”，我们只需保持 mode 状态即可，
            // 渲染时判断 mode === 'MAXIMIZED' 应用不同的 style。
        }
    };

    // 最小化
    const toggleMinimize = () => {
        if (mode === 'MINIMIZED') {
            // --- 还原逻辑 ---

            // 1. 恢复之前的尺寸 (x, y, width, height)
            if (prevBoundsRef.current) {
                setBounds(prevBoundsRef.current);
            }

            // 2. 恢复之前的模式 (如果是从全屏最小化的，就回到全屏)
            setMode(preMinimizeModeRef.current);

        } else {
            // --- 最小化逻辑 ---

            // 1. 记录当前模式 (Normal 或 Maximized)
            preMinimizeModeRef.current = mode;

            // 2. 记录当前尺寸
            prevBoundsRef.current = { ...bounds };

            // 3. 改变状态
            setMode('MINIMIZED');

            // 4. 【关键修改】设置 bounds: 宽度固定 300，高度固定 40
            setBounds(prev => ({
                ...prev,
                width: 300,
                height: 40
            }));
        }
    };

    // 5. 屏幕外恢复 (Rescue)
    const handleRescue = () => {
        setMode('NORMAL');
        // 恢复到第一次打开的状态
        setBounds({ ...initialBoundsRef.current });
    };

    if (!visible) return null;

    // --- 渲染逻辑 ---

    // 如果是 Offscreen 模式，渲染救援按钮
    if (mode === 'OFFSCREEN') {
        return ReactDOM.createPortal(
            <div
                onClick={handleRescue}
                title="点击恢复弹窗"
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    width: 50,
                    height: 50,
                    backgroundColor: '#2196f3',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    zIndex: zIndex + 1,
                    animation: 'bounceIn 0.3s ease'
                }}
            >
                <Icons.Rescue />
            </div>,
            document.body
        );
    }

    // 样式计算
    const isMaximized = mode === 'MAXIMIZED';
    const isMinimized = mode === 'MINIMIZED';

    const dialogStyle: CSSProperties = {
        position: 'fixed',
        zIndex: zIndex,
        // 如果最大化，强制 0,0,100%,100%
        left: isMaximized ? 0 : bounds.x,
        top: isMaximized ? 0 : bounds.y,
        width: isMaximized ? '100vw' : bounds.width,
        height: isMaximized ? '100vh' : bounds.height,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        boxShadow: '0 0 15px rgba(0,0,0,0.2)',
        borderRadius: isMaximized ? 0 : '4px',
        overflow: 'hidden', // 隐藏溢出，尤其在 resize 时
        transition: 'width 0.2s ease, height 0.2s ease, top 0.1s, left 0.1s'
    };

    return ReactDOM.createPortal(
        <>
            <div className="draggable-dialog-wrapper" style={dialogStyle}>
                {/* --- Header --- */}
                <div
                    className="dialog-header"
                    onMouseDown={handleMouseDown}
                    onDoubleClick={toggleMaximize} // 双击 Header 也可最大化/还原，符合习惯
                    style={{
                        height: '40px',
                        backgroundColor: '#f5f5f5',
                        borderBottom: '1px solid #ddd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 10px',
                        cursor: isMaximized ? 'default' : 'move', // 十字图标逻辑在 CSS 类中增强
                        userSelect: 'none',
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {/* 左侧：Icon + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
                        {icon || <span>⚙️</span>}
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>{title}</span>
                    </div>

                    {/* 右侧：Controls */}
                    <div
                        className="dialog-controls"
                        style={{ display: 'flex', gap: '8px' }}
                        onMouseDown={(e) => e.stopPropagation()} // 防止点击按钮触发拖拽
                    >
                        {/* 最小化按钮 */}
                        {!isMaximized && (
                            <button onClick={toggleMinimize} className="icon-btn" title={isMinimized ? "展开" : "最小化"}>
                                {isMinimized ? <Icons.Restore /> : <Icons.Minimize />}
                            </button>
                        )}

                        {/* 最大化/还原按钮 (最小化时不显示) */}
                        {!isMinimized && (
                            <button onClick={toggleMaximize} className="icon-btn" title={isMaximized ? "还原" : "最大化"}>
                                {isMaximized ? <Icons.Restore /> : <Icons.Maximize />}
                            </button>
                        )}

                        {/* 关闭按钮 */}
                        <button onClick={onClose} className="icon-btn close-btn" title="关闭">
                            <Icons.Close />
                        </button>
                    </div>
                </div>

                {/* --- Body --- */}
                {/* 最小化时隐藏 Body 和 Footer */}
                <div
                    className="dialog-body"
                    style={{
                        flex: 1,
                        padding: '16px',
                        overflow: 'auto',
                        display: isMinimized ? 'none' : 'block'
                    }}
                >
                    {children}
                </div>

                {/* --- Footer Slot --- */}
                {footer && (
                    <div
                        className="dialog-footer"
                        style={{
                            padding: '10px 16px',
                            borderTop: '1px solid #eee',
                            backgroundColor: '#fff',
                            display: isMinimized ? 'none' : 'block'
                        }}
                    >
                        {footer}
                    </div>
                )}

                {/* --- Resize Handles (8个方向) --- */}
                {!isMaximized && !isMinimized && (
                    <>
                        <div className="resize-handle n"  onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
                        <div className="resize-handle s"  onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
                        <div className="resize-handle w"  onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
                        <div className="resize-handle e"  onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
                        <div className="resize-handle nw" onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
                        <div className="resize-handle ne" onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
                        <div className="resize-handle sw" onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
                        <div className="resize-handle se" onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />
                    </>
                )}
            </div>

            {/* 注入 CSS 样式 */}
            <style>{`
        .icon-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #555;
        }
        .icon-btn:hover { background-color: #e0e0e0; }
        .close-btn:hover { background-color: #ff4d4f; color: white; }
        
        /* 十字光标逻辑 */
        .dialog-header:hover {
            /* 这里使用 move 标准光标，如果必须是十字，可以用 cursor: crosshair */
            cursor: move; 
        }

        /* Resize Handles Positioning */
        .resize-handle { position: absolute; z-index: 10; }
        .resize-handle.n { top: 0; left: 0; right: 0; height: 5px; cursor: n-resize; }
        .resize-handle.s { bottom: 0; left: 0; right: 0; height: 5px; cursor: s-resize; }
        .resize-handle.w { left: 0; top: 0; bottom: 0; width: 5px; cursor: w-resize; }
        .resize-handle.e { right: 0; top: 0; bottom: 0; width: 5px; cursor: e-resize; }
        .resize-handle.nw { top: 0; left: 0; width: 10px; height: 10px; cursor: nw-resize; }
        .resize-handle.ne { top: 0; right: 0; width: 10px; height: 10px; cursor: ne-resize; }
        .resize-handle.sw { bottom: 0; left: 0; width: 10px; height: 10px; cursor: sw-resize; }
        .resize-handle.se { bottom: 0; right: 0; width: 10px; height: 10px; cursor: se-resize; }

        @keyframes bounceIn {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
      `}</style>
        </>,
        document.body
    );
};