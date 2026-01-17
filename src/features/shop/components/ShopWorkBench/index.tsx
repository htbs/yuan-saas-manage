/**
 * 工作台
 */

import { YsDraggableDialog } from "@/src/components/YsDraggableDialog/YsDraggableDialog";

// 组件属性
interface ShopWorkBenchProps {
  shopId: string; // 商家ID
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export function ShopWorkBench(props: ShopWorkBenchProps) {
  return (
    <>
      <YsDraggableDialog
        visible={props.isOpen}
        onClose={props.onClose}
        title="商家工作台"
      >
        <div>工作台内容</div>
      </YsDraggableDialog>
    </>
  );
}
