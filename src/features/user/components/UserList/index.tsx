import {
  SysUserDataList,
  SysUserFilterListParams,
  useSysUserTable,
  userSearchFields,
  baseColumns,
} from "@/src/features/user";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";
import { UserEditDialog } from "@/src/features/user/components/UserDetail";

export function UserList() {
  const {
    finalUserColumns,
    fetchUserList,
    addAction,
    registerRefetch,
    dialogProps,
  } = useSysUserTable(baseColumns);

  return (
    <div>
      <GenericFilterableList<SysUserDataList, SysUserFilterListParams>
        columns={finalUserColumns}
        searchFields={userSearchFields}
        fetcher={fetchUserList}
        showIndexColumn={true}
        onRefetch={registerRefetch}
        renderSearchActions={addAction}
      />
      <UserEditDialog {...dialogProps} />
    </div>
  );
}
