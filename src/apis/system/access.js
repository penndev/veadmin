import service from "@/utils/request";

export const getSystemAccessLog = (params) => {
  return service({
    url: "/system/admin/access-log",
    method: "get",
    params,
  });
};
