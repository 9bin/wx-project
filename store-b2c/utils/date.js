function getMonthFirstDay(m, y) {
  var t = new Date();
  t.setFullYear(y);
  t.setMonth(m);
  t.setDate(1);
  return t.getDay();
}

function getMonthTotalDate(m, y) {
  var t = new Date();
  t.setFullYear(y);
  t.setMonth(m);
  t.setDate(0);
  return t.getDate();
}



function paintCalendarArray (m, y) {
  var t = new Date();
  var nSpace = getMonthFirstDay(m - 1, y);
  var totalDate = getMonthTotalDate(m, y);
  var ret = [];
  var trArray = [];
  for (var i = 1; ; i++) {
    if (i <= nSpace) {
      trArray.push({ num: new Date(y, m, i - nSpace).getDate()});
    }else if (i <= totalDate + nSpace) {
      trArray.push({
        num: i - nSpace,
        isCurrentMonth: !0,
        isSelect: (m == t.getMonth() + 1 && i - nSpace == t.getDate() && y == t.getFullYear()) ? true : false,
      });
    }
    else {
      var l = trArray.length;
      for (var j = 0; j + l < 7; j++) {
        trArray.push({num: new Date(y, m + 1, j+1).getDate()});
      }
      ret.push(trArray);
      break;
    }
    if (trArray.length == 7) {
      ret.push(trArray);
      trArray = [];
    }
  }
  return ret;
}

module.exports = {
  'getMonthFirstDay': getMonthFirstDay,
  'getMonthTotalDate': getMonthTotalDate,
  'paintCalendarArray': paintCalendarArray,
}