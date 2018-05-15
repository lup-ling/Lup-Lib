//index.js
//获取应用实例
const app = getApp();
var Bmob = require('../../utils/bmob.js')
var Promise = require('../../utils/bluebird.min.js')
var util = require('../../utils/util.js');

Page({
  data: {
    userInfo: {},
    isHiden:false,//右侧跳转按钮显示
    isHidenList:true,//左上角分类列表隐藏
    isHidenDetial: true,//详情列表隐藏
    isHidenPrice: true, //售价行隐藏
    hasUserInfo: false,
    scrollTop:0,
    startX:0,
    startY: 0,
    cateNum:0,
    classNum:0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    listName:'',//未开放接口
    className:'',
    classLength:0,
    needArray:[],
    cateArray:[],
    classArray:[],
    detailArray: [],
    detailViewArray:[]
  },

  onLoad: function () {    
    var huobiaoData = wx.getStorageSync('huobiaoData');
    var categoryArray = wx.getStorageSync('categoryArray');
    var classArray = wx.getStorageSync('classArray');
    if (huobiaoData.length > 0 && categoryArray.length > 0 && classArray.length > 0) {
      //加载本地存储数据
      app.globalData.huobiaoData = huobiaoData;
      console.log("ok")
      this.setData({
        cateArray: categoryArray,
        classArray: huobiaoData[0].classArray,
        detailArray: classArray[0].goodArray,
        className: classArray[0].class,
        classLength: huobiaoData[0].classArray.length
      })
    }else {
      var that = this;//promise 里不能直接使用this 
      util.myAsyncFunction("huobiao").then(function (resolve) {
        that.setData({
          detailArray: resolve.huobiaoData[0].classArray[0].goodArray,
          cateArray: resolve.categoryArray,
          classArray: resolve.huobiaoData[0].classArray,
          className: resolve.huobiaoData[0].classArray[0].class,
          classLength: resolve.huobiaoData[0].classArray.length
        })
        wx.setStorage({
          key: 'huobiaoData',
          data: resolve.huobiaoData,
        })
        wx.setStorage({
          key: 'categoryArray',
          data: resolve.categoryArray,
        })
        wx.setStorage({
          key: 'classArray',
          data: resolve.classArray,
        })
      })
    }
  },

  onShow: function () {
    var num = wx.getStorageSync("authorityNum")
    if (app.globalData.screct > 0 ) {
      this.setData({
        isHidenPrice: false
      })
    }else {
      if ( num == 200909) {
        this.setData({
          isHidenPrice: false
        })
      }
    }
    
  },

  //展开分类列表
  showList: function () {
    var hide = this.data.isHidenList;
    if (hide) {
      this.setData({
        isHidenList: false
      })
    } else {
      this.setData({
        isHidenList: true
      })
    }
  },

  //手指刚放到屏幕触发
  moveS: function (e) {
    if (!this.data.isHidenPrice) {
      //判断是否只有一个触摸点
      if (e.touches.length == 1) {
        this.setData({
          //记录触摸起始位置的X坐标
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY
        });
      }
    }
  },

  moveE: function (e) {
    if (!this.data.isHidenPrice) {
      var that = this
      if (e.changedTouches.length == 1) {
        //手指移动结束后触摸点位置的X坐标
        var endX = e.changedTouches[0].clientX;
        var endY = e.changedTouches[0].clientY;
        //触摸开始与结束，手指移动的距离
        var disX = that.data.startX - endX;
        var disY = (that.data.startY - endY) > 0 ? (that.data.startY - endY) : (endY - that.data.startX);
        var r = 360 * Math.atan(disY / disX) / (2 * Math.PI);
        var r1 = r.toFixed(2);
        console.log("jiaodu", r1)
        if (r1 < 45 && disX > 0) {
          //添加动画效果

          //传入数据
          var good = e.currentTarget.dataset.goods;
          console.log("class", e.currentTarget.dataset.class);
          good["class"] = e.currentTarget.dataset.class;
          good["isHiden"] = true;
          delete good.category;
          delete good.objectID;
          delete good.retailPrice;
          delete good.sNumber;
          delete good.salePrice;
          delete good.salePrices;
          console.log("good", good);
          var arrayG = app.globalData.needArray;
          var arrayI = this.data.needArray;
          var save = false;
          let p1 = new Promise(
            (resolve, reject) => {
              if (arrayG.length !== 0) {//全局数组中存在缓存数据
                console.log("quanju")
                var j = 0;
                for (var i = 0; i < arrayG.length; i++) {//检查要添加的元素是否存在重复
                  j = j + 1;
                  if (arrayG[i].title == good.title && arrayG[i].message == good.message) {
                    console.log("重复")
                    j = j - 1;
                    break;
                  }
                  if (j == arrayG.length) {//可以存入 save = true
                    console.log("可以存入")
                    save = true;
                    resolve("ok")
                  }
                }
                resolve("ok")
              } else {//全局数组中bu存在缓存数据
                var arrayS = wx.getStorageSync("needArray");

                if (arrayS.length !== 0) {//本地存储有数据
                  console.log("bendi")
                  //循环遍历存储
                  var j = 0;
                  for (var i = 0; i < arrayS.length; i++) {//检查要添加的元素是否存在重复
                    j = j + 1;
                    if (arrayS[i].title == good.title && arrayS[i].message == good.message) {
                      console.log("重复")
                      i = j - 1;
                      break;
                    }
                    if (j == arrayS.length) {//可以存入 save = true
                      console.log("可以存入")
                      save = true;
                      resolve("ok")
                    }
                  }
                } else {//本地存储没有数据
                  //网上调数据
                  console.log("wangluo")
                  var list = Bmob.Object.extend("addGoods");
                  var query = new Bmob.Query(list);
                  query.limit(1000);
                  query.find({
                    success: function (res) {
                      console.log("res", res)
                      var j = 0;
                      if (res.length == 0) {
                        save = true;
                        resolve("ok")
                      } else {
                        for (var i = 0; i < res.length; i++) {//检查要添加的元素是否存在重复
                          j = j + 1;
                          if (res[i].attributes.title == good.title && res[i].attributes.message == good.message) {
                            console.log("重复")
                            j = j - 1;
                            break;
                          }
                          console.log(j)
                          if (j == res.length) {//可以存入 save = true
                            console.log("可以存入")
                            save = true;
                            resolve("ok")
                          }
                        }
                      }
                      // resolve("ok")
                    }
                  })
                }
              }
            }
          );

          p1.then(function (resolve) {
            console.log("jin")
            if (save) {
              console.log("save")
              var Diary = Bmob.Object.extend("addGoods");
              var diary = new Diary();
              diary.set("title", good.title);
              diary.set("message", good.message);
              diary.set("buyingPrices", good.buyingPrices);
              diary.set("bNumber", good.bNumber);
              diary.set("buyingPrice", good.buyingPrice);
              diary.set("Btime", good.Btime);
              diary.set("merchant", good.merchant);
              diary.set("phone", good.phone);
              diary.set("class", good.class);
              diary.set("isHiden", good.isHiden);
              diary.save(null, {
                success: function (result) {
                  // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
                  console.log("日记创建成功, objectId:" + result.id);
                  good["id"] = result.id;
                  app.globalData.needArray.push(good)
                  wx.setStorage({
                    key: 'needArray',
                    data: app.globalData.needArray,
                  })
                },
                error: function (result, error) {
                  // 添加失败
                  console.log('创建日记失败', result, error);
                }
              });

            }
          })
          console.log("end")
        }
      }
    }
  },

  //打开商品详细页面
  clickToDetialView: function (e) {
    var hide = this.data.isHidenDetial;
    var hideS = this.data.isHidenPrice;
    if (!hideS) {
      if (hide) {
        this.setData({
          isHidenDetial: false
        })
      } else {
        this.setData({
          isHidenDetial: true
        })
      };
      var array = e.currentTarget.dataset.goods;
      this.setData({
        detailViewArray: array
      })
    }
  },

  //点击详情页面 关闭
  closeView: function () {
    this.setData({
      isHidenDetial: true
    })
  },

  //改变当前页面数据到其他大类的数据
  turnToOtherClass: function (e) {
    var hArray = app.globalData.huobiaoData;
    for (var i = 0; i < hArray.length; i++) {
      if (e.currentTarget.dataset.classname == hArray[i].category) {
        this.setData ({
          detailArray: hArray[i].classArray[0].goodArray,
          classArray: hArray[i].classArray,
          className: hArray[i].classArray[0].class,
          scrollTop:0,
          isHidenDetial: true,
          cateNum:i,
          classLength: hArray[i].classArray.length
        })
      }
    }
  },

  //转到设置页面
  tapToSet: function () {
    wx.navigateTo({
      url: '../set/set',
    })
  },
  //转到缺货页面
  tapToNeed: function () {
    wx.navigateTo({
      url: '../need/need',
    })
  },

  //改变类分数据
  changeClass: function (e) {
    console.log("e", e.currentTarget.dataset.classid)
    var classID = e.currentTarget.dataset.classid;
    var array = this.data.classArray;
    for (var i = 0; i < array.length; i++) {
      if ( classID == array[i].classID) {
        this.setData({
          isHidenDetial: true,
          classNum:i,
          detailArray: array[i].goodArray,
          className: array[i].class,
          classLength: array.length
        })
      }
    }
  },
  //展开或隐藏右侧跳转按钮栏
  hideOrShow: function () {
    var hide = this.data.isHiden;
    var hideD = this.data.isHidenDetial;
    if (!hideD) {
      this.setData({
        isHidenDetial: true
      })
    }else {
      if (hide) {
        this.setData({
          isHiden: false
        })
      } else {
        this.setData({
          isHiden: true
        })
      }
    }
  },

  alter:function (e) {
    app.globalData.isAlter = true;
    this.setData({
      isHidenDetial: true,
    })
    let p1 = new Promise(
      (resolve, reject) => {
        // 创建一个异步调用
        var list = Bmob.Object.extend("huobiao");
        var query = new Bmob.Query(list);

        var objID = e.currentTarget.dataset.object;
        // console.log("adawd", objID)
        query.get(objID, {
          success: function (result) {
            // 查询成功，调用get方法获取对应属性的值

            var obj = {};
            obj = result.attributes;
            obj["objectID"] = result.id;
            app.globalData.detailData = obj;
            // console.log("adawd", app.globalData.detailData)
            resolve("ok")
          }
        })
      }
    );
    p1.then( function (resolve) {
      app.globalData.isAlter = true;
      wx.navigateTo({
        url: '../add/add',
      })
    })
  },

  addData:function () {
    this.setData({
      isHidenDetial: true,
    })
    wx.navigateTo({
      url: '../add/add',
    })
  },

  refresh:function () {
    var that = this;//promise 里不能直接使用this 
    var num = this.data.cateNum;
    var numc = this.data.classNum;
    util.myAsyncFunction("huobiao").then(function (resolve) {
      that.setData({
        isHidenDetial: true,
        detailArray: resolve.huobiaoData[num].classArray[numc].goodArray,
        cateArray: resolve.categoryArray,
        classArray: resolve.huobiaoData[num].classArray,
      })
      wx.setStorage({
        key: 'huobiaoData',
        data: resolve.huobiaoData,
      })
      wx.setStorage({
        key: 'classArray',
        data: resolve.classArray,
      })
    })
  },
  up:function () {
    var numc = this.data.classNum;
    if (numc !== 0 && numc > 0) {
      var numcl = this.data.classNum - 1;
      this.setData({
        classNum: numcl,
        detailArray: this.data.classArray[numcl].goodArray,
        className: this.data.classArray[numcl].class
      })
    }
  },
  down: function () {
    var numc = this.data.classNum;
    console.log("numc", numc)
    if (numc < (this.data.classLength - 1)) {
      var numcl = this.data.classNum + 1;
      this.setData({
        classNum: numcl,
        detailArray: this.data.classArray[numcl].goodArray,
        className: this.data.classArray[numcl].class
      })
    }
  },
})
