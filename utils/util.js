
const requestUrl = "https://bar.shdong.cn";

wx.apiRequest = (url, params) => wx.request({ url: requestUrl + url, ...params });
