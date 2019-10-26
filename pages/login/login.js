//pges/login/login.js

const app = getApp()

Page({
    data: {
        isShowMenu: false,
        BarsList: [],
        firstBars: {},
    },

    nextStep() {
        wx.navigateTo({
            url: '../basicInfo/basicInfo'
        })
    },

    dropDownMenu() {
        this.setData({ isShowMenu: !this.data.isShowMenu })
    },

    scanCode() {
        wx.scanCode({
            success: res => {
                wx.showToast({
                    title: '成功',
                    duration: 2000
                })
            },
            fail: res => {
                wx.showToast({
                    title: '失败',
                    duration: 2000
                })
            },
            complete: (res) => {
            }
        })
    },

    onLoad() {
        wx.getLocation({
            type: 'wgs84',
            success: res => {
                wx.apiRequest("/api/login/getbar", {
                    method: "post",
                    data: {
                        longitude: res.latitude,
                        longitude: res.longitude,
                        token: wx.getStorageSync("token")
                    },
                    success: res => {
                        this.setData({
                            firstBars: res.data.data[0],
                            BarsList: res.data.data.slice(1, 5)
                        })
                    },
                    fail(err) {
                        console.log(err);
                    }
                })
            }
        })
    }
})
