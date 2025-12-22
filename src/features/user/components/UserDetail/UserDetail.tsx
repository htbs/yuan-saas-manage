import { Button } from "antd";
import { useUserStore } from "../../stores/useUserStore";

interface UserDetailProps {
  id: string;
}
export function UserDetail(props: UserDetailProps) {
  const { setView } = useUserStore();
  return (
    <div>
      这里是详情页面 {props.id}
      <Button
        onClick={() => {
          setView("list");
        }}
      >
        返回
      </Button>
    </div>
  );
}
