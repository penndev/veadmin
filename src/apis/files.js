import service from "@/utils/request";

export const listDir = (params) =>
  service({ url: "/files/list", method: "get", params });

export const getContent = (params) =>
  service({ url: "/files/content", method: "get", params });

export const putContent = (data) =>
  service({ url: "/files/content", method: "put", data });

export const mkdir = (data) =>
  service({ url: "/files/dir", method: "post", data });

export const removeFile = (params) =>
  service({ url: "/files/file", method: "delete", params });

export const renameFile = (data) =>
  service({ url: "/files/rename", method: "put", data });

export const chmodFile = (data) =>
  service({ url: "/files/chmod", method: "put", data });

export const uploadFile = (path, file) => {
  const formData = new FormData();
  formData.append("path", path);
  formData.append("file", file);
  return service({
    url: "/files/upload",
    method: "post",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const downloadFile = (params) =>
  service({
    url: "/files/download",
    method: "get",
    params,
    responseType: "blob",
    viewLoading: false,
  });
