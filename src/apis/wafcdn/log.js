import service from "@/utils/request";

// 获取日志列表
export const getLog = (params) => {
  return service({
    url: "/wafcdn/log",
    method: "get",
    params,
  });
};
