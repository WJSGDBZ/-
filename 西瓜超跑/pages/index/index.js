//index.js
//获取应用实例
const app = getApp()
const hosturl = app.globalData.hosturl;
const gData = app.globalData;

Page({
  data: {
    role:'MEMBER',
    isLogin: true,
    userinfo: {}
  },
  // 跳转到快递跑腿下单界面
  goToExpress: function () {
    wx.reLaunch({
      url: '../express/express',
    })
  },
  // 跳转到电脑维修下单界面
  goToComputer: function () {
    wx.reLaunch({
      url: '../computer/computer',
    })
  },
  // 跳转到电费缴纳界面
  goToElectric: function () {
    wx.showToast({
      title: '功能暂未启用',
      icon:'none'
    })
    return false;
    wx.reLaunch({
      url: '../electric/electric',
    })
  },
  // 跳转到我的订单界面
  goToOrder: function () {
    if (gData.isLogin === false) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      wx.reLaunch({
        url: '../order/order',
      })
    }

  },

  // 申请成为兼职者
  askStaff:function(){
    wx.navigateTo({
      url: '../all/all',
    })
  },

  // 去兼职者界面
  goToStaff:function(){
    wx.navigateTo({
      url: '../all/all',
    })
  },

  // 登录按钮点击函数
  goLogin:function(){
    // 测试函数
  },

  // 获取openid的方法
  getOpenId: function () {
    // 调用微信官方登录接口
    wx.login({
      success: res => {
        console.log(res);
        wx.request({
          url: gData.hosturl + '/login/get',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            //'Authorization': gData.token + ''
          },
          data: {
            appId: 'wxe1acbca27eec7ab2',
            appSecret: '92bf97baf3819766aff2ce93cbd09cfd',
            code: res.code
          },
          success: res => {
            console.log(res);
            gData.openid = JSON.parse(res.data.data).openid;
            wx.setStorage({
              data: JSON.parse(res.data.data).openid,
              key: 'openid',
            })
          },
          fail: res => {
            wx.showToast({
              title: '获取用户名失败',
              icon: 'none'
            })
          }
        })
      }
    })
  },

  // 自定义登录的方法
  login: function () {
      wx.request({
        url: gData.hosturl + '/login/login',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': gData.token + ''
        },
        data: {
          username: gData.openid
        },
        // 自定义登录的方法
        success: res => {
          console.log(res);
          console.log(res.data.msg);
          if (res.data.msg === '该用户不存在，请先去注册') {
            wx.navigateTo({
              url: '../sign/sign',
            })
          } else {
            gData.token = res.data.data.token;
            gData.role=res.data.data.role;
            this.setData({
              role:gData.role
            })
            wx.setStorage({
              data: res.data.data.token,
              key: 'token',
            })
            this.getUserInfo()
          }
        },
        fail: res => {
          wx.showToast({
            title: '网络连接错误',
            icon: 'none'
          })
        }
      })
  },

  // 退出登录的方法
  exit: function () {
    gData.isLogin = false
    gData.token=null
    // gData.openid=null
    // wx.removeStorageSync('openid')
    wx.removeStorageSync('token')
    this.setData({
      isLogin: gData.isLogin
    })
  },

  // 获取用户信息的方法
  getUserInfo: function () {
    wx.request({
      url: gData.hosturl + '/user/one',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': gData.token + ''
      },
      data: {
        username: gData.openid
      },
      success: res => {
        if (res.data.error) {
          return false;
        }
        if (!res.data.data) {
          wx.showToast({
            title: '登陆失效',
            icon: 'none'
          })
          gData.isLogin = false
          this.setData({
            isLogin: gData.isLogin
          })
        } else {
          gData.isLogin = true
          this.setData({
            isLogin: gData.isLogin,
            userinfo: res.data.data
          })
          console.log(res)
        }

      },
      fail: res => {
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        })
      }
    })
  },

  //监听页面加载
  onLoad: function () {
    // 查询本地是否缓存openid
    wx.getStorage({
      key: 'openid',
      success: res => {
        gData.openid = res.data;
        wx.getStorage({
          key: 'token',
          success: res => {
            this.login();
          },
          fail: res => {
            wx.showToast({
              title: '请登录',
              icon: 'none'
            })
          }
        })
      },
      fail: res => {
        this.getOpenId();
      }
    })
  },

  // 隐藏tabbar函数
  onShow: function () {
    wx.hideTabBar({
      animation: false,
    })
  }
})