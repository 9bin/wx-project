// pages/limit_time_buy/limit_time_buy.js
var api = require("../../api.js"),
  app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time_list: null,
    goods_list: null,
    page: 1,
    is_loading: false,
    active_index: 0, //活动初始时间段
    theme: 'theme1', //需删除
    color: "#ff0036" //需删除
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.pageOnLoad(this);
    this.loadData();
  },

  /**
   * 产品加载
   */
  loadData: function(load_more) {
    var that = this;
    that.setData({
      page: 1,
      goods_list: [],
    }), wx.showLoading({
      title: '加载中...',
      mask: true
    }), app.request({
      url: api.flash.get_flash_sale,
      data: {
        "activeId": that.data.activeId || "",
        "pageIndex": that.data.page || 1
      },
      success: function(res) {
        if ("0" == res.state) {
          if (0 == res.data.timeBarDataList.length) return void wx.showModal({
            content: "暂无抢购活动",
            showCancel: !1,
            confirmText: "返回首页",
            success: function(t) {
              t.confirm && wx.switchTab({
                url: "/pages/home/home"
              });
            }
          });
          that.setData({
            time_list: res.data.timeBarDataList,
            goods_list: res.data.productList,
            page: (!res.data.productList || res.data.productList.length == 0) ? -1 : (that.data.page + 1)
          }), that.topBarScrollCenter();
        }
        "0" != res.state && wx.showModal({
          title: "提示",
          content: res.message,
          success: function(res) {
            res.confirm && wx.switchTab({
              url: "/pages/index/index"
            });
          },
          showCancel: !1
        });
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  },

  /**
   * 顶部滚动条自动滚到当前时间段
   */
  topBarScrollCenter: function() {
    var index = this.data.active_index || 0;
    this.setData({
      top_bar_scroll: (index - 2) * 64,
    });
  },

  /**
   * 顶部秒杀时间段点击
   */
  topBarItemClick: function(e) {
    var value = e.currentTarget.dataset;
    this.setData({
      active_index: value.index,
      activeId: value.id,
      loading_more: false,
      page: 1,
    });
    this.loadData();
  },

  /**
   * 产品加载
   */
  loadGoodsList: function(load_more) {
    var page = this;
    page.setData({
        is_loading: true,
      }),
      app.request({
        url: api.flash.get_flash_sale,
        data: {
          "activeId": that.data.activeId,
          "pageIndex": that.data.page
        },
        success: function(res) {
          if (res.state == "0") {
            page.setData({
              loading_more: false,
              goods_list: page.data.goods_list.concat(res.data.productList),
              page: (!res.data.productList || res.data.productList.length == 0) ? -1 : (page.data.page + 1),
            });
          }
        }
      });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    -1 != this.data.page && this.loadGoodsList();
  },


  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})