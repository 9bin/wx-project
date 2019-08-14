// pages/address_picker/address_picker.js
var api = require("../../api.js"), app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address_list: null,
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    options.id && this.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadData({
      page: 1,
      reload: true
    });
  },

  loadData: function (options) {
    var e = this;
    if (options.loadmore && !e.data.is_more) return;
    wx.showNavigationBarLoading(), app.request({
      url: api.user.address_list,
      data: { "pageIndex": options.page },
      success: function (res) {
        if (res.state == "0") {
          if (options.reload) {
            e.setData({
              address_list: res.data.data,
              page: options.page,
              is_more: res.data.data.length > 0,
              show_no_data_tip: 0 == res.data.data.length
            });
          }
          if (options.loadmore) {
            e.setData({
              address_list: e.data.address_list.concat(res.data.data),
              page: options.page,
              is_more: res.data.data.length > 0
            });
          }
        }
      },
      complete: function () { wx.hideNavigationBarLoading();}
    });
  },

  getWechatAddress: function () {
    wx.chooseAddress({
      success: function (a) {
        console.log(a);
        "chooseAddress:ok" == a.errMsg && (wx.showLoading(), app.request({
          url: api.user.address_add,
          data: {
            "deliveryPost": a.nationalCode,
            "deliveryName": a.userName,
            "deliveryPhone": a.telNumber,
            "deliveryAddr": a.detailInfo,
            "deliveryProv": a.provinceName,
            "deliveryCity": a.cityName,
            "deliveryArea": a.countyName,
          },
          success: function (res) {
            "0" == res.state ? (wx.setStorageSync("picker_address", res.data), wx.navigateBack()) : wx.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: !1
            });
          },
          complete: function () {
            wx.hideLoading();
          }
        }));
      }
    });
  },

  radioChange: function (e) {
    var e = e.detail.value, s = this.data.address_list[e], wxCurrPage = getCurrentPages(),
      wxPrevPage = wxCurrPage[wxCurrPage.length - 2];
    wxPrevPage.setData({
      address: s
    }), wx.navigateBack();
  }, 

  editAddress: function (e) {
    var that = this, id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/address_edit/address_edit?id=' + id,
    })
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");
    var that = this;
    that.loadData({
      page: that.data.page + 1,
      loadmore: true,
    });
  },
})