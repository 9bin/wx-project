// pages/integral_mall/integral_mall.js
var app = getApp(), api = require("../../api.js"), is_no_more = !1;
var beginX = 0, moveX = 0, endX = 0, animation = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],        //商品列表
    status: -1,       //筛选状态
    priceTagIndex: -1,   //当前选中的价格筛选值
    min: "",          //加个筛选最小值
    max: "",          //加个筛选最大值
    params: {         //筛选表单数据
      qty: "",
      priceBegin: "",
      priceEnd: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this), this.reLoadData();
  },

  /**
   * 数据加载
   */
  reLoadData: function () {
    var a = this;
    is_no_more = !1, a.setData({
      page: 1,
      list: [],
      show_no_data_tip: !1
    });
    var params = a.data.params,
    i = a.data.page || 1;
    wx.showLoading({
      title: '加载中...',
      mask: true,
    }), app.request({
      url: api.integralMall.list,
      data: {
        "priceBegin": params.priceBegin,
        "priceEnd": params.priceEnd,
        "qty": params.qty,
        "pageIndex": i
      },
      success: function (res) {
        res.state == "0" && (0 == res.data.productList.length && (is_no_more = !0), a.setData({
          page: i + 1
        }), a.setData({
          list: res.data.productList,
          priceWhere: res.data.priceWhere
          })), a.setData({
          show_no_data_tip: 0 == a.data.list.length
          });
      },
      complete: function () {wx.hideLoading();}
    })
  },

  /**
   * 加载更多数据
   */
  loadMoreData: function () {
    var i = this,
      params = i.data.params || "",
      o = i.data.page || 2;
    if (i.data.is_loading) return;
    i.setData({
      is_loading: !0
    }), app.request({
      url: api.integralMall.list,
      data: {
        "priceBegin": params.priceBegin,
        "priceEnd": params.priceEnd,
        "qty": params.qty,
        "pageIndex": o
      },
      success: function (res) {
        '0' == res.state && (0 == res.data.productList.length && (is_no_more = !0), i.setData({
          page: o + 1
        }), i.setData({
          list: i.data.list.concat(res.data.productList),
        }));
      },
      complete: function () {
        i.setData({
          is_loading: !1
        })
      }
    })
  },

  /**
   * 筛选弹出窗弹出
   */
  showScreenView: function () {
    animation.translateX(0).step();
    this.setData({
      showScreenView: true,
      animationData: animation.export()
    });
  },

  /**
   * 筛选弹出窗关闭
   */
  closeScreenView: function () {
    this.setData({
      showScreenView: false
    })
  },

  /**
   * 筛选状态
   */
  chickClassfiyTag: function (e) {
    var status = e.currentTarget.dataset.status;
    this.setData({
      status: status,
    }), status == 2 && this.setData({
      min: "0",
      max: this.data.gold || "0",
      priceTagIndex: -1,
    });
  },

  /**
   * 筛选 价格，标签选择
   */
  chickPriceTag: function (e) {
    var value = e.currentTarget.dataset;
      this.setData({
        min: value.min || "",
        max: value.max || ""
      }), this.data.status == 2 && this.setData({
        status: -1
      }), this.setPriceTagIndex();
  },

  /**
   * 监听input输入
   */
  bindMinInput: function (e) {
    var value = e.detail.value;
      this.setData({
        min: value,
      }), this.data.status == 2 && this.setData({
        status: -1
      }), this.setPriceTagIndex();
  },
  bindMaxInput: function (e) {
    var value = e.detail.value;
      this.setData({
       max: value,
      }), this.data.status == 2 && this.setData({
        status: -1
      }), this.setPriceTagIndex();
  },

  /**
   * 设置标签下标
   */
  setPriceTagIndex: function () {
    var priceTagIndex = -1,
      min = this.data.min,
      max = this.data.max,
      priceWhere = this.data.priceWhere;
    for (var i in priceWhere) {
      min == priceWhere[i].priceStart && max == priceWhere[i].priceEnd && (priceTagIndex = i);
    }
    this.setData({
      priceTagIndex: priceTagIndex
    })
  },

  /**
   * 筛选 表单提交
   */
  screenSubmit: function () {
    var i = this, 
      min = i.data.min,
      max = i.data.max,
      status = i.data.status,
      params = i.data.params;
    if ((parseInt(min) > parseInt(max))) return wx.showModal({
      title: '积分筛选错误',
      content: '最高价积分于最低积分，请重新输入',
      showCancel: false,
    });
    params.priceBegin = min;
    params.priceEnd = max;
    params.qty = status == 1 ? "1" : "";
    i.setData({
      params: params,
    }), i.closeScreenView(), i.reLoadData();
  },

  /**
   * 筛选 表单取消提交
   */
  screenReset: function () {
    this.setData({
      priceTagIndex: -1,
      min: "",
      max: "",
      status: -1
    })
  },

  /**
   * 向右滑动隐藏筛选页面
   */
  catchtouchstart: function (e) {
    beginX = e.changedTouches[0].pageX; // 获取触摸时的原点
  },
  move_view: function (e) {
    var that = this,
      moveX = e.changedTouches[0].pageX - beginX;
    moveX >= 0 && animation.translateX(moveX).step();
    that.setData({
      animationData: animation.export()
    })
  },
  colse_view: function (e) {
    var that = this,
      endX = e.changedTouches[0].pageX;
    // 向右滑动
    if (endX - beginX >= 40) {
      console.log('向右滑动');
      that.setData({
        showScreenView: false,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    });
  },

  onShow: function () {
    app.pageOnShow(this);
    var a = this;
    app.request({
      url: api.user.capital,
      success: function (res) {
        res.state == "0" && a.setData({
          gold: res.data.gold
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    !is_no_more && this.loadMoreData();
  },

  /**
  * 弹出框蒙层截断touchmove事件
  */
  preventTouchMove: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})