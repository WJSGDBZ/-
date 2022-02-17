// pages/order-express/order-express.js

const app = getApp()
const hosturl = app.globalData.hosturl;
const gData = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 查询到的订单列表
    orderList: [
      // {id:1,point:456465,code:114554,address:123456,telephone:18195665556,cost:15.6,url:'http://asdasdasfasfasdasd',username:'asdasfd'},
      // {id:2,point:456465,code:114554,address:123456,telephone:18195665556,cost:15.6,url:'http://asdasdasfasfasdasd',username:'asdasfd'}
    ],
    pageNum: 1,
    pagesize: 10,
    total: 0
  },

  // 预览图片的方法
  previewImage: function (e) {
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
    })
  },

  // 拨打电话得方法
  callStaff: function (e) {
    console.log(e.currentTarget.dataset.staff)
    if (e.currentTarget.dataset.staff == null) {
      wx.showToast({
        title: '该订单尚未接单',
        icon: 'none'
      })
    } else {
      wx.request({
        url: gData.hosturl + '/user/one',
        method: 'GET',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': gData.token + ''
        },
        data: {
          username: e.currentTarget.dataset.staff
        },
        success: res => {
          console.log(res)
          if (res.data.station !== "success") {
            wx.showToast({
              title: '联系失败',
              icon: 'none'
            })
          } else {
            console.log(res.data.data.telephone)
            wx.makePhoneCall({
              phoneNumber: res.data.data.telephone
            })
          }
        },
        fail: res => {
          console.log(res)
        }
      })
    }

  },

  // 删除自己的订单
  deleteOrder: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.request({
      url: gData.hosturl + '/express/delete_own',
      method: 'DELETE',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': gData.token + ''
      },
      data: {
        id: e.currentTarget.dataset.id
      },
      success: res => {
        if (res.data.station != "success") {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        } else {
          wx.reLaunch({
            url: '../order-express/order-express',
            complete: res => {
              wx.showToast({
                title: '删除成功',
              })
            }
          })
        }
      },
      fail: res => {
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
      }
    })
  },
  // 获取全部订单的方法
  getAllOrder: function () {
    wx.request({
      url: gData.hosturl + '/express/all_user_time',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': gData.token + ''
      },
      data: {
        page: this.data.pageNum,
        limit: this.data.pagesize
      },
      success: res => {
        // 此处已经改进用户体验
        if (res.data.station !== "success") {
          wx.showToast({
            title: '获取订单信息失败',
            icon: 'none'
          })
          return false
        } else {

          console.log(res.data.data.records)
          this.setData({
            orderList: this.data.orderList.concat(res.data.data.records),
            total: res.data.data.total
          })
          wx.hideLoading()
        }
        console.log(res);
      },
      fail: res => {
        console.log(res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('调用一次');
    wx.showLoading({
      title: '加载中',
    })
    this.getAllOrder();
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
    console.log("快递订单触底一次")
    var len = this.data.orderList.length;
    console.log(len);

    if (this.data.total <= len) {
      return false;
    } else {
      wx.showLoading({
        title:'加载中'
      })
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.getAllOrder();
      console.log(this.data.pageNum)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})