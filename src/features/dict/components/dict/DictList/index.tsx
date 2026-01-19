import {
  baseColumns,
  DictFilterListParams,
  useDictList,
  searchFields,
} from "@/src/features/dict";

import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";
import { DictInfo } from "../../../types";
import { DictEditDialog } from "../DictDetail";
import { DictItemListDialog } from "../../item/DictItemList";

export function DictList() {
  const {
    finalAllColumns,
    fetchList,
    handleSetRefetch,
    addAction,
    baseDialogProps,
    itemDialogProps,
  } = useDictList(baseColumns);
  return (
    <div>
      <GenericFilterableList<DictInfo, DictFilterListParams>
        columns={finalAllColumns}
        searchFields={searchFields}
        fetcher={fetchList}
        showIndexColumn={true}
        onRefetch={handleSetRefetch}
        renderSearchActions={addAction}
      />
      <DictEditDialog {...baseDialogProps} />
      <DictItemListDialog {...itemDialogProps} />
    </div>
  );
}
