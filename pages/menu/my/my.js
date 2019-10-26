// pages/my/my.js
const app = getApp();

Page({

	data: {
		avatar: "../../../images/defaultAvatar.png",
		firstList: [
			{ key: "昵称", value: "赵晓慧" },
			{ key: "当前卡座号", value: "A61" },
			{ key: "衣服颜色", value: "蓝色外套" },
			{ key: "当前酒吧", value: "熹客酒吧" }
		],
		secondList: [
			{ key: "性别", value: "男" },
			{ key: "联系方式", value: "18741542514" },
			{ key: "生日", value: "06.14" },
			{ key: "星座", value: "巨蟹座" },
			{ key: "地址", value: "四川省成都市" }
		],
		statusBarHeight: app.globalData.statusBarHeight,
		menuButton: app.globalData.menuButton,
	},

	goBack() {
		wx.navigateBack();
	},
	
	onLoad: function (options) {
		console.log(123213)
	},

})