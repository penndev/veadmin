import service from "@/utils/request";

// 获取站点
export const getSite = (params) => {
  return service({
    url: "/wafcdn/site",
    method: "get",
    params,
  });
};

// 添加站点
export const postSite = (data) => {
  return service({
    url: "/wafcdn/site",
    method: "post",
    data,
  });
};

// 修改站点
export const putSite = (data) => {
  return service({
    url: "/wafcdn/site",
    method: "put",
    data,
  });
};

// 删除站点
export const deleteSite = (params) => {
  return service({
    url: "/wafcdn/site",
    method: "delete",
    params,
  });
};

export const getDomain = (params) => {
  return service({
    url: "/wafcdn/domain",
    method: "get",
    params,
  });
};

export const postDomain = (data) => {
  return service({
    url: "/wafcdn/domain",
    method: "post",
    data,
  });
};

export const putDomain = (data) => {
  return service({
    url: "/wafcdn/domain",
    method: "put",
    data,
  });
};

export const deleteDomain = (params) => {
  return service({
    url: "/wafcdn/domain",
    method: "delete",
    params,
  });
};

export const getCache = (params) => {
  return service({
    url: "/wafcdn/cache",
    method: "get",
    params,
  });
};

export const deleteCache = (params) => {
  return service({
    url: "/wafcdn/cache",
    method: "delete",
    params,
    paramsSerializer: function handleQuery(query) {
      return Object.entries(query)
        .map(([key, value], _) =>
          Array.isArray(value)
            ? `${key}=${value.join("&" + key + "=")}`
            : `${key}=${value}`,
        )
        .join("&");
    },
  });
};

// ===============================

// 上传文件前置检查
export const stat = (params) => {
  return service({
    url: "/stat",
    method: "get",
    params,
    viewLoading: false,
  });
};

export const postControlHost = (data) => {
  return service({
    url: "/control/host",
    method: "post",
    data,
  });
};

export const getControlHost = (params) => {
  return service({
    url: "/control/host",
    method: "get",
    params,
  });
};

export const putControlHost = (data) => {
  return service({
    url: "/control/host",
    method: "put",
    data,
  });
};

export const deleteControlHost = (params) => {
  return service({
    url: "/control/host",
    method: "delete",
    params,
  });
};

export const installControlHost = (data) => {
  return service({
    url: "/control/host/install",
    method: "put",
    data,
  });
};

export const pushControlHost = (data) => {
  return service({
    url: "/control/host/push",
    method: "put",
    data,
  });
};

export const monitorControlHost = (params) => {
  return service({
    url: "/control/host/monitor",
    method: "get",
    params,
  });
};
