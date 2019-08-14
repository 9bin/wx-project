// pages/miaosha/miaosha.js
var api = require("../../api.js"),
  app = getApp();
var interval = 0;

//秒转成时分秒的时间
function secondToTimeStr(second) {
  if (second < 60) {
    var _s = second;
    // return "00:00:" + (_s < 10 ? "0" + _s : _s);
    return {
      h: '00',
      m: '00',
      s: _s < 10 ? "0" + _s : _s
    }
  }
  if (second < 3600) {
    var _m = parseInt(second / 60);
    var _s = second % 60;
    // return "00:" + (_m < 10 ? "0" + _m : _m) + ":" + (_s < 10 ? "0" + _s : _s);
    return {
      h: '00',
      m: _m < 10 ? "0" + _m : _m,
      s: _s < 10 ? "0" + _s : _s
    }
  }
  if (second >= 3600) {
    var _h = parseInt(second / 3600);
    var _m = parseInt((second % 3600) / 60);
    var _s = second % 60;
    // return (_h < 10 ? "0" + _h : _h) + ":" + (_m < 10 ? "0" + _m : _m) + ":" + (_s < 10 ? "0" + _s : _s);
    return {
      h: _h < 10 ? "0" + _h : _h,
      m: _m < 10 ? "0" + _m : _m,
      s: _s < 10 ? "0" + _s : _s
    }
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time_list: null,
    goods_list: null,
    page: 1,
    active_index: 0, //活动初始时间段
    times: "",
    loading_more: false,
    showCode: false,  //预约弹窗
    tip1: '扫描二维码关注公众号',
    tip2: '关注公众号后联系客服',
    code: '/images/delete/weixin300x300x01.jpg', //需删除
    theme: 'theme1', //需删除
    color: "#ff0036" //需删除
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.pageOnLoad(this),
    this.loadData();
  },

  /**
   * 加载数据
   */
  loadData: function() {
    var that = this;
    that.setData({
      page: 1,
      goods_list: [],
    }),
    wx.showLoading({
      title: '加载中...',
      mask: true
    }), app.request({
      url: api.miaosha.list,
      data: { "activeId": that.data.activeId || "", "pageIndex": that.data.page || 1},
      success: function (res) {
        if ("0" == res.state) {
          if (0 == res.data.timeBarDataList.length) return void wx.showModal({
            content: "暂无秒杀活动",
            showCancel: !1,
            confirmText: "返回首页",
            success: function (t) {
              t.confirm && wx.switchTab({
                url: "/pages/home/home"
              });
            }
          });
          that.setData({
            time_list: res.data.timeBarDataList,
            seckillDisparityTime: res.data.seckillDisparityTime,
            goods_list: res.data.productList,
            page: (!res.data.productList || res.data.productList.length == 0) ? -1 : (that.data.page + 1)
          }), that.topBarScrollCenter(), that.setTimeOver();
        }
        "0" != res.state && wx.showModal({
          title: "提示",
          content: res.message,
          success: function () {
            wx.switchTab({
              url: "/pages/index/index"
            });
          },
          showCancel: !1
        });
      },
      complete: function () {
        wx.hideLoading();
      }
    });
  },

  /**
   * 设置倒计时
   */
  setTimeOver: function() {
    var t = this;

    function _init() {
      0 < t.data.seckillDisparityTime ? (t.data.seckillDisparityTime = t.data.seckillDisparityTime - 1,
        t.data.times = secondToTimeStr(t.data.seckillDisparityTime), t.setData({
        seckillDisparityTime: t.data.seckillDisparityTime,
        times: t.data.times
        })) : clearInterval(interval);
    }

    _init();
    clearInterval(interval), interval = setInterval(function() {
      _init();
    }, 1e3);
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
   * 抢购点击事件
   */
  buy: function(e) {
    var id = e.currentTarget.dataset.id, is_book = e.currentTarget.dataset.is_book || 0, that = this;
    is_book == 0 ? wx.showModal({
      title: '抢购前需预约哦！',
      content: '在“即将开始”中进行预约',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#666666',
      confirmText: '去预约',
      confirmColor: that.data.color,
      success: function(res) {
        if (res.confirm) {
          var time_list = that.data.time_list;
          time_list.length>1 ? (that.setData({
            active_index: that.data.active_index + 1,
            activeId: time_list[that.data.active_index + 1].id,
          }), that.loadData()) : that.showToast({ title: "暂无可预约商品" });
        }
      },
    }) : wx.navigateTo({
        url: '/pages/miaosha/detail/detail?id=' + id,
    })

  },

  /**
   * 去预约
   */
  book: function (e) {
    var id = e.currentTarget.dataset.id, is_book = e.currentTarget.dataset.is_book || 0, that = this;
    // console.log(that.data.time_list[that.data.active_index + 1]);
    is_book == 0 ? app.request({
      url: api.miaosha.appointment,
      data: { "activeId": that.data.time_list[that.data.active_index].id, "subProductId": id},
      success: function (res) {
        if(res.state == "0") {that.showToast({
          title: '预约成功，将在开抢十分钟前以短信形式通知您！',
          });
          for (var i in that.data.goods_list) {
            if (that.data.goods_list[i].id == id) that.data.goods_list[i].marketingInfo.seckillInfo.areadySubscribe = 1;
          }
          that.setData({
            goods_list: that.data.goods_list
          })
        }else {
          that.showToast({ title: res.message });
        }
      }
    }) : that.showToast({ title: "您已经预约成功，不需要重复预约哟"});
  },

  /**
   * 产品加载
   */
  loadGoodsList: function (load_more) {
    var page = this;
    page.setData({
      is_loading: true,
    }),
      app.request({
      url: api.miaosha.list,
        data: {
          "activeId": that.data.activeId,
          "pageIndex": that.data.page
        },
        success: function (res) {
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
  preventTouchMove: function () {
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})