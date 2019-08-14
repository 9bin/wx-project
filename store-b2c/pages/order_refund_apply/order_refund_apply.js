// pages/order_refund_apply/order_refund_apply.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    returnType: 0,   //类型（0、退货  1、换货）
    form: { //表单初始值
      number: 1
    },
    desc: "", //文本内容
    imgList: [],            //上传图片地址
    imgNameList: ["20181210112017981.jpg"],            //上传图片名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    options.id && (this.setData({ id: options.id }), this.loadData());
  },

  loadData: function () {
    var a = this;
    wx.showLoading({
      mask: true,
    }), app.request({
      url: api.order.refund_apply_detail,
      data: { "olid": a.data.id},
      success: function (res) {
        res.state == "0" ? a.setData({
          goods: res.orderLineMap,
          gifts: res.orderGiftList,
          remainRejectedQty: res.remainRejectedQty
        }) : wx.showModal({
          title: '加载失败',
          content: res.message,
          showCancel: !1,
          success: function (res) {
            res.confirm && wx.navigateBack({
              delta: 1,
            })
          }
        })
      },
      complete: function () {wx.hideLoading()}
    })
  },

  /**
   * 提交表单
   */
  submit: function () {
    var page = this,
      desc = page.data.desc,
      imgNameList = page.data.imgNameList,
      pic_url = "";
    if (!desc) return void wx.showToast({
      title: '请描述您的问题',
      image: '/images/icon-warning.png',
    });
    if (imgNameList.length == 0) return void wx.showToast({
      title: '请上传凭证',
      image: '/images/icon-warning.png',
    });
    for (var i in imgNameList) { pic_url += "," + imgNameList[i]; }
    wx.showLoading({
      title: "正在提交",
      mask: true,
    }), app.request({
      url: api.order.refund_apply,
      data: {
        "olid": page.data.id,
        "returnType": page.data.returnType,
        "rejectedCount": page.data.form.number,
        "applicationRemark": desc,
        "pic_url": pic_url
      },
      success: function (res) {
        res.state == "0" ? (wx.showToast({
          title: '提交成功',
          image: '/images/icon-success.png',
        }),setTimeout(function(){wx.navigateBack({
          delta: 1,
        })},1000)) : page.showToast({title: res.message});
      },
      complete: function (res) {wx.hideLoading()}
    })
  },

  /**
   * 类型（0、退货  1、换货）
   */
  typeChoose: function (e) {
    var returnType = e.currentTarget.dataset.returnType;
    this.setData({
      returnType: returnType
    })
  },

  /**
   * 数量减少
   */
  numberSub: function () {
    var t = this.data.form.number;
    if (t <= 1) return !0;
    t-- , this.setData({
      form: {
        number: t
      }
    });
  },

  /**
   * 数量添加
   */
  numberAdd: function () {
    var t = this,
      a = t.data.form.number;
    if (++a > t.data.remainRejectedQty && 0 != t.data.remainRejectedQty) return wx.showToast({
      title: "最多能退" + t.data.remainRejectedQty + "件",
      image: "/images/icon-warning.png"
    }), !0;
    t.setData({
      form: {
        number: ++a
      }
    });
  },

  /**
   * 监听数量修改
   */
  numberBlur: function (e) {
    var that = this;
    var num = e.detail.value;
    num = parseInt(num);
    if (isNaN(num) || num <= 0) num = 1;
    else if (that.data.remainRejectedQty < num && that.data.remainRejectedQty < num != 0) (wx.showToast({
      title: "最多能退" + that.data.remainRejectedQty + "件",
      image: "/images/icon-warning.png"
    }), num = that.data.remainRejectedQty);
    that.setData({
      form: {
        number: num
      }
    });
  },

  /**
   * 监听文本输入
   */
  areaInput: function (e) {
    var desc = e.detail.value;
    this.setData({
      desc: desc
    })
  },

  /**
   * 上传文件
   */
  chooseImg: function (e) {
    if (this.data.imgList.length > 5) return;
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
      fileName: a.splice(o, 1)
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

  /**
   * 商品详情跳转
   */
  navGoodsDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + id,
    })
  },

  /**
   * 商品详情跳转
   */
  navGiftDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/marketing/goods/goods?id=' + id,
    })
  },

  onShow: function () {
    app.pageOnShow(this)
  },

})