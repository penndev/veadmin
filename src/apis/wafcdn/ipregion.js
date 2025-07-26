import service from "@/utils/request";

export const getIpregion = (params) => {
  return service({
    url: "/wafcdn/ipregion",
    method: "get",
    params,
  });
};
