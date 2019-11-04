//pges/login/login.js

const app = getApp()

Page({
    data: {
        isShowMenu: false,
        params: {
            bar: []
        },
    },

    goto() {
        let url;
        console.log(this.data.params.bar[0].page)
        switch (this.data.params.bar[0].page) {
            case 1:
                url = `../basicInfo/basicInfo?showMain=1&name=${this.data.params.bar[0].name}&bid=${this.data.params.bar[0].bid}`;
                break;
            case 2:
                url = `../basicInfo/basicInfo?showMain=0&name=${this.data.params.bar[0].name}&bid=${this.data.params.bar[0].bid}`;
                break;
            default:
                url = `../home/home`
                break;
        }
        wx.navigateTo({ url })
    },

    dropDownMenu() {
        this.setData({ isShowMenu: !this.data.isShowMenu })
    },

    select(e) {
        this.data.params.bar.unshift(this.data.params.bar.splice(e.currentTarget.dataset.index, 1)[0]);
        this.setData({ params: this.data.params, isShowMenu: false });
    },

    scanCode() {
        wx.scanCode({
            success: res => {
                console.log(res)
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
                        latitude: res.latitude,
                        longitude: res.longitude,
                    },
                    success: res => res.data.code == 200 && this.setData({ params: res.data.data })
                })
            }
        })
    }
})
