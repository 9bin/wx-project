// pages/logistics/logistics.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    options.id && (this.setData({
      id: options.id,
      logisticType: options.logsType
    }), this.loadData());
  },

  loadData: function () {
    var a = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    }), app.request({
      url: api.default.get_logistics_foot,
      data: { "id": a.data.id, "type": a.data.logisticType},
      success: function (res) {
        wx.hideLoading(), res.state == "0" && res.data.length>0 && a.setData(res.data), res.state != "0" && wx.showModal({
          title: '提示',
          content: res.message,
          showCancel: !1,
          success: function(res) {
            res.confirm && wx.navigateBack({
              delta: 1,
            });
          },
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})