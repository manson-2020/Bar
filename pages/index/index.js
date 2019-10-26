// pages/index/index.js
const app = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		showDropDownMenu: false,

		statusBarHeight: app.globalData.statusBarHeight,
		menuButton: app.globalData.menuButton,
		tabIndex: 0,
		hasUnderline: false,
		bottomBarHeight: 0,
		topBar: ["熹客酒吧", "群聊房间", "私聊房间"],
		option: [
			{ name: "gift", text: "礼 物" },
			{ name: "withdrawal", text: "提 现" },
			{ name: "query", text: "查 询" },
			{ name: "my", text: "我 的" },
			{ name: "service", text: "客 服" }
		],
		userList: [
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色", isTribe: true },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色", isTribe: true },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色", isTribe: true },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色", isTribe: true },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色", isTribe: true },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色", isTribe: true },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色", isTribe: true },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色", isTribe: true },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色", isTribe: true },
			{ avatar: "../../images/avatar.png", nickname: "张晓梅", room: "A61", clothes: "红色" },
		],
		dropDownMenu: [],
	},

	switchTab(e) {
		this.setData({ tabIndex: e.currentTarget.dataset.index, showDropDownMenu: false });
	},

	dropDown(e) {
		switch (e.currentTarget.dataset.index) {
			case 0:
				wx.getLocation({
					altitude: false,
					success(res) {
						wx.request({
							url: app.globalData.requestUrl + '/api/login/getbar',
							method: "post",
							data: {
								longitude: res.longitude,
								latitude: res.latitude,
							},
							success(res) {
								console.log(res);
							},
							fail(err) {
								console.log(err);
							}
						})
						console.log(res);
					}
				});

				this.setData({ dropDownMenu: ['爱丽丝仙境大厅（距离：54m）', '爱丽丝仙境大厅（距离：54m）'] });
				break;
			case 1:
				this.setData({ dropDownMenu: ['Group Chat 1', 'Group Chat 2'] });
				break;
			case 2:
				this.setData({ dropDownMenu: ['Single Chat 1', 'Single Chat 2'] });
				break;
		}
		this.setData({ showDropDownMenu: !this.data.showDropDownMenu });
	},

	scanCode() {
		wx.scanCode({
			success: res => {
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
			},
			complete: (res) => {
			}
		})
	},

	goto(e) {
		wx.navigateTo({
			url: `../menu/${e.currentTarget.dataset.target}/${e.currentTarget.dataset.target}`
		})
	},

	onLoad() {
		wx.getSystemInfo({
			success: res => {
				if (!res.model.search(/iPhone X|iPhone 11/)) {
					this.setData({ hasUnderline: true });
				}
			}
		});

		const query = wx.createSelectorQuery()
		query.select('#bottomBar').boundingClientRect();
		query.exec(res => res[0] && this.setData({ bottomBarHeight: res[0].height }))

	},
})