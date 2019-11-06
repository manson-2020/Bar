// pages/withdrawal/withdrawal.js
const app = getApp();

Page({
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        menuButton: app.globalData.menuButton,
    },

    goBack: _ => wx.navigateBack(),

    saveInput(e) {
        this.setData({ [e.currentTarget.dataset.type]: e.detail.value });
    },

    submit() {
        wx.apiRequest("/api/user/getMoney", {
            data: { money: this.data.money },
            success: res => {
                wx.showToast({
                    title: res.data.msg,
                    icon: res.data.code == 200 ? "success" : "none",
                    success: _ => res.data.code == 200 && setTimeout(() => wx.redirectTo({ url: 'withdrawal' }), 1500)
                })
            }
        })
    },

    onLoad(options) {
        wx.apiRequest("/api/user/myMoney", {
            success: res => res.data.code == 200 && this.setData({ wallet: res.data.data })
        })
    },

})