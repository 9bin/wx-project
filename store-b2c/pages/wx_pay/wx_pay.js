// pages/wx_pay/wx_pay.js
var app = getApp(),
  api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPwd: !1, //余额支付密码输入弹窗
    length: 6, //余额支付密码长度
    isFocus: false, //聚焦，拉起键盘
    password: "", //余额支付密码
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.pageOnLoad(this);
    options.id && (this.setData({
      id: options.id
    }), this.loadData());
  },

  loadData: function() {
    var a = this;
    wx.showLoading({
      mask: true,
    }), app.request({
      url: api.order.pay_data,
      data: {
        "orderId": a.data.id
      },
      success: function(res) {
        wx.hideLoading();
        if (res.state == "0") a.setData(res.data);
        else wx.showModal({
          title: '提交失败',
          content: res.message,
          showCancel: !1,
          success: function(res) {
            res.confirm && wx.navigateBack({
              delta: 1,
            });
          },
        })
      }
    })
  },

  /**
   * 余额支付密码弹窗
   */
  showPwd: function () {
    this.setData({
      showPwd: true,
    })
  },
  closePwd: function () {
    this.setData({
      showPwd: false,
      password: "",
      isFocus: false,
    });
  },

  /**
   * 余额支付密码输入框聚焦
   */
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },

  /**
   * 余额支付密码输入
   */
  Focus(e) {
    var inputValue = e.detail.value;
    this.setData({
      password: inputValue,
    });
    if (inputValue.length == 6) {
      console.log(inputValue);
      var that = this,
        sumAmout = that.data.sumAmout,
        capital = that.data.__user_info.capital,
        reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (parseFloat(sumAmout) > parseFloat(capital)) {
        return void wx.showToast({
          title: '余额不足',
          image: '/images/icon-warning.png',
        }), that.closePwd();
      }
      if (reg.test(sumAmout)) {
        that.balencPay(), that.closePwd();
      }
    }
  },
  /**
   * 微信支付接口
   */
  wxPay: function (e) {
    var a = this;
    if (a.data.orderId) {
      wx.showLoading({
        mask: true,
      }), app.request({
        url: api.order.wx_pay,
        data: { "orderId": a.data.orderId},
        complete: function () { wx.hideLoading()},
        success: function (res) {
          if(res.state == "0") {
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.packageStr,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success: function (str) {},
              fail: function (str) {},
              complete: function (str) {
                console.log(str)
              }
            })
          }
        }
      })
    }
  },

  /**
   * 余额支付
   */
  balencPay: function () {
    var a = this;
    var id = a.data.orderId;
    id && (wx.showLoading({
      title: "正在提交",
      mask: true,
    }), app.request({
      url: api.order.balance_pay,
      data: {
        "orderId": id,
        "payPsw": a.data.password
      },
      success: function (res) {
        if (res.state == "0") wx.navigateTo({
          url: '/pages/wx_pay/callback/callback?id=' + id + "&payFlog=" + a.data.payFlag,
        });
        else wx.showModal({
          title: '提交失败',
          content: res.message,
          showCancel: !1,
        });
      },
      complete: function () {wx.hideLoading();}
    }));
  },  
})