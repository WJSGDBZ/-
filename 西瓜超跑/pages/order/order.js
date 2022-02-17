// pages/order/order.js

const app = getApp();
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
    }
  },

  // 快递跑腿订单页跳转函数
  goToOrderExpress: function () {
    wx.navigateTo({
      url: '../order-express/order-express',
    })
  },
  // 电脑维修订单页跳转函数
  goToOrderComputer: function () {
    wx.navigateTo({
      url: '../order-computer/order-computer',
    })
  },
  // 电费充值订单页跳转函数
  goToOrderElectric: function () {
    wx.showToast({
      title: '功能暂未启用',
      icon:'none'
    })
    return false;
    wx.navigateTo({
      url: '../order-electric/order-electric',
    })
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
    // if(gData.isLogin===false){
    //   wx.showToast({
    //     title: '请先登录',
    //     icon:'none'
    //   })
    //   wx.reLaunch({
    //     url: '../index/index',
    //   })
    // }
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