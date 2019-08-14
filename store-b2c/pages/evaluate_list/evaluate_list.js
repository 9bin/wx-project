// pages/evaluate_list/evaluate_list.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,  //评价状态 0——未评价，1——已评价
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this), this.loadData({
      page: 1,
      reload: true,
    });
  },

  /**
   * 数据列表加载
   */
  loadData: function (options) {
    var a = this;
    if(a.data.is_loading) return;
    if(options.loadmore&&!a.data.is_more) return;
    if(options.reload) a.setData({list: []});
    a.setData({
      is_loading: true,
    }), app.request({
      url: a.data.status == 1 ? api.evaluate.finish_evaluate_list : api.evaluate.order_evaluate_list,
      method: "GET",
      header: { "content-type": "application/json"},
      data: { "pageIndex": options.page},
      success: function (res) {
        if(res.state == "0") {
          a.setData({
            page: options.page,
            giveValue: a.data.status == 0 ? res.data.giveValue : 0
          });
          if(options.reload) {
            a.data.status == 1 ? a.setData({
              list: res.data.orderLineList,
              is_more: res.data.orderLineList.length > 0,
              show_no_data_tip: res.data.orderLineList.length == 0
            }) : a.setData({
              list: res.data.orderList,
              is_more: res.data.orderList.length > 0,
              show_no_data_tip: res.data.orderList.length == 0
            });
          }
          if (options.loadmore) {
            a.data.status == 1 ? a.setData({
              list: a.data.list.concat(res.data.orderLineList),
              is_more: res.data.orderLineList.length > 0,
            }) : a.setData({
              list: a.data.list.concat(res.data.orderList),
              is_more: res.data.orderList.length > 0,
            })
          }
        }else {
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel: !1,
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
      status: status
    }), this.loadData({
      page: 1,
      reload: true,
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var a = this;
    console.log("loadmore");
    a.loadData({
      page: a.data.page + 1,
      loadmore: true
    })
  },

})