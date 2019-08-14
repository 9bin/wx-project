var md5 = require("md5.js");
module.exports = {
  upload: function (t) {
    console.log("user args:", t);
    var app = getApp();
    var siteInfo = getApp().siteInfo;
    var timeStamp = Date.parse(new Date());
    var paramsToSign = "appId=" + siteInfo.appId + "&version=" + siteInfo.version + "&timeStamp=" + timeStamp + "&key=" + siteInfo.key;
    var sign = md5.md5(paramsToSign).toLocaleUpperCase();
    t.data.appId = siteInfo.appId;
    t.data.version = siteInfo.version;
    t.data.timeStamp = timeStamp;
    t.data.sign = sign;
    t.data.file_type = "bmp,gif,jpg,png,jpeg";
    function uploadFiles(e) {
      "function" == typeof t.start && t.start(e), console.log("submit args:", t), wx.uploadFile({
        url: t.url || app.api.default.upload_image,
        filePath: e.path,
        name: t.name || "image",
        formData: t.data || {},
        success: function (e) {
          console.log("--uploadFile--"), console.log(e), 200 == e.statusCode ? "function" == typeof t.success && (e.data = JSON.parse(e.data),
            t.success(e.data)) : "function" == typeof t.error && t.error({message: "上传错误：" + e.statusCode + "；" + e.data}),
            t.complete();
        },
        fail: function (e) {
          "function" == typeof t.error && t.error({ message: e.errMsg}), t.complete();
        }
      });
    }
    (t = t || {}).complete = t.complete || function () { }, t.data = t.data || {}, wx.chooseImage({
      count: 1,
      success: function (e) {
        if (console.log("--chooseImage--"), console.log(e), e.tempFiles && 0 < e.tempFiles.length) {
          var tempFile = e.tempFiles[0];
          uploadFiles(tempFile);
        }
        else "function" == typeof t.error && t.error({message: "请选择文件"}), t.complete();
      },
      fail: function (e) {
        "function" == typeof t.error && (t.error({message: "请选择文件"}), t.complete());
      }
    });
  }
};