// pages/footprint/footprint.js
var app = getApp(), api = require("../../api.js"), util = require("../../utils/util.js");
var t = new Date();
var d = require('../../utils/date.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchTime: "",  //筛选时间
    showDays: !1,     //显示月份所有天数
    monthNum: t.getMonth() + 1,
    yearNum: t.getFullYear(),
    MonthDayArray: [],
    currentIndex: 0,
    selectNum: "",  //筛选日期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this), this.loadData({
      page: 1,
      reLoad: true
    });
  },

  loadData: function (options) {
    var a = this;
    if(a.data.is_loading) return;
    if(options.load_more && !a.data.is_more) return;
    a.setData({
      is_loading: true,
    }), app.request({
      url: api.user.foot,
      data: {
        "searchTime": a.data.searchTime || "",
        "pageIndex": options.page
      },
      success: function (res) {
        if(res.state == "0") {
          if(options.reLoad) {
            a.setData({
              page: options.page,
              list: res.data.data,
              is_more: res.data.data.length>0,
              show_no_data_tip: res.data.data.length == 0
            })
          }
          if (options.load_more) {
            a.setData({
              page: options.page,
              list: a.data.list.concat(res.data.data),
              is_more: res.data.data.length > 0,
            })
          }
        }
      },
      complete: function () {
        a.setData({
          is_loading: false,
        });}
    })
  },

  onShow: function () {
    this.calcMonthDayArray();
  },

  showDays: function () {
    this.setData({
      showDays: !this.data.showDays
    })
  },

  dateClick: function (e) {
    var a = this;
    var isDisable = e.currentTarget.dataset.isDisable;
    var id = e.currentTarget.dataset.id;
    if(isDisable) return;
    a.setData({
      selectNum: id,
      searchTime: a.data.yearNum+'-'+a.data.monthNum+'-'+id
    }), a.loadData({
      page: 1,
      reLoad: true
    });
  },

  lastMonth_Fn: function () {
    var n = this.data.monthNum;
    var y = this.data.yearNum;
    if (n == 1) {
      this.setData({
        monthNum: 12,
        yearNum: y - 1,
      });
    }
    else {
      this.setData({
        monthNum: n - 1,
      });
    }
    this.calcMonthDayArray();
  },

  nextMonth_Fn: function () {
    var n = this.data.monthNum;
    var y = this.data.yearNum;
    if (n == 12) {
      this.setData({
        monthNum: 1,
        yearNum: y + 1,
      });
    }
    else {
      this.setData({
        monthNum: n + 1,
      });
    }
    this.calcMonthDayArray();
  },


  calcMonthDayArray: function () {
    var that = this;
    var dateArray = d.paintCalendarArray(that.data.monthNum, that.data.yearNum);
    for (var i in dateArray) {
      for(var j in dateArray[i]) {
        if (dateArray[i][j].isSelect) {
          that.setData({
            currentIndex: i
          })
        }
      }
    }
    this.setData({
      MonthDayArray: dateArray,
    })
  },

  onReachBottom: function () {
    console.log("onReachBottom");
    var a = this;
    this.loadData({
      page: a.data.page + 1,
      load_more: true
    })
  },

})