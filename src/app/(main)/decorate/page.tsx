"use client";
import React from "react";
import { Button, message } from "antd";

const Home = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const info = () => {
    messageApi.info("Hello, Ant Design!");
  };

  return (
    <>
      {contextHolder}
      <div style={{ width: "100px", height: "100px" }} className="myRoundFull">
        店铺装修123
      </div>
    </>
  );
};

export default Home;
