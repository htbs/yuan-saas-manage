import { useCallback, useState } from "react";
import { useAuth } from "@/src/features/auth/hooks/useAuth";

export type ModelType = "none" | "updatePassword" | "editUserProfile";

export default function useUserActions() {
  // 控制展开的model
  const [activeModal, setActiveModal] = useState<ModelType>("none");

  // 打开model
  const openModal = useCallback((type: ModelType) => {
    setActiveModal(type);
  }, []);
  // 关闭model
  const colseModal = useCallback(() => {
    setActiveModal("none");
  }, []);

  // 退出登录
  const { logout } = useAuth();
  return { colseModal, openModal, activeModal, logout };
}
