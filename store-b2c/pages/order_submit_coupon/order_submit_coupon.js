// pages/order_submit_coupon/order_submit_coupon.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        "id": "9",
        "name": "仅可购买酒水饮料中的牛奶饮品部分很舒服康师傅空间撒地方开始大幅拉升",
        "min_price": "50.00",
        "sub_price": "5.00",
        "addtime": "1527988233",
        "is_delete": "0",
        "total_count": "6666",
        "is_join": "2",
        "sort": "100",
        "is_receive": "0",
        "begintime": "2018.06.03",
        "endtime": "2018.06.03"
      },
      {
        "id": "10",
        "name": "仅可购买酒水饮料中的牛奶饮品部分",
        "min_price": "50.00",
        "sub_price": "5.00",
        "addtime": "1527988233",
        "is_delete": "0",
        "total_count": "6666",
        "is_join": "2",
        "sort": "100",
        "is_receive": "0",
        "begintime": "2018.06.03",
        "endtime": "2018.06.03"
      },
      {
        "id": "11",
        "name": "仅可购买酒水饮料中的牛奶饮品部分",
        "min_price": "50.00",
        "sub_price": "5.00",
        "addtime": "1527988233",
        "is_delete": "0",
        "total_count": "6666",
        "is_join": "2",
        "sort": "100",
        "is_receive": "0",
        "begintime": "2018.06.03",
        "endtime": "2018.06.03"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    options.id && this.setData({
      id: options.id
    }), this.loadData({
      page: 1,
      reload: true
    });
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