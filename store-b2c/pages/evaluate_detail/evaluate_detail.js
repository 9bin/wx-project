// pages/evaluate_detail/evaluate_detail.js
var app = getApp(), api = require("../../api.js");
var evaluate = {
  "id": 1,
  "nickname": "通***塔",
  "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIicvvYQKjYXI4ZP3rLicFONSTbK70SNpklyB3IUQr6gbEveG0tkIgkZjoUdl904zk6ylSj0E5oQicZQ/132",
  "content": "客服妹子为何不可多看我一眼？客服妹子为何不可多看我一眼？客服妹子为何不可多看我一眼？客服妹子为何不可多看我一眼？",
  "star": 3.5,
  "from": "来自IOS手机版",
  "attr_group": ['深空灰色', "256G"],
  "dianzhan": 228,
  "replay": [
    {
      "id":1,
      "user_id": '1',
      "nickname": "官方回复",
      "avatar_url": "",
      "content": "只因为在人群中多看了你一眼，再也没能够忘记你的容颜，梦想着偶然能有一天再相见，感谢您对我们的支持。",
      "addtime": "2018-06-03 10:00:00"
    },
    {
      "id": 2,
      "user_id": '1',
      "nickname": "黄金时代",
      "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIicvvYQKjYXI4ZP3rLicFONSTbK70SNpklyB3IUQr6gbEveG0tkIgkZjoUdl904zk6ylSj0E5oQicZQ/132",
      "content": "只因为在人群中多看了你一眼，再也没能够忘记你的容颜，梦想着偶然能有一天再相见，感谢您对我们的支持。",
      "addtime": "2018-06-03 10:00:00"
    }
  ],
  "addtime": '2018-06-09',
  "toggleClass": true,
  "pic_list": ["https://wiexin.ym688.cn/web/uploads/image/75/75563ba2b04f54ddfe40203db5171ce00e20775b.jpg", "https://wiexin.ym688.cn/web/uploads/image/75/75563ba2b04f54ddfe40203db5171ce00e20775b.jpg", "https://wiexin.ym688.cn/web/uploads/image/75/75563ba2b04f54ddfe40203db5171ce00e20775b.jpg"]
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluate: evaluate
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
  },

  /**
   * 监听评论提交
   */
  confirm: function (event) {
    console.log(event.detail.value);
  },

  /**
   * 点赞
   */
  toggleClass: function (e) {
    var that = this, id = e.currentTarget.dataset.id, evaluate = that.data.evaluate;
    evaluate.toggleClass = !evaluate.toggleClass;
    that.setData({
      evaluate: that.data.evaluate
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