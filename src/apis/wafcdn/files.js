import service from "@/utils/request";

export const getFiles = (params) => {
  return service({
    url: "/wafcdn/files",
    method: "get",
    params,
  });
};

export const postFiles = (data) => {
  return service({
    url: "/wafcdn/files",
    method: "post",
    data,
  });
};

export const putFiles = (data) => {
  return service({
    url: "/wafcdn/files",
    method: "put",
    data,
  });
};

export const deleteFiles = (params) => {
  return service({
    url: "/wafcdn/files",
    method: "delete",
    params,
    viewLoading: false,
  });
};

export const uploadFile = (data) => {
  return service({
    url: "/wafcdn/files/file",
    method: "post",
    data,
    timeout: 5 * 60 * 1000,
  });
};

export const downloadFile = (params) => {
  return service({
    url: "/wafcdn/files/file",
    method: "get",
    params,
    responseType: "blob",
    timeout: 5 * 60 * 1000,
  });
};
