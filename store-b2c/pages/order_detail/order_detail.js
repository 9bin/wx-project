// pages/order_detail/order_detail.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCancle: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    options.id && (console.log(options.id), this.setData({id: options.id}), this.loadData());
  },

  loadData: function () {
    var a = this;
    wx.showLoading({
      mask: true,
    }), app.request({
      url: api.order.detail,
      data: {"orderId": a.data.id},
      success: function (res) {
        wx.hideLoading();
        if(res.state=="0") a.setData(res.data);
      }
    })
  },

  /**
   * 显示取消弹窗
   */
  showReason: function (e) {
    this.setData({
      showCancle: true,
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
        "orderId": a.data.id,
        "cancelReason": reason
      },
      success: function (res) {
        res.state == "0" ? a.loadData() : wx.showModal({
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
    id && app.request({
      url: api.user.confirm_receipt,
      data: { "id": id },
      success: function (res) {
        if (res.state == "0") {
          a.data.orderMap.orderStatus = 8,
            a.data.orderMap.orderStatusTitle = "已完成",
            a.setData({ orderMap: a.data.orderMap });
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

})