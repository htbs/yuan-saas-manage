// src/components/layout/Header.tsx
import React from 'react';

export function Header() {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 24px', borderBottom: '1px solid #eee'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>YourLogo</div>
      </div>
      <nav style={{ display: 'flex', gap: 12 }}>
        <a href="https://www.baidu.com" target="_blank" rel="noreferrer">产品官网</a>
        <a href="https://www.bing.com" target="_blank" rel="noreferrer">公司官网</a>
      </nav>
    </header>
  );
}
