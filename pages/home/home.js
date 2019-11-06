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
				console.log(this.data.userInfo)
				break;
			default:
				// console.log("大厅")
				break;
		}
		this.setData({ tabIndex: e.currentTarget.dataset.index, showDropDownMenu: false });
	},

	agree(e) {
		this.apiRequest("agree", { uid: e.currentTarget.dataset.uid })
	},

	dropDown(e) {
		switch (e.currentTarget.dataset.index) {
			case 0:
				this.apiRequest("getbar")
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
		this.setData({ keyboardHeight: e.type == "focus" ? e.detail.height : 0 });
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
			roomtype: this.data.tabIndex
		})
	},

	switchItem(e) {
		let [item, type] = [this.data.dropDownMenu.list[e.currentTarget.dataset.index], this.data.dropDownMenu.type];
		this.setData({ showDropDownMenu: false });
		switch (type) {
			case 'groupList':
				this.apiRequest("joinRoom", { uid: item.uid });
				break;
			case 'chatList':
				this.apiRequest("joinRoom", { uid: item.uid });
				break;
			default:
				this.switchHall(item)
				// this.apiRequest("upinfo", { bid: item.bid });
				break;
		}
	},

	switchHall(params, url = String()) {
		switch (Number(params.page)) {
			case 1: case 2:
				url = `../basicInfo/basicInfo?showMain=${params.page}&name=${params.name}&bid=${params.bid}`;
				break;
			default:
				url = `../home/home`
				break;
		}
		wx.navigateTo({ url })
	},

	scanCode() {
		wx.scanCode({
			success: resCode => {
				wx.apiRequest("/api/login/getbar", {
					success: res => {
						if (res.data.code == 200) {
							this.switchHall(JSON.parse(resCode.result));
							// for (let index = 0; index < res.data.data.bar.length; index++) {
							// 	if (res.data.data.bar[index].bid == JSON.parse(resCode.result).bid) {
							// 		this.apiRequest("upinfo", { bid: res.data.data.bar[index].bid });
							// 		break;
							// 	} else if (res.data.data.bar.length - 1 == index) {
							// 		wx.showToast({
							// 			icon: "none",
							// 			title: '找不到对应的酒吧',
							// 			duration: 2000
							// 		})
							// 	}
							// }
						}
					}
				});
			}
		})
	},

	apiRequest(type, data) {
		switch (type) {
			case "getGroupMember":
				wx.apiRequest("/api/room/getGroupMember", {
					data: { rid: this.data.targetInfo.rid },
					success: res => res.data.code == 200 && this.setData({ groupMember: res.data.data })
				})
				break;
			case "giveGift":
				wx.apiRequest("/api/pay/gift", {
					data,
					success: res => {
						if (res.data.code == 200) {
							if (res.data.data.ptype == 2) {
								wx.showToast({
									title: '支付成功！',
									success: _ => {
										this.hide();
										this.data.hallInfo.money = res.data.data.money;
										this.data.targetInfo.hasgift = true;
										this.setData({ hallInfo: this.data.hallInfo, targetInfo: this.data.targetInfo });
									},
									duration: 1200
								})
							} else {
								wx.requestPayment({
									timeStamp: res.data.data.timeStamp.toString(),
									nonceStr: res.data.data.nonceStr,
									package: res.data.data.package,
									signType: res.data.data.signType,
									paySign: res.data.data.paySign,
									success: _ => {
										wx.apiRequest("/api/pay/selectOrder", {
											data: { orderId: res.data.data.orderId },
											success: res => {
												wx.showToast({
													title: res.data.msg,
													success: _ => {
														this.hide();
														this.data.targetInfo.hasgift = true;
														this.setData({ targetInfo: this.data.targetInfo });
													},
													duration: 1200
												})
											}
										});
									},
									fail: _ => wx.showToast({ title: "支付失败！", icon: "none", duration: 1200 })
								})
							}

						} else {
							wx.showToast({
								title: res.data.msg,
								icon: "none",
								duration: 1200
							})
						}
					},
				})
				break;
			case 'getGroupLists':
				wx.apiRequest("/api/home/getGroupLists", {
					success: res => res.data.code == 200 && this.setData({ dropDownMenu: { list: res.data.data, type: "groupList" } })
				});
				break;
			case 'getChatLists':
				wx.apiRequest("/api/home/getChatLists", {
					success: res => res.data.code == 200 && this.setData({ dropDownMenu: { list: res.data.data, type: "chatList" } })
				});
				break;
			case 'giftList':
				wx.apiRequest("/api/room/gift", {
					success: res => res.data.code == 200 && this.setData({ giftList: res.data.data })
				});
				break;
			case 'joinRoom':
				wx.apiRequest("/api/room/join", {
					data,
					success: res => {
						if (res.data.code == 200) {
							this.data.tabIndex = res.data.data.roomtype == 2 ? 2 : 1;
							this.data.topBar[this.data.tabIndex] = res.data.data.nickname.length >= 4 ? res.data.data.nickname.substr(0, 4) + '...' : res.data.data.nickname;
							this.setData({
								tabIndex: this.data.tabIndex,
								[res.data.data.roomtype == 2 ? 'userInfo' : 'targetInfo']: res.data.data,
								topBar: this.data.topBar,
								scrollTop: res.data.data.history.length * 1000
							});
						} else {
							wx.showToast({ title: res.data.msg, icon: "none" })
						}
					}
				});
				break;
			case "getbar":
				wx.getLocation({
					altitude: false,
					success: res => {
						wx.apiRequest("/api/login/getbar", {
							data: {
								longitude: res.longitude,
								latitude: res.latitude,
							},
							success: res => res.data.code == 200 && this.setData({
								dropDownMenu: { list: res.data.data.bar, type: "bar" }
							})
						});
					}
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

	onLoad(options) {
		wx.onSocketMessage(res => {
			res = JSON.parse(res.data);
			switch (res.type) {
				case "friend":
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
					this.setData({
						[res.type == "group" ? "targetInfo" : "userInfo"]: accountInfo,
						scrollTop: accountInfo.history ? accountInfo.history.length * 1000 : 0
					});
					break;
				case "agree":
					console.log(res);
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

		let timer = setInterval(() => {
			wx.getLocation({
				altitude: false,
				success: res => {
					let longitude_start = wx.getStorageSync("longitude_start"),
						latitude_end = wx.getStorageSync("latitude_end"),
						latitude_start = wx.getStorageSync("latitude_start"),
						longitude_end = wx.getStorageSync("longitude_end");
					if (res.longitude >= longitude_end || res.longitude <= longitude_start || res.latitude >= latitude_end || res.latitude <= latitude_start) {
						clearInterval(timer);
						wx.reLaunch({ url: '/pages/index/index' })
					}
				}
			});
		}, 600000);
	}
})