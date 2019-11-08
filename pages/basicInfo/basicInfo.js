// pages/basicInfo/basicInfo.js
const app = getApp();
const menuButton = wx.getMenuButtonBoundingClientRect();

Page({

    data: {
        statusBarHeight: 0,
        isWorker: false,
        titleHeight: 0,
        page: 1,

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

        if (this.data.page == 1) {
            //page == 1时上一步
            if (e.currentTarget.dataset.type == "previous") {
                wx.navigateBack();
            } else {
                if (
                    this.data.barInfo.bid &&
                    this.data.ident &&
                    this.data.nickname &&
                    /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(this.data.phoneNumber) &&
                    this.data.gender
                ) {
                    //page == 1 下一步或者提交
                    if (this.data.ident == 1) {
                        this.setData({ page: 2 })
                    } else {
                        console.log("工作人员提交！")
                        wx.apiRequest("/api/login/upinfo", {
                            method: "post",
                            data: {
                                bid: this.data.barInfo.bid,
                                worker: 2,
                                nickname: this.data.nickname,
                                mobile: this.data.phoneNumber,
                                sex: this.data.gender,
                            },
                            success: res => res.data.code == 200 && wx.redirectTo({ url: `../home/home?bar_name=${this.data.barInfo.name}` }),
                        })
                    }
                } else {
                    wx.showToast({ title: "请检查信息是否完整或者手机号码是否正确！", icon: "none", duration: 3000 })
                }
            }
        } else {

            if (e.currentTarget.dataset.type == "previous") {   //page == 2
                if (this.data.showMain == 2) {      //page直接等于2时
                    wx.navigateBack();
                } else {        //page为第一个页面点击改变为2时
                    this.setData({ page: 1 })
                }
            } else {
                //page == 2时提交
                if (
                    this.data.barInfo.bid &&
                    this.data.seatNumber &&
                    this.data.clothesColor
                ) {
                    console.log("工作人员提交！")
                    wx.apiRequest("/api/login/upinfo", {
                        method: "post",
                        data: {
                            bid: this.data.barInfo.bid,
                            worker: 1,
                            nickname: this.data.nickname,
                            mobile: this.data.phoneNumber,
                            sex: this.data.gender,
                            seat: this.data.seatNumber,
                            color: this.data.clothesColor
                        },
                        success: res => res.data.code == 200 && wx.redirectTo({ url: `../home/home?bar_name=${this.data.barInfo.name}` }),
                    })
                } else {
                    wx.showToast({ title: "请完善信息后提交！", icon: "none", duration: 3000 })
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
        this.setData({ page: options.page, showMain: options.page, barInfo: { bid: options.bid, name: options.name } });
    }
})