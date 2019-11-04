// pages/query/query.js
const app = getApp();

Page({

	data: {
		statusBarHeight: app.globalData.statusBarHeight,
		menuButton: app.globalData.menuButton,
		topTab: ["收到", "送出"],
		tabIndex: 0,
		giftList: []
	},

	goBack() {
		wx.navigateBack();
	},

	switchTab(e) {
		this.setData({ tabIndex: e.currentTarget.dataset.index }, () => {
			this.apiRequest(e.currentTarget.dataset.index + 1);
		});
	},

	apiRequest(param = 1) {
		wx.apiRequest("/api/user/myGift", {
			data: { type: param },
			success: res => this.setData({ giftList: res.data.data })
		});
	},

	onLoad(options) {
		this.apiRequest();
	},
})