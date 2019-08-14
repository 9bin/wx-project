// pages/order_refund_logistics/logistics_company/logistics_company.js
var app = getApp(),
  api = require("../../../api.js"),
  wxSortPickerView = require('../../../wxSortPickerView/wxSortPickerView.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var page = this,
      logisticsCompanys = [];
    app.request({
      url: api.default.get_logistics_company,
      success: function(res) {
        if (res.state == "0" && res.data && res.data.length > 0) {
          for (var index in res.data) {
            logisticsCompanys.push(res.data[index].logisticsName);
          }
          wxSortPickerView.init(logisticsCompanys, page), page.setData({ list: res.data});
        }
      }
    })
  },

  //处理接受点击返回的文字
  wxSortPickerViewItemTap: function(e) {
    var that = this,
      wxCurrPage = getCurrentPages(),
      wxPrevPage = wxCurrPage[wxCurrPage.length - 2],
      name = e.currentTarget.dataset.text,
      list = that.data.list,
      code = "";
      for(var i in list) {
        if (list[i].logisticsName == name) {
          code = list[i].logisticsCode;
        }
      }
    wxPrevPage.setData({
      logisticsCompanyLogogram: code,
      logisticsCompany: name
    }), wx.navigateBack({
      delta: 1,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})