const app = getApp()
const hosturl = app.globalData.hosturl;
const gData = app.globalData;
const delay_time = 100;
Page({
  data: {
    Getcolor: "white",
    currentTab: 0,
    express_image: false,
    repair_image: false,
    cost_image: true,
    re_detail_contents: "",
    ex_detail_contents: "",
    el_detail_contents: "",
    posts_contents: "",
    repair_contents: "",
    electric_contents: "",
    container_height: 100,
    repair_height: 100,
    electric_height: 100,
    cur_height: 100,
    express_page: 1,
    repair_page: 1,
    electric_page: 1,
    ex_visibility: 'hidden',
    re_visibility: 'hidden',
    el_visibility: 'hidden',

  },
  //手动切换页面
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      var index = this.data.currentTab;
      that.setData({
        currentTab: e.target.dataset.current,
      })
      this.onPullDownRefresh();
      switch (index) {
        case 0:
          this.setData({
            el_visibility: 'hidden',
            re_visibility: 'hidden',
            repair_height: 100,
            cur_height: this.data.container_height,
            repair_page: 1
          })
          break;
        case 1:
          this.setData({
            el_visibility: 'hidden',
            ex_visibility: 'hidden',
            container_height: 100,
            cur_height: this.data.repair_height,
            express_page: 1
          })
          break;
        case 2:
          this.setData({
            el_visibility: 'hidden',
            ex_visibility: 'hidden',
            container_height: 100,
            express_page: 1,
            repair_height: 100,
            repair_page: 1
          })
          break;
      }
    }
  },
  //滑动切换
  swiperChange: function (e) {
    this.setData({
      currentTab: e.detail.current,
    })
    this.onPullDownRefresh();
    var index = this.data.currentTab;
    switch (index) {
      case 0:
        this.setData({
          el_visibility: 'hidden',
          re_visibility: 'hidden',
          repair_height: 100,
          cur_height: this.data.container_height,
          repair_page: 1
        })
        break;
      case 1:
        this.setData({
          el_visibility: 'hidden',
          ex_visibility: 'hidden',
          container_height: 100,
          cur_height: this.data.repair_height,
          express_page: 1
        })
        break;
      case 2:
        this.setData({
          ex_visibility: 'hidden',
          re_visibility: 'hidden',
          container_height: 100,
          express_page: 1,
          repair_height: 100,
          repair_page: 1
        })
        break;
    }
  },
  //上拉加载
  onReachBottom: function () {
    var that = this;
    var index = this.data.currentTab;
    switch (index) {
      case 0:
        wx.showToast({
          title: '已经见底啦',
          image: '/images/shibai.png'
        })
        break;
      case 1:
        wx.showToast({
          title: '已经见底啦',
          image: '/images/shibai.png'
        })
        break;
      case 2:
        wx.showToast({
          title: '已经见底啦',
          image: '/images/shibai.png'
        })
        break;
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '玩命加载中',
    })
    var that = this;
    var index = this.data.currentTab;
    switch (index) {
      case 0:
        that.setData({
          express_page: 1,
          container_height: 100,
          cur_height: 100,
        })
        wx.request({
          url: hosturl + '/express/all_staff',
          method: 'Get',
          data: {
            page: 1,
            limit: 10,
            //staff_name:wx.getStorageInfoSync('openId')
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': gData.token + ''
          },
          success(res) {
            //console.log(res.data.data.records.length);
            //console.log(gData.token);
            //console.log(gData.openid);
            //console.log(res.data.station);
            if (res.data.station != "success") {
              wx.showToast({
                title: '您没有该权限',
                image: '/images/shibai.png'
              })
              wx.hideNavigationBarLoading();
              wx.stopPullDownRefresh();
              return;
            }
            var posts_content = [];
            for (var i = 0; i < res.data.data.records.length; i++) {
              if (res.data.data.records[i].status == 1) {
                posts_content = posts_content.concat(res.data.data.records[i]);
              }
            }
            that.setData({
              posts_contents: posts_content,
              container_height: 100 + 320 * posts_content.length,
              cur_height: 100 + 320 * posts_content.length,
            })
            for (var i = 1; i < res.data.data.pages; i++) {
              wx.request({
                url: hosturl + '/express/all_staff',
                method: 'Get',
                data: {
                  page: i + 1,
                  limit: 10,
                  //staff_name:wx.getStorageInfoSync('openId')
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Authorization': gData.token + ''
                },
                success(res) {
                  console.log(res);
                  var posts_content = [];
                  for (var i = 0; i < res.data.data.records.length; i++) {
                    if (res.data.data.records[i].status == 1) {
                      posts_content = posts_content.concat(res.data.data.records[i]);
                    }
                  }
                  that.setData({
                    express_page: that.data.express_page + 1,
                    posts_contents: that.data.posts_contents.concat(posts_content),
                    container_height: that.data.container_height + 320 * posts_content.length,
                    cur_height: that.data.container_height + 320 * posts_content.length,
                  })
                }
              })
            }
            if (that.data.posts_contents.length <= 3) {
              that.setData({
                cur_height: 1060,
                container_height: 1060,
              })
            }
          },
          fail: function () {
            wx.showToast({
              title: '加载失败',
              image: '/images/shibai.png'
            })
          },
          complete: function () {
            wx.hideLoading();
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
          }
        })
        break;
      case 1:
        that.setData({
          repair_page: 1,
          repair_height: 100,
          cur_height: 100,
        })
        wx.request({
          url: hosturl + '/computer/all_staff',
          method: 'Get',
          data: {
            page: 1,
            limit: 10,
            //staff_name:wx.getStorageSync('openId')
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': gData.token + ''
          },
          success(res) {
            console.log(res);
            console.log(res.data.station);
            if (res.data.station != "success") {
              wx.showToast({
                title: '您没有该权限',
                image: '/images/shibai.png'
              })
              that.setData({
                cur_height: 1060,
                repair_height: 1060,
              })
              wx.hideNavigationBarLoading();
              wx.stopPullDownRefresh();
              return;
            }
            var repair_content = [];
            for (var i = 0; i < res.data.data.records.length; i++) {
              if (res.data.data.records[i].status == 1) {
                repair_content = repair_content.concat(res.data.data.records[i]);
              }
            }
            that.setData({
              repair_contents: repair_content,
              repair_height: that.data.repair_height + 320 * repair_content.length,
              cur_height: that.data.repair_height + 320 * repair_content.length,
            })
            for (var i = 1; i < res.data.data.pages; i++) {
              wx.request({
                url: hosturl + '/computer/all_staff',
                method: 'Get',
                data: {
                  page: i + 1,
                  limit: 10,
                  //staff_name:wx.getStorageInfoSync('openId')
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Authorization': gData.token + ''
                },
                success(res) {
                  console.log(res);
                  var repair_content = [];
                  for (var i = 0; i < res.data.data.records.length; i++) {
                    if (res.data.data.records[i].status == 1) {
                      repair_content = repair_content.concat(res.data.data.records[i]);
                    }
                  }
                  that.setData({
                    repair_page: that.data.repair_page + 1,
                    repair_contents: that.data.repair_contents.concat(repair_content),
                    repair_height: that.data.repair_height + 320 * repair_content.length,
                    cur_height: that.data.repair_height + 320 * repair_content.length,
                  })
                }
              })
            }
            if (that.data.repair_contents.length <= 3) {
              that.setData({
                cur_height: 1060,
                repair_height: 1060,
              })
            }
            wx.hideLoading();
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
          },
          fail: function () {
            wx.showToast({
              title: '加载失败',
              image: '/images/shibai.png'
            })
            wx.hideLoading();
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
          },
          complete: function () {}
        })
        break;
      case 2:
        that.setData({
          cur_height: 1060,
        })
        wx.showToast({
          title: '该页面暂未开通',
          image: '/images/shibai.png'
        })
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        // wx.request({
        //   url: hosturl + '/electricity/all_staff',
        //   data: {
        //     page: 1,
        //     limit: 10,
        //   },
        //   header: {
        //     'content-type': 'application/x-www-form-urlencoded',
        //     'Authorization': gData.token + ''
        //   },
        //   success(res) {
        //     console.log(res);
        //     if (res.data.station != "success") {
        //       wx.showToast({
        //         title: '您没有该权限',
        //         image: '/images/shibai.png'
        //       })
        //       return;
        //     }
        //     var electric_content = [];
        //     for (var i = 0; i < res.data.data.records.length; i++) {
        //       if (res.data.data.records[i].status == 1) {
        //         electric_content = electric_content.concat(res.data.data.records[i]);
        //       }
        //     }
        //     if (electric_content.length <= 3) {
        //       that.setData({
        //         electric_contents: electric_content,
        //         electric_page: 1,
        //         electric_height: 1060,
        //         cur_height: 1060,
        //       })
        //     } else {
        //       that.setData({
        //         electric_contents: electric_content,
        //         electric_page: 1,
        //         electric_height: 100 + 320 * electric_content.length,
        //         cur_height: 100 + 320 * electric_content.length,
        //       })
        //     }

        //   },
        //   fail: function () {
        //     wx.showToast({
        //       title: '加载失败',
        //       image: '/images/shibai.png'
        //     })
        //   },
        //   complete: function () {
        //     setTimeout(function () {
        //       wx.hideLoading();
        //       wx.hideNavigationBarLoading();
        //       wx.stopPullDownRefresh();
        //     }, delay_time)
        //   }
        // })
        break;
    }
  },
  onjump: function () {
    wx.redirectTo({
      url: "/pages/all/all",
    })
  },
  goback: function () {
    wx.switchTab({
      url: "/pages/index/index",
    })
  },
  onback: function () {
    wx.redirectTo({
      url: "/pages/history/history",
    })
  },
  onLoad: function () {
    this.onPullDownRefresh();
    wx.connectSocket({
      url: 'wss://wx.tourci.cn:8083/websocket/'+gData.openid,
      header:{
        'content-type': 'application/json'
      },
      success(res){
        console.log(res)
      },
      fail(res){
        console.log(res)
      },
    })
  },

  onshow: function () {

  },
  ex_haddone: function (event) {
    var that = this;
    wx.request({
      url: hosturl + '/express/update',
      method: "Put",
      data: {
        id: event.currentTarget.dataset.id,
        status: 2,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': gData.token + ''
      },
      success(res) {
        //console.log("success");
        //console.log(event.currentTarget.dataset.id);
        //console.log(res);
        setTimeout(function () {
          wx.showToast({
            title: '订单已完成',
            image: '/images/shibai.png'
          })
        }, 500)
        that.onPullDownRefresh();
      },
      fail(res) {
        wx.showToast({
          title: '请检查网络',
          image: '/images/shibai.png'
        })
      },
      complete: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
      }
    })
  },
  re_haddone: function (event) {
    var that = this;
    wx.request({
      url: hosturl + '/computer/update',
      method: "Put",
      data: {
        id: event.currentTarget.dataset.id,
        status: 2,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': gData.token + ''
      },
      success(res) {
        console.log(res);
        setTimeout(function () {
          wx.showToast({
            title: '订单已完成',
            image: '/images/shibai.png'
          })
        }, 500)
        that.onPullDownRefresh();
      },
      fail(res) {
        wx.showToast({
          title: '请检查网络',
          image: '/images/shibai.png'
        })
      },
      complete: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
      }
    })
  },
  el_haddone: function (event) {
    var that = this;
    wx.request({
      url: hosturl + '/electricity/update',
      method: "Put",
      data: {
        id: event.currentTarget.dataset.id,
        status: 2,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': gData.token + ''
      },
      success(res) {
        console.log(res);
        setTimeout(function () {
          wx.showToast({
            title: '订单已完成',
            image: '/images/shibai.png'
          })
        }, 500)
        that.onPullDownRefresh();
      },
      fail(res) {
        wx.showToast({
          title: '请检查网络',
          image: '/images/shibai.png'
        })
      },
      complete: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading();
      }
    })
  },
  ex_detail: function (event) {
    var that = this;
    //console.log(event);
    //console.log(event.currentTarget.dataset.id);
    if (event.currentTarget.dataset.id != undefined) {
      wx.request({
        url: hosturl + '/express/one',
        data: {
          id: event.currentTarget.dataset.id,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': gData.token + ''
        },
        success(res) {
          console.log(res);
          that.setData({
            ex_detail_contents: res.data.data,
          })
        },
      })
    }
    var key = wx.getStorageSync('switch');
    key = !key
    if (key) {
      this.setData({
        ex_visibility: 'visible'
      })
    } else {
      this.setData({
        ex_visibility: 'hidden'
      })
    }
    wx.setStorageSync('switch', key);
  },

  re_detail: function (event) {
    var that = this;
    console.log(event);
    if (event.currentTarget.dataset.id != undefined) {
      wx.request({
        url: hosturl + '/computer/one',
        data: {
          id: event.currentTarget.dataset.id,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': gData.token + ''
        },
        success(res) {
          console.log(res);
          that.setData({
            re_detail_contents: res.data.data
          })
        },
      })
    }
    var key = wx.getStorageSync('switch1');
    key = !key
    if (key) {
      this.setData({
        re_visibility: 'visible'
      })
    } else {
      this.setData({
        re_visibility: 'hidden'
      })
    }
    wx.setStorageSync('switch1', key);
  },
  el_detail: function (event) {
    var that = this;
    console.log(event);
    if (event.currentTarget.dataset.id != undefined) {
      wx.request({
        url: hosturl + '/electricity/one',
        data: {
          id: event.currentTarget.dataset.id,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': gData.token + ''
        },
        success(res) {
          console.log(res);
          that.setData({
            el_detail_contents: res.data.data
          })
        },
      })
    }
    var key = wx.getStorageSync('switch2');
    key = !key
    if (key) {
      this.setData({
        el_visibility: 'visible'
      })
    } else {
      this.setData({
        el_visibility: 'hidden'
      })
    }
    wx.setStorageSync('switch2', key);
  },
  onex_detail_image: function () {
    var that = this;
    wx.previewImage({
      urls: [that.data.ex_detail_contents.url],
    })
  },
  onre_detail_image: function (event) {
    var that = this;
    wx.previewImage({
      urls: [that.data.re_detail_contents.url],
      // current:event.currentTarget.dataset.id,
    })
  },
  ex_call: function (event) {
    wx.request({
      url: hosturl + '/express/one',
      data: {
        id: event.currentTarget.dataset.id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': gData.token + ''
      },
      success(res) {
        console.log(res);
        var phonecall = res.data.data.telephone
        wx.makePhoneCall({
          phoneNumber: phonecall,
        })
      },
      fail() {
        wx.showToast({
          title: '呼叫失败',
          image: '/images/shibai.png'
        })
      },
    })
  },
  re_call: function (event) {
    wx.request({
      url: hosturl + '/electricity/one',
      data: {
        id: event.currentTarget.dataset.id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': gData.token + ''
      },
      success(res) {
        console.log(res);
        var phonecall = res.data.data.telephone
        wx.makePhoneCall({
          phoneNumber: phonecall,
        })
      },
      fail() {
        wx.showToast({
          title: '呼叫失败',
          image: '/images/shibai.png'
        })
      },
    })
  },
  // content:function(event){
  //   var that = this;
  //   console.log(event);
  //   if (event.currentTarget.dataset.id != undefined) {
  //     wx.request({
  //       url: hosturl + '/express/one',
  //       data: {
  //         id: event.currentTarget.dataset.id,
  //       },
  //       header: {
  //         'content-type': 'application/x-www-form-urlencoded',
  //         'Authorization': gData.token + ''
  //       },
  //       success(res) {
  //         console.log(res);
  //         gData.speaker = res.data.data.username;
  //         wx.navigateTo({
  //           url: '/pages/webSocket/websocket',
  //         })
  //       },
  //       fail(res){
  //         wx.showToast({
  //           title: '初始化失败',
  //           image: '/images/shibai.png'
  //         })
  //       },
  //     })
  //   }
  // },
})