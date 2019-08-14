// pages/category/category.js
var app = getApp(),
  api = require('../../api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    color_style: "#333333",  //quanju板式默认值
    sub_cat_list_scroll_top: 0, //竖向滚动条位置
    cat_list: [],               //分类列表初始值
    current_index_active: 0, //分类选择初始值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
    this.loadData();
  },
  /**
   * 左边导航点击事件
   */
  catItemClick: function (t) {
    var index = t.currentTarget.dataset.index, cat_list = this.data.cat_list, current_cat = null;
    for (var i in cat_list) if (i == index) current_cat = cat_list[i];
    this.setData({
      current_index_active: index,
      sub_cat_list_scroll_top: 0,
      current_cat: current_cat
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this,
    navigationBarColor = wx.getStorageSync('_navigation_bar_color') || false,
    hotSearch = wx.getStorageSync('hotSearch') || false;
    if (navigationBarColor) this.setData({
      color_style: navigationBarColor.backgroundColor
    });
    if (hotSearch) this.setData({
      hotSearch: hotSearch
    });
  },

  /**
   * 数据加载
   */
  loadData: function () {
    var that = this;
    var cat_list = wx.getStorageSync("cat_list");
    if (cat_list) {
      that.setData({
        cat_list: cat_list,
        current_cat: cat_list[0],
      });
    }
    app.request({
      url: api.default.cat_list,
      success: function (res) {
        console.log(res);
        if (res.state == '0' && res.data.length > 0) {
          that.setData({
            cat_list: res.data,
            current_cat: res.data[0],
          });
          wx.setStorageSync("cat_list", res.data);
        }
      },
    });
  },
})