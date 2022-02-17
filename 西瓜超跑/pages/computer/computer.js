// pages/computer/computer.js

const app = getApp();
const gData = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: [
      ['老舍区', '临江苑', '德馨苑', '锦地苑'],
      ['1栋', '2栋', '3栋', '4栋', '5栋', '6栋', '7栋', '8栋', '9栋', '10栋', '11栋', '12栋', '13栋', '14栋', '15栋']
    ],
    address_index: [0, 0],
    image: '../../images/add-line.png'
  },

  // 地址改变触发
  bindAddressChange: function (e) {
    this.setData({
      address_index: e.detail.value
    })
  },
  // 手机号正则表达式验证
  checkPhone: function (e) {
    console.log(e);
    if (!(/^1[3456789]\d{9}$/.test(e.detail.value))) {
      wx.showToast({
        title: '手机号输入有误',
        icon: 'none'
      })
      return false;
    }
  },
  // 图片选择函数
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          image: tempFilePaths
        })
        console.log(tempFilePaths);
        that.uploadImage();
      }
    })
  },
  // 图片上传函数
  uploadImage: function () {
    wx.showLoading({
      title: '图片上传中',
    })
    wx.uploadFile({
      filePath: this.data.image[0],
      name: 'files',
      url: gData.hosturl + '/file/upload',
      success: res => {
        wx.showToast({
          title: '上传成功'
        })
        console.log(res)
        console.log(JSON.parse(res.data).data[0])
        this.setData({
          image: JSON.parse(res.data).data[0]
        })
      },
      fail: res => {
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        })
        console.log(res)
      }
    })
  },
  // 维修订单提交事件
  computerSubmit: function (e) {
    if(gData.isLogin===false){
      wx.reLaunch({
        url: '../index/index',
        complete:res=>{
          wx.showToast({
            title: '请登录',
            icon:'none'
          })
        }
      })
      return false;
    }
    console.log(e.detail.value);
    var info = e.detail.value;
    console.log('送件地址:' + this.data.address[0][this.data.address_index[0]] + this.data.address[1][this.data.address_index[1]] + e.detail.value.roomNumber)
    var address_t = this.data.address[0][this.data.address_index[0]] + this.data.address[1][this.data.address_index[1]] + e.detail.value.roomNumber;
    if (info.name === "" || info.roomNumber === "" || info.telephone === "" || info.description === "" || this.data.image === '../../images/add-line.png') {
      wx.showToast({
        title: '信息填写不完整',
        icon: 'none'
      })
    } else {
      if (!(/^1[3456789]\d{9}$/.test(info.telephone))) {
        wx.showToast({
          title: '手机号输入有误',
          icon: 'none'
        })
        return false;
      }
      wx.showLoading({
        title: '下单中'
      })
      wx.request({
        url: gData.hosturl + '/computer/insert',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': gData.token + ''
        },
        data: {
          address: address_t,
          description: info.description,
          url: this.data.image,
          telephone: info.telephone,
          username: gData.openid,
          anotherName:info.name
        },
        success: res => {
          if(res.data.station!=="success"){
            wx.showToast({
              title: '下单失败',
              icon:'none'
            })
            return false;
          }else{
            wx.reLaunch({
              url: '../computer/computer',
              complete:res=>{
                wx.showToast({
                  title: '下单成功',
                })
              }
            })
            console.log(res);
          }



        },
        fail: res => {
          console.log(res);
        }
      })
    }
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
    console.log(gData.token);
    wx.showTabBar({
      animation: false,
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