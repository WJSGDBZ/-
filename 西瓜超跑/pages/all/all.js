const app = getApp()
const hosturl = app.globalData.hosturl;
const gData = app.globalData;
const delay_time = 100;
Page({
  data: {
    area_array: ['老舍区', '临江苑', '锦地苑', '徳馨苑', '研究生公寓', '留学生公寓'],
    Mycolor: "white",
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
    onPrice: 0,
    onNew: 1,
    ex_visibility: 'hidden',
    re_visibility: 'hidden',
    el_visibility: 'hidden',
    apply_visibility:'visible',
    cur_total: "",
    cur_Num: "",
  },
  //按时间排序
  onNew_express: function () {
    wx.startPullDownRefresh();
    this.setData({
      onPrice: 0,
      onNew: 1
    })
    this.onPullDownRefresh();
    wx.stopPullDownRefresh();
  },
  //按价格排序
  onPrice_express: function () {
    wx.showNavigationBarLoading();
    this.setData({
      onPrice: 1,
      onNew: 0,
    })
    var index = this.data.currentTab;
    var that = this;
    switch (index) {
      case 0:
        wx.request({
          url: hosturl + '/express/all_noaccept',
          data: {
            page: 1,
            limit: 10,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': gData.token + ''
          },
          success(res) {
            var posts_content = res.data.data.records;
            if (posts_content.length <= 3) {
              that.setData({
                posts_contents: posts_content,
                container_height: 1060,
                cur_height: 1060,
              })
            } else {
              that.setData({
                posts_contents: posts_content,
                container_height: 100 + 320 * res.data.data.records.length,
                cur_height: 100 + 320 * res.data.data.records.length,
              })
            }
          },
          fail(res) {
            wx.showToast({
              title: '加载失败',
              image: '/images/shibai.png'
            })
          },
          complete: function () {
            setTimeout(function () {
              wx.hideNavigationBarLoading();
              wx.stopPullDownRefresh();
            }, delay_time)
          }
        })
        break;
      case 1:
        break;
      case 2:
        wx.request({
          url: hosturl + '/electricity/all_noaccept',
          data: {
            page: 1,
            limit: 10,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': gData.token + ''
          },
          success(res) {
            var electric_content = res.data.data.records;
            if (electric_content.length <= 3) {
              that.setData({
                electric_contents: electric_content,
                electric_height: 1060,
                cur_height: 1060,
              })
            } else {
              that.setData({
                electric_contents: electric_content,
                electric_height: 100 + 320 * res.data.data.records.length,
                cur_height: 100 + 320 * res.data.data.records.length,
              })
            }
          },
          fail(res) {
            wx.showToast({
              title: '加载失败',
              image: '/images/shibai.png'
            })
          },
          complete: function () {
            setTimeout(function () {
              wx.hideLoading();
              wx.hideNavigationBarLoading();
              wx.stopPullDownRefresh();
            }, delay_time)
          }
        })
        break;
    }

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
            ex_visibility: 'hidden',
            re_visibility: 'hidden',
            container_height: 100,
            express_page: 1,
            repair_height: 100,
            repair_page: 1
          })
          break;
      }
    }
  },
  //滑动切换页面
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
          repair_height: 80,
          repair_page: 1
        })
        break;
    }
  },
  //上拉加载
  onReachBottom: function () {
    var that = this;
    var index = this.data.currentTab;
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '玩命加载中',
    })
    var express_pages = that.data.express_page + 1;
    var repair_pages = that.data.repair_page + 1;
    var electric_pages = that.data.electric_page + 1;
    switch (index) {
      case 0:
        if (that.data.cur_Num >= 4 && that.data.cur_Num == that.data.cur_total) {
          wx.showToast({
            title: '已经见底啦',
            image: '/images/shibai.png'
          })
          wx.hideNavigationBarLoading()
          return;
        }
        if (this.data.onPrice) {
          wx.request({
            url: hosturl + '/express/all_noaccept',
            data: {
              page: express_pages,
              limit: 10,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': gData.token + ''
            },
            success(res) {
              var posts_content = res.data.data.records;
              var cur_Num = posts_content.length + that.data.cur_Num;
              that.setData({
                cur_Num: cur_Num,
                express_page: express_pages,
                container_height: that.data.container_height + 320 * res.data.data.records.length,
                cur_height: that.data.container_height + 320 * res.data.data.records.length,
                posts_contents: that.data.posts_contents.concat(posts_content)
              })
            },
            fail: function () {
              wx.showToast({
                title: '加载失败',
                image: '/images/shibai.png'
              })
            },
            complete: function () {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
                wx.hideLoading();
            }
          })
        } else {
          wx.request({
            url: hosturl + '/express/all_complite_time',
            data: {
              page: express_pages,
              limit: 10,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': gData.token + ''
            },
            success(res) {
              var posts_content = res.data.data.records;
              var cur_Num = posts_content.length + that.data.cur_Num;
              that.setData({
                cur_Num: cur_Num,
                express_page: express_pages,
                container_height: that.data.container_height + 320 * res.data.data.records.length,
                cur_height: that.data.container_height + 320 * res.data.data.records.length,
                posts_contents: that.data.posts_contents.concat(posts_content)
              })
            },
            fail: function () {
              wx.showToast({
                title: '加载失败',
                image: '/images/shibai.png'
              })
            },
            complete: function () {
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
                wx.hideLoading();
            }
          })
        }
        break;
      case 1:
        if (that.data.cur_Num >= 4 && that.data.cur_Num == that.data.cur_total) {
          wx.showToast({
            title: '已经见底啦',
            image: '/images/shibai.png'
          })
          wx.hideNavigationBarLoading()
          return;
        }
        wx.request({
          url: hosturl + '/computer/all_noaccept_time',
          data: {
            page: repair_pages
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': gData.token + ''
          },
          success(res) {
            var repair_content = res.data.data.records;
            var cur_Num = repair_content.length + that.data.cur_Num;
            that.setData({
              cur_Num: cur_Num,
              repair_page: repair_pages,
              repair_height: that.data.repair_height + 320 * res.data.data.records.length,
              cur_height: that.data.repair_height + 320 * res.data.data.records.length,
              repair_contents: that.data.repair_contents.concat(repair_content)
            })
          },
          fail: function () {
            wx.showToast({
              title: '加载失败',
              image: '/images/shibai.png'
            })
          },
          complete: function () {
              wx.hideNavigationBarLoading();
              wx.stopPullDownRefresh();
              wx.hideLoading();
          }
        })
        break;
      case 2:
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        wx.hideLoading();
        // if (that.data.cur_Num >= 4 && that.data.cur_Num == that.data.cur_total) {
        //   wx.showToast({
        //     title: '已经见底啦',
        //     image: '/images/shibai.png'
        //   })
        //   wx.hideNavigationBarLoading()
        //   return;
        // }
        // if (this.data.onPrice) {
        //   wx.request({
        //     url: hosturl + '/electricity/all_noaccept',
        //     data: {
        //       page: electric_pages
        //     },
        //     header: {
        //       'content-type': 'application/x-www-form-urlencoded',
        //       'Authorization': gData.token + ''
        //     },
        //     success(res) {
        //       var electric_content = res.data.data.records;
        //       var cur_Num = electric_content.length + that.data.cur_Num;
        //       that.setData({
        //         cur_Num: cur_Num,
        //         electric_page: electric_pages,
        //         electric_height: that.data.electric_height + 320 * res.data.data.records.length,
        //         cur_height: that.data.electric_height + 320 * res.data.data.records.length,
        //         electric_contents: that.data.electric_contents.concat(electric_content)
        //       })
        //       wx.hideNavigationBarLoading();
        //     },
        //     fail: function () {
        //       wx.showToast({
        //         title: '加载失败',
        //         image: '/images/shibai.png'
        //       })
        //     },
        //     complete: function () {
        //         wx.hideNavigationBarLoading();
        //         wx.stopPullDownRefresh();
        //         wx.hideLoading();
        //     }
        //   })
        // } else {
        //   wx.request({
        //     url: hosturl + '/electricity/all_noaccept_time',
        //     data: {
        //       page: electric_pages
        //     },
        //     header: {
        //       'content-type': 'application/x-www-form-urlencoded',
        //       'Authorization': gData.token + ''
        //     },
        //     success(res) {
        //       var electric_content = res.data.data.records;
        //       var cur_Num = posts_content.length + that.data.cur_Num;
        //       that.setData({
        //         cur_Num: cur_Num,
        //         electric_page: electric_pages,
        //         electric_height: that.data.electric_height + 320 * res.data.data.records.length,
        //         cur_height: that.data.electric_height + 320 * res.data.data.records.length,
        //         electric_contents: that.data.electric_contents.concat(electric_content)
        //       })
        //     },
        //     fail: function () {
        //       wx.showToast({
        //         title: '加载失败',
        //         image: '/images/shibai.png'
        //       })
        //     },
        //     complete: function () {
        //         wx.hideNavigationBarLoading();
        //         wx.stopPullDownRefresh();
        //         wx.hideLoading();
        //     }
        //   })
        // }
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
        if (that.data.onPrice) {
          this.setData({
            onPrice: 0,
            onNew: 1,
          })
        }
        wx.request({
          url: hosturl + '/express/all_noaccept_time',
          data: {
            page: 1,
            limit: 10,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': gData.token + ''
          },
          success(res) {
            console.log(res);
            //console.log(gData.token);
            //console.log(gData.openid);
            //console.log(res.data.data.records.length);
            var posts_content = res.data.data.records;
            var cur_Num = posts_content.length;
            if (posts_content.length <= 3) {
              that.setData({
                cur_Num: cur_Num,
                cur_total: res.data.data.total,
                posts_contents: posts_content,
                express_page: 1,
                container_height: 1060,
                cur_height: 1060,
              })
              wx.hideLoading();
              if(posts_content.length == 0)
              {
                wx.showToast({
                  title: '当前还没有订单哟',
                  image: '/images/shibai.png'
                })
              }
            } else {
              that.setData({
                cur_Num: cur_Num,
                cur_total: res.data.data.total,
                posts_contents: posts_content,
                express_page: 1,
                container_height: 100 + 320 * res.data.data.records.length,
                cur_height: 100 + 320 * res.data.data.records.length,
              })
              wx.hideLoading();
            }
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
        })
        break;
      case 1:
        wx.request({
          url: hosturl + '/computer/all_noaccept_time',
          data: {
            page: 1,
            limit: 10,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': gData.token + ''
          },
          success(res) {
            if (res.data.station != "success") {
              wx.showToast({
                title: '您没有该权限',
                image: '/images/shibai.png'
              })
              if(that.data.apply_visibility == 'hidden')
              {
                that.setData({
                  apply_visibility:'visible'
                })
              }
              that.setData({
                cur_height:1060,
                repair_height:1060,
              })
              wx.hideNavigationBarLoading();
              wx.stopPullDownRefresh();
              return;
            }
            if(that.data.apply_visibility == 'visible')
            {
              that.setData({
                apply_visibility:'hidden'
              })
            }
            that.setData({

            })
            console.log(res);
            var repair_content = res.data.data.records;
            var cur_Num = repair_content.length;
            if (repair_content.length <= 3) {
              that.setData({
                cur_Num: cur_Num,
                cur_total: res.data.data.total,
                repair_contents: repair_content,
                repair_page: 1,
                repair_height: 1060,
                cur_height: 1060,
              })
              wx.hideLoading();
              if(repair_content.length == 0)
              {
                wx.showToast({
                  title: '当前还没有订单哟',
                  image: '/images/shibai.png'
                })
              }
            } else {
              that.setData({
                cur_Num: cur_Num,
                cur_total: res.data.data.total,
                repair_contents: repair_content,
                repair_page: 1,
                repair_height: 100 + 320 * res.data.data.records.length,
                cur_height: 100 + 320 * res.data.data.records.length,
              })
              wx.hideLoading();
            }
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
          complete: function () {

          }
        })
        break;
      case 2:
        that.setData({
          cur_height:1060,
        })
        wx.showToast({
          title: '该页面暂未开通',
          image: '/images/shibai.png'
        })
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        // wx.request({
        //   url: hosturl + '/electricity/all_noaccept_time',
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
        //     var electric_content = res.data.data.records;
        //     var cur_Num = electric_content.length;
        //     if(electric_content.length<=3)
        //     {
        //       that.setData({
        //         cur_Num:cur_Num,
        //         cur_total:res.data.data.total,
        //         electric_contents: electric_content,
        //         electric_page: 1,
        //         electric_height: 1060,
        //         cur_height: 1060,
        //       })
        //     }
        //     else{
        //     that.setData({
        //       cur_Num:cur_Num,
        //       cur_total:res.data.data.total,
        //       electric_contents: electric_content,
        //       electric_page: 1,
        //       electric_height: 100 + 320 * res.data.data.records.length,
        //       cur_height: 100 + 320 * res.data.data.records.length,
        //     })
        //   }
        //   },
        //   fail: function () {
        //     wx.showToast({
        //       title: '加载失败',
        //       image: '/images/shibai.png'
        //     })
        //   },
        //   complete: function () {
        //     setTimeout(function(){
        //       wx.hideLoading();
        //       wx.hideNavigationBarLoading();
        //       wx.stopPullDownRefresh();
        //     },delay_time)
        //   }
        // })
        break;
    }
  },
  //跳转到子页
  onjump: function () {
    wx.redirectTo({
      url: "/pages/staff/staff",
    })
  },
  //回到首页
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
  //接单
  express_onchoice: function (event) {
    var that = this;
    console.log(event.currentTarget.dataset.id);
    wx.request({
      url: hosturl + '/express/update',
      method: "Put",
      data: {
        id: event.currentTarget.dataset.id,
        status: 1,
        staffName: gData.openid + ''
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': gData.token + ''
      },
      success(res) {
        console.log(res);
        setTimeout(function () {
          wx.showToast({
            title: '接单成功',
            image: '/images/shibai.png'
          })
        }, 500)
        that.onPullDownRefresh();
      },
      fail(res) {
        wx.showToast({
          title: '接单失败',
          image: '/images/shibai.png'
        })
      },
      complete: function () {
      }
    })
  },
  repair_onchoice: function (event) {
    var that = this;
    console.log(event.currentTarget.dataset.id);
    wx.request({
      url: hosturl + '/computer/update',
      method: "Put",
      data: {
        id: event.currentTarget.dataset.id,
        status: 1,
        staffName: gData.openid + ''
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': gData.token + ''
      },
      success(res) {
        console.log(res);
        setTimeout(function () {
          wx.showToast({
            title: '接单成功',
            image: '/images/shibai.png'
          })
        }, 500)
        that.onPullDownRefresh();
      },
      fail(res) {
        wx.showToast({
          title: '接单失败',
          image: '/images/shibai.png'
        })
      },
      complete: function () {
      }
    })
  },
  electric_onchoice: function (event) {
    var that = this;
    console.log(event.currentTarget.dataset.id);
    console.log(wx.getStorageSync('openId'));
    wx.request({
      url: hosturl + '/electricity/update',
      method: "Put",
      data: {
        id: event.currentTarget.dataset.id,
        staffName: gData.openid + '',
        status: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      success(res) {
        console.log(res);
        setTimeout(function () {
          wx.showToast({
            title: '接单成功',
            image: '/images/shibai.png'
          })
        }, 500)
        that.onPullDownRefresh();
      },
      fail(res) {
        wx.showToast({
          title: '接单失败',
          image: '/images/shibai.png'
        })
      },
      complete: function () {
      }
    })
  },

  onLoad: function () {
    this.onPullDownRefresh();
    wx.setStorageSync('switch', 0);
    wx.setStorageSync('switch1', 0);
    wx.setStorageSync('switch2', 0);
  },

  onshow: function () {

  },
  //显示细节
  ex_detail: function (event) {
    var that = this;
    //console.log(event);
    //console.log(event.currentTarget.dataset.id);
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
  onscroll:function(event){
    console.log(event.detail)
  },
  re_apply:function(){
    wx.showToast({
      title: '请联系客服',
      image: '/images/shibai.png'
    })
  },
})