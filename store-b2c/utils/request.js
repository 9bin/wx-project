var md5 = require("md5.js");

/**
 * 网络请求
 */
module.exports = function (a) {
  a.data || (a.data = {});
  // var e = wx.getStorageSync("token") || false;
  var e = "b6ce1441d735e0f5cf03b22dccd42086";
  if (e) a.data.token = e;
  var siteInfo = getApp().siteInfo;
  var timeStamp = Date.parse(new Date());
  var paramsToSign = "appId=" + siteInfo.appId + "&version=" + siteInfo.version + "&timeStamp=" + timeStamp + "&key=" + siteInfo.key;
  var sign = md5.md5(paramsToSign).toLocaleUpperCase();
  a.data.appId = siteInfo.appId;
  a.data.version = siteInfo.version;
  a.data.timeStamp = timeStamp;
  a.data.sign = sign;
  console.log(a),
    wx.request({
      url: a.url,
      header: a.header || {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: a.data || {},
      method: a.method || "POST",
      dataType: a.dataType || "json",
      success: function (e) {
        console.log(e.data);
        -1 == e.data.code ? getApp().login() : a.success && a.success(e.data);
      },
      fail: function (e) {
        console.warn("--- request fail >>>"), console.warn(e), console.warn("<<< request fail ---");
        var t = getApp();
        t.is_on_launch ? (t.is_on_launch = !1, wx.showModal({
          title: "网络请求出错",
          content: e.errMsg,
          showCancel: !1,
          success: function (e) {
            e.confirm && a.fail && a.fail(e);
          }
        })) : (wx.showToast({
          title: e.errMsg,
          image: "/images/icon-warning.png"
        }), a.fail && a.fail(e));
      },
      complete: function (e) {
        200 != e.statusCode && (console.log("--- request http error >>>"), console.log(e.statusCode),
          console.log(e.data), console.log("<<< request http error ---")), a.complete && a.complete(e);
      }
    });
};