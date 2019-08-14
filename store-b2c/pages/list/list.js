// pages/list/list.js
var app = getApp(),
  api = require('../../api.js'),
  is_no_more = !1;
var beginX = 0,
  moveX = 0,
  endX = 0,
  animation = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cat_id: "", //商品分类id
    page: 1, //数据页面首页
    select: "1", //顶部导航初始位置
    sort: "11", //产品排序初始值
    goods_list: [], //产品列表
    content: "", //数据信息
    priceWhere: [], //快捷价格区间
    brandList: [], //品牌列表
    separateBrandList: [], //格式化品牌列表
    cat_list_child: [], //分类列表
    listType: 'grid', //列表排列样式
    showScreenView: false, //筛选弹窗
    animationData: {}, //筛选弹窗动画
    screenTagShow: false, //筛选分类详细内容显示
    brandListShow: false, //筛选格式化品牌列表
    classfiyListShow: false, //筛选全部分类弹窗
    current_checked_cat: "", //筛选-->全部分类，当前分类id
    show_child_list: true, //筛选-->全部分类子类显示初始状态
    priceTagIndex: -1, //当前选中的价格筛选值
    cat: { //筛选form表单的值 
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
    params: { //列表数据加载参数
      classId: "",
      priceBegin: '',
      priceEnd: '',
      brandId: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.pageOnLoad(this), this.loadData(options);
    var listType = wx.getStorageSync("listType");
    listType && this.setData({
      listType: listType
    });
  },

  loadData: function(t) {
    t.cat_id && this.setData({
      cat_id: t.cat_id,
    }), this.reloadGoodsList(), this.getBrandList();
  },

  /**
   * 获取品牌列表
   */
  getBrandList: function() {
    var page = this;
    app.request({
      url: api.default.get_brand_list,
      success: function(res) {
        res.state == "0" && page.setData({
          brandList: res.data.list
        });
      }
    }), app.request({
      url: api.default.get_separate_brand_list,
      success: function(res) {
        console.log(res);
        res.state == "0" && res.data != "" && page.setData({
          separateBrandList: res.data
        })
      }
    })
  },

  /**
   * 数据重新加载
   */
  reloadGoodsList: function() {
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
      url: api.default.goods_list,
      data: {
        'pageIndex': i,
        'sort': a.data.sort,
        'classId': params.classId || a.data.cat_id || "",
        'priceBegin': params.priceBegin,
        'priceEnd': params.priceEnd,
        'brandId': params.brandId,
      },
      success: function(res) {
        '0' == res.state && (0 == res.data.list.length && (is_no_more = !0), a.setData({
          page: i + 1
        }), a.setData({
          content: res.data.content,
          goods_list: res.data.list,
          priceWhere: res.data.priceWhere
        })), a.setData({
          show_no_data_tip: 0 == a.data.goods_list.length
        });
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  },

  /**
   * 加载更多数据
   */
  loadMoreGoodsList: function() {
    var i = this,
      params = i.data.params || "",
      o = i.data.page || 2;
    if (i.data.is_loading) return;
    i.setData({
      is_loading: !0
    }), app.request({
      url: api.default.goods_list,
      data: {
        'pageIndex': o,
        'sort': i.data.sort,
        'classId': params.classId || i.data.cat_id || "",
        'priceBegin': params.priceBegin,
        'priceEnd': params.priceEnd,
        'brandId': params.brandId,
      },
      success: function(res) {
        '0' == res.state && (0 == res.data.list.length && (is_no_more = !0), i.setData({
          page: o + 1
        }), i.setData({
          goods_list: i.data.goods_list.concat(res.data.list),
        }));
      },
      complete: function() {
        i.setData({
          is_loading: !1
        })
      }
    })
  },

  /**
   * 列表排列样式
   */
  setListType: function() {
    var listType = this.data.listType;
    listType == "grid" ? listType = 'col' : listType = "grid";
    this.setData({
      listType: listType
    }), wx.setStorageSync("listType", listType);
  },

  /**
   * 顶部导航点击
   */
  sortClick: function(e) {
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
   * 筛选弹出窗
   */
  showScreenView: function() {
    animation.translateX(0).step();
    this.setData({
      showScreenView: true,
      animationData: animation.export()
    });
    var cat_list = wx.getStorageSync("cat_list") || [], that = this;
    !cat_list && app.request({
      url: api.default.cat_list,
      success: function (res) {
        console.log(res);
        if (res.state == '0' && res.data.length > 0) {
          wx.setStorageSync("cat_list", res.data);
        }
      },
    });
  },

  /**
   * 关闭筛选弹出窗
   */
  closeScreenView: function() {
    this.setData({
      showScreenView: false
    })
  },

  /**
   * 筛选--显示品牌格式化列表
   */
  showBrandList: function() {
    this.setData({
      brandListShow: !this.data.brandListShow
    })
  },

  /**
   * 筛选-->全部分类
   */
  classfiyListShow: function() {
    var a = this;
    a.setData({
      classfiyListShow: !this.data.classfiyListShow
    });
    if(this.data.classfiyListShow) {
      var cat_list = wx.getStorageSync("cat_list") || [],
        cat_list_child = [];
      for (var i in cat_list) {
        for (var j in cat_list[i].childNode) {
          cat_list_child.push(cat_list[i].childNode[j]);
        }
      }
      a.setData({
        cat_list_child: cat_list_child
      });
    }
  },

  /**
   * 筛选-->全部分类-显示子类
   */
  showChildList: function(e) {
    var id = e.currentTarget.dataset.current_checked_cat;
    id === this.data.current_checked_cat ? this.setData({
      show_child_list: !this.data.show_child_list
    }) : this.setData({
      show_child_list: true
    })
    this.setData({
      current_checked_cat: id,
    })
  },

  /**
   * 选择全部分类筛选值
   */
  choose: function(e) {
    var value = e.currentTarget.dataset,
      cat = this.data.cat;
    cat.classfiy.id = value.child_id,
      cat.classfiy.name = value.child_name,
      this.setData({
        cat: cat,
        classfiyListShow: false,
      })
  },

  /**
   * 筛选-->品牌分类弹出窗
   */
  screenTagShow: function() {
    this.setData({
      screenTagShow: !this.data.screenTagShow
    });
  },

  /**
   * 筛选 价格，标签选择
   */
  chickPriceTag: function(e) {
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
  setPriceTagIndex: function() {
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
   * 筛选 品牌，标签选择
   */
  chickClassfiyTag: function(e) {
    var cat = this.data.cat,
      value = e.currentTarget.dataset;
    cat.brand.id = value.id,
      cat.brand.name = value.name,
      this.setData({
        cat: cat,
        brandListShow: false,
      });
  },

  /**
   * 筛选 表单提交
   */
  screenSubmit: function() {
    var cat = this.data.cat,
      params = this.data.params;
    console.log(this.data.cat);
    if ((parseInt(cat.price.min) > parseInt(cat.price.max))) return wx.showModal({
      title: '筛选有误',
      content: '价格筛选错误，请重新输入',
      showCancel: false,
    });
    params.classId = cat.classfiy.id;
    params.priceBegin = cat.price.min;
    params.priceEnd = cat.price.max;
    params.brandId = cat.brand.id;
    this.setData({
      params: params,
      is_screen: true,
      sort: "11",
    }), this.closeScreenView(), this.reloadGoodsList();
    if (params.classId == "" && params.priceBegin == "" && params.priceEnd == "" && params.brandId == "") this.setData({
      is_screen: false,
    });
  },

  /**
   * 筛选 表单取消提交
   */
  screenReset: function() {
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
  catchtouchstart: function(e) {
    beginX = e.changedTouches[0].pageX; // 获取触摸时的原点
  },
  move_view: function(e) {
    var that = this,
      moveX = e.changedTouches[0].pageX - beginX;
    moveX >= 0 && animation.translateX(moveX).step();
    that.setData({
      animationData: animation.export()
    })
  },
  colse_view: function(e) {
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
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    is_no_more || this.loadMoreGoodsList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})