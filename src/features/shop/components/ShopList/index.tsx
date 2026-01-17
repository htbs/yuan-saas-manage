import {
  baseColumns,
  ShopListInfo,
  ShopFilterListParams,
  useShopList,
  searchFields,
} from "@/src/features/shop";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";
import { ShopEditDialog } from "../ShopDetail/index";
import { ShopWorkBench } from "../ShopWorkBench/index";

export function ShopList() {
  const {
    finalAllColumns,
    fetchList,
    dialogProps,
    addAction,
    workBenchDialogProps,
    registerRefetch,
  } = useShopList(baseColumns);
  return (
    <div>
      <GenericFilterableList<ShopListInfo, ShopFilterListParams>
        columns={finalAllColumns}
        searchFields={searchFields}
        fetcher={fetchList}
        showIndexColumn={true}
        onRefetch={registerRefetch}
        renderSearchActions={addAction}
      />
      <ShopWorkBench {...workBenchDialogProps} />
      <ShopEditDialog {...dialogProps} />
    </div>
  );
}
