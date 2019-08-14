// pages/distribution/distribution.js
var app = getApp(),
  api = require('../../api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    distribution: "1", //配送方式
    name: "", //联系人
    mobile: "", //联系方式
    selfPickAddr: null, //自提地点
    productIds: "", //商品Ids
  },

  getSendType: function(e) {
    var distribution = e.currentTarget.dataset.distribution;
    this.setData({
      distribution: distribution
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.pageOnLoad(this);
    if (options.productIds) this.setData({
      productIds: options.productIds,
    });
    var page = this;
    wx.getStorage({
      key: 'selfPickData',
      success: function(res) {
        page.setData({
          distribution: res.data.distribution,
          name: res.data.selfPickAddrPerson,
          mobile: res.data.selfPickAddrPhone,
          selfPickAddr: res.data.selfPickAddr
        })
      },
    });

  },

  /**
   * 监听input输入
   */
  inputBlur: function(a) {
    var t = '{"' + a.currentTarget.dataset.name + '":"' + a.detail.value + '"}';
    this.setData(JSON.parse(t));
  },

  /**
   * 提交表单
   */
  submit: function() {
    var distribution = this.data.distribution,
      name = this.data.name,
      mobile = this.data.mobile,
      selfPickAddr = this.data.selfPickAddr,
      wxCurrPage = getCurrentPages(),
      wxPrevPage = wxCurrPage[wxCurrPage.length - 2];
    if (distribution == "1") {
      wxPrevPage.setData({
        distribution: distribution,
      }), wx.removeStorage({
        key: 'selfPickData',
      }), wx.navigateBack({
        delta: 1,
      });
    } else {
      if (name == "") return wx.showToast({
        title: "请输入联系人",
        image: "/images/icon-warning.png"
      }), !1;
      if (mobile == "" || (!/^1[3456789]\d{9}$/.test(mobile) && !/^0\d{2,3}-?\d{7,8}$/.test(mobile))) return wx.showToast({
        title: "电话格式不正确",
        image: "/images/icon-warning.png"
      }), !1;
      if (selfPickAddr == null) return wx.showToast({
        title: "请选择自提点",
        image: "/images/icon-warning.png"
      }), !1;
      wxPrevPage.setData({
        distribution: distribution,
        selfPickAddrPerson: name,
        selfPickAddrPhone: mobile,
        selfPickAddr: selfPickAddr
      }), wx.setStorage({
        key: 'selfPickData',
        data: {
          distribution: distribution,
          selfPickAddrPerson: name,
          selfPickAddrPhone: mobile,
          selfPickAddr: selfPickAddr
        },
      }), wx.navigateBack({
        delta: 1,
      });
    }
  },
})