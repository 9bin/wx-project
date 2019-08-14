// pages/order_refund_logistics/order_refund_logistics.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logisticsCompany: "",    //物流公司
    logisticsCode: "",     //物流单号
    logisticsCompanyLogogram: "", //物流简码
    imgList: [],            //上传图片地址
    imgNameList: ["20181210112017981.jpg"],            //上传图片名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    options.id && options.extype && this.setData({
      id: options.id,
      extype: options.extype
    });
  },

  submit: function (event) {
    var page = this,
      value = event.detail.value,
      imgNameList = page.data.imgNameList,
      pic_url = "";
    if (!value.logisticsCompany) return void wx.showToast({
      title: '请选择物流公司',
      image: '/images/icon-warning.png',
    });
    if (!value.logisticsCode) return void wx.showToast({
      title: '请输入物流单号',
      image: '/images/icon-warning.png',
    });
    if (imgNameList.length==0) return void wx.showToast({
      title: '请上传凭证',
      image: '/images/icon-warning.png',
    });
    for (var i in imgNameList) { pic_url += "," + imgNameList[i];}
    wx.showLoading({
      title: "正在提交",
      mask: true,
    }), app.request({
      url: api.order.fill_in_logistics,
      data: {
        "logisticsCompanyName": value.logisticsCompany,
        "logisticsCompany": value.logisticsCode,
        "logisticsCode": page.data.logisticsCompanyLogogram,
        "returnType": page.data.extype,
        "pic_url": pic_url.substring(1),
        "id": page.data.id
      },
      success: function (res) {
        res.state == "0" ? wx.showToast({
          title: '提交成功',
          icon: 'success',
        }) : wx.showModal({
          title: '提交失败',
          content: res.message,
          showCancel: !1
        })
      },
      complete: function () {wx.hideLoading()}
    })

  },

  /**
   * 上传文件
   */
  chooseImg: function (e) {
    if (this.data.imgList.length>5) return;
    var that = this;
    app.uploader.upload({
      name: 'file',
      data: {
        "upload_type": "upload_temp",
      },
      start: function (a) {
        wx.showLoading({
          title: "正在上传",
          mask: !0
        })
      },
      success: function (a) {
        if ("0" == a.state) {
          that.data.imgList.push(a.data.fileUrl), that.data.imgNameList.push(a.data.fileName), that.setData({
            imgList: that.data.imgList,
            imgNameList: that.data.imgNameList
          })
        } else {
          that.showToast({
            title: a.message,
          });
        }
      },
      error: function (a) {
        that.showToast({
          title: a.message,
        });
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  /**
   * 取消图片
   */
  cancleChoose: function () {
    var o = t.currentTarget.dataset.index, a = this.data.imgList, n = this.data.fileName;
    this.setData({
      imgList: a.splice(o, 1),
      fileName: a.splice(o,1)
    })
  },

  /**
   * 查看大图
   */
  onGoodsImageClick: function (t) {
    var o = t.currentTarget.dataset.index, a = this.data.imgList;
    wx.previewImage({
      urls: a,
      current: a[o]
    });
  },

  onShow: function () {
    app.pageOnShow(this);
  }
})