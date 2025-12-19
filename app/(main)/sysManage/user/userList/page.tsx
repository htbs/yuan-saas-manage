"use client";
import { SysUserDataList, SysUserFilterListParams } from "@/src/features/user";
import { useSysUserTable } from "@/src/features/user/index";
import {
  userSearchFields,
  baseColumns,
} from "@/src/features/user/types/UserTable.types";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";

export default function SysUserList() {
  const { finalUserColumns, fetchUserList, handleSetRefetch } =
    useSysUserTable(baseColumns);

  return (
    <div>
      <GenericFilterableList<SysUserDataList, SysUserFilterListParams>
        columns={finalUserColumns}
        searchFields={userSearchFields}
        fetcher={fetchUserList}
        showIndexColumn={true}
        onRefetch={handleSetRefetch}
      />
    </div>
  );
}
