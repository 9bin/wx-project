// pages/integral_mall/detail/detail.js
var api = require("../../../api.js"),
  utils = require("../../../utils.js"),
  app = getApp(),
  WxParse = require("../../../wxParse/wxParse.js");
import Swiper from '../../../utils/Swiper.js';
var area_picker = require("../../../area_picker/area_picker.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    nav_status: 0, //导航初始状态
    showMenu: false, //首页flaot初始状态
    hide: "hide", //显示、隐藏vedio
    current: 0, //banner当前滑块
    chickTag: 0, //评价标签初始值
    toggleClass: false, //点赞
    tab_detail: false, //商品页产品详情展示
    form: { //表单初始值
      number: 1
    },
    goods: null, //产品数据
    evaluateTag: [], //评价标签
    evaluateList: [], //评价列表
    region: [],
    freight: 0,
    "goods_qrcode": "",
    page: 1
  },

  /**
   * 分享
   */
  showShareModal: function () {
    this.setData({
      share_modal_active: "active",
      no_scroll: !0
    });
  },
  shareModalClose: function () {
    this.setData({
      share_modal_active: "",
      no_scroll: !1
    });
  },

  /**
   * 生成海报
   */
  getGoodsQrcode: function () {
    var a = this;
    if (a.setData({
      goods_qrcode_active: "active",
      share_modal_active: ""
    }), a.data.goods_qrcode) return !0;
    // app.request({
    //   url: api.miaosha.goods_qrcode,
    //   data: {
    //     goods_id: a.data.id
    //   },
    //   success: function (t) {
    //     0 == t.code && a.setData({
    //       goods_qrcode: t.data.pic_url
    //     }), 1 == t.code && (a.goodsQrcodeClose(), wx.showModal({
    //       title: "提示",
    //       content: t.msg,
    //       showCancel: !1,
    //       success: function (t) {
    //         t.confirm;
    //       }
    //     }));
    //   }
    // });
  },
  goodsQrcodeClose: function () {
    this.setData({
      goods_qrcode_active: "",
      no_scroll: !1
    });
  },

  /**
   * 保存海报图片
   */
  saveGoodsQrcode: function () {
    var a = this;
    wx.saveImageToPhotosAlbum ? (wx.showLoading({
      title: "正在保存图片",
      mask: !1
    }), wx.downloadFile({
      url: a.data.goods_qrcode,
      success: function (t) {
        wx.showLoading({
          title: "正在保存图片",
          mask: !1
        }), wx.saveImageToPhotosAlbum({
          filePath: t.tempFilePath,
          success: function () {
            wx.showModal({
              title: "提示",
              content: "商品海报保存成功",
              showCancel: !1
            });
          },
          fail: function (t) {
            wx.showModal({
              title: "图片保存失败",
              content: t.errMsg,
              showCancel: !1
            });
          },
          complete: function (t) {
            console.log(t), wx.hideLoading();
          }
        });
      },
      fail: function (t) {
        wx.showModal({
          title: "图片下载失败",
          content: t.errMsg + ";" + a.data.goods_qrcode,
          showCancel: !1
        });
      },
      complete: function (t) {
        console.log(t), wx.hideLoading();
      }
    })) : wx.showModal({
      title: "提示",
      content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      showCancel: !1
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    options.id && (this.setData({
      id: options.id
    }), this.getGoods());
  },

  /**
   * 获取商品详情
   */
  getGoods: function () {
    var page = this;
    app.request({
      url: api.default.getGoods,
      data: { "subProductId": page.data.id },
      success: function (res) {
        if (res.state == "0") {
          var a = res.data.detailDescTouch || "";
          WxParse.wxParse("detail", "html", a, page), page.setData({
            goods: res.data,
            attr_group_list: res.data.propertyEntity,
            evaluateTag: res.data.discussLabelList
          });
          if (res.data.listImg.length > 0) {
            var s = wx.createSelectorQuery();
            s.select('#swiper').boundingClientRect(function (a) {
              page.setData({
                swiperWidth: a.width
              })
              var swiper = new Swiper(page, {
                startSlide: 0,              // 初始化跳到第几个轮播图
                speed: 300,                   // 运动缓慢
                continuous: true,             //是否连续
                length: res.data.listImg.length, //幻灯片数据长度
                width: page.data.swiperWidth,    //幻灯片宽度
              })
            }).exec();
          }
          page.addFoot();
        } else {
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel: !1,
            success: function (res) {
              res.confirm && wx.switchTab({
                url: '/pages/index/index',
              })
            },
          })
        }

      }
    })
  },

  /**
   * 导航菜单切换
   */
  navTap: function (e) {
    var that = this,
      status = e.currentTarget.dataset.nav_status;
    this.setData({
      nav_status: status
    })
    if (status == 0) {
      that.setData({
        tab_detail: false,
        scrollTop: 0,
      })
    } else if (status == 1) {
      that.setData({
        tab_detail: true
      }), that.setData({
        toview: "goodsDetail"
      });
    } else {
      that.getProductComment({
        page: 1,
        reload: true
      });
    }
  },

  /**
   * 返回首页float弹出框显示、隐藏
   */
  showMenu: function () {
    this.setData({
      showMenu: !this.data.showMenu
    })
  },

  /**
   * 视屏播放
   */
  play: function (t) {
    var a = t.target.dataset.url;
    this.setData({
      url: a,
      hide: "",
      show: !0
    }), wx.createVideoContext("video").play();
  },

  /**
   * 查看banner大图
   */
  onGoodsImageClick: function (t) {
    var o = t.currentTarget.dataset.index, a = this.data.goods.listImg;
    wx.previewImage({
      urls: a,
      current: a[o]
    });
  },

  onGoodsImageClickOne: function (t) {
    var o = t.currentTarget.dataset.src;
    wx.previewImage({
      urls: [o],
    });
  },

  /**
   * 查看评价图片
   */
  commentPicView: function (t) {
    console.log(t);
    var o = t.currentTarget.dataset.picIndex;
    wx.previewImage({
      current: this.data.goods.commentEntity.imageList[o],
      urls: this.data.goods.commentEntity.imageList
    });
  },

  /**
   * 地址修改
   */
  bindRegionChange: function () {
    this.setData({
      area_picker_show: true,
    }), area_picker.init(this);
  },

  /**
   * 显示，隐藏规格选择
   */
  hideAttrPicker: function () {
    this.setData({
      show_attr_picker: !1
    });
  },
  showAttrPicker: function () {
    this.setData({
      show_attr_picker: !0
    });
  },

  /**
   * 选择规格
   */
  attrClick: function (e) {
    var that = this,
      attr_group_id = e.currentTarget.dataset.groupId,
      attr_id = e.currentTarget.dataset.id,
      attr_group_list = that.data.attr_group_list;
    for (var i in attr_group_list) {
      if (attr_group_list[i].attrId == attr_group_id) {
        for (var j in attr_group_list[i].propertyList) {
          if (attr_group_list[i].propertyList[j].attrvalueId == attr_id) {
            attr_group_list[i].propertyList[j].selectState = 1;
          } else {
            attr_group_list[i].propertyList[j].selectState = 0;
          }
        }
      }
    }
    that.setData({
      attr_group_list: attr_group_list,
    });

    var check_attr_list = "";
    for (var i in attr_group_list) {
      for (var j in attr_group_list[i].propertyList) {
        if (attr_group_list[i].propertyList[j].selectState == 1) {
          check_attr_list = check_attr_list + ',' + (attr_group_list[i].propertyList[j].attrvalueId);
          break;
        }
      }
    }
    check_attr_list && that.data.goods.data_str && (that.setData({
      id: JSON.parse(that.data.goods.data_str)[check_attr_list.substring(1)]
    }), that.getGoods());
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
    that.setData({
      form: {
        number: num
      }
    });
  },

  /**
   * 购买提交订单
   */
  buyNow: function () {
    this.submit("BUY_NOW");
  },
  submit: function (t) {
    var a = this;
    if (a.data.form.number > a.data.goods.productQty) return a.showToast({
      title: "商品库存不足，请选择其它规格或数量",
      image: "/images/icon-warning.png"
    }), !0;
      "BUY_NOW" == t && wx.navigateTo({
        url: "/pages/integral_mall/order_submit/order_submit?goods_info=" + JSON.stringify({
          goods_id: a.data.id,
          num: a.data.form.number,
          buyType: "6",
        })
      });
  },

  /**
   * 获取评价列表
   */
  getProductComment: function (options) {
    var that = this;
    if (that.data.id_loading) return;
    if (options.loadmore && !that.data.is_more) return;
    that.setData({
      is_loading: true
    }), app.request({
      url: api.evaluate.get_evaluate_list,
      data: {
        "mainProductId": that.data.goods.mainProductId,
        "type": "0",
        "pageIndex": options.page,
        "lableId": that.data.evaluateTagId || ""
      },
      success: function (res) {
        if (res.state == "0") {
          if (options.reload) {
            that.setData({
              evaluateList: res.data.list,
              page: options.page,
              is_more: res.data.list.length > 0,
              show_no_data_tip: 0 == res.data.list.length
            });
          }
          if (options.loadmore) {
            that.setData({
              evaluateList: that.data.evaluateList.concat(res.data.list),
              page: options.page,
              is_more: res.data.list.length > 0
            });
          }
        }
      },
      complete: function () {
        that.setData({
          is_loading: false
        })
      }
    })
  },

  /**
   * 评价标签选择
   */
  chickTag: function (e) {
    var that = this,
      id = e.currentTarget.dataset.id,
      tag = that.data.evaluateTag;
    for (var i in tag) {
      if (tag[i].labelId == id) {
        tag[i].active = true
      } else {
        tag[i].active = false
      }
    };
    that.setData({
      evaluateTag: tag,
      evaluateTagId: id
    }), that.getProductComment({
      page: 1,
      reload: true
    });
  },

  /**
   * 产品详情展示
   */
  showGoodsDetail: function () {
    this.setData({
      tab_detail: true,
      nav_status: 1
    })
  },

  /**
   * 收藏或者取消收藏
   */
  collect: function (e) {
    var page = this, flag = e.currentTarget.dataset.flag;
    app.request({
      url: api.user.collect,
      data: { "collectionFlag": flag, "subProductId": page.data.goods.id },
      success: function (res) {
        res.state == "0" && flag == 0 ? page.data.goods.collectionFlag = 1 : page.data.goods.collectionFlag = 0, page.setData({
          goods: page.data.goods
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  scrolltolower: function () {
    console.log("scrolltolower");
    var that = this;
    that.getProductComment({
      page: that.data.page + 1,
      loadmore: true,
    });
  },

  /**
   * 新增会员足迹
   */
  addFoot: function () {
    var a = this;
    app.request({
      url: api.user.add_foot,
      data: {
        "mainProductId": a.data.goods.mainProductId,
        "subProductId": a.data.goods.id
      },
      success: function (res) { }
    })
  },

  onShow: function () {
    app.pageOnLoad(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})