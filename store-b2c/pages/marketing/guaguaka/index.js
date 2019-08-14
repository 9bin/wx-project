// pages/marketing/guaguaka/index.js
var app = getApp(), api = require("../../../api.js"), WxPares = require("../../../wxParse/wxParse.js");
Page({
  ctx: null,
  /**
   * 页面的初始数据
   */
  data: {
    isStart: !1,
    isShowScratch: false,
    award_name: !1,
    id: "104"
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
          interactionMarketingType: "1"
        })
      }) : a.showToast({ title: "奖品已经发送到您的账号中，请注意查收" });
    }
    this.setData({
      showResult: false,
      winResult: null,
      isShowScratch: false
    })
  },


  /**
   * 点击抽奖
   */
  lottery: function () {
    var a = this;
    if (a.data.joinLimitDay - a.data.joinAmount <= 0) return a.showToast({ title: "今日机会，您已经用完了" });
    a.data.joinAmount++;
    app.request({
      url: api.lottery.lotto,
      data: { "id": a.data.id },
      success: function (res) {
        if(res.state == "0") {
          a.setData({
            winResult: res.data,
            name: a.setName(res.data)
          }), setTimeout(function () { a.setData({ isShowScratch: true }) }, 200), a.init();
        } else {
          a.data.joinAmount -= 1, a.showToast({ title: res.message});
        }
      }
    })
  },

  /**
   * 设置中奖内容
   */
  setName: function (t) {
    var a = "";
    switch (t.awardType) {
      case 1:
        a = t.quantity + "积分";
        break;

      case 2:
        a = t.couponBatchMap.processValue + "元优惠券";
        break;

      case 3:
        a = t.giftProductMap.name;
        break;

      default:
        a = "谢谢参与";
    }
    return a;
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
   * 初始化canvas
   */
  init: function () {
    var t = wx.createSelectorQuery(), s = this;
    s.setData({
      award_name: !1
    }), t.select("#frame").boundingClientRect(), t.exec(function (t) {
      var a = t[0].width, e = t[0].height;
      s.setData({
        r: 14,
        lastX: "",
        lastY: "",
        minX: "",
        minY: "",
        maxX: "",
        maxY: "",
        canvasWidth: a,
        canvasHeight: e
      });
      var i = wx.createCanvasContext("scratch");
      i.drawImage("/images/mask.jpg", 0, 0, a, e), s.ctx = i, "undefined" == typeof my ? i.draw(!1, function (t) {
        s.setData({
          award_name: !0
        });
      }) : i.draw(!0), s.setData({
        isStart: !0,
        isScroll: !0
      });
    });
  },

  drawRect: function (t, a) {
    var e = this.data.r / 2, i = 0 < t - e ? t - e : 0, s = 0 < a - e ? a - e : 0;
    return "" !== this.data.minX ? this.setData({
      minX: this.data.minX > i ? i : this.data.minX,
      minY: this.data.minY > s ? s : this.data.minY,
      maxX: this.data.maxX > i ? this.data.maxX : i,
      maxY: this.data.maxY > s ? this.data.maxY : s
    }) : this.setData({
      minX: i,
      minY: s,
      maxX: i,
      maxY: s
    }), this.setData({
      lastX: i,
      lastY: s
    }), [i, s, 2 * e];
  },

  clearArc: function (t, a, e) {
    var i = this.data.r, s = this.ctx, o = i - e, r = Math.sqrt(i * i - o * o), n = t - o, c = a - r, d = 2 * o, h = 2 * r;
    e <= i && (s.clearRect(n, c, d, h), e += 1, this.clearArc(t, a, e));
  },

  touchStart: function (t) {
    if (!this.data.isStart) return
    this.drawRect(t.touches[0].x, t.touches[0].y),
    this.clearArc(t.touches[0].x, t.touches[0].y, 1),
    this.ctx.draw(!0);
  },

  touchMove: function (t) {
    if (this.data.isStart) {
      this.drawRect(t.touches[0].x, t.touches[0].y), this.clearArc(t.touches[0].x, t.touches[0].y, 1),
        this.ctx.draw(!0);
    }
  },

  touchEnd: function (t) {
    if (this.data.isStart) {
      var e = this, a = this.data.canvasWidth, i = this.data.canvasHeight, s = this.data.minX, o = this.data.minY, r = this.data.maxX, n = this.data.maxY;
      .4 * a < r - s && .4 * i < n - o && (e.setData({ isStart: !1, isScroll: !1, showResult: !0 }), e.ctx.draw());
    }
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    app.pageOnShow(this);
  },
})