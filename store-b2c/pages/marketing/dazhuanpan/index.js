// pages/marketing/dazhuanpan/index.js
var app = getApp(), api = require("../../../api.js"), WxPares = require("../../../wxParse/wxParse.js");
var interval = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRule: false,
    last_index: 0,//上一回滚动的位置
    amplification_index: 0,//轮盘的当前滚动位置
    roll_flag: true,//是否允许滚动
    max_number: 8,//轮盘的全部数量
    speed: 400,//速度，速度值越大，则越慢 初始化为300
    finalindex: 5,//最终的奖励
    myInterval: "",//定时器
    max_speed: 40,//滚盘的最大速度
    minturns: 10,//最小的圈数为2
    runs_now: 0,//当前已跑步数

    id: "107"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pageOnLoad(this), this.toggleClassBg();
    options.id && (this.setData({
      id: options.id
    }), this.loadData());
  },

  /**
   * 数据加载
   */
  loadData: function () {
    var a = this;
    if(!a.data.id) return wx.showModal({
      title: '活动已停止',
      content: '敬请期待下一轮开始',
      showCancel: !1,
      success: function (res) {
        res.confirm && wx.navigateBack({
          delta: 1,
        })
      }
    });
    wx.showLoading({
      title: '加载中...',
      mask: true,
    }), app.request({
      url: api.lottery.load_data,
      data: {
        id: a.data.id
      },
      success: function (res) {
        if (res.state == "0") a.setData(res.data), WxPares.wxParse("content", "html", res.data.explain||"", a);
      },
      complete: function () {wx.hideLoading();}
    })
  },

  /**
   * 领奖
   */
  prize: function (e) {
    var id = e.target.dataset.id;
    var awardType = e.target.dataset.awardType;
    var a = this;
    if (id) {
      awardType == 3 ? wx.navigateTo({
        url: '/pages/marketing/order_submit/order_submit?goods_info=' + JSON.stringify({
          goods_id: id,
          num: 1,
          buyType: "7",
          actId: a.data.id,
          interactionMarketingType: "5"
        })
      }) : a.showToast({ title: "奖品已经发送到您的账号中，请注意查收" });
    }
    this.setData({
      showResult: false,
      winResult: null
    })
  },

  /**
   * 点击抽奖
   */
  lottery: function () {
    var a = this, finalindex = a.data.finalindex;
    if (a.data.joinLimitDay - a.data.joinAmount<=0) return a.showToast({ title: "今日机会，您已经用完了"});
    a.data.joinAmount++;
    app.request({
      url: api.lottery.lotto,
      data: { "id": a.data.id },
      success: function (res) {
        if(res.state == "0") {
          if (res.data.grade == 1) finalindex = 2;
          else if (res.data.grade == 2) finalindex = 4 ;
          else if (res.data.grade == 3) finalindex = 6;
          else if (res.data.grade == 4) finalindex = 8;
          else {
            let arr = [1, 3, 5, 7];
            finalindex = arr[parseInt(Math.random() * arr.length)];
          }
          a.setData({
            finalindex: finalindex,
            winResult: res.data
          }), a.startrolling();
        } else {
         a.data.joinAmount -= 1, a.showToast({ title: res.message});
        }
      }
    })
  },

  //开始滚动
  startrolling: function () {
    let _this = this;
    if (_this.data.roll_flag) {
      _this.data.runs_now = 0;
      _this.data.roll_flag = false;
      _this.rolling();
    }
  },

  //滚动轮盘的动画效果
  rolling: function (amplification_index) {
    var _this = this;
    this.data.myInterval = setTimeout(function () { _this.rolling(); }, this.data.speed);
    this.data.runs_now++;
    this.data.amplification_index++;
    var count_num = this.data.minturns * this.data.max_number + this.data.finalindex - this.data.last_index;
    //上升期间
    if (this.data.runs_now <= (count_num / 3) * 2) {
      this.data.speed -= 30;
      if (this.data.speed <= this.data.max_speed) {
        this.data.speed = this.data.max_speed;
      }
    }
    //抽奖结束
    else if (this.data.runs_now >= count_num) {
      clearInterval(this.data.myInterval);
      this.data.roll_flag = true;
      this.data.last_index = this.data.amplification_index;
      this.setData({
        showResult: true
      });
    }
    //下降期间
    else if (count_num - this.data.runs_now <= 10) {
      this.data.speed += 20;
    }
    //缓冲区间
    else {
      this.data.speed += 10;
      if (this.data.speed >= 100) {
        this.data.speed = 100;
      }
    }
    if (this.data.amplification_index > this.data.max_number) {
      this.data.amplification_index = 1;
    }
    this.setData(this.data);

  },

  /**
   * 闪烁背景
   */
  toggleClassBg: function () {
    var that = this;
    interval != 0 && clearInterval(interval);
    interval = setInterval( function () {
      that.setData({
        on: that.data.on == "" ? "on": ""
      })
    }, 500);
  },

  /**
   * 规则说明弹窗
   */
  showRule: function () {
      this.setData({
        showRule: !this.data.showRule,
      })
  },

  onHide: function () {
    clearInterval(interval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(interval);
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    app.pageOnShow(this);
  },
})