// pages/address_edit/address_edit.js
var app = getApp(),
  api = require("../../api.js"),
  area_picker = require("../../area_picker/area_picker.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    mobile: "",
    detail: "",
    checked: "",
    region: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.pageOnLoad(this);
    var t = this;
    options.id ? (wx.setNavigationBarTitle({
      title: '编辑地址',
    }), t.setData({
      is_update: true,
      address_id: options.id
    }), wx.showLoading({
      title: "正在加载",
      mask: !0
    }), app.request({
      url: api.user.address_detail,
      data: {
        "id": options.id
      },
      success: function(res) {
        wx.hideLoading(), res.state == "0" && t.setData({
          name: res.data.deliveryName,
          mobile: res.data.deliveryPhone,
          detail: res.data.deliveryAddr,
          checked: res.data.isDefault,
          region: [res.data.deliveryProv, res.data.deliveryCity, res.data.deliveryArea],
        })
      }
    })) : wx.setNavigationBarTitle({
      title: '新增地址',
    });
  },

  /**
   * 所在地修改
   */
  bindRegionChange: function () {
    console.log("kkk")
    this.setData({
      area_picker_show: true,
    }), area_picker.init(this);
  },

  /**
   * 默认地址开关
   */
  switchChange: function(e) {
    e.detail.value ? this.setData({
      checked: "1"
    }) : this.setData({
      checked: "0"
    });
  },

  /**
   * 监听input输入
   */
  inputBlur: function(a) {
    var t = '{"' + a.currentTarget.dataset.name + '":"' + a.detail.value + '"}';
    this.setData(JSON.parse(t));
  },

  /**
   * 保存
   */
  saveAddress: function() {
    var a = this;
    if (a.data.name == "") return wx.showToast({
      title: "请输入收货人",
      image: "/images/icon-warning.png"
    }), !1;
    if (a.data.mobile == "" || (!/^1[3456789]\d{9}$/.test(a.data.mobile) && !/^0\d{2,3}-?\d{7,8}$/.test(a.data.mobile))) return wx.showToast({
      title: "电话格式不正确",
      image: "/images/icon-warning.png"
    }), !1;
    if (a.data.region.length == 0) return wx.showToast({
      title: "请选择所在地",
      image: "/images/icon-warning.png"
    }), !1;
    if (a.data.detail == "") return wx.showToast({
      title: "请输入详细地址",
      image: "/images/icon-warning.png"
    }), !1;
    wx.showLoading({
        title: "正在保存",
        mask: !0
      }),
      (a.data.is_update ? app.request({
        url: api.user.address_save,
        data: {
          "id": a.data.address_id,
          "deliveryName": a.data.name,
          "deliveryPhone": a.data.mobile,
          "deliveryProv": a.data.region[0],
          "deliveryCity": a.data.region[1],
          "deliveryArea": a.data.region[2],
          "deliveryAddr": a.data.detail,
          "isDefault": a.data.checked
        },
        success: function(a) {
          "0" == a.state && wx.showModal({
            title: "提示",
            content: a.message,
            showCancel: !1,
            success: function(a) {
              a.confirm && wx.navigateBack();
            }
          }), "0" != a.state && wx.showToast({
            title: a.message,
            image: "/images/icon-warning.png"
          });
        },
        complete: function() {
          wx.hideLoading();
        }
      }) : app.request({
        url: api.user.address_add,
        data: {
          "deliveryName": a.data.name,
          "deliveryPhone": a.data.mobile,
          "deliveryProv": a.data.region[0],
          "deliveryCity": a.data.region[1],
          "deliveryArea": a.data.region[2],
          "deliveryAddr": a.data.detail,
          "isDefault": a.data.checked
        },
        success: function(a) {
          "0" == a.state && wx.showModal({
            title: "提示",
            content: a.message,
            showCancel: !1,
            success: function(a) {
              a.confirm && wx.navigateBack();
            }
          }), "0" != a.state && wx.showToast({
            title: a.message,
            image: "/images/icon-warning.png"
          });
        },
        complete: function() {
          wx.hideLoading();
        }
      }));
  },

  deleteAddress: function () {
    var a = this;
    wx.showModal({
      title: '确定删除吗？',
      success: function(res) {
        res.confirm && app.request({
          url: api.user.address_del,
          data: { "id": a.data.address_id},
          success: function (res) {
            res.state == "0" && wx.navigateBack(), "0" != res.state && wx.showToast({
              title: res.message,
              image: "/images/icon-warning.png"
            });
          }
        })
      },
    })
  }
})