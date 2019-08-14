//logs.js
const util = require('../../utils/util.js')
Page({
  data: {
    logs: [],
    hide: "hide",     //显示、隐藏vedio
    listImg: [
      "http://hbhl888.com/upLoad/product/month_1710/201710251716378579.jpg",
      "http://hbhl888.com/upLoad/product/month_1710/201710251716154108.jpg",
    ],
    videoPath: "https://jdvod.300hu.com/4c1f7a6atransbjngwcloud1oss/5dd1011f114806827213918209/v.f20.mp4?dockingId=5d9ec8b8-b2cb-4e66-b930-b833a67f0224&storageSource=3", 
  },
  onLoad: function () {
    var a = this;
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
  },
  
  /**
   * 视屏播放
   */
  play: function (t) {
    var a = t.currentTarget.dataset.url;
    console.log(a);
    this.setData({
      url: a,
      hide: "",
    }), wx.createVideoContext("video").play();
  },

  onReady: function () {
    var s =  wx.createSelectorQuery(), t = this;
    s.select('#swiper').boundingClientRect(function (res) {
      console.log(res);
      t.setData({
        swiperWidth: res.width
      })
      var swiper = new Swiper(t, {
        startSlide: 0,              // 初始化跳到第几个轮播图
        speed: 300,                   // 运动缓慢
        continuous: false,             //是否连续
        length: t.data.listImg.length, //幻灯片数据长度
        width: t.data.swiperWidth,    //幻灯片宽度
      })
    }).exec();

  },
});

function Swiper(page, options) {
  if (!options.length) return
  var transitions = function (tem) {
    var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
    for (var i in props) if (temp.style[props[i]] !== undefined) return true;
    return false;
  }
  var slidePos, width, length;
  var style = new Array();
  options = options || {};
  var index = parseInt(options.startSlide, 10) || 0;
  page.data.index = index;
  var speed = options.speed || 300;
  options.continuous = options.continuous !== undefined ? options.continuous : true;
  
  setup();

  function setup() {
    
    // cache length
    length = options.length;

    // set continuous to false if only one slide
    if (options.length < 2) options.continuous = false;

    // create an array to store current positions of each slide
    slidePos = new Array(length);

    // determine width of each slide
    width = options.width;

    var pos = length;

    // stack elements
    while (pos--) {
      if (transitions) {
        move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
      }
    }

    // reposition elements before and after index
    if (options.continuous && transitions) {
      move(circle(index + 1), width, 0);
    }
  }

  function move(index, dist, speed) {

    translate(index, dist, speed);
    slidePos[index] = dist;

  }

  function circle(index) {

    // a simple positive modulo using length
    return (length + (index % length)) % length;

  }

  function translate(index, dist, speed) {

    style[index] = "transition-duration:" + speed + 'ms;' + "transform:translate(" + dist + "px,0)" + " translateZ(0);" + "-o-transform:translateX(" + dist + "px);";
    page.setData({
      style: style
    })
  }

  // setup initial vars
  var start = {};
  var delta = {};
  var isScrolling;

  // setup event capturing
  var events = {
    start: function (event) {
      console.log(event);
      var a = this;
      var touches = event.touches[0];
      start = {

        // get initial touch coords
        x: touches.pageX,
        y: touches.pageY,

        // store time to determine touch duration
        time: +new Date().getTime()
      };
      // used for testing first move event
      isScrolling = undefined;

      // reset delta and end measurements
      delta = {};
    },
    move: function (event) {
      console.log(event);
      // ensure swiping with one touch and not pinching
      if (event.touches.length > 1) return
      var touches = event.touches[0];

      // measure change in x and y
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      }

      // determine if scrolling test has run - one time test
      if (typeof isScrolling == 'undefined') {
        isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
        page.setData({
          no_scroll: !isScrolling
        })
      }

      if (!isScrolling) {

        // increase resistance if first or last slide
        if (options.continuous) { // we don't add resistance at the end

          translate(index, delta.x + slidePos[index], 0);
          translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);

        } else {

          delta.x =
            delta.x /
            ((!index && delta.x > 0               // if first slide and sliding left
              || index == length - 1        // or if last slide and sliding right
              && delta.x < 0                       // and if sliding at all
            ) ?
              (Math.abs(delta.x) / width + 1)      // determine resistance level
              : 1);                                 // no resistance if false

          // translate 1:1
          translate(index, delta.x + slidePos[index], 0);
          translate(index + 1, delta.x + slidePos[index + 1], 0);
        }

      }

    },
    end: function (event) {

      console.log(event);
      // measure duration
      var duration = +new Date().getTime() - start.time;

      // determine if slide attempt triggers next/prev slide
      var isValidSlide =
        Number(duration) < 250               // if slide duration is less than 250ms
        && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
        || Math.abs(delta.x) > width / 2;      // or if slide amt is greater than half the width

      var current = 0;

      if (isValidSlide) {
        if (delta.x < 0) {
          current = index + 1;
        }
        if (delta.x > 0) {
          current = index - 1;
        }
      }
      console.log("当前改变值：" + current)
      current >= length && (current = 0);
      current < 0 && (current = length - 1);
      page.data.index = current;
      // determine if slide attempt is past start and end
      var isPastBounds =
        !index && delta.x > 0                            // if first slide and slide amt is greater than 0
        || index == length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

      if (options.continuous) isPastBounds = false;

      // determine direction of swipe (true:right, false:left)
      var direction = delta.x < 0;

      // if not scrolling vertically
      if (!isScrolling) {

        if (isValidSlide && !isPastBounds) {

          if (direction) {

            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index - 1), -width, 0);
              move(circle(index + 2), width, 0);

            } else {
              move(index - 1, -width, 0);
            }

            move(index, slidePos[index] - width, speed);
            move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
            index = circle(index + 1);

          } else {
            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index + 1), width, 0);
              move(circle(index - 2), -width, 0);

            } else {
              move(index + 1, width, 0);
            }

            move(index, slidePos[index] + width, speed);
            move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
            index = circle(index - 1);

          }
        } else {

          if (options.continuous) {

            move(index, 0, speed);
            move(circle(index + 1), width, speed);

          } else {

            move(index, 0, speed);
            move(index + 1, width, speed);
          }

        }
      }
    },
  };

  page.start = events.start;
  page.move = events.move;
  page.end = events.end;
}

export default Swiper
