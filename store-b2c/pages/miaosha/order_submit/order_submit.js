// pages/miaosha/order_submit/order_submit.js
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
    integral_radio: 0, //积分兑换开关
    showIntegraExplan: !1, //显示积分兑换说明弹窗
    showIntegraCode: !1, //积分抵扣开启验证码获取弹窗
    integral_ex: {
      "forehead_integral": "",
      "forehead": "0.00"
    }, //积分兑换
    new_total_price: 0, //合计总价
    express_price: "0", //运费
    distribution: "1", //配送方式
    invoiceType: "1", //发票
    picker_coupon: "", //选取的优惠券
    showPwd: !1, //余额支付密码输入弹窗
    length: 6, //余额支付密码长度
    isFocus: false, //聚焦，拉起键盘
    password: "", //余额支付密码
    balencePay: 0, //余额支付金额   
    getSmsCodeTxt: '获取验证码', // 验证码提示
    statuGetSmsCode: false, // 获取短信验证码状态
    leaveWords: "",  //留言   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
  onShow: function() {
    app.pageOnShow(this);
    var page = this;
    page.getOrderData(page.data.options);
  },

  /**
   * 获取订单信息
   */
  getOrderData: function(options) {
    var page = this;
    if (options.goods_info) {
      var goods_info = JSON.parse(options.goods_info);
      console.log(goods_info);
      wx.showLoading({
          title: "正在加载",
          mask: true,
        }),
        app.request({
          url: api.order.submit_preview,
          data: {
            "buyType": goods_info.buyType,
            "count": goods_info.num,
            "pid": goods_info.goods_id,
            "actId": goods_info.actId || ""
          },
          success: function(res) {
            if (res.state == "0") {
              page.setData(res.data), page.getPrice(), page.getExpressPrice();
            } else {
              wx.showModal({
                title: "提示",
                content: res.message,
                showCancel: false,
                confirmText: "返回",
                success: function(res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1,
                    });
                  }
                }
              });
            }
          },
          complete: function() {
            wx.hideLoading();
          }
        });
    }
  },

  /**
   * 提交订单
   */
  orderSubmit: function (t) {
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
    if (o != "1") {
      if (!a.data.invoiceTitle) return void wx.showToast({
        title: "请填写发票抬头",
        image: "/images/icon-warning.png"
      });
      if (i.invoiceTitle = a.data.invoiceTitle, a.data.invoiceTitle != "个人" && !a.data.ratepayerCode) return void wx.showToast({
        title: "请填写发票税号",
        image: "/images/icon-warning.png"
      });
      if (i.ratepayerCode = a.data.ratepayerCode, !a.data.invoiceContent) return voidwx.showToast({
        title: "请选择发票明细",
        image: "/images/icon-warning.png"
      });
      i.invoiceContent = a.data.invoiceContent;
    }
    i.distribution = e, i.invoiceType = o, i.buyerRemarks = a.data.leaveWords, i.useCapital = a.data.balencePay, i.useIntegral = a.data.integral_ex.forehead_integral, i.payPsw = a.data.password;
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
        "invoiceType": i.invoiceType,
        "invoiceContent": i.invoiceContent || "",
        "invoiceTitle": i.invoiceTitle || "",
        "ratepayerCode": i.ratepayerCode || "",
        "buyerRemarks": i.buyerRemarks || "",
        "couponId": i.couponId || "",
        "useCapital": i.useCapital,
        "payPsw": i.payPsw,
        "useIntegral": i.useIntegral
      },
      success: function (res) {
        wx.hideLoading();
        if (res.state == "0") {
          a.data.new_total_price == 0 ? app.request({
            url: api.order.pay_data,
            data: {
              "orderId": res.data
            },
            success: function (str) {
              if (str.state == "0") wx.navigateTo({
                url: '/pages/wx_pay/callback/callback?id=' + res.data + "&payFlog=" + str.data.payFlag,
              });
              else wx.showModal({
                title: '提交失败',
                content: res.message,
                showCancel: !1,
              })
            }
          }) : wx.navigateTo({
            url: '/pages/wx_pay/wx_pay?id=' + res.data,
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
   * 跳转优惠券列表
   */
  showCouponPicker: function() {
    this.data.couponList && 0 < this.data.couponList.length && wx.navigateTo({
      url: '/pages/order_submit_coupon/order_submit_coupon',
    })
  },

  /**
   * 积分兑换说明弹窗
   */
  integration: function() {
    this.setData({
      showIntegraExplan: !this.data.showIntegraExplan
    });
    this.data.showIntegraExplan ? this.setData({
      show_model: !0
    }) : this.setData({
      show_model: !1
    });
  },

  /**
   * 积分抵扣开关
   */
  integralSwitchChange: function(t) {
    t.detail.value ? this.setData({
      integral_radio: 1,
      showIntegraCode: true,
      show_model: !0
    }) : this.cancleExchange();
  },

  /**
   * 积分兑换
   */
  integralipt: function(e) {
    var that = this,
      value = e.detail.value,
      integral_ex = that.data.integral_ex,
      integral = that.data.member.integral,
      glodExchangeCapital = that.data.businessConfig.glodExchangeCapital;
    if (value) parseInt(integral) < parseInt(value) ? (wx.showToast({
        title: '积分总额' + integral,
        image: '/images/icon-warning.png',
      }), integral_ex.forehead = (parseFloat(integral) * glodExchangeCapital).toFixed(2), integral_ex.forehead_integral = integral) : (integral_ex.forehead = (parseFloat(value) * glodExchangeCapital).toFixed(2), integral_ex.forehead_integral = value),
      that.setData({
        integral_ex: that.data.integral_ex
      });
    else that.setData({
      integral_ex: {
        "forehead_integral": value,
        "forehead": "0.00"
      }
    });
  },

  /**
   * 获取短信验证码
   */
  getSmsCode: function() {
    app.getSmsCode(this, this.data.__user_info.realMobile, "7", function(res) {
      -1 == res && wx.showToast({
        title: '验证码获取失败',
        image: '/images/icon-warning.png',
      });
    });

  },

  /**
   * 积分兑换取消
   */
  cancleExchange: function() {
    this.setData({
      integral_radio: 0,
      showIntegraCode: !1,
      show_model: !1,
      integral_ex: {
        "forehead_integral": "",
        "forehead": "0.00"
      }
    }), this.getPrice();
  },

  /**
   * 积分兑换提交
   */
  submitExchange: function(e) {
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
      success: function(res) {
        if (res.state == "0") {
          page.getPrice(), page.setData({
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
   * 余额支付密码弹窗
   */
  showPwd: function() {
    this.data.member.hasPayPsw ? this.setData({
      showPwd: true,
      show_model: !0
    }) : wx.showModal({
      title: '提示！',
      content: '请先设置支付密码',
      showCancel: true,
      cancelText: '暂不设置',
      cancelColor: '#999999',
      confirmText: '去设置',
      confirmColor: '#eb0c36',
      success: function(res) {
        res.confirm && wx.navigateTo({
          url: '/pages/setting/setting',
        })
      },
    });
  },

  closeShowPwd: function() {
    this.setData({
      showPwd: false,
      show_model: !1,
    }), this.getPrice();
  },

  /**
   * 监听余额支付金额输入
   */
  balencePay: function(e) {
    this.setData({
      balencePay: e.detail.value
    });
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
      var that = this,
        balencePay = that.data.balencePay,
        capital = that.data.member.capital,
        reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (parseFloat(balencePay) <= 0) return void wx.showToast({
        title: '请输入金额',
        image: '/images/icon-warning.png',
      }), that.setData({
        password: "",
      });
      if (parseFloat(balencePay) > parseFloat(that.data.member.capital))
        return void wx.showToast({
          title: '余额不足',
          image: '/images/icon-warning.png',
        }), that.setData({
          password: "",
        });
      if (reg.test(balencePay)) {
        that.closeShowPwd();
      } else {
        return void wx.showToast({
          title: '金额输入有误',
          image: '/images/icon-warning.png',
        }), that.setData({
          password: "",
        });
      }
    }
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
  getPrice: function() {
    var t = this,
      a = parseFloat(t.data.totalPrice),
      e = parseFloat(t.data.express_price),
      i = t.data.picker_coupon,
      s = t.data.integral_ex,
      n = t.data.integral_radio,
      o = parseFloat(t.data.balencePay),
      d = t.data.distribution;
    i && (a -= parseFloat(i.processValue)), s && 1 == n && (a -= parseFloat(s.forehead)), o && (a -= o),
      "1" == d && !isNaN(e) && (a += e), a <= 0 && (a = 0), t.setData({
        new_total_price: a.toFixed(2)
      });

  },

  /**
   * 计算运费 
   */
  getExpressPrice: function () {
    var page = this, productList = page.data.productList, productJsonStr= {};
    for(var i in productList) {
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