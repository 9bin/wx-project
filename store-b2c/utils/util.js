const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatData(t) {
  var r = t.getFullYear(), e = t.getMonth() + 1, a = t.getDate();
  t.getHours(), t.getMinutes(), t.getSeconds();
  return [r, e, a].map(formatNumber).join("-");
}

function objectToUrlParams(t) {
  var r = "";
  for (var e in t) r += "&" + e + "=" + t[e];
  return r.substr(1);
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  objectToUrlParams: objectToUrlParams,
  formatData: formatData
}
