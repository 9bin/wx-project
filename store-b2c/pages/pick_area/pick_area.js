// pages/pick_area/pick_area.js
var app = getApp(),
  api = require("../../api.js");
// area = require("../../utils/area.js"),
// QQMapWX = require('../../utils/qqmap-wx-jssdk.js'),
// demo = new QQMapWX({
//   key: 'EWMBZ-LPBAX-TID47-ZHYTU-NZPG2-C4FQA' // 必填
// });
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // province: [],
    // cities: [],
    // county: [],
    // list: [],
    // province_name: "",
    // city_name: "",
    // county_name: "",
    // province_index: [0],
    // city_index: [0],
    // county_index: [0],
    // changePicker: "",
    // area_picker_show: false,
    // showProPick: false,
    // showCityPick: false,
    // showCouPick: false
    checked: "",
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.pageOnLoad(this);
    var page = this,
      id = options.id || "",
      productIds = options.productIds || "";
    productIds && wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res);
        "getLocation:ok" == res.errMsg && page.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          productIds: productIds
        }), page.loadData();
      },
    });
    id && page.setData({
      checked: id,
    });
  },

  loadData: function(options) {
    var page = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    }), app.request({
      url: api.order.get_self_pick_addr_list,
      data: {
        "productIds": page.data.productIds,
        "longitude": page.data.longitude,
        "latitude": page.data.latitude,
      },
      success: function(a) {
        a.state == "0" && page.setData({
          list: a.data,
        });
      },
      complete: function() {
        wx.hideLoading();
      }
    });

  },

  /**
   * 监听选择器修改
   */
  radioChange: function(e) {
    var receiveId = e.detail.value,
      list = this.data.list,
      wxCurrPage = getCurrentPages(),
      wxPrevPage = wxCurrPage[wxCurrPage.length - 2];
    wxPrevPage.setData({
      selfPickAddr: list[receiveId]
    }), wx.navigateBack({
      delta: 1,
    });

  },

  // /**
  //  * 监听省份修改
  //  */
  // bindProChange: function(e) {
  //   const val = e.detail.value;
  //   this.setData({
  //     province_index: val,
  //     changePicker: "province"
  //   })
  // },

  // /**
  //  * 监听城市修改
  //  */
  // bindCityChange: function(e) {
  //   const val = e.detail.value;
  //   this.setData({
  //     city_index: val,
  //     changePicker: "city"
  //   })
  // },

  // /**
  //  * 监听县区修改
  //  */
  // bindCouChange: function(e) {
  //   const val = e.detail.value;
  //   this.setData({
  //     county_index: val,
  //     changePicker: "county"
  //   })
  // },


  // /**
  //  * 显示地区选择弹窗
  //  */
  // showPickView: function(e) {
  //   var area = e.currentTarget.dataset.area,
  //     that = this;
  //   if (area == "province") {
  //     that.setData({
  //       area_picker_show: true,
  //       showProPick: true,
  //       showCityPick: false,
  //       showCouPick: false
  //     })
  //   } else if (area == "city") {
  //     that.setData({
  //       area_picker_show: true,
  //       showProPick: false,
  //       showCityPick: true,
  //       showCouPick: false
  //     })
  //   } else if (area == "county") {
  //     that.setData({
  //       area_picker_show: true,
  //       showProPick: false,
  //       showCityPick: false,
  //       showCouPick: true
  //     })
  //   } else {
  //     that.setData({
  //       area_picker_show: false,
  //       showProPick: false,
  //       showCityPick: false,
  //       showCouPick: false
  //     })
  //   }

  // },

  // /**
  //  * 隐藏地区选择弹窗
  //  */
  // hideAreaPicker: function() {
  //   this.setData({
  //     area_picker_show: false,
  //     showProPick: false,
  //     showCityPick: false,
  //     showCouPick: false
  //   })
  // },

  // /**
  //  * 提交地区选择
  //  */
  // areaPickerConfirm: function() {
  //   var that = this,
  //   province = that.data.province,
  //     cities = that.data.cities,
  //     county = that.data.county,
  //     province_index = that.data.province_index,
  //     city_index = that.data.city_index,
  //     county_index = that.data.county_index,
  //     province_name = that.data.province_name,
  //     city_name = that.data.city_name,
  //     county_name = that.data.county_name,
  //     changePicker = that.data.changePicker;
  //   if (changePicker == "province") {
  //     that.setData({
  //       province_name: province[province_index[0]],
  //     }), that.hideAreaPicker(), setTimeout(function () {
  //       that.setProvince()
  //     }, 200)
  //   }else if (changePicker == "city") {
  //     that.setData({
  //       city_name: cities[city_index[0]],
  //     }), that.hideAreaPicker(), setTimeout(function () {
  //       that.setProvince()
  //     }, 200)
  //   }else if ( changePicker == "county") {
  //     that.setData({
  //       county_name: county[county_index[0]],
  //     }), that.hideAreaPicker(), setTimeout(function () {
  //       that.setProvince()
  //     }, 200)
  //   }else {
  //     that.hideAreaPicker();
  //   }
  //   console.log(this.data.province_name + '--' + this.data.city_name + '--' + this.data.county_name);
  // },

  // /**
  //  * 省市区设置
  //  */
  // setProvince: function() {
  //   var province = [],
  //     province_index = [0],
  //     province_name = this.data.province_name;
  //     for(var i in area) {
  //       province.push(area[i].name);
  //       if (area[i].name == province_name) {
  //         province_index[0] = i;
  //       }
  //     }
  //     this.setData({
  //       province: province,
  //       province_index: province_index,
  //       province_name: province[province_index[0]],
  //     }), this.setCity({
  //       'province': area[province_index[0]], 
  //     });
  // },

  // setCity: function (options) {
  //   var province = options.province, cities = [], city_index = [0], city_name = this.data.city_name;
  //   for (var j in province.city) {
  //     cities.push(province.city[j].name);
  //     if (city_name == province.city[j].name) {
  //       city_index[0] = j;
  //     }
  //   }
  //   this.setData({
  //     cities: cities,
  //     city_index: city_index,
  //     city_name: cities[city_index[0]],
  //   }), this.setCounty({
  //     'city': province.city[city_index[0]],
  //   });

  // },

  // setCounty: function (options) {
  //   var city = options.city,
  //     county = [],
  //     county_index = [0],
  //     county_name = this.data.county_name;

  //   county = city.districtAndCounty;
  //   for (var k in county) {
  //     if (county_name == county[k]) {
  //       county_index[0] = k;
  //       break;
  //     }
  //   }
  //   this.setData({
  //     county: county,
  //     county_index: county_index,
  //     county_name: county[county_index[0]]
  //   })
  // },



})