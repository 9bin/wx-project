//app.js
var api, util = require("./utils/util.js");
var userInfo = {
  account: "17711110009",
  address: null,
  area: null,
  birthday: "2017-12-15",
  capital: 88888424.03,
  city: null,
  full_path: "http://s.b2c.com/kz/ui/b2c/common/images/user50x50x01.jpg",
  gold: 2664,
  isrealemail: "0",
  isrealmobile: "0",
  lastLoginTime: "2018-11-27 10:38:19",
  level: "318",
  levelName: "普通会员",
  maid: "382",
  mid: "364",
  nickname: "David",
  obligationOrderCount: 16,
  province: null,
  qq: null,
  realEmail: null,
  realMobile: "17711110009",
  realname: null,
  sex: "1",
  status: "1",
  waitDeliveryOrderCount: 1,
  waitEvaluateOrderCount: 2,
  waitReceiptOrderCount: 0
};
App({
  is_on_launch: !0,
  onLaunch: function() {
    this.setApi(),
      api = this.api,
      // this.getStoreData(),
      // this.getCatList();
      wx.setStorageSync("user_info", userInfo);
  },
  /**
   * 小程序获取商铺信息
   */
  getStoreData: function() {
    this.request({
      url: api.default.store,
      success: function(e) {
        0 == e.code && (wx.setStorageSync("store", e.data.store), wx.setStorageSync("store_name", e.data.store_name),
          wx.setStorageSync("show_customer_service", e.data.show_customer_service), wx.setStorageSync("contact_tel", e.data.contact_tel),
          wx.setStorageSync("share_setting", e.data.share_setting));
      },
      complete: function() {}
    });
  },
  /**
   * 小程序获取分类列表
   */
  getCatList: function() {
    this.request({
      url: api.default.cat_list,
      success: function(e) {
        if (0 == e.code) {
          var t = e.data.list || [];
          wx.setStorageSync("cat_list", t);
        }
      }
    });
  },
  /**
   * 小程序发起请求
   */
  request: require("utils/request.js"),
  /**
   * 全局接口
   */
  api: require("api.js"),
  setApi: function() {
    var n = this.siteInfo.siteroot;
    n = n.replace("app/index.php", ""), n += "api/",
      this.api = function e(t) {
        for (var a in t) "string" == typeof t[a] ? t[a] = t[a].replace("{$_api_root}", n) : t[a] = e(t[a]);
        return t;
      }(this.api);
  },
  /**
   * 请求域名
   */
  siteInfo: require("siteinfo.js"),
  /**
   * 底部导航数据，后台获取，待删除
   */
  _navbar: require("utils/navbar.js"),
  /**
   * 页面加载
   */
  pageOnLoad: function(e) {
    this.page.onLoad(e);
  },
  /**
   * 监听页面显示
   */
  pageOnShow: function(e) {
    this.page.onShow(e);
  },
  page: require("utils/page.js"),
  /**
   * 图片上传
   */
  uploader: require("utils/uploader.js"),
  /**
   * try to bind parent
   */
  loginBindParent: function(object) {
    var access_token = wx.getStorageSync("access_token");
    if (access_token == '') {
      return true;
    }
    getApp().bindParent(object);
  },
  bindParent: function(object) {
    if (object.parent_id == "undefined" || object.parent_id == 0)
      return;
    console.log("Try To Bind Parent With User Id:" + object.parent_id);
    var user_info = wx.getStorageSync("user_info");
    var share_setting = wx.getStorageSync("share_setting");
    if (share_setting.level > 0) {
      var parent_id = object.parent_id;
      if (parent_id != 0) {
        getApp().request({
          url: api.share.bind_parent,
          data: {
            parent_id: object.parent_id
          },
          success: function(res) {
            if (res.code == 0) {
              user_info.parent = res.data
              wx.setStorageSync('user_info', user_info);
            }
          }
        });
      }
    }
  },
  /**
   * 获取短信验证码
   */
  getSmsCode: function(page, mobile = '', sendCodeType, callback) {
    //验证手机号是否正确
    if (mobile == '' || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(mobile))) {
      callback(-1);
      return;
    }
    //限制获取短信时间
    var time = 60;
    var timeInterval;
    page.setData({
      statuGetSmsCode: true,
    });
    timeInterval = setInterval(function() {
      if (time >= 2) {
        time -= 1;
        page.setData({
          getSmsCodeTxt: time + '秒后重试',
        });
      } else {
        page.setData({
          statuGetSmsCode: '',
          getSmsCodeTxt: '获取验证码',
        });
        clearInterval(timeInterval);
      }
    }, 1000);
    //获取短信验证码
    this.request({
      url: api.default.getSmsCode,
      data: {
        'mobile': mobile,
        "sendCodeType": sendCodeType
      },
      success: function(res) {
        callback(res);
      }
    });
  },
  /**
   * 底部导航点击事件
   */
  navigatorClick: function(e, t) {
    var a = e.currentTarget.dataset.open_type;
    if ("redirect" == a) return !0;
    if ("wxapp" == a) {
      var n = e.currentTarget.dataset.path;
      "/" != n.substr(0, 1) && (n = "/" + n), wx.navigateToMiniProgram({
        appId: e.currentTarget.dataset.appid,
        path: n,
        complete: function(e) {
          console.log(e);
        }
      });
    }
    if ("tel" == a) {
      var o = e.currentTarget.dataset.tel;
      wx.makePhoneCall({
        phoneNumber: o
      });
    }
    return !1;
  },
  globalData: {
    userInfo: null
  }
})