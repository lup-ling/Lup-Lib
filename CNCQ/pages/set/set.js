// pages/set/set.js
const app = getApp()
var Bmob = require('../../utils/bmob.js')
var time 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:["登陆成功","登录失败","清除成功","清除失败"],
    show:"",
    isHidenM:true,
    sNumber:0,
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
  //输入权限密码，打开权限
  writePassWord: function (e) {
    console.log("e",e.detail.value)
    this.setData({
      sNumber: e.detail.value
    })
  },

  //确认密码
  enter: function() {
    var num = this.data.sNumber;
    if (num == 200909) {
      app.globalData.screct = 9527;
      wx.setStorage({
        key: 'authorityNum',
        data: num,
      })
      this.setData({
        show: this.data.message[0],
        isHidenM: false
      })

    } else {
      console.log("qeqeq wdaa")
      this.setData({
        show: this.data.message[1],
        isHidenM: false
      })
    }
    var that = this;
    time = setTimeout(function () {
      that.setData({
        isHidenM: true
      })
    }, 2000)
  },

  //触摸关闭提示框
  closeMessage: function() {
    console.log("关闭提示框")
    this.setData({
      isHidenM: true
    })
  },

  //清除本地数据
  clear: function() {
    wx.setStorage({
      key: 'huobiaoData',
      data: [],
    })
    wx.setStorage({
      key: 'categoryArray',
      data: [],
    })
    wx.setStorage({
      key: 'classArray',
      data: [],
    })
    wx.setStorage({
      key: 'needArray',
      data: [],
    })
    var a = wx.getStorageInfoSync("huobiaoData")
    var b = wx.getStorageInfoSync("categoryArray")
    var c = wx.getStorageInfoSync("classArray")
    var d = wx.getStorageInfoSync("needArray")
    // console.log("清除本地文件",a,b,c,d)
    if (a.length == undefined || b.length == undefined || c.length == undefined || d.length == undefined) {
      this.setData({
        show: this.data.message[2],
        isHidenM: false
      })
      
    }else {
      this.setData({
        show: this.data.message[3],
        isHidenM: false
      })
    }
    var that = this;
    setTimeout(function () {
      that.setData({
        isHidenM: true
      })
    }, 2000)
  }
})