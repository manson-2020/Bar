// pages/basicInfo/basicInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ident: null,
        gender: null,
        nickname: null,
        phoneNumber: null,
        hall: null,
        seatNumber: null,
        clothesColor: null,
    },

    saveInput(e) {
        this.setData({ [e.currentTarget.dataset.item]: e.detail.value })
    },

    done() {
        // wx.apiRequest("/api/login/upinfo", {
        //     method: "post",
        //     data: {
        //         token: wx.getStorageSync("token"),
        //         is_work: this.data.ident,
        //         nickname: this.data.nickname,
        //         name: this.data.ident,
        //         mobile: this.data.phoneNumber,
        //         sex: this.data.gender,
        //         seatNumber: this.data.ident,
        //         clothesColor: this.data.ident,
        //         bid: this.data.hall,

        //         avatar: this.data.ident,
        //         birthday: this.data.ident,
        //     },
        //     success: res => console.log(res),
        //     fail: err => console.log(err)
        // })
        // return false;
        wx.navigateTo({
            url: '../index/index'
        })
    },

    choose(e) {
        this.setData({ [e.currentTarget.dataset.choose]: e.detail.value });
    },

    
})