// pages/miaosha/detail/detail.js
var api = require("../../../api.js"), utils = require("../../../utils.js"), app = getApp(), WxParse = require("../../../wxParse/wxParse.js");

var beginX = 0;//触摸时的原点
var area_picker = require("../../../area_picker/area_picker.js");
var miaoshaInterval = 0;
import Swiper from "../../../utils/Swiper.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    status: 0,       //秒杀状态  
    nav_status: 0,   //导航初始状态
    showMenu: false,   //首页flaot初始状态
    hide: "hide",     //显示、隐藏vedio
    current: 0,        //banner当前滑块
    chickTag: 0,       //评价标签初始值
    toggleClass: false,  //点赞
    tab_detail: false,   //商品页产品详情展示
    evaluateTag: [], //评价标签
    evaluateList: [], //评价列表
    miaosha_end_time_over: { //秒杀时间初始值
      h: "--",
      m: "--",
      s: "--",
    },
    form: {             //表单初始值
      number: 1
    },
    goods: {},     //产品数据
    region: [],    //收货地区
    freight: 0,     //运费
    "goods_qrcode": ""
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
  onLoad: function(options) {
    app.pageOnLoad(this);
    options.id && (this.setData({
      id: options.id
    }),
    this.getGoods());
  },

  /**
   * 获取商品详情
   */
  getGoods: function () {
    var page = this;
    app.request({
      url: api.default.getGoods,
      data: { "subProductId": page.data.id},
      success: function (res) {
        if(res.state == "0") {
          var a = res.data.detailDescTouch || "";
          WxParse.wxParse("detail", "html", a, page), page.setData({
            goods: res.data,
            evaluateTag: res.data.discussLabelList,
            miaosha_data: res.data.marketingInfo.seckillInfo
          }), page.data.miaosha_data && page.setMiaoshaTimeOver();
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
        }else {
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel: !1,
            success: function(res) {
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
   * 设置秒杀时间
   */
  setMiaoshaTimeOver: function () {
    var a = this;
    function t() {
      var t = a.data.miaosha_data.seckillEndTime || 0;
      a.data.miaosha_data.seckillEndTime--, t = t < 0 ? 0 : t, a.setData({
        miaosha_data: a.data.miaosha_data,
        miaosha_end_time_over: function (t) {
          var a = parseInt(t / 3600), o = parseInt(t % 3600 / 60), e = t % 60;
          return {
            h: a < 10 ? "0" + a : "" + a,
            m: o < 10 ? "0" + o : "" + o,
            s: e < 10 ? "0" + e : "" + e,
          };
        }(t)
      });
      t == 0 && (clearInterval(miaoshaInterval), a.getGoods());
    }
    t(), miaoshaInterval = setInterval(function () {
      t();
    }, 1e3);
  },

  /**
   * 导航菜单切换
   */
  navTap: function (e) {
    var that = this, status = e.currentTarget.dataset.nav_status;
    this.setData({
      nav_status: status
    })
    if(status == 0) {
      that.setData({ tab_detail: false, scrollTop: 0,})
    }else if (status == 1) {
      that.setData({ tab_detail: true }), that.setData({
        toview: "goodsDetail"
        });
    }else {
      that.setData({
        scrollTop: 0,
        tab_detail: false,
        toview: ""
      }), that.getProductComment({
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
  
  // /**
  //  * 监听video组件滑动
  //  */
  // catchtouchstart: function (e) {
  //   beginX = e.changedTouches[0].pageX; // 获取触摸时的原点
  // },
  // colse_view: function (e) {
  //   var that = this, endX = e.changedTouches[0].pageX;
  //   // 向右滑动
  //   if (endX - beginX >= 125) {
  //     console.log('向右滑动');
  //     that.setData({
  //       current: that.data.goods.pic_list.length - 1,
  //       hide: "hide",
  //     }), wx.createVideoContext("video").stop();
  //   } else if (endX - beginX <= -125) {
  //       console.log('向左滑动');
  //     that.setData({
  //       current: that.data.current + 1,
  //       hide: "hide",
  //     }), wx.createVideoContext("video").stop();
  //   }
  // },

  /**
   * 地址修改
   */
  bindRegionChange: function () {
    this.setData({
      area_picker_show: true,
    }), area_picker.init(this);
  },

  /**
   * 显示，隐藏优惠券列表
   */
  showCouponList: function () {
    this.setData({
      show_coupon_list: !0
    }), this.getCouponList();
  },
  hideCouponList: function () {
    this.setData({
      show_coupon_list: !1
    });
  },

  /**
   * 显示，隐藏促销列表
   */
  showPromotionList: function () {
    this.setData({
      show_promotion_list: !0
    });
  },
  hidePromotionList: function () {
    this.setData({
      show_promotion_list: !1
    });
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
    var t = this, a = t.data.form.number;
    if (++a > t.data.miaosha_data.useLimit && 0 != t.data.miaosha_data.useLimit) return wx.showToast({
      title: "一单限购" + t.data.miaosha_data.useLimit + "件",
      image: "/images/icon-warning.png"
    }), !0;
    t.setData({
      form: {
        number: a
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
    if(isNaN(num) || num<=0) num = 1;
    else if (that.data.miaosha_data.useLimit < num && that.data.miaosha_data.useLimit < num != 0) (wx.showToast({
      title: "一单限购" + that.data.miaosha_data.useLimit + "件",
      image: "/images/icon-warning.png"
    }), num = that.data.miaosha_data.useLimit); that.setData({
        form: {
          number: num
        }
    });
  },

  /**
   * 根据商品获取此商品下的优惠券
   */
  getCouponList: function () {
    var page = this;
    wx.showLoading({
      title: '加载中...',
      mask: true,
    }), app.request({
      url: api.coupon.get_coupont_by_product,
      data: { "subProductId": page.data.id},
      success: function (res) {
        res.state == "0" && page.setData({
          coupon_list: res.data
        })
      },
      complete: function () {wx.hideLoading();}
    })
  },

  /**
   * 领取优惠券
   */
  receive: function (e) {
    var id = e.currentTarget.dataset.id, page = this, coupon_list = page.data.coupon_list;
    app.request({
      url: api.coupon.receive,
      data: { "batchId": id},
      success: function (res) {
        if(res.state == "0") {
          for (var i in coupon_list) {
            if (coupon_list[i].id == id) {
              coupon_list[i].isUse = '1';
              break;
            }
          }
          page.setData({
            coupon_list: coupon_list
          })
        } else {
          page.showToast({
            title: res.message
          })
        }
      }
    })
  },

  /**
   * 去预约
   */
  book: function (e) {
    var id = e.currentTarget.dataset.id, page = this;
    app.request({
      url: api.miaosha.appointment,
      data: { "activeId": page.data.miaosha_data.id, "subProductId": id },
      success: function (res) {
        if (res.state == "0") {
            page.showToast({
            title: '预约成功，将在开抢十分钟前以短信形式通知您！',
          });
          page.data.miaosha_data.areadySubscribe = 1, page.setData({
            miaosha_data: page.data.miaosha_data
          })
        } else {
          page.showToast({ title: res.message });
        }
      }
    })
  },

  buyOrigin: function() {
    this.submit("BUY_ORIGIN");
  },

  /**
   * 购买提交订单
   */
  buyNow: function () {
    this.data.miaosha_data ? this.submit("BUY_NOW") : wx.showModal({
      title: "提示",
      content: "秒杀商品当前时间暂无活动",
      showCancel: !1,
    });
  },
  submit: function (t) {
    var a = this;
    if ("BUY_NOW" == t && a.data.miaosha_data && 0 < a.data.miaosha_data.currentStock && a.data.form.number > a.data.miaosha_data.currentStock) return wx.showToast({
      title: "商品库存不足",
      image: "/images/icon-warning.png"
    }), !0;
    if (a.data.form.number > a.data.goods.realProductQty) return wx.showToast({
      title: "商品库存不足",
      image: "/images/icon-warning.png"
    }), !0;
    "BUY_NOW" == t && app.request({
      url: api.order.check_order,
      data: { "buyType": "3", "actId": a.data.miaosha_data.id, "count": a.data.form.number, "pid": a.data.id },
      success: function (res) {
        if (res.state == "0") {
          wx.navigateTo({
            url: "/pages/miaosha/order_submit/order_submit?goods_info=" + JSON.stringify({
              goods_id: a.data.id,
              num: a.data.form.number,
              buyType: "3",
              actId: a.data.miaosha_data.id
            })
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel: !1
          })
        }
      }
    });
    "BUY_ORIGIN" == t && wx.navigateTo({
      url: "/pages/miaosha/order_submit/order_submit?goods_info=" + JSON.stringify({
        goods_id: a.data.id,
        num: a.data.form.number,
        buyType: "1",
      })
    });
  },

  /**
   * 点赞
   */
  toggleClass: function (e) {
    var that = this, id = e.currentTarget.dataset.id, list = that.data.pingjia.pingjia_list;
    for (var i in list) { if (list[i].id == id) { list[i].toggleClass = !list[i].toggleClass } };
    that.setData({
      pingjia: that.data.pingjia
    })

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
   * 产品详情展示
   */
  showGoodsDetail: function () {
    this.setData({
      tab_detail: true,
      nav_status: 1
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
   * 收藏或者取消收藏
   */
  collect: function (e) {
    var page = this, flag = e.currentTarget.dataset.flag;
    app.request({
      url: api.user.collect,
      data: { "collectionFlag": flag, "subProductId": page.data.goods.id},
      success: function (res) {
        res.state == "0" && flag == 0 ? page.data.goods.collectionFlag = 1 : page.data.goods.collectionFlag = 0, page.setData({
          goods: page.data.goods
        })
      }
    })
  },

  onShow: function () {
    app.pageOnLoad(this);
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})