// pages/basicInfo/basicInfo.js
const app = getApp();
const menuButton = wx.getMenuButtonBoundingClientRect();

Page({

    data: {
        statusBarHeight: 0,
        isWorker: false,
        titleHeight: 0,
        showMain: true,
        ident: '',
        gender: '',
        nickname: '',
        phoneNumber: '',
        seatNumber: '',
        clothesColor: '',
    },

    saveInput(e) {
        this.setData({ [e.currentTarget.dataset.item]: e.detail.value });
    },

    step(e) {
        if (e.currentTarget.dataset.type == "previous") {
            if (this.data.showMain || this.data.isWorker) {
                wx.navigateBack();
            } else {
                this.setData({ showMain: true });
            }
        } else {
            if (this.data.ident) {
                console.log("工作人员，提交数据后直接跳转");
                wx.apiRequest("/api/login/upinfo", {
                    method: "post",
                    data: {
                        bid: this.data.barInfo.bid,
                        is_work: this.data.ident,
                        name: this.data.nickname,
                        mobile: this.data.phoneNumber,
                        sex: this.data.gender,
                    },
                    success: res => res.data.code == 200 && wx.redirectTo({ url: `../home/home?bar_name=${this.data.barInfo.name}` }),
                    fail: err => console.log(err)
                })
            } else {
                if (!this.data.showMain) {
                    wx.apiRequest("/api/login/upinfo", {
                        method: "post",
                        data: {
                            bid: this.data.barInfo.bid,
                            is_work: this.data.ident,
                            nickname: this.data.nickname,
                            mobile: this.data.phoneNumber,
                            sex: this.data.gender,
                            seat: this.data.seatNumber,
                            color: this.data.clothesColor
                        },
                        success: res => res.data.code == 200 && wx.redirectTo({ url: `../home/home?bar_name=${this.data.barInfo.name}` }),
                        fail: err => console.log(err)
                    })
                } else {
                    this.setData({ showMain: false });
                }
            }
        }
    },

    choose(e) {
        this.setData({ [e.currentTarget.dataset.type]: Number(e.detail.value) });
    },

    onShow() {
        wx.getSystemInfo({
            success: res => {
                this.setData({
                    titleHeight: menuButton.height + (menuButton.top - res.statusBarHeight) * 2,
                    statusBarHeight: res.statusBarHeight
                });
            }
        })
    },

    onLoad(options) {
        // console.log(options);return
        this.setData({ showMain: !!Number(options.showMain), isWorker: !Number(options.showMain), barInfo: { bid: options.bid, name: options.name } });
    }
})