// pages/query/query.js
const app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		statusBarHeight: app.globalData.statusBarHeight,
		menuButton: app.globalData.menuButton,
		topTab: ["收到", "送出"],
		tabIndex: 0
	},

	goBack() {
		wx.navigateBack();
	},

	switchTab(e) {
		this.setData({ tabIndex: e.currentTarget.dataset.index })
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
	},
})