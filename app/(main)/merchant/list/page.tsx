"use client";
import { Button } from "antd";
import React from "react";
import { useRouter } from "next/navigation";
import { Form } from "antd";

export default function MerchantList() {
  const router = useRouter();
  const handleAdd = () => {
    router.push("/merchant/add");
  };
  return (
    <>
      <h1>这里是商家列表</h1>
      <Button onClick={handleAdd}>新增商家</Button>
    </>
  );
}
