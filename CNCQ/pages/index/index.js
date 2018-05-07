//index.js
//获取应用实例
const app = getApp();
var Bmob = require('../../utils/bmob.js')
var Promise = require('../../utils/bluebird.min.js')
var util = require('../../utils/util.js');

Page({
  data: {
    userInfo: {},
    isHiden:false,
    isHidenList:true,
    isHidenDetial:true,
    hasUserInfo: false,
    scrollTop:0,
    cateNum:0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    toView: '',
    listName:"",
    detailArray: [],
    cateArray:[],
    detailViewArray:[]
  },

  onLoad: function () {    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    var huobiaoData = wx.getStorageSync('huobiaoData');
    var categoryArray = wx.getStorageSync('categoryArray');
    var classArray = wx.getStorageSync('classArray');
    if (huobiaoData.length > 0 && categoryArray.length > 0 && classArray.length > 0) {
      //加载本地存储数据
      app.globalData.huobiaoData = huobiaoData;
      console.log("ok")
      this.setData({
        detailArray: huobiaoData[0].classArray,
        cateArray: categoryArray,
      })
    }else {
      var that = this;//promise 里不能直接使用this 
      util.myAsyncFunction("huobiao").then(function (resolve) {
        that.setData({
          detailArray: resolve.huobiaoData[0].classArray,
          cateArray: resolve.categoryArray,
        })
        wx.setStorage({
          key: 'huobiaoData',
          data: resolve.huobiaoData,
        })
        wx.setStorage({
          key: 'categoryArray',
          data: resolve.categoryArray,
        })
      })
    }
  },

  onShow: function () {
    var array = ["1阿达","2无法","3公司","5如果","4好的","6加油"];
    array.sort();
    console.log("sort", array)
  },

  //获取用户信息
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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

  //打开商品详细页面
  clickToDetialView: function (e) {
    var hide = this.data.isHidenDetial;
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
      detailViewArray:array
    })

  },

  //改变当前页面数据到其他大类的数据
  turnToOtherClass: function (e) {
    var hArray = app.globalData.huobiaoData;
    for (var i = 0; i < hArray.length; i++) {
      if (e.currentTarget.dataset.classname == hArray[i].category) {
        this.setData ({
          detailArray: hArray[i].classArray,
          scrollTop:0,
          isHidenDetial: true,
          cateNum:i
        })
      }
    }
  },

  //跳转到当前页面指定位置
  turnToHeadView: function (e) {
    this.setData({
      toView: e.currentTarget.dataset.goodid,
    })
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
    util.myAsyncFunction("huobiao").then(function (resolve) {
      that.setData({
        isHidenDetial:true,
        detailArray: resolve.huobiaoData[num].classArray,
      })
      wx.setStorage({
        key: 'huobiaoData',
        data: resolve.huobiaoData,
      })
    })
  }
})
