// pages/home/home.js
var app = getApp(),
  api = require('../../api.js'),
  share_count = 0,
  interval = 0,
  timer1 = 1,
  timer2 = 1,
  msgHistory = "",
  purchase_frame = !0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color_style: "#eb0c36", //首页板式默认值
    play: -1, //播放器当前播放
    time: 0,
    buy_user: "",
    buy_address: "",
    buy_time: 0,
    buy_type: "",
    "module_list": [ //首页布局，后台数据，待删
      {
        "name": "banner"
      },
      {
        "name": "nav"
      },
      {
        "name": "notice"
      },
      {
        "name": "qianggou"
      },
      {
        "name": "miaosha"
      },
      {
        "name": "block"
      },
      {
        "name": "yushou"
      },
      {
        "name": "video",
        "video_id": "28",
      },
      {
        "name": "banner_ad"
      },
      {
        "name": "video",
        "video_id": "27",
      },
      {
        "name": "cat"
      },
      // {
      //   "name": "single_cat",
      //   "cat_id": "2"
      // },
      // {
      //   "name": "single_cat",
      //   "cat_id": "1"
      // },
    ],
    "nav_count": 0,
    "nav_icon_list": [ //导航图标，后台数据，待删
      {
        "name": "商品分类",
        "icon": 'fi-class-solid',
        "background": "background:-webkit-linear-gradient(top,#ff3155,#ff6e91)",
        "url": "/pages/category/category",
        "open_type": "switchTab",
        "pic_url": "/images/delete/icon-1.png"
      },
      {
        "name": "领券中心",
        "icon": 'fi-coupon',
        "background": "background:-webkit-linear-gradient(top,#38d095,#67e2b3)",
        "url": "/pages/coupon_list/coupon_list",
        "open_type": "navigate",
        "pic_url": "/images/delete/icon-2.png"
      },
      {
        "name": "积分商城",
        "icon": 'fi-gift',
        "background": "background:-webkit-linear-gradient(top,#f85931,#fc8c70)",
        "url": "/pages/integral_mall/integral_mall",
        "open_type": "navigate",
        "pic_url": "/images/delete/icon-3.png"
      },
      {
        "name": "我的收藏",
        "icon": 'fi-star',
        "background": "background:-webkit-linear-gradient(top,#3361ff,#6e95ff)",
        "url": "/pages/conllect/conllect",
        "open_type": "navigate",
        "pic_url": "/images/delete/icon-4.png"
      },
    ],
    "notice": [ //公告，后台数据，待删
      {
        "id": "1",
        "title": "小米年度压箱底，又一款全面屏手机亮相"
      },
      {
        "id": "10",
        "title": "测试腾讯视频"
      },
      {
        "id": "48",
        "title": "她她她开放的哈伦裤；护发素可怜的很疯狂撒电话费凯撒的回复撒"
      },
      {
        "id": "40",
        "title": "测试"
      }
    ],
    "block": [ //推荐商品，后台数据，待删除
      {
        "pic_url": "/images/delete/indexAd345x370x01.jpg",
        "url": "",
        "open_type": ""
      },

      {
        "pic_url": "/images/delete/indexAd345x175x01.jpg",
        "url": "\/pages\/share\/index",
        "open_type": "navigate"
      },
      {
        "pic_url": "/images/delete/indexAd345x175x02.jpg",
        "url": "\/pages\/coupon-list\/coupon-list",
        "open_type": "navigate"
      },
      // {
      //   "pic_url": "https:\/\/xcx.jxzggsp.com\/addons\/zjhj_mall\/core\/web\/uploads\/image\/1a\/1a1bf48f510d849b419765391b766f72.jpg",
      //   "url": "\/pages\/article-list\/article-list?id=2",
      //   "open_type": "navigate"
      // },
    ],
    "banner_ad": [ //首页banner图，后台数据，待删
      {
        "id": "1",
        "store_id": "1",
        "pic_url": "/images/ad750x150x01.jpg",
        "title": "不知道什么图",
        "page_url": "",
        "sort": "100",
        "addtime": "1522381117",
        "is_delete": "0",
        "type": "1",
        "open_type": "navigate"
      },
      {
        "id": "2",
        "store_id": "1",
        "pic_url": "/images/ad750x150x01.jpg",
        "title": "",
        "page_url": "",
        "sort": "100",
        "addtime": "1522381237",
        "is_delete": "0",
        "type": "1",
        "open_type": "navigate"
      }
    ],
    "video_list": [
      {
        content: "测试",
        id: "28",
        pic_url: "https://www.xkedou.cn/addons/zjhj_mall/core/web/uploads/image/60/6085ed8782c0a6b7eb052893796a41bbf271be80.png",
        url: "https://www.zdhywl.cc/addons/zjhj_mall/core/web/uploads/video/40/401e3a297a6f67224ca2aa4f6a04370d.mp4"
      },
      {
        content: "测试",
        id: "27",
        pic_url: "https://www.xkedou.cn/addons/zjhj_mall/core/web/uploads/image/60/6085ed8782c0a6b7eb052893796a41bbf271be80.png",
        url: "https://www.zdhywl.cc/addons/zjhj_mall/core/web/uploads/video/40/401e3a297a6f67224ca2aa4f6a04370d.mp4"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var value = "2018-07-05 00:00:00";
    console.log();
    app.pageOnLoad(this), this.loadData(options);
    var that = this,
      parent_id = 0,
      user_id = options.user_id,
      scene = decodeURIComponent(options.scene);
    if (user_id != undefined && null != user_id) {
      parent_id = user_id;
    } else if (scene != undefined && null != scene) {
      parent_id = scene;
    }
    app.loginBindParent({
      parent_id: parent_id
    });
  },

  /**
   * 加载页面数据 `
   */
  loadData: function(options) {
    var that = this;
    var page_home_data = wx.getStorageSync("page_home_data");
    if (page_home_data) {
      that.setData(page_home_data);
    }
    that.qianggouTimer();
    that.miaoshaTimer();
    app.request({
      url: api.default.index,
      success: function (res) {
        if(res.state == "0") {
          that.setData(res.data);
          wx.setStorageSync('page_home_data', res.data);
          that.qianggouTimer();
          that.miaoshaTimer();
        }
      },
      complete: function () {
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 限时秒杀倒计时
   */
  miaoshaTimer: function() {
    var t = this;
    t.data.seckillEntity && t.data.seckillEntity.differSecond && (clearInterval(timer1), timer1 = setInterval(function() {
      0 < t.data.seckillEntity.differSecond ? (t.data.seckillEntity.differSecond = t.data.seckillEntity.differSecond - 1,
        t.data.seckillEntity.times = t.getTimesBySecond(t.data.seckillEntity.differSecond), t.setData({
        seckillEntity: t.data.seckillEntity
        })) : clearInterval(timer1);
    }, 1e3));
  },
  /**
   * 限时抢购倒计时
   */
  qianggouTimer: function () {
    var t = this;
    t.data.flashSaleEntity && t.data.flashSaleEntity.differSecond && (clearInterval(timer2), timer2 = setInterval(function () {
      0 < t.data.flashSaleEntity.differSecond ? (t.data.flashSaleEntity.differSecond = t.data.flashSaleEntity.differSecond - 1,
        t.data.flashSaleEntity.times = t.getTimesBySecond(t.data.flashSaleEntity.differSecond), t.setData({
          flashSaleEntity: t.data.flashSaleEntity
        })) : clearInterval(timer2);
    }, 1e3));
  },
  /**
   * 格式化时间
   */
  getTimesBySecond: function(t) {
    if (t = parseInt(t), isNaN(t)) return {
      h: "00",
      m: "00",
      s: "00"
    };
    var a = parseInt(t / 3600),
      e = parseInt(t % 3600 / 60),
      i = t % 60;
    return {
      h: a < 10 ? "0" + a : "" + a,
      m: e < 10 ? "0" + e : "" + e,
      s: i < 10 ? "0" + i : "" + i
    };
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this,
      navigationBarColor = wx.getStorageSync('_navigation_bar_color') || false;
    if (navigationBarColor) that.setData({
      color_style: navigationBarColor.backgroundColor
    });
    // purchase_frame ? that.suspension(that.data.time) : that.setData({
    //   buy_user: ""
    // }), 
    that.notice();
  },
  /**
   * 获取最新公告
   */
  notice: function() {
    // var taht = this;
    // app.request({
    //   url: api.default.notice,
    //   success: function (res) {
    //     console.log(res);
    //     if(res.code == 0) {
    //       that.setData({
    //         notice: res.data
    //       })
    //     }
    //   }
    // })
  },
  /**
   * 左上角悬浮框
   */
  suspension: function() {
    var r = this;
    interval = setInterval(function() {
      app.request({
        url: api.default.buy_data,
        data: {
          time: r.data.time
        },
        method: "POST",
        success: function(t) {
          if (0 == t.code) {
            var a = !1;
            msgHistory == t.md5 && (a = !0);
            var e = "",
              i = t.cha_time,
              n = Math.floor(i / 60 - 60 * Math.floor(i / 3600));
            e = 0 == n ? i % 60 + "秒" : n + "分" + i % 60 + "秒";
            var o = "购买了",
              s = "/pages/goods/goods?id=" + t.data.goods;
            2 === t.data.type ? (o = "预约了", s = "/pages/yuhsou/details/details?id=" + t.data.goods) : 3 === t.data.type ? (o = "秒杀了",
              s = "/pages/miaosha/details/details?id=" + t.data.goods) : 4 === t.data.type && (o = "抢购了",
              s = "/pages/limit_time_buy/details/details?gid=" + t.data.goods), !a && t.cha_time <= 300 ? (r.setData({
              buy_time: e,
              buy_type: o,
              buy_url: s,
              buy_user: 5 <= t.data.user.length ? t.data.user.slice(0, 4) + "..." : t.data.user,
              buy_avatar_url: t.data.avatar_url,
              buy_address: 8 <= t.data.address.length ? t.data.address.slice(0, 7) + "..." : t.data.address
            }), msgHistory = t.md5) : r.setData({
              buy_user: "",
              buy_type: "",
              buy_url: s,
              buy_address: "",
              buy_avatar_url: "",
              buy_time: ""
            });
          }
        }
      });
    }, 1e4);
  },
  /**
   * 点击跳转小程序事件
   */
  navigatorClick: function(t) {
    var a = t.currentTarget.dataset.open_type,
      e = t.currentTarget.dataset.url;
    return "wxapp" != a || ((e = function(t) {
        var a = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
          e = /^[^\?]+\?([\w\W]+)$/.exec(t),
          i = {};
        if (e && e[1])
          for (var n, o = e[1]; null != (n = a.exec(o));) i[n[1]] = n[2];
        return i;
      }(e)).path = e.path ? decodeURIComponent(e.path) : "", console.log("Open New App"),
      wx.navigateToMiniProgram({
        appId: e.appId,
        path: e.path,
        complete: function(t) {
          console.log(t);
        }
      }), !1);
  },
  /**
   * 底部导航点击事件
   */
  naveClick: function(t) {
    app.navigatorClick(t, this);
  },
  /**
   * 监听--播放器播放
   */
  play: function(t) {
    this.setData({
      play: t.currentTarget.dataset.index
    });
  },
  /**
   * 监听隐藏--显示公告
   */
  showNotice: function() {
    this.setData({
      show_notice: !0
    });
  },
  closeNotice: function() {
    this.setData({
      show_notice: !1
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      play: -1
    }), clearInterval(interval), console.log("hide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.setData({
      play: -1
    }), clearInterval(timer1), clearInterval(timer2), clearInterval(interval), console.log("unload");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    clearInterval(timer1), clearInterval(timer2), this.loadData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var a = this;
    // return {
    //   path: "/pages/index/index?user_id=" + wx.getStorageSync("user_info").id,
    //   success: function (t) {
    //     1 == ++share_count && app.shareSendCoupon(a);
    //   },
    //   title: a.data.store.name
    // };
  },
  showText: function () {
    this.setData({
      showText: true
    })
  }
})