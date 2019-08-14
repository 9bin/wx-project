// pages/invoice/invoice.js
var app = getApp(),
  api = require('../../api.js'),
  WxPares = require("../../wxParse/wxParse.js"),
  data = require("../../data.js");
var Validate = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceType: "1", //发票类型
    invoiceTitle: "", //发票抬头
    invoiceTitleType: [ //发票抬头类型
      {
        name: '1',
        value: '个人',
      },
      {
        name: '2',
        value: '单位'
      },
    ],
    unit: "",              //单位名称
    invoiceTitleChecked: "1", //发票抬头类型初始值
    invoiceContent: "2", //发票明细初始值
    ratepayerCode: "", //纳税人识别号
    showCodeState: false, //显示发票税号说明
    showInvoiceState: false, //显示发票须知
    modleTitle: "", // 弹出窗标题
    codeState: data.codeState, //发票税号说明详细
    invoiceState: data.invoiceState //发票须知详细
  },

  getSendType: function(e) {
    var invoiceType = e.currentTarget.dataset.invoiceType;
    this.setData({
      invoiceType: invoiceType
    });
  },

  bindUnitInput: function(e) {
    this.setData({
      unit: e.detail.value
    })
  },

  bindCodeInput: function(e) {
    this.setData({
      ratepayerCode: e.detail.value
    })
  },

  radioChange: function(e) {
    this.setData({
      invoiceTitleChecked: e.detail.value
    });
  },

  radioChange2: function(e) {
    this.setData({
      invoiceContent: e.detail.value
    })
  },

  showCodeState: function() {
    this.setData({
        showModle: true,
        modleTitle: '发票税号说明'
      }),
      WxPares.wxParse("content", "html", this.data.codeState, this);
  },

  closeModle: function() {
    this.setData({
      showModle: false,
    })
  },

  showInvoiceState: function() {
    this.setData({
        showModle: true,
        modleTitle: '发票须知'
      }),
      WxPares.wxParse("content", "html", this.data.invoiceState, this);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.pageOnLoad(this);
    var a = this;
    wx.getStorage({
      key: 'invoice',
      success: function(res) {
        console.log(res);
        a.setData({
          invoiceType: res.data.invoiceType,
          invoiceContent: res.data.invoiceContent,
          unit: res.data.unit,
          ratepayerCode: res.data.ratepayerCode,
          invoiceTitleChecked: res.data.invoiceTitleChecked
        })
      },
    })
  },

  submit: function() {
    var page = this,
      wxCurrPage = getCurrentPages(),
      wxPrevPage = wxCurrPage[wxCurrPage.length - 2];
    var invoiceTitle = "", invoiceTitleChecked = page.data.invoiceTitleChecked;
    invoiceTitleChecked == "1" ? (invoiceTitle = "个人") : (invoiceTitle = page.data.unit || "");
    console.log(invoiceTitle);
    wxPrevPage.setData({
      invoiceType: page.data.invoiceType || "1",
      invoiceContent: page.data.invoiceContent,
      invoiceTitle: invoiceTitle,
      ratepayerCode: page.data.ratepayerCode
    }), wx.navigateBack({
      delta: 1,
    }), wx.setStorage({
      key: 'invoice',
      data: {
        invoiceType: page.data.invoiceType || "1",
        invoiceContent: page.data.invoiceContent,
        unit: page.data.unit,
        invoiceTitleChecked: invoiceTitleChecked,
        ratepayerCode: page.data.ratepayerCode
      }
    });
  }
})