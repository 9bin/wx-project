module.exports = {
  currentPage: null,
  onLoad: function (page) {
    console.log("--------pageOnLoad----------"), this.currentPage = page;
    var that = this;
    void 0 === page.showToast && (page.showToast = function (e) {
      that.showToast(e);
    })
    // getApp().setNavigationBarColor(), this.setPageNavbar(page), page.naveClick = function (e) {
    //   getApp().navigatorClick(e, page);
    // }, this.setDeviceInfo(), this.setPageClasses(), 
    this.setUserInfo();
  },

  onShow: function (e) {
    console.log("--------pageOnShow----------"), this.currentPage = e;
  },
  setPageNavbar: function (page) {
    console.log("----setPageNavbar----");
    var that = this, navbar = wx.getStorageSync('_navbar');
    if (navbar) {
      setNavbar(navbar);
    }
    var o = !1;
    for (var t in this.navbarPages) if (page.route == this.navbarPages[t]) {
      o = !0;
      break;
    }
    // o ? getApp().request({
    //       url: getApp().api.default.navbar,
    //       success: function (res) {
    //         0 == res.code && (setNavbar(res.data), wx.setStorageSync("_navbar", res.data), that.setPageClasses());
    //       }
    //     }) : console.log("----setPageNavbar Return----");
    wx.setStorageSync('_navbar', getApp()._navbar);


    function setNavbar(navbar) {
      var in_navs = false;
      var route = page.route || (page.__route__ || null);
      for (var i in navbar.navs) {
        if (navbar.navs[i].url === "/" + route) {
          navbar.navs[i].active = true;
          in_navs = true;
        } else {
          navbar.navs[i].active = false;
        }
      }
      in_navs && 　page.setData({ _navbar: navbar });
    }
  },
  showToast: function (e) {
    console.log("--- showToast ---");
    var a = this.currentPage, o = e.duration || 2500, t = e.title || "", n = (e.success,
      e.fail, e.complete || null);
    a._toast_timer && clearTimeout(a._toast_timer), a.setData({
      _toast: {
        title: t
      }
    }), a._toast_timer = setTimeout(function () {
      var e = a.data._toast;
      e.hide = !0, a.setData({
        _toast: e
      }), "function" == typeof n && n();
    }, o);
  },
  setDeviceInfo: function () {
    var e = this.currentPage, a = [{
      id: "device_iphone_5",
      model: "iPhone 5"
    }, {
      id: "device_iphone_x",
      model: "iPhone X"
    }], o = wx.getSystemInfoSync();
    if (o.model) for (var t in 0 <= o.model.indexOf("iPhone X") && (o.model = "iPhone X"),
      a) a[t].model == o.model && e.setData({
        __device: a[t].id
      });
  },
  navbarPages: ["pages/home/home"],
  setPageClasses: function () {
    var e = this.currentPage, a = e.data.__device;
    e.data._navbar && e.data._navbar.navs && 0 < e.data._navbar.navs.length && (a += " show_navbar"),
      a && e.setData({
        __page_classes: a
      });
  },
  setUserInfo: function () {
    var e = this.currentPage, a = wx.getStorageSync("user_info");
    a && e.setData({
      __user_info: a
    });
  },
};