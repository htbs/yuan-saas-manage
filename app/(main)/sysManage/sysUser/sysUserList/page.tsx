"use client";
import {
  SysUserFilterListParams,
  SysUserDataList,
} from "@/src/features/sysUser/types";
import { useSysUserTable } from "@/src/features/sysUser/hooks/useSysUserTable";
import {
  userSearchFields,
  baseColumns,
} from "@/src/features/sysUser/types/SysUserTable.types";
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
