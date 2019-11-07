// pages/basicInfo/basicInfo.js
const app = getApp();
const menuButton = wx.getMenuButtonBoundingClientRect();

Page({

    data: {
        statusBarHeight: 0,
        isWorker: false,
        titleHeight: 0,
        showMain: true,
        ident: 1,
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
            if (this.data.ident == 2) {
                if (this.data.barInfo.bid
                    && this.data.ident
                    && this.data.nickname
                    && /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(this.data.phoneNumber)
                    && this.data.gender
                ) {
                    wx.apiRequest("/api/login/upinfo", {
                        method: "post",
                        data: {
                            bid: this.data.barInfo.bid,
                            worker: this.data.ident,
                            nickname: this.data.nickname,
                            mobile: this.data.phoneNumber,
                            sex: this.data.gender,
                        },
                        success: res => res.data.code == 200 && wx.redirectTo({ url: `../home/home?bar_name=${this.data.barInfo.name}` }),
                        fail: err => console.log(err)
                    })
                } else {
                    wx.showToast({ title: "0---请检查信息是否完整或者手机号码是否正确！", icon: "none", duration: 3000 })
                }

            } else {
                if (!this.data.showMain) {
                    if (this.data.barInfo.bid
                        && this.data.seatNumber
                        && this.data.clothesColor
                    ) {
                        wx.apiRequest("/api/login/upinfo", {
                            method: "post",
                            data: {
                                bid: this.data.barInfo.bid,
                                worker: 1,
                                seat: this.data.seatNumber,
                                color: this.data.clothesColor
                            },
                            success: res => res.data.code == 200 && wx.redirectTo({ url: `../home/home?bar_name=${this.data.barInfo.name}` }),
                            fail: err => console.log(err)
                        })
                    } else {
                        wx.showToast({ title: "1---请检查信息是否完整或者手机号码是否正确！", icon: "none", duration: 3000 })
                    }

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
        this.setData({ showMain: !!Number(options.showMain), isWorker: !Number(options.showMain), barInfo: { bid: options.bid, name: options.name } });
    }
})