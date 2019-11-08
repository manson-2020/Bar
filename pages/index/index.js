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
        let [url, bar] = [, this.data.params.bar[0]];
        switch (bar.page) {
            case 1: case 2:
                url = `../basicInfo/basicInfo?page=${bar.page}&name=${bar.name}&bid=${bar.bid}`;
                break;
            default:
                wx.apiRequest("/api/login/upinfo", { data: { bid: bar.bid } })
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
        this.setData({ params: this.data.params, isShowMenu: false }, this.goto);
    },

    scanCode() {
        wx.scanCode({
            success: res => {
                for (let index = 0; index < this.data.params.bar.length; index++) {
                    if (this.data.params.bar[index].bid == JSON.parse(res.result).bid) {
                        this.select({ currentTarget: { dataset: { index } } });
                        break;
                    } else if (this.data.params.bar.length - 1 == index) {
                        wx.showToast({
                            icon: "none",
                            title: '找不到对应的酒吧',
                            duration: 2000
                        })
                    }
                }
            }
        })
    },

    onShow() {
        wx.getLocation({
            type: 'wgs84',
            success: res => {
                wx.apiRequest("/api/login/getbar", {
                    data: {
                        latitude: res.latitude,
                        longitude: res.longitude,
                    },
                    success: res => res.data.code == 200 && this.setData({ params: res.data.data })
                })
            }
        })
    },

})
