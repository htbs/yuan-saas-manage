// /** @type {import('tailwindcss').Config} */
// const config = {
//   darkMode: "class",
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: "var(--ant-color-primary)",
//         success: "var(--ant-color-success)",
//         warning: "var(--ant-color-warning)",
//         error: "var(--ant-color-error)",
//         info: "var(--ant-color-info)",
//         text: {
//           primary: "var(--ant-color-text-primary)",
//           secondary: "var(--ant-color-text-secondary)",
//           disabled: "var(--ant-color-text-disabled)",
//         },
//         bg: {
//           primary: "var(--ant-color-bg-primary)",
//           secondary: "var(--ant-color-bg-secondary)",
//           container: "var(--ant-color-bg-container)",
//         },
//         border: {
//           primary: "var(--ant-color-border)",
//           secondary: "var(--ant-color-border-secondary)",
//         },
//       },
//       fontFamily: {
//         sans: "var(--ant-font-family)",
//       },
//       fontSize: {
//         base: "var(--ant-font-size-base)",
//         sm: "var(--ant-font-size-sm)",
//         lg: "var(--ant-font-size-lg)",
//       },
//       // spacing: {
//       //   xs: "var(--ant-space-xs)",
//       //   sm: "var(--ant-space-sm)",
//       //   md: "var(--ant-space-md)",
//       //   lg: "var(--ant-space-lg)",
//       //   xl: "var(--ant-space-xl)",
//       //   xxl: "var(--ant-space-xxl)",
//       // },
//       borderRadius: {
//         xs: "var(--radius-xs)",
//         sm: "var(--radius-sm)",
//         md: "var(--radius-md)",
//         lg: "var(--radius-lg)",
//         xl: "var(--radius-xl)",
//         myRoundFull: "var(--radius-full)",
//       },
//     },
//   },
// };
// export default config;

/** @type {import('tailwindcss').Config} */

const config = {
  // 配置需要扫描的文件路径（确保 Tailwind 能识别所有组件和页面）
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // 主题配置（可扩展默认主题）
  theme: {
    extend: {
      // 自定义颜色
      colors: {
        primary: "#3B82F6", // 蓝色作为主色
        secondary: "#10B981", // 绿色作为辅助色
      },
      // 自定义字体
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      // 自定义动画
      animation: {
        "bounce-slow": "bounce 3s infinite",
      },
    },
  },
  // 插件配置
  plugins: [
    // 示例：添加表单样式插件（需先安装 npm install -D @tailwindcss/forms）
    // require('@tailwindcss/forms'),
  ],
};
export default config;
