// pages/evaluate/evaluate.js
var app = getApp(),
  api = require('../../api.js');
  var md5 = require("../../utils/md5.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_anon: !0,
    logisticeScore: 5,
    serviceScore: 5,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.pageOnLoad(this);
    options.id && (this.setData({
      id: options.id
    }), this.loadData());
    var a = this;
    wx.getSystemInfo({
      success: function(res) {
        if (res.errMsg == "getSystemInfo:ok") {
          var android = new RegExp("Android");
          var ios = new RegExp("iOS");
          if (android.test(res.system)) a.setData({
            terminal: "2"
          });
          if (ios.test(res.system)) a.setData({
            terminal: "3"
          });
        }
      },
    })
  },

  loadData: function() {
    var a = this;
    wx.showLoading({
      mask: true,
    }), app.request({
      url: api.evaluate.comment_preview,
      method: "GET",
      header: {
        "content-type": "application/json"
      },
      data: {
        "orderId": a.data.id
      },
      success: function(t) {
        if (t.state == "0") {
          var orderLineIds = "";
          for (var i in t.data.orderLineList) t.data.orderLineList[i].disScore = 5, t.data.orderLineList[i].content = "",
            t.data.orderLineList[i].pic_list = [], t.data.orderLineList[i].uploaded_pic_list = [], orderLineIds += "," + t.data.orderLineList[i].id;
          a.setData({
            goods_list: t.data.orderLineList,
            orderCode: t.data.orderCode,
            uploadType: t.data.uploadType,
            orderLineIds: orderLineIds.length ? orderLineIds.substring(1) : ""
          });
        } else {
          wx.showModal({
            title: "提示",
            content: t.message,
            showCancel: !1,
            success: function(res) {
              res.confirm && wx.navigateBack();
            }
          })
        }

      },
      complete: function() {
        wx.hideLoading()
      }
    })
  },

  commentSubmit: function() {
    var a = this;
    wx.showLoading({
      title: "正在提交",
      mask: !0
    });
    var n = a.data.goods_list;
    var siteInfo = app.siteInfo;
    var timeStamp = Date.parse(new Date());
    var paramsToSign = "appId=" + siteInfo.appId + "&version=" + siteInfo.version + "&timeStamp=" + timeStamp + "&key=" + siteInfo.key;
    var sign = md5.md5(paramsToSign).toLocaleUpperCase();
    var d = {
      "appId": siteInfo.appId,
      "version": siteInfo.version,
      "timeStamp": timeStamp,
      "sign": sign,
      "file_type": "bmp,gif,jpg,png,jpeg" ,
      "upload_type": a.data.uploadType 
    };
    var data = {
      "orderId": a.data.id,
      "orderCode": a.data.orderCode,
      "terminal": a.data.terminal,
      "isDiscuss": "0",
      "serviceScore": a.data.serviceScore,
      "logisticeScore": a.data.logisticeScore,
      "orderLineIds": a.data.orderLineIds,
    };
    for (var i in n) {
      data['disScore_' + n[i].id] = n[i].disScore;
      data['disContent_' + n[i].id] = n[i].content;
      data['disProductId_' + n[i].id] = n[i].subProductId;
      data['disProductName_' + n[i].id] = n[i].productName;
      data['disProductProperty_' + n[i].id] = n[i].property;
      data['disAnon_' + n[i].id] = a.data.is_anon;
      data["disImages_" + n[i].id] = "";
    }
    n.length && function e(o) {
      if(o == n.length) return void app.request({
        url: api.evaluate.add_comment,
        data: data,
        success: function (res) {
          wx.hideLoading(), res.state == '0' && wx.showModal({
            title: "提示",
            content: res.message,
            showCancel: !1,
            success: function (t) {
              t.confirm && wx.redirectTo({
                url: "/pages/order/order?status=3"
              });
            }
          }), res.state != '0' && wx.showToast({
            title: res.message,
            image: "/images/icon-warning.png"
          });
        }
      });
      var s = 0;
      if (!n[o].pic_list.length || 0 == n[o].pic_list.length) return e(o + 1);
      for (var t in n[o].pic_list) !function (i) {
        wx.uploadFile({
          url: api.default.upload_image,
          name: "file",
          formData: d,
          filePath: n[o].pic_list[i],
          complete: function (str) {
            console.log(str)
            if (str.data) {
              var a = JSON.parse(str.data);
              "0" == a.state && (n[o].uploaded_pic_list[i] = a.data.fileUrl, data["disImages_" + n[o].id] += "," + a.data.fileUrl);
            }
            if (++s == n[o].pic_list.length) return (data["disImages_" + n[o].id] = data["disImages_" + n[o].id].substring(1), e(o + 1));
          }
        });
      }(t);
    }(0);
  },

  /**
   * 描述打分
   */
  setScore1: function(e) {
    var i = e.currentTarget.dataset.score,
      a = e.currentTarget.dataset.index,
      e = this.data.goods_list;
    e[a].disScore = i, this.setData({
      goods_list: e
    })
  },

  /**
   * 服务打分
   */
  setScore2: function(e) {
    var i = e.currentTarget.dataset.score;
    this.setData({
      serviceScore: i,
    })
  },

  /**
   * 物流打分
   */
  setScore3: function(e) {
    var i = e.currentTarget.dataset.score;
    this.setData({
      logisticeScore: i,
    })
  },

  /**
   * 评鉴内容
   */
  contentInput: function(t) {
    var a = this,
      i = t.currentTarget.dataset.index;
    a.data.goods_list[i].content = t.detail.value, a.setData({
      goods_list: a.data.goods_list
    });
  },

  /**
   * 删除图片
   */
  deleteImage: function(t) {
    var a = t.currentTarget.dataset.index,
      i = t.currentTarget.dataset.picIndex,
      e = this.data.goods_list;
    e[a].pic_list.splice(i, 1), this.setData({
      goods_list: e
    });
  },

  /**
   * 选择图片
   */
  chooseImage: function(t) {
    var a = this,
      i = t.currentTarget.dataset.index,
      e = a.data.goods_list,
      o = e[i].pic_list.length;
    wx.chooseImage({
      count: 5 - o,
      success: function(t) {

        e[i].pic_list = e[i].pic_list.concat(t.tempFilePaths), a.setData({
          goods_list: e
        });
      }
    });
  },

  /**
   * 匿名开关
   */
  radio: function() {
    this.setData({
      is_anon: !this.data.is_anon
    })
  }

})