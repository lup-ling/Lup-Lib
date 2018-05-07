// pages/login/login.js
const app = getApp();
var Bmob = require('../../utils/bmob.js');
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serectNum:0,
    isHiden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var serect = wx.getStorageSync("serect")
    if ( serect == 20090921) {
      wx.redirectTo({
        url: '../index/index',
      })
      console.log("登陆成功")
    }

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
  
  writeSerect: function (e) {
    this.setData ({
      serectNum: e.detail.value
    })
  },

  /**
   * 用户点击确认密码登陆
   */
  login:function () {
    console.log("login", this.data.serectNum);
    if (this.data.serectNum == 20090921) {
      this.setData({
        isHiden:true
      })
      wx.setStorage({
        key: 'serect',
        data: this.data.serectNum
      });
      wx.redirectTo({
        url: '../index/index',
      })
    }else {
      this.setData ({
        isHiden: false
      })
    }
  }
})