// pages/marketing/yaoyiyao/index.js
var app = getApp(), api = require("../../../api.js"), WxPares = require("../../../wxParse/wxParse.js");
var audioCtx = !1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRule: false,
    shakeThreshold: 300,   //频率阈值
    lastX: 0,
    lastY : 0,
    lastZ: 0,
    lastUpdate: 0,
    isStart: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    options.id && (this.setData({
      id: options.id
    }), this.loadData());
  },

  /**
   * 数据加载
   */
  loadData: function () {
    var a = this;
    if (!a.data.id) return wx.showModal({
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
    if (id) {
      awardType == 3 ? wx.navigateTo({
        url: '/pages/marketing/order_submit/order_submit?goods_info=' + JSON.stringify({
          goods_id: id,
          num: 1,
          buyType: "7",
          actId: a.data.id,
          interactionMarketingType: "4"
        })
      }) : a.showToast({ title: "奖品已经发送到您的账号中，请注意查收" });
    }
    this.setData({
      showResult: false,
      winResult: null,
      isStart: true
    })
  },

  start: function () {
    let { shakeThreshold, lastX, lastY, lastZ, lastUpdate } = this.data;
    var a = this;
    wx.onAccelerometerChange(function(res){
      const curTime = new Date().getTime();
      if ((curTime - lastUpdate) > 100) {
        const curX = res.x, curY = res.y, curZ = res.z, speed = Math.abs(curX + curY + curZ - lastX - lastY - lastZ) / (curTime - lastUpdate) * 10000; 
        if (speed > shakeThreshold && a.data.isStart) {
          a.data.isStart = false;
          audioCtx.play();
          a.lottery();
        }
        lastUpdate = curTime
        lastX = curX
        lastY = curY
        lastZ = curZ
      }
    })
  },

  lottery: function () {
    var a = this;
    setTimeout(function(){
      a.setData({
        isStart: true
      })
    },2000);
    // app.request({
    //   url: api.lottery.lotto,
    //   data: { "id": a.data.id },
    //   success: function (res) {
    //     if (res.state == "0") {
    //       a.setData({
    //         winResult: res.data,
    //       }), a.setData({
    //         showResult: true
    //       })
    //     } else {
    //       a.showToast({ title: res.message });
    //     }
    //   },
    // });
  },

  /**
   * 规则说明弹窗
   */
  showRule: function () {
    this.setData({
      showRule: !this.data.showRule,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.pageOnShow(this);
  },

  onReady: function () {
    audioCtx = wx.createInnerAudioContext(), audioCtx.src = "https://yun.pfan123.com/shake_sound.mp3", this.start();
  },

})