
const requestUrl = "https://bar.shdong.cn";

wx.apiRequest = (url, params) => {
    params.method = params.method || "post";
    params.data = params.data || {};
    params.data.token = wx.getStorageSync("token") || '';

    return wx.request({ url: requestUrl + url, ...params });
};
