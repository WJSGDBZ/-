// pages/contact/contact.js
const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
const gData = app.globalData;
var number = 1;
var cur_speaker = gData.speaker;
/**
 * 初始化数据
 */
function initData(that) {
  inputVal = '';

  msgList = [{
      id:0,
      speaker: 'server',
      content: '实时对话开启',
      image:''
    }
  ]
  that.setData({
    msgList,
    inputVal
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    image:"",
    images:"",
    input:"",
    msgList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   initData(this);
   this.showMessage();
   console.log(gData.speaker);
   console.log(gData.openid)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.showMessage();
  },

  onHide:function(){
    wx.closeSocket({
      code: 1000,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.showMessage();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
showMessage:function(){
  wx.onSocketOpen((result) => {

  })
  wx.onSocketMessage(message => {
    console.log("收到的消息为：");
    console.log(message);
    var messages = message.data;
    var mes = messages.split("##");
    messages = mes[0];
    cur_speaker = mes[1];
    var images = '';
    if(mes.length >=3)
    {
      images = mes[1];
      cur_speaker = mes[2];
      console.log(images)
    }
    msgList.push({
      id:number++,
      speaker: 'server',
      content: messages,
      image:images
    })
    this.setData({
      msgList,
    })
  })
  wx.onSocketError((res) => {
    console.log(res)
  })
},
  /**
   * 获取聚焦
   */
  focus: function(e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })

  },

  //失去聚焦(软键盘消失)
  blur: function(e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
    })

  },

  /**
   * 发送点击监听
   */
  sendClick: function(e) {
    msgList.push({
      speaker: 'customer',
      contentType: 'text',
      content: e.detail.value
    })
    inputVal = '';
    var input = '';
    this.setData({
      msgList,
      inputVal,
      input,
    });
  },
  send_image:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          image:tempFilePaths,
        })
        console.log(tempFilePaths);
        that.uploadImage();
      }
    })
  },
  onbutton:function(){
    var that = this;
    if(gData.speaker != cur_speaker)
    {
      gData.speaker = cur_speaker;
    }
    if(this.data.image.length != 0)
    {
    msgList.push({
      id:number++,
      speaker: 'customer',
      content: that.data.input,
      image:that.data.images,
    })
    wx.onSocketOpen((result) => {})
    var messages = gData.speaker +'@#'+that.data.input+'##'+that.data.images+'##'+gData.openid;
    wx.sendSocketMessage({
      data: messages,
      success(res){
      console.log("发送成功");
        console.log(res);     
      },
      fail(res){
        console.log(res);
      },
    })
    inputVal = '';
    this.setData({
      msgList,
      inputVal,
      image:'',
      input:'',
    })
  }
  else{
  msgList.push({
    id:number++,
    speaker: 'customer',
    content:that.data.input,
    image:''
  })
  wx.onSocketOpen((result) => {})
  var messages = gData.speaker +'@#'+that.data.input+'##'+gData.openid;
  console.log(JSON.stringify(messages));
  wx.sendSocketMessage({
    data: messages,
    success(res){
    console.log("发送成功");
      console.log(res);     
    },
    fail(res){
      console.log(res);
    },
  })
  inputVal = '';
  this.setData({
    msgList,
    inputVal,
    input:'',
  });
}
  },
  uploadImage: function () {
    wx.showLoading({
      title: '图片预上传中',
    })
    wx.uploadFile({
      filePath: this.data.image[0],
      name: 'files',
      url: gData.hosturl + '/file/upload',
      success: res => {
        wx.showToast({
          title: '预上传成功'
        })
        console.log(res)
        console.log(JSON.parse(res.data).data[0])
        this.setData({
          images:JSON.parse(res.data).data[0]
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
  onsubmit:function(event){
    console.log(event);
    this.setData({
      input:event.detail.value
    })
  },
  onimage: function (event) {
    console.log(event)
    var that = this;
    wx.previewImage({
      urls: [msgList[event.currentTarget.dataset.id].image],
    })
  },
  ondeleteimg:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success(res) {
        if (res.confirm) {
          that.setData({
            image:''
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})
