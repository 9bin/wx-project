// pages/order_refund_detail/order_refund_detail.js
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
      id: options.id
    }), this.loadData());
  },

  loadData: function () {
    var a = this;
    wx.showLoading({
      mask: true,
    }), app.request({
      url: api.order.refund_detail,
      data: { "returnProId": a.data.id},
      success: function (res) {
        res.state == "0" && a.setData(res.data);
      },
      complete: function () {wx.hideLoading()}
    })
  },

  /**
   * 确认收货
   */
  sureReseiving: function () {
    var page = this;
    wx.showLoading({ mask: true }), app.request({
      url: api.order.sure_reseiving,
      data: { "id": page.data.id },
      success: function (res) {
        if (res.state == '0') {
          page.data.status = 8, page.setData({
            status: status
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel: !1
          })
        }
      },
      complete: function () { wx.hideLoading() }
    })
  },

  /**
   * 确认收款
   */
  sureCollection: function () {
    var page = this;
    wx.showLoading({ mask: true }), app.request({
      url: api.order.sure_collection,
      data: { "id": page.data.id },
      success: function (res) {
        if (res.state == '0') {
          page.data.status = 8, page.setData({
            status: status
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel: !1
          })
        }
      },
      complete: function () { wx.hideLoading() }
    })
  },

  /**
   * 取消申请
   */
  cancle: function () {
    var page = this;
    wx.showModal({
      title: '确定要取消售后申请？',
      showCancel: true,
      confirmColor: '#eb0c36',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({ mask: true }), app.request({
            url: api.order.calcle_refund,
            data: { "id": page.data.id },
            success: function (res) {
              if (res.state == '0') {
                page.data.status = 0, page.setData({
                  status: status
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.message,
                  showCancel: !1
                })
              }
            },
            complete: function () { wx.hideLoading() }
          })
        }
      },
    })
  },

  onGoodsImageClick: function (t) {
    var o = t.currentTarget.dataset.index, page = this, a = page.data.proofPicUrl, c = [];
    for(var i in a) {
      var p = page.data.full_path + a[i]; 
      c.push(p);
    }
    wx.previewImage({
      urls: c,
      current: c[0]
    });
  },
})