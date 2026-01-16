import { useRoleList } from "./useRoleList";
import { baseColumns, searchFields } from "./RoleList.types";
import { RoleInfo, RoleFilterListParams } from "../../types";
import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";
import { RoleEditDialog } from "../RoleDetail/RoleDetail";
import { RoleAuthMenu } from "../RoleAuth/RoleAuthMeun";

export function RoleList() {
  const {
    finalColumns,
    fetchList,
    handleSetRefetch,
    openAdd,
    dialogProps,
    authMenuDialogProps,
  } = useRoleList(baseColumns);
  const renderSearchActions = () => {
    return (
      <Space>
        <Button icon={<PlusOutlined />} onClick={openAdd}>
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
      />
      <RoleEditDialog {...dialogProps} />
      <RoleAuthMenu {...authMenuDialogProps} />
    </div>
  );
}
