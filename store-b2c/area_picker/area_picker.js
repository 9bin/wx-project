// area_picker/area_picker.js
var api = require("../api.js");
var area_picker = {
  currentPage: null,
  region: [],
  init: function(a) {
    this.currentPage = a;
    var that = this;
    that.getData({
        pid: "0",
        level: "2"
      }), a.hideAreaPicker = function() {
        a.setData({
          area_picker_show: false
        })
      }, a.provinceChange = function(e) {
        var id = e.currentTarget.dataset.id,
          name = e.currentTarget.dataset.name;
        that.region = [], that.region[0] = name, a.setData({
          region: that.region,
          proChecked: id,
        }), that.getData({
          pid: id,
          level: "3"
        });
      }, a.cityChange = function(e) {
        var id = e.currentTarget.dataset.id,
          name = e.currentTarget.dataset.name;
        that.region.splice(2, 1), that.region[1] = name, a.setData({
          region: that.region,
          cityChecked: id,
        }), that.getData({
          pid: id,
          level: "4"
        });
      }, a.countyChange = function(e) {
        var id = e.currentTarget.dataset.id,
          name = e.currentTarget.dataset.name;
        that.region[2] = name, a.setData({
          region: that.region,
          couChecked: id,
        }), that.next();
      }, a.showProPick = function() {
        a.setData({
          showProPick: true,
          showCityPick: false,
          showCouPick: false
        })
      },
      a.showCityPick = function() {
        a.setData({
          showProPick: false,
          showCityPick: true,
          showCouPick: false
        })
      },
      a.showCouPick = function() {
        a.setData({
          showProPick: false,
          showCityPick: false,
          showCouPick: true
        })
      }
  },

  getData: function(options) {
    var that = this;
    getApp().request({
      url: api.user.get_area_list,
      data: {
        "pid": options.pid,
        "level": options.level
      },
      success: function(res) {
        if (res.state == "0") {
          if (options.level == "2") {
            that.currentPage.setData({
              area_picker_province_list: res.data,
              showProPick: true,
              showCityPick: false,
              showCouPick: false
            })
          }
          if (options.level == "3") {
            that.currentPage.setData({
              area_picker_city_list: res.data,
              showProPick: false,
              showCityPick: true,
              showCouPick: false
            })
          }
          if (options.level == "4") {
            that.currentPage.setData({
              area_picker_county_list: res.data,
              showProPick: false,
              showCityPick: false,
              showCouPick: true
            })
          }
        }
      }
    })
  },

  next: function() {
    this.currentPage.setData({
      area_picker_show: false
    });
    !new RegExp("address_edit").test(this.currentPage.route) && this.getFreight();
  },

  getFreight: function() {
    var that = this;
    getApp().request({
      url: api.default.freight_calculate,
      data: {
        "qty": that.currentPage.data.form.number,
        "freightTemplateId": that.currentPage.data.goods.freightTemplateId,
        "province": that.currentPage.data.proChecked,
        "city": that.currentPage.data.cityChecked || "",
        "area": that.currentPage.data.couChecked || ""
      },
      success: function(res) {
        res.state == "0" && that.currentPage.setData({
          freight: res.data.freight
        })
      }
    })
  },

};
module.exports = area_picker;