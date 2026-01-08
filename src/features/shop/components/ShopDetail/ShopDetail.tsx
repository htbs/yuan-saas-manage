// 详情、修改、新增

import { useShopStore } from "../../stores/useShopStore";

interface ShopDetailProps {
  id?: string;
}

export function ShopDetail(props: ShopDetailProps) {
  // 详情ID
  const shopId = useShopStore((state) => state.editId);
  // 设置详情视图
  const setView = useShopStore((state) => state.setView);
  // 详情视图
  const view = useShopStore((state) => state.view);

  return <div>这里是店铺详情{shopId}</div>;
}
