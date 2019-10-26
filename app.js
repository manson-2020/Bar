//app.js
import './utils/util';

App({
    onLaunch() {
        // 登录
        wx.login({
            success: res => {
                wx.apiRequest('/api/login/index', {
                    method: "post",
                    data: { code: res.code },
                    success: res => {
                        if (res.data.code == 200) wx.setStorageSync('token', res.data.data.token);
                        wx.getStorageSync('token')
                    },
                    fail(err) {
                        console.log(err);
                    }
                });
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            console.log(res)
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },

    globalData: {
        statusBarHeight: wx.getMenuButtonBoundingClientRect().top,
        menuButton: wx.getMenuButtonBoundingClientRect()
    }
})