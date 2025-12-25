import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RoleFilterListParams } from "../types";

interface RoleState {
  // --- 状态 ---
  view: "list" | "add" | "edit" | "detail" | "auth";
  editId: string | null;
  queryParams: RoleFilterListParams;
  pagination: {
    current: number;
    pageSize: number;
  };

  // --- 操作 ---
  // 切换视图：如 setView('edit', '123')
  setView: (view: RoleState["view"], id?: string | null) => void;
  // 更新搜索条件
  setQueryParams: (params: RoleFilterListParams) => void;
  // 更新分页
  setPagination: (current: number, pageSize: number) => void;
  // 重置该模块所有状态
  resetAll: () => void;

  goBack: () => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      // 默认值
      view: "list",
      editId: null,
      queryParams: { pageNo: 1, pageSize: 10 },
      pagination: {
        current: 1,
        pageSize: 10,
      },

      setView: (view, id = null) => set({ view, editId: id }),

      setQueryParams: (params) => set((state) => ({ queryParams: params })),

      setPagination: (current, pageSize) =>
        set((state) => ({
          pagination: { ...state.pagination, current, pageSize },
        })),

      resetAll: () =>
        set({
          view: "list",
          editId: null,
          queryParams: { pageNo: 1, pageSize: 10 },
          pagination: { current: 1, pageSize: 10 },
        }),
      goBack: () => set({ view: "list", editId: null }),
    }),
    {
      name: "role-management-storage", // 存储在 localStorage 中的 Key
      storage: createJSONStorage(() => sessionStorage), // 建议用 sessionStorage，关闭浏览器标签即清理
    }
  )
);
