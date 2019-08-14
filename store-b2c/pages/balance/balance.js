// pages/balance/balance.js
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.pageOnShow(this);
    var a = this;
    app.request({
      url: api.user.capital,
      success: function (res) {
        res.state == "0" && a.setData({
          capital: res.data.capital
        })
      }
    });
  },
  
})