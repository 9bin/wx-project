// pages/yushou/yushou.js
var app = getApp(), api = require("../../api.js");
var is_no_more = !1;
var beginX = 0, moveX = 0, endX = 0, animation = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: "1", //顶部导航初始位置
    sort: "11", //产品排序初始值
    page: 1, //数据页面首页
    showScreenView: false,
    animationData: {},      //筛选弹窗动画
    screenTagShow: true, //筛选分类详细内容显示
    priceTagIndex: -1,       //当前选中的价格筛选值
    cat: { price: { min: "", max: "" }, classfiy: {id: "", name: ""} }, //筛选form表单的值
    params: { //列表数据加载参数
      classId: "",
      priceBegin: '',
      priceEnd: '',
    },
    goods_list: [],
    cat_list: [],        //分类列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this), this.reloadGoodsList(), this.getCatList();
  },

  /**
   * 数据加载
   */
  reloadGoodsList: function () {
    var a = this;
    is_no_more = !1, a.setData({
      page: 1,
      goods_list: [],
      show_no_data_tip: !1
    });
    var params = a.data.params,
      i = a.data.page || 1;
    wx.showLoading({
      title: '加载中...',
    }), app.request({
      url: api.yushou.list,
      data: {
        'pageIndex': i,
        'sort': a.data.sort,
        'classId': params.classId,
        'priceBegin': params.priceBegin,
        'priceEnd': params.priceEnd,
      },
      success: function (res) {
        '0' == res.state && (0 == res.data.productList.length && (is_no_more = !0), a.setData({
          page: i + 1
        }), a.setData({
          content: res.data.content,
          goods_list: res.data.productList,
          priceWhere: res.data.priceWhere
          })), a.setData({
            show_no_data_tip: 0 == a.data.goods_list.length
          });
      },
      complete: function () {wx.hideLoading();}
    })
  },

  /**
   * 加载更多数据
   */
  loadMoreGoodsList: function () {
    var i = this,
      params = i.data.params || "",
      o = i.data.page || 2;
    if(i.data.is_loading) return;
    i.setData({
      is_loading: !0
    }), app.request({
      url: api.yushou.list,
      data: {
        'pageIndex': o,
        'sort': i.data.sort,
        'classId': params.classId,
        'priceBegin': params.priceBegin,
        'priceEnd': params.priceEnd,
      },
      success: function (res) {
        '0' == res.state && (0 == res.data.productList.length && (is_no_more = !0), i.setData({
          page: o + 1
        }), i.setData({
          goods_list: i.data.goods_list.concat(res.data.productList),
        }));
      },
      complete: function () {
        i.setData({
          is_loading: !1
        })
      }
    })
  },

  /**
   * 获取分类列表
   */
  getCatList: function () {
    var cat_list = wx.getStorageSync("cat_list") || [], that = this;
    cat_list ? that.setData({
      cat_list: cat_list
    }) : app.request({
      url: api.default.cat_list,
      success: function (res) {
        if (res.state == '0' && res.data.length > 0) {
          that.setData({
            cat_list: res.data
          }), wx.setStorageSync("cat_list", res.data);
        }
      },
    });

  },

  /**
   * 顶部导航
   */
  sortClick: function (e) {
    var page = this,
      sort = page.data.sort,
      select = e.currentTarget.dataset.select;
    switch (select) {
      case "1":
        sort = "11";
        break;
      case "2":
        sort = "1";
        break;
      case "3":
        sort == "3" ? sort = "4" : sort = "3";
        break;
    }
    this.setData({
      select: select,
      sort: sort,
    }), this.reloadGoodsList();
  },

  /**
   * 筛选弹出窗弹出
   */
  showScreenView: function () {
    animation.translateX(0).step();
    this.setData({
      showScreenView: true,
      animationData: animation.export()
    });
  },

  /**
   * 筛选弹出窗关闭
   */
  closeScreenView: function () {
    this.setData({
      showScreenView: false
    })
  },

  /**
   * 筛选-->分类弹出窗
   */
  screenTagShow: function () {
    this.setData({ screenTagShow: !this.data.screenTagShow });
  },

  /**
   * 筛选 价格，标签选择
   */
  chickPriceTag: function (e) {
    var value = e.currentTarget.dataset,
      cat = this.data.cat;
    cat.price.min = value.min,
      cat.price.max = value.max,
      this.setData({
        cat: cat
      }), this.setPriceTagIndex();
  },

  /**
   * 监听input输入
   */
  bindMinInput: function (e) {
    var value = e.detail.value,
      cat = this.data.cat;
    cat.price.min = value,
    this.setData({
      cat: cat,
    }), this.setPriceTagIndex();
  },
  bindMaxInput: function (e) {
    var value = e.detail.value,
      cat = this.data.cat;
    cat.price.max = value,
    this.setData({
      cat: cat,
    }), this.setPriceTagIndex();
  },

  /**
   * 设置标签下标
   */
  setPriceTagIndex: function () {
    var priceTagIndex = -1,
      cat = this.data.cat,
      priceWhere = this.data.priceWhere;
    for (var i in priceWhere) {
      cat.price.min == priceWhere[i].priceStart && cat.price.max == priceWhere[i].priceEnd && (priceTagIndex = i);
    }
    this.setData({
      priceTagIndex: priceTagIndex
    })
  },

  /**
   * 筛选 分类，标签选择
   */
  chickClassfiyTag: function (e) {
    var value = e.currentTarget.dataset,
      cat = this.data.cat;
    cat.classfiy.id = value.id,
      cat.classfiy.name = value.name,
      this.setData({
        cat: cat,
      })
  },

  /**
   * 筛选 表单提交
   */
  screenSubmit: function () {
    var cat = this.data.cat,
      params = this.data.params;
    if ((parseInt(cat.price.min) > parseInt(cat.price.max))) return wx.showModal({
      title: '价格筛选错误',
      content: '最高价低于最低价，请重新输入',
      showCancel: false,
    });
    params.classId = cat.classfiy.id;
    params.priceBegin = cat.price.min;
    params.priceEnd = cat.price.max;
    this.setData({
      params: params,
      is_screen: true,
      sort: "11",
    }), this.closeScreenView(), this.reloadGoodsList();
    if (params.classId == "" && params.priceBegin == "" && params.priceEnd == "") this.setData({
      is_screen: false,
    });
  },

  /**
   * 筛选 表单取消提交
   */
  screenReset: function () {
    this.setData({
      priceTagIndex: -1,
      cat: {
        price: {
          min: "",
          max: ""
        },
        classfiy: {
          id: "",
          name: ""
        },
        brand: {
          id: "",
          name: ""
        }
      },
    })
  },

  /**
   * 向右滑动隐藏筛选页面
   */
  catchtouchstart: function (e) {
    beginX = e.changedTouches[0].pageX; // 获取触摸时的原点
  },
  move_view: function (e) {
    var that = this,
      moveX = e.changedTouches[0].pageX - beginX;
    moveX >= 0 && animation.translateX(moveX).step();
    that.setData({
      animationData: animation.export()
    })
  },
  colse_view: function (e) {
    var that = this,
      endX = e.changedTouches[0].pageX;
    // 向右滑动
    if (endX - beginX >= 40) {
      console.log('向右滑动');
      that.setData({
        showScreenView: false,
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    !is_no_more && this.loadMoreGoodsList();
  },


  /**
  * 弹出框蒙层截断touchmove事件
  */
  preventTouchMove: function () {
  },
})