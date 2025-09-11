import service from "@/utils/request";

// 获取日志列表
export const getLog = (params) => {
  return service({
    url: "/wafcdn/log",
    method: "get",
    params,
  });
};

export const clearLog = (params) => {
  return service({
    url: "/wafcdn/log-clear",
    method: "delete",
    params,
  });
};
