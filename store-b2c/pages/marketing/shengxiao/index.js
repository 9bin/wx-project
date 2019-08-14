// pages/marketing/shengxiao/index.js
var app = getApp(), api = require("../../../api.js"), WxPares = require("../../../wxParse/wxParse.js");
var interval = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRule: false,
    id: "108"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this), this.toggleClassBg();
    options.id && (this.setData({
      id: options.id
    }), this.loadData());
    
  },

  /**
   * 数据加载
   */
  loadData: function () {
    var a = this;
    if(!a.data.id) return wx.showModal({
      title: '活动已停止',
      content: '敬请期待下一轮开始',
      showCancel: !1,
      success: function (res) {
        res.confirm && wx.navigateBack({
          delta: 1,
        })
      }
    })
    wx.showLoading({
      title: '加载中...',
      mask: true,
    }), app.request({
      url: api.lottery.load_data,
      data: {
        id: a.data.id
      },
      success: function (res) {
        if (res.state == "0") a.setData(res.data), WxPares.wxParse("content", "html", res.data.explain || "", a);
      },
      complete: function () { wx.hideLoading(); }
    })
  },

  /**
   * 领奖
   */
  prize: function (e) {
    var id = e.target.dataset.id;
    var awardType = e.target.dataset.awardType;
    var a = this;
    if(id) {
      awardType == 3 ? wx.navigateTo({
        url: '/pages/marketing/order_submit/order_submit?goods_info=' + JSON.stringify({
          goods_id: id,
          num: 1,
          buyType: "7",
          actId: a.data.id,
          interactionMarketingType: "4"
        })
      }) : a.showToast({title: "奖品已经发送到您的账号中，请注意查收"});
    }
    this.setData({
      showResult: false,
      positionStyle: "",
      nagativeStyle: "",
      winResult: null
    })
  },

  /**
   * 点击抽奖
   */
  lottery: function (e) {
    console.log(e);
    if(e.touches.length===1) {
      var index = e.currentTarget.dataset.id;
      var a = this;
      if (a.data.joinLimitDay - a.data.joinAmount <= 0) return a.showToast({ title: "今日机会，您已经用完了" });
      a.data.joinAmount++;
      a.setData({
        checked: index,
        positionStyle: "transform: rotateY(180deg) !important;opacity: 0 !important;visibility: hidden !important;",
        nagativeStyle: "transform: rotateY(0deg) !important;opacity: 1 !important;visibility: visible !important;"
      });
      app.request({
        url: api.lottery.lotto,
        data: { "id": a.data.id },
        success: function (res) {
          if (res.state == "0") {
            a.setData({
              winResult: res.data
            }), setTimeout(function(){
              a.setData({
                showResult: true
              });
            }, 1e3);
          } else {
            a.data.joinAmount -= 1,a.setData({checked: index,positionStyle: "",nagativeStyle: ""}), a.showToast({ title: res.message });
          }
        }
      })
    }
    
  },

  /**
   * 闪烁背景
   */
  toggleClassBg: function () {
    var that = this;
    interval != 0 && clearInterval(interval);
    interval = setInterval(function () {
      that.setData({
        on: that.data.on == "" ? "on" : ""
      })
    }, 500);
  },

  /**
   * 规则说明弹窗
   */
  showRule: function () {
    this.setData({
      showRule: !this.data.showRule,
    })
  },

  onHide: function () {
    clearInterval(interval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(interval);
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    app.pageOnShow(this);
  },
})