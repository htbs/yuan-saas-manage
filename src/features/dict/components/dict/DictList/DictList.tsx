import {
  baseColumns,
  DictFilterListParams,
  useDictStore,
  useDictList,
  searchFields,
} from "@/src/features/dict";

import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";
import { DictInfo } from "../../../types";

export function DictList() {
  const { finalAllColumns, fetchList, handleSetRefetch } =
    useDictList(baseColumns);
  const { pagination, setPagination, setQueryParams, resetAll, setView } =
    useDictStore();
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
      <GenericFilterableList<DictInfo, DictFilterListParams>
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
