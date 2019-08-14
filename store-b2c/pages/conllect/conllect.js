// pages/conllect/conllect.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    editIndex: 0,
    delBtnWidth: 80
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this),
    this.loadData({
      page: 1,
      reLoad: true
    });
  },

  loadData: function (options) {
    var a = this;
    if(a.data.is_loading) return;
    if(options.loadmore && !a.data.is_more) return;
    a.setData({
      is_loading: true
    }), app.request({
      url: api.user.collect_list,
      data: { "pageIndex": options.page || "1"},
      success: function (res) {
        if(res.state == "0") {
          if(options.reLoad) {
            a.setData({
              goods: res.data.data,
              page: options.page,
              is_more: res.data.data.length > 0,
              show_no_data_tip: res.data.data.length == 0,
            })
          }
          if (options.loadmore) {
            a.setData({
              goods: a.data.goods.concat(res.data.data),
              page: options.page,
              is_more: res.data.data.length > 0,
            })
          }
        }
      },
      complete: function () {
        a.setData({
          is_loading: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.pageOnShow(this);
  },

  /**
   * 手指刚放到屏幕触发
   */
  touchS: function (e) {
    var that = this;
    if (e.touches.length == 1) {
      that.setData({
        startX: e.touches[0].clientX
      });
    }
  },

  /**
   * 触摸时触发，手指在屏幕上每移动一次，触发一次
   */
  touchM: function (e) {
    var that = this
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = that.data.startX - moveX;
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {
        txtStyle = "right:0px;left:0px";
      } else if (disX > 0) {
        txtStyle = "right:" + disX + "px;left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          txtStyle = "right:" + delBtnWidth + "px;left:-" + delBtnWidth + "px";
        }
      }
      var index = e.currentTarget.dataset.index;
      var goods = that.data.goods;
      goods[index].txtStyle = txtStyle;
      this.setData({
        goods: goods
      });
    }
  },

  /**
   * 监听手指触摸结束
   */
  touchE: function (e) {
    var that = this
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = disX > delBtnWidth / 2 ? "right:" + delBtnWidth + "px;left:-" + delBtnWidth + "px" : "right:0px;left:0px";
      var index = e.currentTarget.dataset.index;
      var goods = that.data.goods;
      goods[index].txtStyle = txtStyle;
      this.setData({
        goods: goods
      });
    }
  },

  /**
   * 收藏或者取消收藏
   */
  collect: function (e) {
    var page = this, id = e.currentTarget.dataset.id, goods = page.data.goods;
    app.request({
      url: api.user.collect,
      data: { "collectionFlag": "1", "subProductId": id },
      success: function (res) {
        if (res.state == "0") {
          for (var i in goods) {
            if (goods[i].id == id) { goods.splice(i, 1); break; }
          }
        }
        page.setData({
          goods: goods
        })

      }
    })
  },

  /**
   * 添加购物车
   */
  addCart: function (e) {
    var index = e.currentTarget.dataset.index, a = this;
    wx.showLoading({
      title: "正在提交",
      mask: !0
    }),
      app.request({
        url: api.cart.add_cart,
        data: {
          "subProductId": a.data.goods[index].id,
          "itemPrice": parseFloat(a.data.goods[index].mallPrice).toFixed(2),
          "itemCount": "1"
        },
        success: function (t) {
          t.state == "0" && wx.showToast({
            title: "已添入购物车",
            duration: 1500
          }), wx.hideLoading();
        }
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadData({
      page: this.data.page + 1,
      loadmore: true,
    });
  },
})