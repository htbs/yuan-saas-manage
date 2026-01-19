import { useDictItemList } from "@/src/features/dict/components/item/DictItemList/useDictItemList";
import { baseColumns, searchFields } from "./DictItemList.types";

import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";
import { DictItemFilterListParams, DictItemInfo } from "../../../types";
import { YsDraggableDialog } from "@/src/components/YsDraggableDialog/YsDraggableDialog";
import { DictItemDetailDialog } from "@src/features/dict/components/item/DictItemDetail";

interface DictItemListDialogProps {
  dictCode: string; // 字典编码
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export function DictItemListDialog(props: DictItemListDialogProps) {
  const {
    finalAllColumns,
    fetchList,
    registerRefetch,
    addAction,
    dialogProps,
  } = useDictItemList(baseColumns);
  return (
    <>
      <YsDraggableDialog
        visible={props.isOpen}
        onClose={props.onClose}
        title={"字典项列表"}
        initialWidth={1100}
        initialHeight={600}
      >
        <GenericFilterableList<DictItemInfo, DictItemFilterListParams>
          columns={finalAllColumns}
          searchFields={searchFields}
          fetcher={fetchList}
          showIndexColumn={true}
          onRefetch={registerRefetch}
          renderSearchActions={addAction}
        />
      </YsDraggableDialog>
      <DictItemDetailDialog {...dialogProps} dictCode={props.dictCode} />
    </>
  );
}
