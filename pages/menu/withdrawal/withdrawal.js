// pages/withdrawal/withdrawal.js
const app = getApp();

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    menuButton: app.globalData.menuButton,
    record: [
      { time: "2019-09-24  14:22", money: "150.00" },
      { time: "2019-09-24  14:22", money: "150.00" },
      { time: "2019-09-24  14:22", money: "150.00" },
      { time: "2019-09-24  14:22", money: "150.00" },
      { time: "2019-09-24  14:22", money: "150.00" },
      { time: "2019-09-24  14:22", money: "150.00" },
      { time: "2019-09-24  14:22", money: "150.00" },
      { time: "2019-09-24  14:22", money: "150.00" },
      { time: "2019-09-24  14:22", money: "150.00" },
    ]
  },

  goBack() {
    wx.navigateBack();
  },

  onLoad: function (options) {

  },

})