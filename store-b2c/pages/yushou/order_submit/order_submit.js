// pages/yushou/order_submit/order_submit.js
var api = require("../../../api.js"), app = getApp(), util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    total_price: 0,              //产品总价
    new_total_price: 0,          //合计总价
    express_price: "0",          //运费
    distribution: "1",           //配送方式
    invoiceType: "1",            //发票
    leaveWords: "",              //留言
    selfPickAddrPerson: "",       //自提收货人姓名
    selfPickAddrPhone: "",       //自提收货人电话
    invoiceContent: "",          //发票明细初始值
    invoiceTitle: "",             //发票抬头
    ratepayerCode: "",           //纳税人识别号

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
            "actId": goods_info.actId
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

  orderSubmit: function (t) {
    var a = this, e = a.data.distribution, o = a.data.invoiceType, i = {};
    if(e == "1") {
      if (!a.data.address || !a.data.address.id) return void wx.showToast({
        title: "请选择收货地址",
        image: "/images/icon-warning.png"
      });
      i.address_id = a.data.address.id;
    }else {
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
    i.distribution = e, i.invoiceType = o, i.buyerRemarks = a.data.leaveWords;
    var goods_info = JSON.parse(a.data.options.goods_info);
    i.buyType = goods_info.buyType,
      i.actId = goods_info.actId,
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
        "buyerRemarks": i.buyerRemarks || ""
      },
      success: function (res) {
        wx.hideLoading();
        if(res.state == "0") {
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
        }else {
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
      a = parseFloat(t.data.productList[0].marketingInfo.presellInfo.deposit),
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