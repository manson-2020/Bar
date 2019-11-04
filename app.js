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
                    success: res => res.data.code == 200 && wx.setStorageSync('token', res.data.data.token),
                    fail(err) {
                        console.log(err);
                    }
                });
            }
        });

        wx.connectSocket({ url: 'wss://bar.shdong.cn:9898' });
        wx.onSocketError(res => console.log(res));
        wx.onSocketOpen(() => console.log('WebSocket 已打开！'));
        wx.onSocketClose(res => console.log('WebSocket 已关闭！'));
    },

    globalData: {
        statusBarHeight: wx.getMenuButtonBoundingClientRect().top,
        menuButton: wx.getMenuButtonBoundingClientRect()
    }
})