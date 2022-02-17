// pages/express/express.js
const app = getApp();
const gData = app.globalData;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    point: ['侧门中通菜鸟驿站', '西门菜鸟驿站', '永嘉驿站', '侧门圆通菜鸟驿站'],
    point_index: 0,
    address: [
      ['老舍区', '临江苑', '德馨苑', '锦地苑'],
      ['1栋', '2栋', '3栋', '4栋', '5栋', '6栋', '7栋', '8栋', '9栋', '10栋', '11栋', '12栋', '13栋', '14栋', '15栋']
    ],
    address_index: [0, 0],
    image: '../../images/add-line.png',
    code: '',
    telephone: '',
    cost: '',
    url: []
  },
  // 取件点改变触发
  bindPointChange: function (e) {
    this.setData({
      point_index: e.detail.value
    })
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

  // 下单按钮提交事件
  expressSubmit: function (e) {
    if (gData.isLogin === false) {
      wx.reLaunch({
        url: '../index/index',
        complete: res => {
          wx.showToast({
            title: '请登录',
            icon: 'none'
          })
        }
      })
      return false;
    }
    console.log(e.detail.value)
    var info = e.detail.value;
    console.log(this.data.point[this.data.point_index]);
    console.log('送件地址:' + this.data.address[0][this.data.address_index[0]] + this.data.address[1][this.data.address_index[1]] + e.detail.value.roomNumber)
    var address_t = this.data.address[0][this.data.address_index[0]] + this.data.address[1][this.data.address_index[1]] + e.detail.value.roomNumber;
    var point_t = this.data.point[this.data.point_index];
    if (info.code === "" || info.roomNumber === "" || info.telephone === "" || info.cost === "" || this.data.image === '../../images/add-line.png') {
      wx.showToast({
        title: '信息填写不完整',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '下单中'
      })
      wx.request({
        url: gData.hosturl + '/express/insert',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': gData.token + ''
        },
        data: {
          address: address_t,
          code: info.code,
          cost: info.cost,
          point: point_t,
          telephone: info.telephone,
          url: this.data.image,
          username: gData.openid
        },
        success: res => {
          if (res.data.station !== "success") {
            wx.showToast({
              title: '下单失败',
              icon: 'none'
            })
            return false;
          } else {
            wx.reLaunch({
              url: '../express/express',
              complete: res => {
                wx.showToast({
                  title: '下单成功',
                })
              }
            })
          }

        },
        fail: res => {
          wx.showToast({
            title: '下单失败',
            icon: 'none'
          })
          console.log(res)
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