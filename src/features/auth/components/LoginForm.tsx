import React, { useCallback, useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserTypeEnum, LoginTypeEnum } from "@/src/types/constant";
import { hashPasswordMD5UpperCase } from "@/src/lib/utils/crypto";
import styles from "./LoginForm.module.css";
import type { LoginFormVals, LoginFormProps, LoginReqParams } from "../type";

/**
 * LoginForm: 纯 UI + 校验。onSubmit 由上层处理业务（例如调用 loginApi）。
 */
export function LoginForm({ onSubmit, loading = false }: LoginFormProps) {
  const [form] = Form.useForm<LoginFormVals>();
  const [submitting, setSubmitting] = useState(false);

  // onFinish : 提交表单
  const handleFinish = useCallback(
    // Promise<void> 函数 :
    async (loginVals: LoginFormVals) => {
      // state : 提交参数
      const username = (loginVals.username ?? "").trim();
      const password = loginVals.password ?? "";
      const remember = !!loginVals.remember;

      if (!username || !password) {
        message.error("用户名和密码不能为空");
        return;
      }
      setSubmitting(true);

      try {
        const loginParams: LoginReqParams = {
          username: username,
          password: hashPasswordMD5UpperCase(password),
          userType: UserTypeEnum.SYSTEM_USER,
          loginType: LoginTypeEnum.USERNAME_PASSWORD,
        };
        // 登录 : 调用传入的 onSubmit 方法
        await onSubmit({ ...loginParams, remember });
      } catch (err: unknown) {
        // 登录失败 :
        const text =
          err && typeof err === "object" && "message" in err
            ? (err as { message?: unknown }).message
            : "Login failed";
        message.error(String(text ?? "Login failed"));
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit]
  );

  return (
    <div className={styles["login-form"]}>
      <div className={styles["login-form__card"]}>
        <h2 className={styles["login-form__title"]}>登录您的账号</h2>

        {/* 表单 */}
        <Form
          form={form}
          layout="vertical"
          variant="filled"
          onFinish={handleFinish}
          initialValues={{ remember: true }}
        >
          {/* 用户名, 必填, 3 ~ 50,  */}
          <Form.Item
            // label="用户名"
            name="username"
            rules={[
              { required: true, message: "请输入用户名" },
              { min: 3, message: "至少 3 个字符" },
              { max: 10, message: "至多 10 个字符" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const v = String(value).trim();
                  if (v.length < 3)
                    return Promise.reject(new Error("用户名至少 3 个字符"));
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              className="h-12"
              placeholder="请输入您的账号"
              autoComplete="username"
            />
          </Form.Item>

          {/* 密码, 必填, 6 ~ 128 */}
          <Form.Item
            // label="密码"
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "至少 6 个字符" },
              { max: 12, message: "至多 12 个字符" },
            ]}
          >
            <Input.Password
              className="h-12"
              placeholder="请慎入您的密码"
              autoComplete="current-password"
            />
          </Form.Item>

          {/* 记住我 */}
          {/* <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住我</Checkbox>
          </Form.Item> */}

          {/* 提交按钮 */}
          <Form.Item>
            <Button
              className="h-12! bg-emerald-500! text-xl!"
              type="primary"
              htmlType="submit"
              block
              loading={loading || submitting}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;
