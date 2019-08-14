// pages/user/user.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_center_bg: "/images/bannerx01.jpg",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
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
    app.pageOnShow(this);
    this.getUserInfo();
  },

  /**
   * to getUserInfo
   */
  getUserInfo: function () {
    var i = this;
    app.request({
      url: api.user.index,
      success: function (res) {
        if(res.state == "0") {i.setData({ user_info: res.data }), wx.setStorageSync("user_info", res.data)}
        else {wx.showModal({
          title: '请重新登录',
          content: '用户信息获取失败',
          showCancel: !1,
          success: function(res) {
            res.confirm && wx.reLaunch({
              url: '/pages/login/login',
            })
          },
        })}
      }
    })
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