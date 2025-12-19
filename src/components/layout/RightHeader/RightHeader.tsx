import { Card } from "antd";
import UserDropdown from "@/src/features/sysUser/components/UserDropdown/UserDropdown";

export default function RightHeader() {
  return (
    <Card size="small" className="mb-4! mt-4! ">
      <UserDropdown
        userName="测试"
        onLogout={() => {
          console.log("推出登录");
        }}
        onRestPassword={() => {
          console.log("重置密码");
        }}
      />
    </Card>
  );
}
