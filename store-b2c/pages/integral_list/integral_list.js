// pages/integral_list/integral_list.js
var app = getApp(), api = require("../../api.js"), is_no_more = !1;
var beginX = 0, moveX = 0, endX = 0, animation = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],         //积分收支列表
    integral_info: "",   //积分详情
    checked: "",      //筛选值
    screenDate: [      //筛选列表
      {
        id: "week",
        name: "一周内"
      },
      {
        id: "month",
        name: "一月内"
      },
      {
        id: "semester",
        name: "半年内"
      }, {
        id: "year",
        name: "一年内"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.pageOnShow(this), this.reloadData();
  },

  /**
   * 数据加载
   */
  reloadData: function () {
    var a = this;
    is_no_more = !1, a.setData({
      page: 1,
      list: [],
      show_no_data_tip: !1
    });
    var range = a.data.range || "", i = a.data.page || 1;
    wx.showLoading({
      mask: true,
    }), app.request({
      url: api.user.integral,
      data: {
        "inOrOut": "2",
        "range": a.data.range || "",
        "pageIndex": i,
        "disbursementType": "1"
      },
      success: function (res) {
        res.state == "0" && (0 == res.data.expensesList.length && (is_no_more = !0),
          a.setData({
            page: i+1
          }), a.setData({
            list: res.data.expensesList,
            integral_info: res.data
          })), a.setData({
          show_no_data_tip: res.data.expensesList.length == 0
        });
      },
      complete: function () {wx.hideLoading();}
    })

  },

  loadMoreData: function () {
    var i = this,
      o = i.data.page || 2;
    if (i.data.is_loading) return;
    i.setData({
      is_loading: !0
    }), app.request({
      url: api.user.capial_list,
      data: {
        "inOrOut": "2",
        "range": i.data.range || "",
        "pageIndex": o,
        "disbursementType": "1"
      },
      success: function (res) {
        '0' == res.state && (0 == res.data.expensesList.length && (is_no_more = !0), i.setData({
          page: o + 1
        }), i.setData({
          list: i.data.list.concat(res.data.expensesList),
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
   * 签到
   */
  toSign: function () {
    var a = this;
    app.request({
      url: api.user.sign_in,
      success: function (res) {
        if(res.state == "0") {
          a.setData({
            showSignIn: true,
            interaction: res.data 
          }), a.reloadData();
        }else {
          a.showToast({ title: res.message});
        } 
      }
    })
  },

  /**
   * 签到成功去抽奖
   */
  lottery: function (e) {
    var that = this;
    var lotteryType = e.currentTarget.dataset.lotteryType;
    var id = e.currentTarget.dataset.id;
    if (that.data.integral_info.isSingnin != 1) return that.showToast({ title: "先签到才可抽奖哦"});
    switch (lotteryType) {
      case "1": wx.navigateTo({
        url: '/pages/marketing/guaguaka/index?id=' + id,
      }); break;
      case "2": wx.navigateTo({
        url: '/pages/marketing/zajindan/index?id=' + id,
      }); break;
      case "3": wx.navigateTo({
        url: '/pages/marketing/yaoyiyao/index?id=' + id,
      }); break;
      case "4": wx.navigateTo({
        url: '/pages/marketing/shengxiao/index?id=' + id,
      }); break;
      case "5": wx.navigateTo({
        url: '/pages/marketing/dazhanpan/index?id=' + id,
      }); break;
      default: that.showToast({ title: "无抽奖活动" }); break;
    }
  },

  /**
   * 关闭签到弹窗
   */
  hideSingIn: function () {
    this.setData({
      showSignIn: false
    });
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
   * 筛选 分类，标签选择
   */
  chickClassfiyTag: function (e) {
    var value = e.currentTarget.dataset.id;
      this.setData({
        checked: value,
      });
  },

  /**
   * 筛选 表单提交
   */
  screenSubmit: function () {
    var checked = this.data.checked;
    this.setData({
      range: checked,
    }), this.closeScreenView(), this.reloadData();
  },

  /**
   * 筛选 表单取消提交
   */
  screenReset: function () {
    this.setData({
      checked: "",
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
})