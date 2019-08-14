// pages/order/order.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    orderStatus: "",
    scrollTop: 0,
    showCancle: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this), options.status && (this.setData({ status: options.status }), this.navStatus());
  },

  loadData: function (options) {
    var a = this;
    if (a.data.is_loading) return;
    if (options.loadmore && !a.data.is_more) return;
    if (options.reload) a.setData({ list: [] });
    a.setData({
      is_loading: true
    }), app.request({
      url: api.order.list,
      data: { "pageIndex": options.page, "orderStatus": a.data.orderStatus || "all"},
      success: function (res) {
        if(res.state == "0") {
          if(options.reload) {
            a.setData({
              list: res.data.list,
              page: options.page,
              is_more: res.data.list.length > 0,
              show_no_data_tip: res.data.list.length == 0
            })
          }
          if (options.loadmore) {
            a.setData({
              list: a.data.list.concat(res.data.list),
              page: options.page,
              is_more: res.data.list.length > 0
            })
          }
        }
      },
      complete: function () {
        a.setData({
          is_loading: false
        })}

    })
  },

  /**
   * 显示取消弹窗
   */
  showReason: function (e) {
    this.setData({
      showCancle: true,
      cancleOrderId: e.currentTarget.dataset.id || ""
    })
  },
  cancleReason: function (e) {
    this.setData({
      showCancle: false,
    })
  },

  /**
   * 取消订单
   */
  cancle: function (e) {
    this.setData({
      showCancle: false,
    });
    var a = this,
      reason = e.currentTarget.dataset.reason
    app.request({
      url: api.order.cancle_order,
      data: {
        "orderId": a.data.cancleOrderId,
        "cancelReason": reason
      },
      success: function (res) {
        res.state == "0" ? a.loadData({
          page: 0,
          reload: true,
          scrollTop: 0
        }) : wx.showModal({
          title: '取消失败',
          content: res.message,
          showCancel: !1,
        })
      }
    })
  },

  /**
   * 确认收货
   */
  confirmReceipt: function (e) {
    var a = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    id && app.request({
      url: api.user.confirm_receipt,
      data: {"id": id},
      success: function (res) {
        if(res.state == "0") {
          a.data.list[index].orderStatus = 8,
          a.data.list[index].orderStatusTitle = "已完成",
          a.setData({list: a.data.list});
        }
      }
    })
  },

  /**
   * 商品详情跳转
   */
  navGoodsDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var goodsType = e.currentTarget.dataset.goodsType;
    switch (goodsType) {
      case "2":
        wx.navigateTo({
          url: '/pages/limit_time_buy/detail/detail?id=' + id,
        });
        break;
      case "3":
        wx.navigateTo({
          url: '/pages/miaosha/detail/detail?id=' + id,
        });
        break;
      case "4":
        wx.navigateTo({
          url: '/pages/fixed_price/detail/detail?id=' + id,
        });
        break;
      case "5":
        wx.navigateTo({
          url: '/pages/yushou/detail/detail?id=' + id,
        });
        break;
      case "6":
        wx.navigateTo({
          url: '/pages/integral_mall/detail/detail?id=' + id,
        });
        break;
      case "7":
        wx.navigateTo({
          url: '/pages/marketing/goods/goods?id=' + id,
        });
        break;
      default: 
        wx.navigateTo({
          url: '/pages/goods/goods?id=' + id,
        })
    }
  },

  /**
   * 导航切换
   */
  tapTab: function (e) {
    var status = e.currentTarget.dataset.status;
    this.setData({
      status: status,
      scrollTop: 0
    }), this.navStatus();
  },

  /**
   * 导航
   */
  navStatus: function (e) {
    var page = this,
      orderStatus = page.data.orderStatus,
      status = page.data.status;
    switch (status) {
      case "0":
        orderStatus = "all";
        break;
      case "1":
        orderStatus = "0";
        break;
      case "2":
        orderStatus = "1";
        break;
      case "3":
        orderStatus = "2";
        break;
      case "4":
        orderStatus = "4";
        break;
    }
    this.setData({
      orderStatus: orderStatus,
    }), this.loadData({
      page: 0,
      reload: true,
    });
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