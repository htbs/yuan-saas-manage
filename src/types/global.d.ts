// 告诉 TypeScript 所有以 .less 结尾的文件都是有效的模块
declare module '*.less' {
    const content: { [className: string]: string };
    export default content;
}