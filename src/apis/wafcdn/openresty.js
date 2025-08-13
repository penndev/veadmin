import service from "@/utils/request";

export const status = (params) => {
  return service({
    url: "/wafcdn/openresty/status",
    method: "get",
    params,
  });
};

export const start = (params) => {
  return service({
    url: "/wafcdn/openresty/start",
    method: "put",
    params,
  });
};

export const stop = (params) => {
  return service({
    url: "/wafcdn/openresty/stop",
    method: "put",
    params,
  });
};

export const reload = (params) => {
  return service({
    url: "/wafcdn/openresty/reload",
    method: "put",
    params,
  });
};
