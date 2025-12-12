export interface Result<T = unknown> {
  status: string; // 状态码
  code: string; // 业务状态状态码，可根据这个码区分不同业务的特殊报错
  message: string; // 描述信息
  data: T; // 数据
  traceId: string; // 请求ID，用于排查问题
  timestamp: number; // 时间戳
  debug: string; // 调试信息 只有后端开启调试才会有信息
}
