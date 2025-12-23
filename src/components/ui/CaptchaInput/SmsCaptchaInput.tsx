// 短信验证码输入框
import React, { useState } from "react";
import { Input, Button, message, Space } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { useCountDown } from "./useCountDown";

interface SmsCaptchaInputProps {
  value?: string;
  disabled?: boolean; // 是否禁用输入框
  onChange?: (value: string) => void;
  phone?: string; // 关联的手机号，用于发送前的校验
  onSend?: () => Promise<void>; // 发送验证码的 API 调用
}

const SmsCaptchaInput: React.FC<SmsCaptchaInputProps> = ({
  value,
  onChange,
  disabled,
  phone,
  onSend,
}) => {
  const { count, start, isCounting } = useCountDown(60);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async () => {
    console.log("phone", phone);
    // 1. 基础校验
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      message.warning("请先输入正确的手机号");
      return;
    }

    setLoading(true);
    try {
      // 2. 调用外部传入的发送逻辑（元识 API）
      if (onSend) {
        await onSend();
      }
      message.success("验证码已发送");
      start(); // 开启倒计时
    } catch (error) {
      // 错误处理由全局拦截器或此处处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space.Compact className="w-full">
      <Input
        prefix={<SafetyCertificateOutlined className="text-gray-400" />}
        placeholder="请输入验证码"
        maxLength={6}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <Button
        disabled={isCounting || disabled}
        loading={loading}
        onClick={handleSend}
        className="min-w-[120px]"
      >
        {isCounting ? `${count}s 后重发` : "获取验证码"}
      </Button>
    </Space.Compact>
  );
};

export default SmsCaptchaInput;
