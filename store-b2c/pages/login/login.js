// pages/login/login.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = {
      frontColor: '#ffffff',
      backgroundColor: '#3d3c3f',
      animation: {
        duration: 1000,
        timingFunc: 'easeInOut'
      },
    };
    wx.setNavigationBarColor(data);
  },

  login: function () {
    wx.login({
      success: function(res) {
        res.errMsg == "login:ok" && app.request({
          url: api.user.login,
          data:{
            "account": res.code,
            "accountType": "10"
          },
          success: function (res) {
            res.state == "0" ? wx.reLaunch({
              url: '/pages/home/home',
            }) : wx.showModal({
              title: '登录失败',
              content: res.message,
              showCancel: !1,
            })
          }
        })
      },
    })
  },
})