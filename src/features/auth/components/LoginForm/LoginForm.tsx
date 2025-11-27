/**
 * LoginForm.tsx : ( 纯 UI, 表单校验等 )
 * 
 */
import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import type { LoginReqParams } from "../../api/types";
import styles from "../LoginForm/LoginForm.module.css";

export interface LoginFormProps {
    onSubmit: (vals: LoginReqParams & { remember?: boolean }) => Promise<void> | void;
    loading?: boolean;
}

/**
 * 组件只处理 UI & 校验。onSubmit 交由上层处理业务。
 */
export function LoginForm({ onSubmit, loading = false }: LoginFormProps) {
    const [form] = Form.useForm();

    const handleFinish = async (vals: any) => {
        const { username, password, remember } = vals;
        await onSubmit({ username, password, remember });
    };

    return (
        <div className={styles["login-form"]}>
            <div className={styles["login-form__card"]}>
                <h2 className={styles["login-form__title"]}>登录</h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={{ remember: true }}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: "请输入用户名" }]}
                    >
                        <Input placeholder="用户名/邮箱/手机号" />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: "请输入密码" }]}
                    >
                        <Input.Password placeholder="密码" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>记住我</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default LoginForm;
