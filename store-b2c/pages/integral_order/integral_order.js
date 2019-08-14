// pages/integral_order/integral_order.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    orderStatus: "",
    scrollTop: 0,
    showCancle: false,
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this), this.navStatus();
  },

  loadData: function (options) {
    var a = this;
    if (a.data.is_loading) return;
    if (options.loadmore && !a.data.is_more) return;
    if (options.reload) a.setData({ list: [] });
    a.setData({
      is_loading: true
    }), app.request({
      url: api.order.list,
      data: { "pageIndex": options.page, "orderStatus": a.data.orderStatus || "all" },
      success: function (res) {
        if (res.state == "0") {
          if (options.reload) {
            a.setData({
              list: res.data.list,
              page: options.page,
              is_more: res.data.list.length > 0,
              show_no_data_tip: res.data.list.length == 0
            })
          }
          if (options.loadmore) {
            a.setData({
              list: a.data.list.concat(res.data.list),
              page: options.page,
              is_more: res.data.list.length > 0
            })
          }
        }
      },
      complete: function () {
        a.setData({
          is_loading: false
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