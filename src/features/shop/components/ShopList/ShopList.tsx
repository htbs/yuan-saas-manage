import {
  baseColumns,
  useShopStore,
  ShopListInfo,
  ShopFilterListParams,
  useShopList,
  searchFields,
} from "@/src/features/shop";

import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";

export function ShopList() {
  const { finalAllColumns, fetchList, handleSetRefetch } =
    useShopList(baseColumns);
  const { pagination, setPagination, setQueryParams, resetAll, setView } =
    useShopStore();
  const renderSearchActions = () => {
    return (
      <Space>
        <Button icon={<PlusOutlined />} onClick={() => setView("add")}>
          新增
        </Button>
      </Space>
    );
  };
  return (
    <div>
      <GenericFilterableList<ShopListInfo, ShopFilterListParams>
        columns={finalAllColumns}
        searchFields={searchFields}
        fetcher={fetchList}
        showIndexColumn={true}
        onRefetch={handleSetRefetch}
        renderSearchActions={renderSearchActions}
        controlledPagination={pagination} // 分页同步
        onPaginationChange={setPagination} // 分页操作回调
        onSearchUpdate={setQueryParams} // 搜索操作回调
        onReset={resetAll} // 重置操作回调
      />
    </div>
  );
}
