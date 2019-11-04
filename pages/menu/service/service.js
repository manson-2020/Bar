// pages/service/service.js

const app = getApp();

Page({

	data: {
		statusBarHeight: app.globalData.statusBarHeight,
		menuButton: app.globalData.menuButton,
		content: ''
	},

	goBack() {
		wx.navigateBack();
	},

	onLoad(options) {
		wx.apiRequest("/api/user/service", {
			method: "post",
			data: {},
			success: res => res.data.code == 200 && this.setData({ content: res.data.data })
		})
	},
})