import service from "@/utils/request";

export const status = (params) => {
  return service({
    url: "/wafcdn/openrsty/status",
    method: "get",
    params,
  });
};

export const start = (params) => {
  return service({
    url: "/wafcdn/openrsty/start",
    method: "put",
    params,
  });
};

export const stop = (params) => {
  return service({
    url: "/wafcdn/openrsty/stop",
    method: "put",
    params,
  });
};

export const reload = (params) => {
  return service({
    url: "/wafcdn/openrsty/reload",
    method: "put",
    params,
  });
};
