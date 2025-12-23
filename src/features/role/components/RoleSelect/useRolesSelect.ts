// 角色下拉框
import { useState, useEffect } from "react";
import type { RoleInfo } from "../../types";
import { findPageRoolListApi } from "@src/services";
import { RoleFilterListParams } from "../RoleList/RoleList.types";

export const useRoles = (scope?: "platform" | "merchant") => {
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const parmas: RoleFilterListParams = {
        pageNo: 1,
        pageSize: 1000,
      };
      const pageRole = await findPageRoolListApi(parmas);
      if (pageRole.totalElements > 0 && pageRole.content?.length > 0) {
        setRoles(pageRole.content);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [scope]);

  return { roles, loading, refresh: fetchRoles };
};
