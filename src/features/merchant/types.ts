import { Page } from "@/src/types/constant";
export interface FilterListParams {
  userName: string;
  userType: string;
  phone: string;
  pageNo: number;
  pageSize: number;
}

export interface MerchantListData {
  id: number;
  userName: string;
  userType: string;
  phone: string;
  createTime: string;
  updateTime: string;
}

export type PageMerchant = Page<MerchantListData>;
