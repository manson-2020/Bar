// pages/index/index.js


const app = getApp();

Page({

	data: {
		showDropDownMenu: false,
		statusBarHeight: app.globalData.statusBarHeight,
		menuButton: app.globalData.menuButton,
		headerBarHeight: 240,
		tabIndex: 0,
		scrollTop: 0,
		hasUnderline: false,
		bottomBarHeight: 0,
		topBar: ["酒吧", "我的房间", "我的私聊"],
		option: [
			{ name: "gift", text: "礼 物" },
			{ name: "withdrawal", text: "提 现" },
			{ name: "query", text: "查 询" },
			{ name: "my", text: "我 的" },
			{ name: "service", text: "客 服" }
		],
		userList: [],
		dropDownMenu: { list: [], type: '' },
		hallInfo: {},
		giftList: [],
		userInfo: {},
		targetInfo: {},
		applyList: [],
		noticeList: [],
		isMarker: false
	},

	saveInput(e) {
		this.setData({ [e.currentTarget.dataset.type]: e.detail.value });
	},

	switchTab(e) {
		switch (e.currentTarget.dataset.index) {
			case 1:
				if (!Object.keys(this.data.targetInfo).length) {
					this.apiRequest("joinRoom", { uid: this.data.hallInfo.uid })
				}
				break;
			case 2:
				// console.log("私聊")
				break;
			default:
				// console.log("大厅")
				break;
		}
		this.setData({ tabIndex: e.currentTarget.dataset.index, showDropDownMenu: false });
	},

	switchHall(e) {
		let [bar, type] = [this.data.dropDownMenu.list[e.currentTarget.dataset.index], this.data.dropDownMenu.type];
		this.setData({ showDropDownMenu: false });
		switch (type) {
			case 'groupList':
				// console.log(bar);
				this.apiRequest("joinRoom", { uid: bar.uid });
				break;
			case 'chatList':
				// console.log(bar)
				this.apiRequest("joinRoom", { uid: bar.uid });
				break;
			default:
				this.apiRequest("upinfo", { bid: bar.bid });
				break;
		}

	},

	agree(e) {
		this.apiRequest("agree", { uid: e.currentTarget.dataset.uid })
	},

	dropDown(e) {
		switch (e.currentTarget.dataset.index) {
			case 0:
				wx.getLocation({
					altitude: false,
					success: res => this.apiRequest("getbar", {
						longitude: res.longitude,
						latitude: res.latitude,
					})
				});
				break;
			case 1:
				this.apiRequest("getGroupLists");
				break;
			case 2:
				this.apiRequest("getChatLists");
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
		if (e.currentTarget.dataset.target == "gift") {
			this.apiRequest("giftList");
			this.show({ currentTarget: { dataset: { type: 'showGift' } } });
		} else {
			wx.navigateTo({
				url: `../menu/${e.currentTarget.dataset.target}/${e.currentTarget.dataset.target}`
			});
		}
	},

	show(e) {
		if (e.currentTarget.dataset.type == "showNotice") {
			this.apiRequest("getmsg");
			this.setData({ isMarker: false })
		} else if (e.currentTarget.dataset.type == "showPay") {
			if (!this.data.tabIndex) {
				wx.showToast({ icon: 'none', title: '进入房间后才能赠送礼物~' });
				return
			} else {
				this.setData({ currentGoods: this.data.giftList[e.currentTarget.dataset.index] })
				this.hide();
			}
		} else if (e.currentTarget.dataset.type == "showGroupMember") {
			this.apiRequest("getGroupMember");
		}
		this.setData({ showLayer: true, [e.currentTarget.dataset.type]: true })
	},

	hide() {
		this.setData({
			showLayer: false,
			showGift: false,
			showQrcode: false,
			showNotice: false,
			showAlert: false,
			showPay: false,
			showGroupMember: false,
		})
	},

	joinRoom(e) {
		this.apiRequest('joinRoom', { uid: e.currentTarget.dataset.uid });
	},

	sendMsg(e) {
		if (!this.data.targetInfo.hasgift && this.data.targetInfo.roomtype == 1) {
			console.log(this.data.targetInfo)
			wx.showToast({ title: "送过礼物才能发送哦！", icon: 'none' });
			return;
		}

		if (this.data[e.currentTarget.dataset.type]) {
			let accountInfo = this.data[e.currentTarget.dataset.type == "group" ? "targetInfo" : "userInfo"];
			wx.sendSocketMessage({
				data: JSON.stringify({
					from: this.data.hallInfo.uid,
					to: accountInfo.uid,
					rid: accountInfo.rid,
					type: e.currentTarget.dataset.type,
					msg: this.data[e.currentTarget.dataset.type]
				}),
				success: res => this.setData({ [e.currentTarget.dataset.type]: '' })
			});
		}
	},

	keyboard(e) {
		this.setData({ keyboardHeight: e.detail.height });
	},

	confirm() {
		this.apiRequest("apply");
	},

	stopTouchMove: _ => false,

	pay(e) {
		this.apiRequest("giveGift", {
			ptype: Number(e.currentTarget.dataset.type),
			rid: this.data[(this.data.tabIndex == 1 ? 'target' : 'user') + 'Info'].rid,
			gid: this.data.currentGoods.gid,
		})
	},

	apiRequest(type, data = {}) {
		switch (type) {
			case "getGroupMember":
				wx.apiRequest("/api/room/getGroupMember", {
					data: { rid: this.data.targetInfo.rid },
					success: res => {
						console.log(res.data.data)
						res.data.code == 200 && this.setData({ groupMember: res.data.data })
					}
				})
				break;
			case "giveGift":
				wx.apiRequest("/api/pay/gift", {
					data, success: res => {
						if (res.data.code == 200) {
							wx.showToast({
								title: '支付成功！',
								success: _ => {
									this.hide();
									this.data.hallInfo.money = res.data.data.money;
									this.setData({ hallInfo: this.data.hallInfo });
								},
								duration: 1200
							})
						}
					},
				})
				break;
			case 'getGroupLists':
				wx.apiRequest("/api/home/getGroupLists", {
					data,
					success: res => res.data.code == 200 && this.setData({ dropDownMenu: { list: res.data.data, type: "groupList" } })
				});
				break;
			case 'getChatLists':
				wx.apiRequest("/api/home/getChatLists", {
					data,
					success: res => res.data.code == 200 && this.setData({ dropDownMenu: { list: res.data.data, type: "chatList" } })
				});
				break;
			case 'giftList':
				wx.apiRequest("/api/room/gift", {
					data,
					success: res => res.data.code == 200 && this.setData({ giftList: res.data.data })
				});
				break;
			case 'joinRoom':
				wx.apiRequest("/api/room/join", {
					data,
					success: res => {
						this.data.tabIndex = res.data.data.roomtype == 2 ? 2 : 1;
						this.data.topBar[res.data.data.roomtype] = res.data.data.nickname.length >= 4 ? res.data.data.nickname.substr(0, 4) + '...' : res.data.data.nickname;
						this.setData({
							tabIndex: this.data.tabIndex,
							[res.data.data.roomtype == 2 ? 'userInfo' : 'targetInfo']: res.data.data,
							topBar: this.data.topBar,
							scrollTop: res.data.data.history.length * 1000
						});
					}
				});
				break;
			case "getbar":
				wx.apiRequest("/api/login/getbar", {
					data,
					success: res => res.data.code == 200 && this.setData({ dropDownMenu: { list: res.data.data.bar, type: "bar" } })
				});
				break;

			case "apply":
				wx.apiRequest("/api/room/friend", {
					data: {
						uid: this.data.targetInfo.uid,
						rid: this.data.targetInfo.rid
					},
					success: res => {
						wx.showToast({
							title: res.data.msg,
							duration: 2000,
							icon: res.data.code == 200 ? "success" : "none",
							success: this.hide
						});
					}
				})
				break;
			case 'getmsg':
				wx.apiRequest("/api/user/getmsg", {
					data,
					success: res => {
						this.setData({ applyList: res.data.data });
					}
				})
				break;
			case 'upinfo':
				wx.apiRequest("/api/login/upinfo", {
					data,
					success: res => this.apiRequest(),
				})
				break;
			case 'agree':
				wx.apiRequest("/api/room/agree", {
					data,
					success: res => wx.showToast({ title: res.data.msg, icon: 'none', duration: 1200, success: this.hide }),
				})
				break;
			default:
				wx.apiRequest("/api/home/getMember", {
					data,
					success: res => {
						if (res.data.code == 200) {
							res = res.data.data;
							wx.setStorageSync("longitude_start", res.longitude_start);
							wx.setStorageSync("latitude_end", res.latitude_end);
							wx.setStorageSync("latitude_start", res.latitude_start);
							wx.setStorageSync("longitude_end", res.longitude_end);

							wx.sendSocketMessage({
								data: JSON.stringify({
									from: res.uid,
									to: 0,
									rid: 0,
									type: "login",
									msg: 0,
									avatar: res.avatar,
									nickname: res.nickname
								})
							});
							this.data.topBar[0] = res.name;
							this.setData({ hallInfo: res, topBar: this.data.topBar });
						}
					}
				});
				break;
		}
	},

	onReachBottom() {
		console.log("加载更多...")
	},

	onShow() {
		setInterval(() => {
			wx.getLocation({
				altitude: false,
				success: res => {
					let longitude_start = wx.getStorageSync("longitude_start"),
						latitude_end = wx.getStorageSync("latitude_end"),
						latitude_start = wx.getStorageSync("latitude_start"),
						longitude_end = wx.getStorageSync("longitude_end");

					// console.log(res.longitude * 1000000 >= longitude_end * 1000000 || res.longitude * 1000000 <= longitude_start * 1000000 ||
					// 	res.latitude * 1000000 >= latitude_end * 1000000 || res.latitude * 1000000 <= latitude_start * 1000000)

					if (res.longitude >= longitude_end || res.longitude <= longitude_start || res.latitude >= latitude_end || res.latitude <= latitude_start) {
						wx.redirectTo({ url: '../index/index' })
					}
				}
			});
		}, (1000 * 60 * 10));


	},

	onLoad(options) {
		wx.onSocketMessage(res => {
			console.log('收到服务器内容：', JSON.parse(res.data));
			res = JSON.parse(res.data);
			switch (res.type) {
				case "service":
					this.setData({ isMarker: true });
					break;
				case "notify":
					this.data.noticeList.push(res);
					this.setData({ noticeList: this.data.noticeList })
					break;
				case "group":
				case "chat":
					let accountInfo = res.type == "group" ? this.data.targetInfo : this.data.userInfo;
					accountInfo.history && accountInfo.history.push(res);
					console.log(accountInfo)
					this.setData({
						[res.type == "group" ? "targetInfo" : "userInfo"]: accountInfo,
						scrollTop: accountInfo.history ? accountInfo.history.length * 1000 : 0
					});
					break;
			}
		});

		wx.getSystemInfo({
			success: res => {
				if (!res.model.search(/iPhone X|iPhone 11/)) {
					this.setData({ hasUnderline: true });
				}
			}
		});

		const query = wx.createSelectorQuery()
		query.select('#bottomBar').boundingClientRect();
		query.select('#headerBar').boundingClientRect();
		query.exec(res => this.setData({
			bottomBarHeight: res[0].height,
			headerBarHeight: res[1].height
		}));

		this.apiRequest();
	}
})