// pages/cart/cart.js
var app = getApp(), api = require("../../api.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_cart_edit: false,  //显示编辑购物车
    editIndex: 0,
    delBtnWidth: 80
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this);
  },

  /**
   * 获取购物车数据
   */
  loadData: function () {
    var page = this;
    wx.showLoading({
      title: '正在加载...',
      mask: true,
    }), app.request({
      url: api.cart.get_cart_list,
      success: function (res) {
        res.state == "0" && page.setData(res.data);
        var count = 0;
        if (res.data.fixedPriceInfo && res.data.fixedPriceInfo.productList.length > 0) {
          var fixedPriceInfo = res.data.fixedPriceInfo;
          for (var i in fixedPriceInfo.productList) {
            fixedPriceInfo.productList[i].cartInfo.status == 1 && (count += 1)
          }
        }
        if (res.data.ptProductList && res.data.ptProductList.length > 0) {
          var ptProductList = res.data.ptProductList;
          for (var i in ptProductList) {
            ptProductList[i].cartInfo.status == 1 && (count += 1)
          }
        }
        if (res.data.marketInfo && res.data.marketInfo.productList.length > 0) {
          var marketInfo = res.data.marketInfo;
          for (var i in marketInfo.productList) {
            marketInfo.productList[i].cartInfo.status == 1 && (count += 1);
          }
        }
        page.setData({ count: count})
      },
      complete: function () {wx.hideLoading();}
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.pageOnShow(this), this.loadData();
  },

  /**
   * 全选按钮绑定事件
   */
  cartCheckAll: function () {
    this.setData({
      isAllCheck: !this.data.isAllCheck
    }), this.getGoodsIds();
  },

  /**
   * 单选按钮绑定事件
   */
  cartCheckOne: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var util = e.currentTarget.dataset.util;
    var goods = that.data[util];
    if (util == "ptProductList") {
      that.setData({
        cartIds: goods[index].cartInfo.id
      }),that.updateStatus({
        updateType: "1",
        value: goods[index].cartInfo.status == 0 ? 1 : 0
      });
    }
    if (util == "marketInfo") {
      that.setData({
        cartIds: goods.productList[index].cartInfo.id
      }), that.updateStatus({
        updateType: "1",
        value: goods.productList[index].cartInfo.status == 0 ? 1 : 0
      });
    }
    if (util == "fixedPriceInfo") {
      that.setData({
        cartIds: goods.productList[index].cartInfo.id
      }), that.updateStatus({
        updateType: "1",
        value: goods.productList[index].cartInfo.status == 0 ? 1 : 0
      });
    }
  },

  /**
   * 单个删除商品
   */
  cartDeleteOne: function (e) {
    var cartIds = e.currentTarget.dataset.cartId;
    var subProductIds = e.currentTarget.dataset.goodId;
    this.setData({
      cartIds: cartIds,
      subProductIds: subProductIds
    }), this.deleteCart({ deleteType: "1"});
  },

  /**
   * 多个删除商品
   */
  cartDelete: function (e) {
    var a = this, cartIds = "", subProductIds = "", deleteType = e.currentTarget.dataset.deletetype;
    if (a.data.fixedPriceInfo && a.data.fixedPriceInfo.productList.length > 0) {
      var fixedPriceInfo = a.data.fixedPriceInfo.productList;
      for (var i in fixedPriceInfo) {
        if (fixedPriceInfo[i].cartInfo.status==1) {
          cartIds = cartIds + "," + fixedPriceInfo[i].cartInfo.id;
          subProductIds = subProductIds + "," + fixedPriceInfo[i].id;
        }
      }
    }
    if (a.data.ptProductList && a.data.ptProductList.length > 0) {
      var ptProductList = a.data.ptProductList;
      for (var i in ptProductList) {
        if (ptProductList[i].cartInfo.status == 1) {
          cartIds = cartIds + "," + ptProductList[i].cartInfo.id;
          subProductIds = subProductIds + "," + ptProductList[i].id;
        }
      }
    }
    if (a.data.marketInfo && a.data.marketInfo.productList.length > 0) {
      var marketInfo = a.data.marketInfo.productList;
      for (var i in marketInfo) {
        if (marketInfo[i].cartInfo.status == 1) {
          cartIds = cartIds + "," + marketInfo[i].cartInfo.id;
          subProductIds = subProductIds + "," + marketInfo[i].id;
        }
      }
    }
    a.setData({
      cartIds: cartIds.substring(1) || "",
      subProductIds: subProductIds.substring(1) || ""
    }), a.deleteCart({
      deleteType: deleteType == "delete"?"1":"2"
    })
  },

  /**
   * 清空失效商品
   */
  cleanDisable: function () {
    var that = this, disableProductList = that.data.disableProductList, cartIds = "", subProductIds = "";
    for(var i in disableProductList) {
      cartIds = cartIds + "," + disableProductList[i].cartInfo.id;
      subProductIds = subProductIds + "," + disableProductList[i].id;
    }
    that.setData({
      cartIds: cartIds.substring(1) || "",
      subProductIds: subProductIds.substring(1) || ""
    }), that.deleteCart({
      deleteType: "1"
    })
  },

  /**
   * 数量减少
   */
  numberSub: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var util = e.currentTarget.dataset.util;
    var goods = that.data[util];
    var value = 1;
    if (util == "ptProductList") {
      that.setData({
        cartIds: goods[index].cartInfo.id
      });
      value = goods[index].cartInfo.itemCount;
    } else {
      that.setData({
        cartIds: goods.productList[index].cartInfo.id
      });
      value = goods.productList[index].cartInfo.itemCount;
    }
    if (value <= 1) return !0;
    value-- , that.updateStatus({
      updateType: "2",
      value: value
    });
  },

  /**
   * 数量添加
   */
  numberAdd: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var util = e.currentTarget.dataset.util;
    var goods = that.data[util];
    var value = 1;
    if (util == "ptProductList") {
      that.setData({
        cartIds: goods[index].cartInfo.id
      }), value = goods[index].cartInfo.itemCount, that.updateStatus({
        updateType: "2",
        value: ++value
      });
    } else {
      that.setData({
        cartIds: goods.productList[index].cartInfo.id
      }), value = goods.productList[index].cartInfo.itemCount, that.updateStatus({
        updateType: "2",
        value: ++value
      });
    }
  },

  /**
   * 监听数量修改
   */
  numberBlur: function (e) {
    var that = this;
    var num = e.detail.value;
    var cartIds = e.currentTarget.dataset.cartId;
    num = parseInt(num);
    if (isNaN(num) || num <= 0) num = 1;
    that.setData({
      cartIds: cartIds
    }), that.updateStatus({
      updateType: "2",
      value: num
    });
  },


  /**
   * 全选获取商品列表id
   */
  getGoodsIds: function () {
    var a = this, cartIds = "";
    if (a.data.fixedPriceInfo && a.data.fixedPriceInfo.productList.length > 0) {
      var fixedPriceInfo = a.data.fixedPriceInfo;
      for (var i in fixedPriceInfo.productList) {
        cartIds = cartIds + "," + fixedPriceInfo.productList[i].cartInfo.id;
      }
    }
    if (a.data.ptProductList && a.data.ptProductList.length > 0) {
      var ptProductList = a.data.ptProductList;
      for (var i in ptProductList) {
        cartIds = cartIds + "," + ptProductList[i].cartInfo.id;
      }
    }
    if (a.data.marketInfo && a.data.marketInfo.productList.length > 0) {
      var marketInfo = a.data.marketInfo;
      for (var i in marketInfo.productList) {
        cartIds = cartIds + "," + marketInfo.productList[i].cartInfo.id;
      }
    }
    a.setData({
      cartIds: cartIds.substring(1),
    }), a.updateStatus({
      updateType: "1",
      value: a.data.isAllCheck ? 1 : 0
    });
  },

  /**
   * 更新购物车数据
   */
  updateStatus: function (options) {
    var page = this;
    wx.showLoading({
      mask: true,
    }), app.request({
      url: api.cart.update_cart,
      data: {
        "type": options.updateType,
        "value": options.value,
        "cartIds": page.data.cartIds
      },
      success: function (res) {
        res.state == "0" && page.loadData();
      },
      complete: function () {wx.hideLoading();}
    })
  },

  /**
   * 删除g购物车数据
   */
  deleteCart: function (options) {
    var page = this;
    wx.showModal({
      content: '确定要删除该商品？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#999999',
      confirmText: '删除',
      confirmColor: '#eb0c36',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在处理...',
            mask: true,
          }), app.request({
            url: api.cart.delete_cart,
            data: {
              "type": options.deleteType,
              "cartIds": page.data.cartIds,
              "subProductIds": page.data.subProductIds
            },
            success: function (res) {
              res.state == "0" && page.loadData();
            },
            complete: function () {wx.hideLoading();} 
          })
        }
      },
    })
  },

  /**
   * 显示，隐藏规格选择
   */
  hideAttrPicker: function () {
    this.setData({
      show_attr_picker: !1
    });
  },
  showAttrPicker: function (e) {
    this.setData({
      show_attr_picker: !0
    });
    // var that = this;
    // var index = e.currentTarget.dataset.index;
    // var util = e.currentTarget.dataset.util;
    // var goods = that.data[util];
    // if (util == "ptProductList") {
    //   that.setData({
    //     goods: goods[index]
    //   }),
    //   that.setData({
    //     ptProductList: goods
    //   });
    // }
    // if (util == "marketInfo") {
    //   goods.productList[index].txtStyle = txtStyle, that.setData({
    //     marketInfo: goods
    //   });
    // }
    // if (util == "fixedPriceInfo") {
    //   goods.productList[index].txtStyle = txtStyle, that.setData({
    //     fixedPriceInfo: goods
    //   });
    // }
  },


  /**
   * 编辑购物车
   */
  cartEdit: function () {
    this.setData({
      show_cart_edit: !0,
      isAllCheck: !1
    }), this.getGoodsIds();
  },

  /**
   * 编辑购物车完成
   */
  cartDone: function () {
    this.setData({
      show_cart_edit: !1,
      isAllCheck: !1
    }), this.getGoodsIds();
  },

  /**
   * 手指刚放到屏幕触发
   */
  touchS: function (e) {
    var that = this;
    if (e.touches.length == 1) {
      that.setData({
        startX: e.touches[0].clientX
      });
    }
  },

  /**
   * 触摸时触发，手指在屏幕上每移动一次，触发一次
   */
  touchM: function (e) {
    var that = this
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = that.data.startX - moveX;
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {
        txtStyle = "right:0px;left:0px";
      } else if (disX > 0) {
        txtStyle = "right:" + disX + "px;left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          txtStyle = "right:" + delBtnWidth + "px;left:-" + delBtnWidth + "px";
        }
      }
      var index = e.currentTarget.dataset.index;
      var util = e.currentTarget.dataset.util;
      var goods = that.data[util];
      if (util == "ptProductList") {
        goods[index].txtStyle = txtStyle, that.setData({
          ptProductList: goods
        });
      }
      if (util == "marketInfo") {
        goods.productList[index].txtStyle = txtStyle, that.setData({
          marketInfo: goods
        });
      }
      if (util == "fixedPriceInfo") {
        goods.productList[index].txtStyle = txtStyle, that.setData({
          fixedPriceInfo: goods
        });
      }
    }
  },

  /**
   * 监听手指触摸结束
   */
  touchE: function (e) {
    var that = this
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = disX > delBtnWidth / 2 ? "right:" + delBtnWidth + "px;left:-" + delBtnWidth + "px" : "right:0px;left:0px";
      var index = e.currentTarget.dataset.index;
      var util = e.currentTarget.dataset.util;
      var goods = that.data[util];
      if (util == "ptProductList") {
        goods[index].txtStyle = txtStyle, that.setData({
          ptProductList: goods
        });
      }
      if (util == "marketInfo") {
        goods.productList[index].txtStyle = txtStyle, that.setData({
          marketInfo: goods
        });
      }
      if (util == "fixedPriceInfo") {
        goods.productList[index].txtStyle = txtStyle, that.setData({
          fixedPriceInfo: goods
        });
      }
    }
  },

})