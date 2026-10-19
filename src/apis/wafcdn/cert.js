import service from "@/utils/request";

export const getCert = (params) => {
  return service({
    url: "/wafcdn/cert",
    method: "get",
    params,
  });
};

export const postCert = (data) => {
  return service({
    url: "/wafcdn/cert",
    method: "post",
    data,
  });
};

export const putCert = (data) => {
  return service({
    url: "/wafcdn/cert",
    method: "put",
    data,
  });
};

export const deleteCert = (params) => {
  return service({
    url: "/wafcdn/cert",
    method: "delete",
    params,
  });
};

export const postCertAcme = (data) => {
  return service({
    url: "/wafcdn/cert/acme",
    method: "post",
    data,
    timeout: 180 * 1000,
  });
};
