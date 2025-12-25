import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ShopFilterListParams } from "../types";

interface ShopState {
  // --- view workbench:工作台  ---
  view: "list" | "add" | "edit" | "detail" | "workbench";
  editId: string | null;
  queryParams: ShopFilterListParams;
  pagination: {
    current: number;
    pageSize: number;
  };

  // --- 操作 ---
  // 切换视图：如 setView('edit', '123')
  setView: (view: ShopState["view"], id?: string | null) => void;
  // 更新搜索条件
  setQueryParams: (params: ShopFilterListParams) => void;
  // 更新分页
  setPagination: (current: number, pageSize: number) => void;
  // 重置该模块所有状态
  resetAll: () => void;

  goBack: () => void;
}

export const useShopStore = create<ShopState>()(
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
      name: "shop-management-storage", // 存储在 localStorage 中的 Key
      storage: createJSONStorage(() => sessionStorage), // 建议用 sessionStorage，关闭浏览器标签即清理
    }
  )
);
