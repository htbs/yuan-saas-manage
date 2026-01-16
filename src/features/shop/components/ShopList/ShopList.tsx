import {
    baseColumns,
    useShopStore,
    ShopListInfo,
    ShopFilterListParams,
    useShopList,
    searchFields,
} from "@/src/features/shop";
import React, {useRef, useState, useEffect} from "react";
import {YsDraggableDialog} from '@src/components/YsDraggableDialog/YsDraggableDialog';
import SchemaForm from "@src/components/YsForm/index";
import {FormFieldConfig, SchemaFormRef} from "@src/components/YsForm/types";
import {z} from "zod";
import {Button, Space, Radio, Divider} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";

// 1. Zod Schema, 校验规则
const formSchema = z.object({
  fullName: z.string().min(2, "姓名必填"),
  email: z.string().email("邮箱格式有误"),
  phone: z.string().optional(),
  department: z.string(),
  isRemote: z.boolean(),
});
type FormData = z.infer<typeof formSchema>;

export function ShopList() {
  // 弹窗显隐控制变量
  const [isOpen, setIsOpen] = useState(false);
  // 2. 字段配置
  const fields: FormFieldConfig<FormData>[] = [
    {
      name: "fullName",
      label: "员工姓名",
      type: "input",
      // required: true 只是为了显示红星，实际校验看 Zod
      required: true,
      placeholder: "请输入",
    },
    {
      name: "email",
      label: "公司邮箱",
      type: "input",
      required: true,
      renderAfter: "@company.com",
    },
    {
      name: "phone",
      label: "联系电话",
      type: "input",
      // 单独控制 span：这一行我想要两个输入框，所以各占 12 (总24)
      span: 12,
    },
    {
      name: "department",
      label: "所属部门",
      type: "select",
      span: (data) => {
        console.log(data);
        return 12;
      },
      options: [
        { label: "研发部", value: "rd" },
        { label: "市场部", value: "mkt" },
      ],
    },
    {
      name: "isRemote",
      label: "是否远程",
      type: "switch",
      tooltip: "远程办公需要额外审批",
    },
  ];
  // 1. 创建 Ref
  const formRef = useRef<SchemaFormRef>(null);

  // 监听 isOpen 变化
  useEffect(() => {
    // 只有当弹窗打开，且 ref 存在时才执行
    if (isOpen && formRef.current) {
      requestAnimationFrame(() => {
        formRef.current?.reset({
          fullName: "张三",
          // 其他默认值...
        });
      });
    }
  }, [isOpen]); // 依赖项数组中放入 isOpen

  const handleOk = () => {
    // 3. 点击 Modal 确定按钮时，调用子组件的 submit
    // 这会自动触发 RHF 的校验，如果有错误，表单会显示红字，
    // 且不会执行下面的 handleFormSubmit
    formRef.current?.submit();
  };

  // 4. 表单验证通过后，才会执行这个回调
  const handleFormSubmit = (data: any) => {
    console.log("表单校验通过，数据：", data);
  };
  const { finalAllColumns, fetchList, handleSetRefetch } =
    useShopList(baseColumns);
  const { pagination, setPagination, setQueryParams, resetAll, setView } =
    useShopStore();
  const renderSearchActions = () => {
    return (
      <Space>
        <Button icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
          新增
        </Button>
      </Space>
    );
  };
  return (
    <div>
      <GenericFilterableList<ShopListInfo, ShopFilterListParams>
        columns={finalAllColumns}
        searchFields={searchFields}
        fetcher={fetchList}
        showIndexColumn={true}
        onRefetch={handleSetRefetch}
        renderSearchActions={renderSearchActions}
        controlledPagination={pagination} // 分页同步
        onPaginationChange={setPagination} // 分页操作回调
        onSearchUpdate={setQueryParams} // 搜索操作回调
        onReset={resetAll} // 重置操作回调
      />
      <YsDraggableDialog
        visible={isOpen}
        title="新增商家"
        onClose={() => setIsOpen(false)}
        initialWidth={600}
        initialHeight={400}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button>重置</Button>
            <Button type="primary" onClick={handleOk}>
              提交表单
            </Button>
          </div>
        }
      >
        <SchemaForm
          ref={formRef}
          schema={formSchema}
          fields={fields}
          // readonly={true}
          onSubmit={handleFormSubmit}
          layout="horizontal"
        />
      </YsDraggableDialog>
    </div>
  );
}
