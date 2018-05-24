// pages/add/add.js
const app = getApp();
var util = require('../../utils/util.js');  
var Bmob = require('../../utils/bmob.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[],//将globalData中的货表数组传递到array中
    arrayClass:[],//picker选择分类需要的分类数组
    detailData: {},// 修改数据类型时需要placeholder的数据
    index1:0,
    index2: 0,
    cateName:"",
    className:"",
    currentTime:"",
    bPrice:"",
    time:"",
    goodMessage: {},
    isHiden:true, //删除按钮默认隐藏,
    isHidenAdd:true//默认隐藏添加分类分区按钮
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      array: app.globalData.huobiaoData,
    })
    // console.log("array",this.data.array)
    var isAlter = app.globalData.isAlter;
    // console.log("add", this.data.isHidenAdd)
    if (isAlter) {//isAlter=true 进入修改模式
      this.setData({
        detailData: app.globalData.detailData,
        goodMessage: app.globalData.detailData,
        bPrice: app.globalData.detailData.buyingPrice
      })
      var detailData = this.data.detailData;
      var cate1 = detailData.category;
      var class1 = detailData.class;
      for (var i = 0; i < this.data.array.length; i++) {
        if (cate1 == this.data.array[i].category) {
          this.setData({
            index1:i,
            time: detailData.Btime
          })
          for (var j = 0; j < this.data.array[i].classArray.length; j++) {
            if (class1 == this.data.array[i].classArray[j].class) {
              var array1 = this.data.array[i].classArray
              this.setData({
                index2: j,
                arrayClass: array1
              })
              // console.log("array1", this.data.index2)
              break;
            }
          }
        } 
      }
    } else {//isAlter=false 进入添加模式
      var date = util.formatTime(new Date());
      var date1 = date.substring(0, 10);
      // console.log(date1)
      this.setData({
        array: app.globalData.huobiaoData,
        currentTime: date1,
        time: date1,
        arrayClass: app.globalData.huobiaoData[0].classArray,
        isHidenAdd:false
      })
      console.log("add", this.data.isHidenAdd)
      this.data.goodMessage["cateID"] = app.globalData.huobiaoData[0].cateID;
      this.data.goodMessage["category"] = app.globalData.huobiaoData[0].category;
      this.data.goodMessage["classID"] = app.globalData.huobiaoData[0].classArray[0].classID;
      this.data.goodMessage["class"] = app.globalData.huobiaoData[0].classArray[0].class;
      this.data.goodMessage["Btime"] = date1;
      // console.log("log", this.data.goodMessage.classID,this.data.goodMessage.class)
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
    // console.log("hide1", this.data.isHiden)
    // console.log("alter1", app.globalData.isAlter)
    if (this.data.isHiden) {
      if (app.globalData.isAlter) {
        this.setData({
          isHiden: !app.globalData.isAlter
        })
      } 
    }else {
      if (!app.globalData.isAlter) {
        this.setData({
          isHiden: !app.globalData.isAlter
        })
      }
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
    console.log("hide")
    app.globalData.isAlter = false;
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

  //改变数据。保存数据 
  finishWrite: function (w) {
    var key = w.currentTarget.dataset.text;
    var value = w.detail.value;
    if (value.length > 0) {
      this.data.goodMessage[key] = value;
    }
    if (this.data.goodMessage.buyingPrices > 0 && this.data.goodMessage.bNumber > 0) {
      var price = (this.data.goodMessage.buyingPrices / this.data.goodMessage.bNumber).toFixed(2);
      String(price)
      this.data.goodMessage['buyingPrice'] = price;
      console.log(this.data.goodMessage.buyingPrice);
      this.setData ({
        bPrice: price
      })
    }
    console.log(this.data.goodMessage)
  },
  
  // 改变大分类
  changeCate:function (p) {
    console.log(p)
    var indexP = p.detail.value;
    var cate = this.data.array[indexP].category;
    var cateID = this.data.array[indexP].cateID;
    this.setData ({
      index1: indexP
    })
    this.data.goodMessage["category"] = cate;
    this.data.goodMessage["cateID"] = cateID;
    console.log("message", this.data.goodMessage)

    this.setData({
      arrayClass:this.data.array[indexP].classArray,
    })

  },

  //改变小分类
  changeClass: function (p) {
    console.log(p)
    var indexP = p.detail.value;
    var clas = this.data.arrayClass[indexP].class;
    var classID = this.data.arrayClass[indexP].classID;
    this.setData({
      index2: indexP,
    })
    this.data.goodMessage["class"] = clas;
    this.data.goodMessage["classID"] = classID;
    console.log("message", this.data.goodMessage)
  },

  //改变时间 
  changeTime:function (t) {
    console.log(t.detail.value)
    this.data.goodMessage["Btime"] = t.detail.value;
    this.setData ({
      time : t.detail.value
    })
    
  },

  // 保存数据。上传数据
  save: function () {
    var that = this;
    var text = this.data.goodMessage;
    console.log("isAlter",app.globalData.isAlter)
    if (app.globalData.isAlter) {//编辑模式
      var Diary = Bmob.Object.extend("huobiao");
      var query = new Bmob.Query(Diary);
      var idc = this.data.goodMessage.objectID;
      console.log("save", idc)
      query.get(idc, {
        success: function (result) {
          console.log("result",result)
          result.set("cateID", text.cateID);
          result.set("category", text.category);
          result.set("classID", text.classID);
          result.set("class", text.class);
          result.set("title", text.title);
          result.set("message", text.message);
          result.set("buyingPrices", text.buyingPrices);
          result.set("bNumber", text.bNumber);
          result.set("buyingPrice", text.buyingPrice);
          result.set("salePrices", text.salePrices);
          result.set("sNumber", text.sNumber);
          result.set("salePrice", text.salePrice);
          result.set("retailPrice", text.retailPrice);
          result.set("Btime", text.Btime);
          result.set("merchant", text.merchant);
          result.set("phone", text.phone);
          var detail = that.data.detailData
          console.log("save detail",detail)
          var obj = {};
          obj["Btime"] = text.Btime;
          obj["buyingPrice"] = text.buyingPrice;
          obj["buyingPrices"] = text.buyingPrices;
          obj["bNumber"] = text.bNumber;
          obj["merchant"] = text.merchant;
          obj["phone"] = text.phone;
          var array1 = result.attributes.history;
          var n = array1.length;
          for (var i = 0; i < array1.length; i++) {
            if (array1[i].Btime == text.Btime) {
              array1.splice(i,1,obj);
              n = n - 1;
              console.log("==",n);
            }
            if ( i == (array1.length - 1) && n == array1.length) {
              array1.push(obj);
              console.log("!==", n);
            }
          }
          result.set("history", array1);
          app.globalData.isAlter = false;
          console.log("alter")
          result.save();
          wx.navigateBack({
            delta: 2
          })
        },
        error: function (object, error) {
          console.log("error")
        }
      });
    }else {//添加模式
      // console.log(this.data.goodMessage)
      // console.log(this.data.goodMessage.title)
      if (this.data.goodMessage.title !== undefined && this.data.goodMessage.title.length !== 0 && this.data.goodMessage.buyingPrices !== undefined && this.data.goodMessage.buyingPrices.length !== 0) {
        var Diary = Bmob.Object.extend("huobiao");
        var diary = new Diary();
        diary.set("cateID", text.cateID);
        diary.set("category", text.category);
        diary.set("classID", text.classID);
        diary.set("class", text.class);
        diary.set("title", text.title);
        diary.set("message", text.message);
        diary.set("buyingPrices", text.buyingPrices);
        diary.set("bNumber", text.bNumber);
        diary.set("buyingPrice", text.buyingPrice);
        diary.set("salePrices", text.salePrices);
        diary.set("sNumber", text.sNumber);
        diary.set("salePrice", text.salePrice);
        diary.set("retailPrice", text.retailPrice);
        diary.set("Btime", text.Btime);
        diary.set("merchant", text.merchant);
        diary.set("phone", text.phone);
        var obj = {};
        obj["Btime"] = text.Btime;
        obj["buyingPrice"] = text.buyingPrice;
        obj["buyingPrices"] = text.buyingPrices;
        obj["bNumber"] = text.bNumber;
        obj["merchant"] = text.merchant;
        obj["phone"] = text.phone;
        var array1 = [];
        array1.push(obj)
        diary.set("history", array1);
        //添加数据，第一个入口参数是null
        diary.save(null, {
          success: function (result) {
            // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
            console.log("日记创建成功, objectId:" + result.id);
            app.globalData.isAlter = false;
            wx.navigateBack({
              delta: 2
            })
          },
          error: function (result, error) {
            // 添加失败
            console.log('创建日记失败',result,error);
          }
        });
      } 
    }
  },

  // 删除数据
  del:function () {
    if (app.globalData.isAlter) {
      //删除操作
      var Diary = Bmob.Object.extend("huobiao");
      var query = new Bmob.Query(Diary);
      var idc = this.data.goodMessage.objectID;
      query.get(idc, {
        success: function (object) {
          // The object was retrieved successfully.
          object.destroy({
            success: function (deleteObject) {
              console.log('删除日记成功');
              app.globalData.isAlter = false;
              wx.navigateBack({
                delta:2
              })
            },
            error: function (object, error) {
              console.log('删除日记失败');
            }
          });
        },
        error: function (object, error) {
          console.log("query object fail");
        }
      });

    }
  }
})