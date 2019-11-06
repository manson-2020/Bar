// pages/my/my.js
const app = getApp();

Page({

	data: {
		firstList: [],
		secondList: [],
		statusBarHeight: app.globalData.statusBarHeight,
		menuButton: app.globalData.menuButton,
		showModal: true,
		constellation: ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天秤座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"]
	},

	goBack() {
		wx.navigateBack();
	},

	uploadAvatar() {
		wx.chooseImage({
			count: 1,
			sizeType: "compressed",
			success: res => {
				wx.uploadFile({
					url: 'https://bar.shdong.cn/files/image/upload',
					filePath: res.tempFilePaths[0],
					name: 'image',
					complete: res => {
						let result = JSON.parse(res.data);
						if (res.statusCode == 200) {
							wx.apiRequest("/api/user/upinfo", {
								data: { avatar: "https://bar.shdong.cn" + result.data.path },
								success: res => {
									if (res.data.code == 200) {
										wx.showToast({
											title: result.msg,
											icon: 'success',
											duration: 1200,
											success: _ => setTimeout(() => wx.redirectTo({ url: "my" }), 1200)
										});
									}
								}
							});
						} else {
							wx.showToast({
								title: result.msg,
								icon: 'none',
								duration: 1200
							});
						}
					}
				})

			}
		})
	},

	transformUser() {
		wx.showModal({
			title: "警告！", content: "你的操作不可逆！", cancelColor: "#FB61C6", success: res => {
				if (res.confirm) {
					wx.apiRequest("/api/user/upinfo", {
						data: { worker: 1 },
						success: res => {
							if (res.data.code == 200) {
								wx.showToast({
									title: "转换成功！",
									success: _ => setTimeout(wx.navigateBack, 1200),
									duration: 1200
								});
							}
						}
					});
				}
				if (res.cancel) {
					wx.showToast({ title: "你取消了转换为普通用户！", icon: "none" })
				}
			}
		})
	},

	edit(e) {
		let item = this.data.firstList[e.currentTarget.dataset.index];
		if (item.key == "当前酒吧") {
			return false;
		}
		this.setData({
			showModal: false,
			modalTitle: item.key,
			modalType: item.remarks,
			modalInput: item.value
		});
	},

	hide(e) {
		this.setData({ showModal: true, [e.currentTarget.dataset.type]: '' })
	},

	submit(e) {
		wx.apiRequest("/api/user/upinfo", {
			data: {
				[e.currentTarget.dataset.type]: this.data[e.currentTarget.dataset.type]
			},
			success: res => res.data.code == 200 && wx.redirectTo({ url: "my" })
		});
	},

	saveValue(e) {
		switch (e.currentTarget.dataset.type) {
			case "birthday":
			case "address":
			case "constellation":
				wx.apiRequest("/api/user/upinfo", {
					data: {
						[e.currentTarget.dataset.type]: this.data.constellation[e.detail.value] || e.detail.value.toString()
					},
					success: res => res.data.code == 200 && wx.redirectTo({ url: "my" })
				});
				break;
			default:
				this.setData({ [e.currentTarget.dataset.type]: e.detail.value });
				break;
		}
	},

	onLoad(options) {
		wx.apiRequest("/api/user/getinfo", {
			success: res => {
				if (res.data.code == 200) {
					res = res.data.data;
					this.setData({
						avatar: res.avatar,
						firstList: [
							{ remarks: "bar", key: "当前酒吧", value: res.bar },
							{ remarks: "nickname", key: "昵称", value: res.nickname },
							{ remarks: "seat", key: "当前卡座号", value: res.seat },
							{ remarks: "color", key: "衣服颜色", value: res.color },
							{ remarks: "mobile", key: "联系方式", value: res.mobile },
						],
						secondList: [
							{ remarks: "gender", key: "性别", value: res.sexname },
							{ remarks: "birthday", key: "生日", value: res.birthday, mode: "date" },
							{ remarks: "constellation", key: "星座", value: res.constellation, mode: "selector" },
							{ remarks: "address", key: "地址", value: res.address, mode: "region" }
						],
						isWorker: res.worker
					})
				}
			}
		})
	},

})