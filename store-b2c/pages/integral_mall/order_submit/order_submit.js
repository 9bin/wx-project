// pages/integral_mall/order_submit/order_submit.js
var api = require("../../../api.js"),
  app = getApp(),
  util = require("../../../utils/util.js"),
  WxParse = require("../../../wxParse/wxParse.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    new_total_price: 0, //合计总价
    express_price: "0", //运费
    distribution: "1", //配送方式 
    getSmsCodeTxt: '获取验证码', // 验证码提示
    statuGetSmsCode: false, // 获取短信验证码状态
    leaveWords: "",  //留言  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    var a = this;
    a.setData({
      options: options,
      time: util.formatData(new Date()),
      mobile: this.data.__user_info.realMobile.substr(-4) || ""
    });
    app.request({
      url: api.user.address_list,
      data: { "pageIndex": 1 },
      success: function (res) {
        if (res.state == "0" && res.data.data && res.data.data.length && res.data.data[0].isDefault == "1") {
          a.setData({
            address: res.data.data[0]
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.pageOnShow(this);
    var page = this;
    page.getOrderData(page.data.options);
  },

  /**
   * 获取订单信息
   */
  getOrderData: function (options) {
    var page = this;
    if (options.goods_info) {
      var goods_info = JSON.parse(options.goods_info);
      wx.showLoading({
        title: "正在加载",
        mask: true,
      }),
        app.request({
          url: api.order.submit_preview,
          data: {
            "buyType": "1",
            "count": goods_info.num,
            "pid": goods_info.goods_id,
            "actId": goods_info.actId || ""
          },
          success: function (res) {
            if (res.state == "0") {
              page.setData(res.data), page.getPrice(), page.getExpressPrice();
            } else {
              wx.showModal({
                title: "提示",
                content: res.message,
                showCancel: false,
                confirmText: "返回",
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1,
                    });
                  }
                }
              });
            }
          },
          complete: function () {
            wx.hideLoading();
          }
        });
    }
  },

  /**
   * 提交订单
   */
  submitNow: function (t) {
    var a = this, e = a.data.distribution, o = a.data.invoiceType, i = {};
    if (e == "1") {
      if (!a.data.address || !a.data.address.id) return void wx.showToast({
        title: "请选择收货地址",
        image: "/images/icon-warning.png"
      });
      i.address_id = a.data.address.id;
    } else {
      if (i.address_name = a.data.selfPickAddrPerson, i.address_mobile = a.data.selfPickAddrPhone, !a.data.selfPickAddr.id) return void wx.showModal({
        title: "警告",
        content: "请选择自提点",
        showCancel: !1
      });
      if (i.address_id = a.data.selfPickAddr.id, !i.address_name || null == i.address_name) return void wx.showToast({
        title: "请填写联系人",
        image: "/images/icon-warning.png"
      });
      if (!i.address_mobile || null == i.address_mobile) return void wx.showToast({
        title: "请填写联系方式",
        image: "/images/icon-warning.png"
      });
      if (!/^\+?\d[\d -]{8,12}\d/.test(i.address_mobile)) return void wx.showModal({
        title: "提示",
        content: "手机号格式不正确",
        showCancel: !1
      });
    }
    i.distribution = e, i.buyerRemarks = a.data.leaveWords, i.useIntegral = a.data.new_total_price;
    var goods_info = JSON.parse(a.data.options.goods_info);
    i.buyType = goods_info.buyType,
      i.actId = goods_info.actId || "",
      i.count = goods_info.num,
      i.pid = goods_info.goods_id;
    wx.showLoading({
      title: '正在提交',
      mask: true,
    }), app.request({
      url: api.order.submit,
      data: {
        "buyType": i.buyType,
        "actId": i.actId,
        "count": i.count,
        "pid": i.pid,
        "deliveryType": i.distribution,
        "receiveId": i.address_id,
        "selfPickAddrPerson": i.address_name || "",
        "selfPickAddrPhone": i.address_mobile || "",
        "invoiceType": "1",
        "invoiceContent": i.invoiceContent || "",
        "invoiceTitle": i.invoiceTitle || "",
        "ratepayerCode": i.ratepayerCode || "",
        "buyerRemarks": i.buyerRemarks || "",
        "couponId": i.couponId || "",
        "useIntegral": i.useIntegral
      },
      success: function (res) {
        if (res.state == "0") {
          app.request({
            url: api.order.pay_data,
            data: {
              "orderId": res.data
            },
            success: function (str) {
              wx.hideLoading();
              if (str.state == "0") wx.navigateTo({
                url: '/pages/wx_pay/callback/callback?id=' + res.data + "&payFlog=" + str.data.payFlag,
              });
              else wx.showModal({
                title: '提交失败',
                content: res.message,
                showCancel: !1,
              })
            }
          });
        } else {
          wx.showModal({
            title: '提交失败',
            content: res.message,
            showCancel: !1,
          })
        }
      }
    })

  },

  /**
   * 获取短信验证码
   */
  getSmsCode: function () {
    app.getSmsCode(this, this.data.__user_info.realMobile, "7", function (res) {
      -1 == res && wx.showToast({
        title: '验证码获取失败',
        image: '/images/icon-warning.png',
      });
    });

  },

  /**
   * 提交订单验证手机弹窗
   */
  orderSubmit: function () {
    this.setData({
      showIntegraCode: true,
      show_model: !0
    })
  },

  /**
   * 积分兑换提交
   */
  submitExchange: function (e) {
    console.log(e.detail.value);
    var page = this,
      value = e.detail.value;
    app.request({
      url: api.default.check_send_code,
      data: {
        "mobile": page.data.__user_info.realMobile,
        "sendCodeType": "7",
        "messageCode": value.code
      },
      success: function (res) {
        if (res.state == "0") {
          page.submitNow(), page.setData({
            showIntegraCode: !1,
            show_model: !1
          });
        } else {
          wx.showToast({
            title: '短信验证码错误',
            image: '/images/icon-warning.png',
          });
        }
      }
    })
  },

  /**
   * 积分兑换取消
   */
  cancleExchange: function () {
    this.setData({
      showIntegraCode: !1,
      show_model: !1,
    });
  },

  /**
   * 留言
   */
  bindinput: function (e) {
    this.setData({
      leaveWords: e.detail.value
    })
  },

  /**
   * 计算总价
   */
  getPrice: function () {
    var t = this,
      a = parseFloat(t.data.totalPrice),
      e = parseFloat(t.data.express_price),
      d = t.data.distribution;
      "1" == d && !isNaN(e) && (a += e), a <= 0 && (a = 0), t.setData({
        new_total_price: a.toFixed(2)
      });

  },

  /**
   * 计算运费 
   */
  getExpressPrice: function () {
    var page = this, productList = page.data.productList, productJsonStr = {};
    for (var i in productList) {
      productJsonStr[productList[i].id] = productList[i].cartInfo.itemCount;
    }
    if (page.data.distribution == '1' && page.data.address) {
      app.request({
        url: api.order.freight_calculate,
        data: {
          "addressId": page.data.address.id,
          "freightProductIds": page.data.productIds,
          "productJsonStr": JSON.stringify(productJsonStr),
        },
        success: function (res) {
          res.state == "0" && page.setData({
            express_price: res.data
          }), page.getPrice();
        }
      })
    }
  },
})