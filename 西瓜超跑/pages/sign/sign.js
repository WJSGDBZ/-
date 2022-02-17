// pages/sign/sign.js
const app = getApp()
const hosturl = app.globalData.hosturl;
const gData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 请求头封装
    rheader: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': gData.token + ''
    },
    telephone: '',
    studentNumber: '',
    sex: ["男", "女"],
    sex_index:0,
    age: '',
    date: ''
  },
  // 性别选择改变时触发
  bindSexChange:function(e){
    this.setData({
      sex_index: e.detail.value
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
  // 学号正则表达式验证
  checkStudentNumber: function (e) {
    console.log(e);
    if (!(/^3[123]\d{11}$/.test(e.detail.value))) {
      wx.showToast({
        title: '学号输入有误',
        icon: 'none'
      })
      return false;
    }
  },
  // 注册表单提交事件
  signSubmit: function (e) {
    console.log(e);
    console.log(e.detail.value)
    var info = e.detail.value;
    if (info.telephone === "" || info.studentNumber === "" || info.age === "" ) {
      wx.showToast({
        title: '信息不完整',
        icon: 'none'
      })
    } else {
      // 调用注册接口
      if (!(/^1[3456789]\d{9}$/.test(info.telephone))) {
        wx.showToast({
          title: '手机号输入有误',
          icon: 'none'
        })
        return false;
      }
      if (!(/^3[123]\d{11}$/.test(info.studentNumber))) {
        wx.showToast({
          title: '学号输入有误',
          icon: 'none'
        })
        return false;
      }
      wx.showLoading({
        title: '注册中'
      })
      wx.request({
        url: gData.hosturl + '/login/insert',
        method: 'POST',
        header: this.data.rheader,
        data: {
          username: gData.openid,
          age: info.age,
          sex: this.data.sex[this.data.sex_index],
          studentNumber: info.studentNumber,
          telephone: info.telephone
        },
        success: res => {
          console.log(res);
          if (res.data.station !== "success") {

          } else {
            wx.navigateBack({
              complete: (res) => {
                wx.showToast({
                  title: '注册成功',
                })
              },
            })
          }
        },
        fail: res => {
          wx.showToast({
            title: '网络连接错误',
            icon:'none'
          })
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