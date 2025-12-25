import { useRoleList } from "./useRoleList";
import { useRoleStore } from "../../stores/useRoleStore";
import { baseColumns, searchFields } from "./RoleList.types";
import { RoleInfo, RoleFilterListParams } from "../../types";
import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";

export function RoleList() {
  const { finalColumns, fetchList, handleSetRefetch } =
    useRoleList(baseColumns);
  const { pagination, setPagination, setQueryParams, resetAll, setView } =
    useRoleStore();
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
    <div className="w-full! h-full!">
      <GenericFilterableList<RoleInfo, RoleFilterListParams>
        columns={finalColumns}
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
