// pages/order_refund/order_refund.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    status: 0,  //服务状态 0——售后申请，1——申请记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this), this.loadData({
      page: 0,
      reload: true
    });
  },

  loadData: function (options) {
    var a = this;
    if (a.data.is_loading) return;
    if (options.loadmore && !a.data.is_more) return;
    if (options.reload) a.setData({ list: [] });
    a.setData({
      is_loading: true
    }), app.request({
      url: a.data.status == 0 ? api.order.refund : api.order.refund_record,
      data: {"pageIndex": options.page},
      success: function (res) {
        if (res.state == "0") {
          if (options.reload) {
            a.setData({
              list: res.data.data,
              page: options.page,
              is_more: res.data.data.length>0,
              show_no_data_tip: res.data.data.length == 0
            })
          }
          if (options.loadmore) {
            a.setData({
              list: a.data.list.concat(res.data.data),
              page: options.page,
              is_more: res.data.data.length>0
            })
          }
        }
      },
      complete: function (res) {a.setData({is_loading: false})}
    })
  },

  /**
   * 商品详情跳转
   */
  navGoodsDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + id,
    })
  },

  /**
   * 商品详情跳转
   */
  navGiftDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/marketing/goods/goods?id=' + id,
    })
  },

  /**
   * 导航切换
   */
  tapTab: function (e) {
    var status = e.currentTarget.dataset.status;
    this.setData({
      status: status,
      scrollTop: 0
    }), this.loadData({
      page: 0,
      reload: true,
    });
  },

  /**
   * 确认收货
   */
  sureReseiving: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var page = this;
    var list = this.data.list;
    wx.showLoading({ mask: true }), app.request({
      url: api.order.sure_reseiving,
      data: { "id": id },
      success: function (res) {
        if (res.state == '0') {
          list[index].status = 8, page.setData({
            list: list
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
  sureCollection: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var page = this;
    var list = this.data.list;
    wx.showLoading({ mask: true }), app.request({
      url: api.order.sure_collection,
      data: { "id": id },
      success: function (res) {
        if (res.state == '0') {
          list[index].status = 8, page.setData({
            list: list
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
  cancle: function (e) {
    var page = this;
    wx.showModal({
      title: '确定要取消售后申请？',
      showCancel: true,
      confirmColor: '#eb0c36',
      success: function(res) {
        if(res.confirm) {
          var id = e.currentTarget.dataset.id;
          var index = e.currentTarget.dataset.index;
          var list = page.data.list;
          wx.showLoading({ mask: true }), app.request({
            url: api.order.calcle_refund,
            data: { "id": id },
            success: function (res) {
              if (res.state == '0') {
                list[index].status = 0, page.setData({
                  list: list
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

  tolower: function () {
    var a = this;
    console.log("loadmore");
    a.loadData({
      page: a.data.page + 1,
      loadmore: true
    })
  }
})