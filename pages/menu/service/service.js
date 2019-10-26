// pages/service/service.js

const app = getApp();

Page({

	data: {
		statusBarHeight: app.globalData.statusBarHeight,
		menuButton: app.globalData.menuButton,
	},

	goBack() {
		wx.navigateBack();
	},

	onLoad: function (options) {

	},
})