import service from "@/utils/request";

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
    // 覆盖默认的http参数get数组处理的问题。
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

export const getCacheDelete = (params) => {
  return service({
    url: "/wafcdn/cache/delete/list",
    method: "get",
    params,
  });
};

export const putCacheDelete = (params) => {
  return service({
    url: "/wafcdn/cache/delete/list",
    method: "put",
    params,
  });
};
