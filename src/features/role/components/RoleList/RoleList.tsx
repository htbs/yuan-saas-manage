import { useRoleList } from "./useRoleList";
import { baseColumns, searchFields } from "./RoleList.types";
import { RoleInfo, RoleFilterListParams } from "../../types";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";
import { RoleEditDialog } from "../RoleDetail/RoleDetail";
import { RoleAuthMenu } from "../RoleAuth/RoleAuthMeun";

export function RoleList() {
  const {
    finalColumns,
    fetchList,
    handleSetRefetch,
    addAction,
    dialogProps,
    authMenuDialogProps,
  } = useRoleList(baseColumns);
  return (
    <div className="w-full! h-full!">
      <GenericFilterableList<RoleInfo, RoleFilterListParams>
        columns={finalColumns}
        searchFields={searchFields}
        fetcher={fetchList}
        showIndexColumn={true}
        onRefetch={handleSetRefetch}
        renderSearchActions={addAction}
      />
      <RoleEditDialog {...dialogProps} />
      <RoleAuthMenu {...authMenuDialogProps} />
    </div>
  );
}
