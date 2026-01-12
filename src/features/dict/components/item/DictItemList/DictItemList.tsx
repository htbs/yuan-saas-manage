import { useDictItemList } from "@/src/features/dict/components/item/DictItemList/useDictItemList";
import { useDictItemStore } from "../../../stores/useDictItemStore";
import {
  baseColumns,
  searchFields,
} from "../../../components/item/DictItemList/DictItemList.types";

import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";
import { DictItemFilterListParams, DictItemInfo } from "../../../types";

export function DictItemList() {
  const { finalAllColumns, fetchList, handleSetRefetch } =
    useDictItemList(baseColumns);
  const { pagination, setPagination, setQueryParams, resetAll, setView } =
    useDictItemStore();
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
      <GenericFilterableList<DictItemInfo, DictItemFilterListParams>
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
