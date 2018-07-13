var winWidth = null;
var winHeight = null;
var _num = null;
const config = require('../../utils/config.js');
let app = getApp()
Page({
  data: {
    myindex: null,
    mask: true,
    lick: true,
    x: winWidth,
    y: winHeight,
    distance: "",
    otherdetail: '右滑喜欢Ta',
    animationData: {},
    content: [],
    noCode: false,
  },
  onLoad: function () {
    var that = this;
    var res = wx.getSystemInfoSync();
    winWidth = res.windowWidth;
    winHeight = res.windowHeight;
    that.setData({
      x: winWidth,
      y: winHeight,
    })
    config.getuid((res) => {
      if (res.data.data.code == '20000') {
        app.globalData.uid = res.data.data.uid
        this.getallData(res)
      } else {
        config.mytoast('服务器错误,请稍后再试', (res) => { })
      }
    }, (res) => { })
  },
  /**
   * 滑动函数
   */
  tap: function (e) {
    var that = this;
    var distance = that.data.distance;
    if ((distance > (winWidth + winWidth / 4)) || (distance < (winWidth - winWidth / 4))) {
      var content = that.data.content;
      if (app.globalData._ishua) {
        if (distance > (winWidth + winWidth / 4)) {
          var lick = true
          this.getselectR(config.getData(e, 'id'))  //右滑
        }
        if (distance < (winWidth - winWidth / 4)) {
          var lick = false
          this.getselectL(config.getData(e, 'id'))  //左滑
        }
        content.splice(e.currentTarget.dataset.index, 1);
        that.setData({
          x: winWidth,
          y: winHeight,
          content: content,
          lick: lick
        });
      } else {
        that.setData({
          x: winWidth,
          y: winHeight,
          noCode: true
        });
      }
    } else {
      that.setData({
        x: winWidth,
        y: winHeight,
        lick: null
      })
    }
  },
  //左滑不喜欢点击函数
  unlick: function () {
    if (app.globalData._ishua) {
      var that = this
      var length = this.data.content.length - 1;
      _num = length--
      this.setData({
        myindex: _num,
        action: 'left',
        lick: false,
      })
      setTimeout(function () {
        var content = that.data.content;
        console.log(content[_num].user_id)
        that.getselectL(content[_num].user_id)
        content.splice(_num, 1);
        console.log(content);
        that.setData({
          content: content,
        })
      }, 1000)
    } else {
      // this.setData({
      //   noCode: true
      // })
    }

  },
  //右滑喜欢点击函数
  lick: function () {
    if (app.globalData._ishua) {
      var that = this
      var length = this.data.content.length - 1;
      _num = length--
      this.setData({
        myindex: _num,
        action: 'right',
        lick: true
      })
      setTimeout(() => {
        var content = that.data.content;
        that.getselectL(content[_num].user_id)
        content.splice(_num, 1);
        that.setData({
          content: content,
        })
      }, 1000)
    } else {
      // this.setData({
      //   noCode: true
      // })
    }

  },
  /**
   * 提示函数
   */
  openlick: function () {
    if (this.data.otherdetail == '右滑喜欢Ta') {
      this.setData({
        otherdetail: '左滑忽略'
      })
    } else {
      this.setData({
        mask: false
      })
    }
  },
  /**
   * 去授权登录页面
   */
  goloading() {
    wx.navigateTo({
      url: '/pages/index/toloading/toloading',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 获取首页滑一滑数据
   */
  getallData(res) {
    config.ajax('POST', {
      uid: res.data.data.uid
    }, config.index, (res) => {
      if (res.data.data.code == '20000') {
        console.log(res.data.data.list)
        this.setData({
          content: res.data.data.list
        })
      } else {
        config.mytoast('暂无数据', (res) => {
          app.globalData._ishua = false
          // this.setData({
          //   noCode: true,
          //   otherdetail: '没有其他了...'
          // })
          config.mytoast('没有其他了',(res)=>{

          })
        })
      }

    }, (res) => {

    })
  },
  /**
   * 左滑不喜欢封装函数
   */
  getselectL(tid) {
    config.ajax('POST', {
      uid: app.globalData.uid,
      _type: 1,
      relation_id: tid
    }, config.select, (res) => {
      console.log(res)
      if (res.data.data.code == '40000') {
        app.globalData._ishua = false
        console.log(res.data)
        this.setData({
          mynoCode: true,
          step: res.data.data.step
        })
      }
      if (res.data.data.code == '40002') {
        app.globalData._ishua = false
        // this.setData({
        //   noCode: true,
        //   otherdetail: '没有其他了...'
        // })
        config.mytoast(res.data.data.msg, (res) => {

        })
      }
    }, (res) => {

    })
  },
  /**
   * 右滑喜欢封装函数
   */
  getselectR(tid) {
    config.ajax('POST', {
      uid: app.globalData.uid,
      _type: 2,
      relation_id: tid
    }, config.select, (res) => {
      if (res.data.data.code == '40000') {
        console.log(res.data)
        app.globalData._ishua = false
        this.setData({
          noCode: true,
          step: res.data.data.step
        })
      }
      if (res.data.data.code == '40002') {
        app.globalData._ishua = false
        // this.setData({
        //   noCode: true,
        //   otherdetail: '没有其他了...'
        // })
        config.mytoast('没有其他了', (res) => {

        })
      }
    }, (res) => {

    })
  },
  /**
   * 滑动检测事件
   */
  onChange: function (e) {
    var that = this;
    that.setData({
      distance: e.detail.x
    })
  },
  onScale: function (e) {
  }
})