"use client";

import { Button, Flex } from "antd";
const HomeHeader = () => {
  return (
    <Flex justify="space-between" align="center">
      <div
        style={{ width: "100px", height: "100px" }}
        className="text-4xl font-bold text-blue-600"
      >
        数据看板
      </div>
      <div>
        <Button type="primary">新增店铺</Button>
      </div>
    </Flex>
  );
};
export default function Home() {
  return (
    <div>
      <HomeHeader />
    </div>
  );
}
