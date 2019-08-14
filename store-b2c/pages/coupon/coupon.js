// pages/coupon/coupon.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon_list: [],
    status: 0,
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this), this.loadData({
      page: 1,
      reload: true
    });
  },

  loadData: function (options) {
    var a = this;
    if(a.data.is_loading) return;
    if(options.loadmore&&!a.data.is_more) return;
    if(options.reload) a.setData({list: []});
    a.setData({ is_loading: true}), app.request({
      url: api.coupon.my_coupon,
      data: { "pageIndex": options.page, "useState": a.data.status || "0"},
      success: function (res) {
        if(res.state == "0") {
          if(options.reload) {
            a.setData({
              coupon_list: res.data.couponList,
              page: options.page,
              is_more: res.data.couponList.length>0,
              show_no_data_tip: !res.data.couponList || res.data.couponList.length == 0
            })
          }
          if(options.loadmore) {
            a.setData({
              list: a.data.coupon_list.concat(res.data.couponList),
              page: options.page,
              is_more: res.data.couponList.length > 0,
            })
          }
        }else {
          a.setData({
            show_no_data_tip: !0,
          }), wx.showModal({
            title: '提示',
            content: res.message,
            showCancel: !1,
            success: function(t) {
              t.confirm && wx.navigateBack({
                delta: 1,
              });
            },
          })
        }
      },
      complete: function () {a.setData({is_loading: false})}
    })
  },

  /**
   * 导航切换
   */
  tapTab: function (e) {
    var status = e.currentTarget.dataset.status;
    this.setData({
      status: status,
      scrollTop: 0,
    }), this.loadData({
      page: 1,
      reload: true
    });
  },

  use: function () {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },

  tolower: function () {
    var a = this;
    console.log("loadmore");
    a.loadData({
      page: a.data.page + 1,
      loadmore: true
    })
  },
})