// pages/marketing/zajindan/index.js
var app = getApp(), api = require("../../../api.js"), WxPares = require("../../../wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eggChecked: -1,      //敲击的金蛋
    eggOpen: -1,         //砸开的金蛋
    id: "107",
    Hammer: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    options.id && (this.setData({
      id: options.id
    }), this.loadData());
    this.loadData();
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
    });
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
          interactionMarketingType: "2"
        })
      }) : a.showToast({ title: "奖品已经发送到您的账号中，请注意查收" });
    }
    this.setData({
      showResult: false,
      winResult: null,
      eggChecked: -1,      //敲击的金蛋
      eggOpen: -1,         //砸开的金蛋
    })
  },

  /**
   * 点击抽奖
   */
  lottery: function (e) {
    var a = this;
    if (e.touches.length !== 1) return; 
    if (a.data.joinLimitDay - a.data.joinAmount <= 0) return a.showToast({ title: "今日机会，您已经用完了" });
    a.data.joinAmount++;
    var index = e.currentTarget.dataset.index;
    a.setData({
      eggChecked: index,
      Hammer: "hiting-1"
    });
    setTimeout(function () {
      a.setData({
        Hammer: "rotateing"
      });
    }, 1000);
    setTimeout(function () {
      a.setData({
        Hammer: "hiting-2"
      });
    }, 2000);
    setTimeout(function(){
      a.setData({
        eggOpen: index,
        Hammer: ""
      });
      setTimeout(function () {
        a.data.winResult ? a.setData({
          showResult: !0
        }) : (a.data.errMsg && a.showToast({ title: a.data.errMsg }), a.setData({ eggChecked: -1, eggOpen: -1}));
      }, 500)
    },2100)
    app.request({
      url: api.lottery.lotto,
      data: { "id": a.data.id },
      success: function (res) {
        if (res.state == "0") {
          a.setData({
            winResult: res.data,
          });
        } else {
          a.data.joinAmount -= 1, a.setData({errMsg: res.message});
        }
      },
    });
    
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    app.pageOnShow(this);
  },
})