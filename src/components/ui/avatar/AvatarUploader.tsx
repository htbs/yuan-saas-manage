// "use client";

import React, { useState, useCallback, useEffect } from "react";
import { Upload, message, Image, UploadProps } from "antd";
import type { RcFile, UploadFile } from "antd/es/upload";
import {
  LoadingOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop"; // 引入裁剪组件
import NextImage from "next/image";

interface AvatarUploaderProps {
  value?: string;
  onChange?: (val?: string) => void;
  needCrop?: boolean; // 新增：是否需要裁剪
  aspect?: number; // 新增：裁剪比例，默认 1/1
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  value,
  onChange,
  needCrop = false,
  aspect = 1,
}) => {
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 外部 value 变化时同步到 fileList（编辑回显）
  useEffect(() => {
    setFileList(
      value
        ? [
            {
              uid: "-1",
              name: value.split("/").pop() || "avatar.png",
              status: "done",
              url: value,
            },
          ]
        : []
    );
  }, [value]);

  // 在组件内部
  const handleCustomRequest: UploadProps["customRequest"] = useCallback<
    NonNullable<UploadProps["customRequest"]>
  >(
    async (options) => {
      const { file, onSuccess, onError } = options;
      // 这里的 options 会自动推导出 file, onSuccess, onError, onProgress 等
      console.log("file: ", file);
      setLoading(true);
      try {
        // 这里的延时模拟真实请求，否则同步执行有时会触发 React 的批处理导致状态更新不及时
        await new Promise((resolve) => setTimeout(resolve, 500));
        // 此处对接你的上传接口
        const remoteUrl =
          "https://yl-prescription-share.oss-cn-beijing.aliyuncs.com/test/1765435757686/home-r.png";
        onChange?.(remoteUrl);
        setFileList([
          {
            uid: "-1",
            name: (file as File).name,
            status: "done",
            url: remoteUrl,
          },
        ]);
        onSuccess?.({ status: "done", url: remoteUrl }, file as RcFile);
      } catch (e) {
        message.error("上传失败");
      } finally {
        setLoading(false);
      }
    },
    [onChange]
  );

  // 渲染上传核心逻辑
  const renderUpload = () => (
    <Upload
      listType="picture-circle"
      showUploadList={false}
      fileList={fileList}
      customRequest={handleCustomRequest}
    >
      {(fileList[0]?.url || value) && !loading ? (
        <div className="group relative w-full h-full overflow-hidden rounded-full">
          <NextImage
            src={fileList[0]?.url || value}
            alt="avatar"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
            <EyeOutlined
              className="text-white cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewOpen(true);
              }}
            />
            <DeleteOutlined
              className="text-white cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onChange?.(undefined);
                setFileList([]);
              }}
            />
          </div>
        </div>
      ) : (
        <div>{loading ? <LoadingOutlined /> : <PlusOutlined />} 上传</div>
      )}
    </Upload>
  );

  return (
    <>
      {/* 核心：如果需要裁剪，用 ImgCrop 包裹，否则直接渲染 */}
      {needCrop ? (
        <ImgCrop
          rotation={true} // 支持旋转
          aspect={aspect} // 裁剪比例
          showGrid // 显示网格
          modalTitle="编辑头像"
          modalOk="确定"
          modalCancel="取消"
          fillColor="transparent"
          // 如果需要圆形裁剪框，可设置 cropShape="round"
          cropShape="round"
        >
          {renderUpload()}
        </ImgCrop>
      ) : (
        renderUpload()
      )}

      {/* 预览大图 */}
      <div style={{ display: "none" }}>
        <Image
          alt="预览"
          src={fileList[0]?.url || value}
          preview={{
            open: previewOpen,
            onOpenChange: (val) => setPreviewOpen(val),
          }}
        />
      </div>
    </>
  );
};

export default AvatarUploader;
