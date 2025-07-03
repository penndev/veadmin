import service from "@/utils/request";

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
