import service from "@/utils/request";

export const getIPRegion = (params) => {
  return service({
    url: "/wafcdn/ip-region",
    method: "get",
    params,
  });
};
