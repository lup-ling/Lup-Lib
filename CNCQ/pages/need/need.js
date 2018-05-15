// pages/need/need.js
const app = getApp();
var Bmob = require('../../utils/bmob.js')
var Promise = require('../../utils/bluebird.min.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    needArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var array = app.globalData.needArray;
    console.log("global",array)
    if (array.length == 0) {
      var array1 = wx.getStorageSync("needArray");
      // console.log("bendi", array1)
      if (array1.length == 0) {
        var list = Bmob.Object.extend("addGoods");
        var query = new Bmob.Query(list);
        var array2 = [];
        query.find({
          success: function(res) {
            for( var i = 0; i < res.length; i++) {
              var obj = res[i].attributes;
              obj["id"] = res[i].id;
              array2.push(obj)
            }
            that.setData ({
              needArray:array2
            })
            wx.setStorageSync("needArray", array2)
            app.globalData.needArray = array2;
          }
        })
      }else {
        that.setData({
          needArray: array1
        })
        app.globalData.needArray = array1;
        // console.log("add", that.data.needArray)
      }
    }else {
      that.setData({
        needArray: array
      })
      // console.log("add", that.data.needArray)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  refresh_needArray: function () {
    var that = this;
    var list = Bmob.Object.extend("addGoods");
    var query = new Bmob.Query(list);
    var array2 = [];
    query.find({
      success: function (res) {
        for (var i = 0; i < res.length; i++) {
          var obj = res[i].attributes;
          obj["id"] = res[i].id;
          array2.push(obj)
        }
        that.setData({
          needArray: array2
        })
        wx.setStorageSync("needArray", array2)
        app.globalData.needArray = array2;
        // console.log("dad", array2)
      }
    })
  },

  //滑动删除
  moveS1: function (e) {
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      });
    }
  },

  moveE1: function (e) {
    console.log(e)
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
        //删除操作
        var Diary = Bmob.Object.extend("addGoods");
        var query = new Bmob.Query(Diary);
        var idc = e.currentTarget.dataset.id;
        var index = e.currentTarget.dataset.index;
        query.get(idc, {
          success: function (object) {
            // The object was retrieved successfully.
            object.destroy({
              success: function (deleteObject) {
                console.log('删除日记成功');
                var array = that.data.needArray;
                array.splice(index,1);
                that.setData ({
                  needArray: array
                })
                wx.setStorageSync("needArray", array)
                app.globalData.needArray = array;
              },
              error: function (object, error) {
                console.log('删除日记失败');
              }
            });
          },
        });
      }
    }
  }
})