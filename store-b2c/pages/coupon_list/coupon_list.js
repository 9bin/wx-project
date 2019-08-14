// pages/coupon_list/coupon_list.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: null,
    couponType: "0",
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
    var that = this;
    if (that.data.is_loading) return;
    if (options.loadmore && !that.data.is_more) return;
    that.setData({
      is_loading: true
    }),
    app.request({
      url: api.coupon.get_coupon_list,
      data: { "pageIndex": options.page, "type": that.data.couponType || "0"},
      success: function (res) {
        if(res.state == "0") {
          if(options.reload) {
            that.setData({
              list: res.data.couponList,
              page: options.page,
              is_more: res.data.couponList >0,
              show_no_data_tip: res.data.couponList.length == 0
            })
          }
          if (options.loadmore) {
            that.setData({
              list: that.data.list.concat(res.data.couponList),
              page: options.page,
              is_more: res.data.couponList > 0,
            })
          }

        } 
      },
      complete: function (res) {
        that.setData({
          is_loading: false
        })
      }
    })
  },

  checkTag: function (e) {
    var couponType = e.currentTarget.dataset.couponType;
    this.setData({
      couponType: couponType,
      top_bar_scroll: 0
    }), this.loadData({
      page: 1,
      reload: true
    });
  },

  /**
   * 使用优惠券
   */
  toUse: function () {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },
  
  /**
   * 领取优惠券
   */
  receive: function (e) {
    var id = e.currentTarget.dataset.id, page = this, list = page.data.list;
    app.request({
      url: api.coupon.receive,
      data: { "batchId": id },
      success: function (res) {
        if (res.state == "0") {
          for (var i in list) {
            if (list[i].id == id) {
              list[i].isUse = '1';
              break;
            }
          }
          page.setData({
            list: list
          })
        } else {
          page.showToast({
            title: res.message
          })
        }
      }
    })
  },

  onShow: function () {
    app.pageOnShow(this);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  tolower: function () {
    var that = this;
    that.loadData({
      page: that.data.page + 1,
      loadmore: true,
    });
  },
})