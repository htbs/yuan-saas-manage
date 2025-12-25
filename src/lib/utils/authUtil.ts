import { User } from "@/src/types/user";
import { STORAGE_AUTH, STORAGE_USER, StorageAuth } from "@src/types/constant";
/** 从 storage 读取 token */
export function readTokenFromStorages(): StorageAuth {
  // window 是浏览器提供的全局对象, 服务端渲染时是没有 window 的 ! ( typeof 规避异常 )
  if (typeof window === "undefined") return JSON.parse("{}");
  // 先从 sessionStorage 读取, 再从 localStorage 读取 :
  return JSON.parse(localStorage.getItem(STORAGE_AUTH) ?? "{}") as StorageAuth;
}

/** 将 token 存入 storage */
export function saveAuthToStorage(token: string, refareshToken: string) {
  // window 是浏览器提供的全局对象, 服务端渲染时是没有 window 的 ! ( typeof 规避异常 )
  if (typeof window === "undefined") return;

  // 根据 remeber 决定是存入 localStorage :
  const storageUserToke: StorageAuth = {
    token,
    refareshToken,
  };
  // 存入 token 和 user : ( {} 表示空对象 )
  localStorage.setItem(STORAGE_AUTH, JSON.stringify(storageUserToke));
}

/** 清空 storage 中的 token / user 信息 */
export function clearAuthFromStorage() {
  // window 是浏览器提供的全局对象, 服务端渲染时是没有 window 的 ! ( typeof 规避异常 )
  if (typeof window === "undefined") return;

  // 移除 localStorage / sessionStorage 中的 token / user :
  localStorage.removeItem(STORAGE_AUTH);
  localStorage.removeItem(STORAGE_USER);
}

/**
 * 存储当前登录人信息
 */
export function saveUserToStorage(userInfo: User) {
  // window 是浏览器提供的全局对象, 服务端渲染时是没有 window 的 ! ( typeof 规避异常 )
  if (typeof window === "undefined") return;

  // 存入用户信息 :
  localStorage.setItem(STORAGE_USER, JSON.stringify(userInfo));
}

/**
 * 获取当地登录人信息
 */
export function readLocalUserInfo(): User | null {
  // window 是浏览器提供的全局对象, 服务端渲染时是没有 window 的 ! ( typeof 规避异常 )
  if (typeof window === "undefined") return null;

  // 获取用户信息 :
  const userInfo = localStorage.getItem(STORAGE_USER);
  return userInfo ? (JSON.parse(userInfo) as User) : null;
}
