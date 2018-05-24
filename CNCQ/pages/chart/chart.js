// pages/chart/chart.js\
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history:[],
    title:"",
    message:"",
    y:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    // wx.drawCanvas ({
    //   canvasId:"chart",
    //   actions:context.getActions()
    // })
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
    var context = wx.createCanvasContext("chart", this);
    var width = wx.getSystemInfoSync().windowWidth;//屏幕宽
    var height = wx.getSystemInfoSync().windowHeight;//屏幕高
    var y = height * 0.15;//水平线高
    var array = app.globalData.historyArray;//历史数据数组
    var startY = y;//原点坐标数据 y
    var lengthA = array.length;//数组长度
    var startX = width / (lengthA * 2);//原点坐标x
    var y0 = array[0].buyingPrices;//y轴参考值
    this.setData({
      y: y
    })//估计没用
    //画水平线
    context.setStrokeStyle("red");
    context.setFontSize(10)
    context.fillText("参考线", width - 35, y + 13)
    context.setLineWidth(1);
    context.beginPath()
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.closePath();
    context.stroke();
    //起始坐标点
    context.beginPath(); 
    context.setStrokeStyle("#565356");
    context.setLineWidth(3);
    context.setFillStyle("#565356");
    context.setFontSize(12)
    context.fillText('¥'+array[0].buyingPrices, startX - 15, startY - 10)
    context.fillText(0, startX - 4, startY + 20)
    context.arc(startX, startY, 2, 0, 2 * Math.PI);
    context.closePath();
    context.stroke();
    
    for (var i = 1; i < array.length; i++) {
      //当前坐标点
      var y1 = y0 - array[i].buyingPrices + startY; 
      var x1 = startX + startX * 2 * i;
      //上一个坐标点
      var yL = y0 - array[i - 1].buyingPrices + startY;
      var xL = startX + startX * 2 * (i - 1);
      //画点
      context.beginPath();
      context.setStrokeStyle("#565356");
      context.setLineWidth(3);
      context.setFillStyle("#565356");
      context.setFontSize(12)
      context.fillText(array[i].buyingPrices, x1 - 15, y1 - 10)
      context.fillText(i, x1 - 4, y1 + 20)
      context.arc(x1, y1, 2, 0, 2 * Math.PI);
      context.closePath();
      context.stroke(); 
      //划线
      context.beginPath();
      context.setStrokeStyle("#838383");
      context.setLineWidth(1);
      context.moveTo(xL,yL);
      context.lineTo(x1,y1);
      context.closePath();
      context.stroke();
    }

    wx.drawCanvas({
      canvasId: "chart",
      actions: context.getActions()
    })
    console.log("onshow", array)
    this.setData({
      history:array,
      title: app.globalData.title_H,
      message: app.globalData.message_H
    })
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
  
  }
})