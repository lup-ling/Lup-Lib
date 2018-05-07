var Bmob = require('../utils/bmob.js');
var Promise = require('../utils/bluebird.min.js');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

//封装数组排重
function surplusless (array) {
  //获取class分类数组
  var newArray = [];
  var returnArray = [];
  
  for (var i = 0; i < array.length; i++) {
    var listItem = {};
    listItem['class'] = array[i].class;
    listItem['classId'] = array[i].classId;
    newArray.push(listItem)
  }

  for (var i = 0; i < newArray.length; i++) {
    var item = newArray[i].class;
    var num = 0;
    if (returnArray.length == 0) {
      returnArray.push(newArray[i]);
    } else {
      for (var j = 0; j < returnArray.length; j++) {
        if (returnArray[j].class == item) {
          num = num + 1;
        }
        if (num == 0 && j == returnArray.length - 1) {
          returnArray.push(newArray[i])
        }
      }
    }
  }
  return (returnArray)
}

module.exports.surplusless = surplusless;

function makeJson (listname) {
  
}
//封装数组排重 进阶版
function surplusless1(array1, name1, name2) {
  //获取分类数组
  var getArray = [];
  var array = [];

  for (var i = 0; i < array1.length; i++) {
    var obj = {};
    obj["a"] = array1[i].a;
    obj["b"] = array1[i].b;
    getArray.push(obj)
  }

  for (var i = 0; i < getArray.length; i++) {
    var item = getArray[i].b;
    var num = 0;
    if (array.length == 0) {
      array.push(getArray[i]);
    } else {
      for (var j = 0; j < array.length; j++) {
        if (array[j].b == item) {
          num = num + 1;
        }
        if (num == 0 && j == array.length - 1) {
          array.push(getArray[i])
        }
      }
    }
  }
  var returnArray = [];
  for (var z = 0; z < array.length; z++) {
      var obj = {};
      obj[name1] = array[z].a;
      obj[name2] = array[z].b;
      returnArray.push(obj);
  }

  return (returnArray)
}

module.exports.surplusless1 = surplusless1;

function putItemToArray(array1,array2) {
  var obj = {};
  for (var i = 0; i < array1.length; i++) {
    obj[array1[i]] = array2[i];
  }
  return (obj)
}

module.exports.putItemToArray = putItemToArray;

function by(name, minor) {
  return function (o, p) {
    var a, b;
    if (o && p && typeof o === 'object' && typeof p === 'object') {
      a = o[name];
      b = p[name];
      if (a === b) {
        return typeof minor === 'function' ? minor(o, p) : 0;
      }
      var c = Number(a);
      var d = Number(b);
      if (typeof a === typeof b) {
        if (isNaN(c) && isNaN(d)) {
          return a < b ? -1 : 1;
        }else {
          return c < d ? -1 : 1;
        }
        
      }
      return typeof a < typeof b ? -1 : 1;
    } else {
      console.log("error");
    }
  }
}
module.exports.by = by;

//单列数据排序

// function getArray(listName) {
  
//   objec["finish"] = false;
//   var list = Bmob.Object.extend(listName);
//   var query = new Bmob.Query(list);
//   query.limit(1000);
//   query.find({
//     success: function (res) {
      
//       return (objec)
//     }
//   })
// }
// module.exports.getArray = getArray;

function myAsyncFunction(listName) {
  return new Promise((resolve, reject) => {
    var list = Bmob.Object.extend(listName);
    var query = new Bmob.Query(list);
    query.limit(1000);
    query.find({
      success :function (res) {
        
        var objec = {};
        //1.获取全部数据，存入resArray中
        var resArray = [];
        var categoryArray = [];//categoryArray中包含cateID，category两项 需要return
        var array1 = [];//categoryArray的临时数组       
        for (var i = 0; i < res.length; i++) {
          //1.1获取categoryArray
          var obj1 = {};
          obj1["a"] = res[i].attributes.cateID;
          obj1["b"] = res[i].attributes.category;
          array1.push(obj1);

          resArray.push(res[i].attributes);
        }
        categoryArray = surplusless1(array1, 'cateID', 'category');
        //2.转成json数据
        var huobiaoData = [];//创建大数组 需要return
        for (var i = 0; i < categoryArray.length; i++) {
          var obj = {};
          obj["cateID"] = categoryArray[i].cateID;
          obj["category"] = categoryArray[i].category;
          //2.2 获取classArray数组 
          var classArray = [];//classArray中包含classID，class两项 需要return
          var array2 = [];//classArray的临时数组
          for (var j = 0; j < resArray.length; j++) {
            if (resArray[j].cateID == categoryArray[i].cateID) {
              var objC = {};
              objC["a"] = resArray[j].classID;
              objC["b"] = resArray[j].class;
              array2.push(objC);
              classArray = surplusless1(array2, 'classID', 'class');
              
            }
          }
          classArray.sort(compare('classID'));
          console.log("sort", classArray)
          //3.获取goodArray数组
          var classArr = [];
          for (var m = 0; m < classArray.length; m++) {
            var objC = {};
            var goodArray = [];
            for (var j = 0; j < resArray.length; j++) {
              if (resArray[j].classID == classArray[m].classID && resArray[j].cateID == categoryArray[i].cateID) {
                var array1 = ['title', 'message', 'buyingPrices', 'bNumber', 'buyingPrice', 'salePrices', 'sNumber', 'salePrice', 'retailPrice', 'Btime', 'merchant', 'phone','objectID'];
                var array2 = [resArray[j].title, resArray[j].message, resArray[j].buyingPrices, resArray[j].bNumber, resArray[j].buyingPrice, resArray[j].salePrices, resArray[j].sNumber, resArray[j].salePrice, resArray[j].retailPrice, resArray[j].Btime, resArray[j].merchant, resArray[j].phone, res[j].id];
                //将goodmessage装入goodArray数组中
                goodArray.push(putItemToArray(array1, array2))
              }
            }

            goodArray.sort(by("title", by("salePrice")));
            objC["classID"] = classArray[m].classID;
            objC["class"] = classArray[m].class;
            objC["goodArray"] = goodArray;
            classArr.push(objC);
          }
          obj["classArray"] = classArr;
          huobiaoData.push(obj);
        }
        var app = getApp();
        app.globalData.huobiaoData = huobiaoData;

        // console.log("huobiao", huobiaoData)
        objec["huobiaoData"] = huobiaoData;
        objec["categoryArray"] = categoryArray;
        objec["classArray"] = classArray;
        resolve(objec)
      }
    })
  });
};
module.exports.myAsyncFunction = myAsyncFunction;