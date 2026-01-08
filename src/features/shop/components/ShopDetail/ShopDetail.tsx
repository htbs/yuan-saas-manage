// 详情、修改、新增
import DetailHeader from '@src/components/layout/Detailheader/index'
import { useShopStore } from "../../stores/useShopStore";
import { useState } from 'react';

interface ShopDetailProps {
  id?: string;
}

export function ShopDetail(props: ShopDetailProps) {
    const [loading, setLoading] = useState(false);
    // 假设当前是从路由获取的参数，这里模拟为 'add'
    const currentMode = 'add';

    const handleBack = () => {
        setView('list');
    };

    const handleSave = () => {
        setLoading(true);
        // 模拟异步请求
        setTimeout(() => {
            setLoading(false);
            console.log('保存成功');
            setView('list');
        }, 2000);
    };
  // 详情ID
  const shopId = useShopStore((state) => state.editId);
  // 设置详情视图
  const setView = useShopStore((state) => state.setView);
  // 详情视图
  const view = useShopStore((state) => state.view);

  return <div className="p-6 bg-gray-50">
      {/* 头部组件 */}
       <DetailHeader
          mode={view}
          onBack={handleBack}
          onSave={handleSave}
          loading={loading}
      />



  </div>
}
