import service from "@/utils/request";

// 获取系统验证码
export const getCaptcha = (params) => {
  return service({
    url: "/captcha",
    method: "get",
    params,
  });
};
