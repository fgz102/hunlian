// pages/active_q/active_q.js
const config = require('../../utils/config.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noCode:false,
    step:'1',
    wrapContent:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 获取用户数据
   */
  getData(res) {
    config.ajax('POST', {
      uid: res.data.data.uid
    }, config.activityIndex, (res) => {
      if (res.data.data.code == '20000') {
        this.setData({
          list: res.data.data.list,
          noCode: false,
        })
      } else if (res.data.data.code == '40001') {
        this.setData({
          noCode: true,
          step:res.data.data.step
        })
      } else {
        config.mytoast('服务器错误', (res) => { })
      }
      this.setData({
        wrapContent:true
      })
      wx.hideLoading()
    }, (res) => {

    })
  },
  /**
   * 活动详情
   */
  details_page: function (e) {
    wx.navigateTo({
      url: '/pages/active/active_details_q/active_details_q?id=' + config.getData(e, 'id'),
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getNumdata(res) {
    config.ajax('POST', {
      uid: res.data.data.uid
    }, config.mailBoxNew, (res) => {
      if (res.data.data.code == '20000') {
        var otherNum = 0;
        console.log(res.data.data)
        for (var i = 0; i < res.data.data.list.length; i++) {
          res.data.data.list[i].myleft = 0,
            otherNum += parseInt(res.data.data.list[i].num)
        }
        otherNum = parseInt(otherNum) + parseInt(res.data.data.message_num)
      } else {
        var otherNum = 0;
        otherNum = res.data.data.message_num
      }
      if (otherNum > 0) {
        wx.showTabBarRedDot({
          index: 3,
          success: function (res) {
            wx.setTabBarBadge({
              index: 3,
              text: otherNum.toString(),
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        wx.hideTabBarRedDot({
          index: 3,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }, (res) => {

    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    config.getuid((res) => {
      if (res.data.data.code == '20000') {
        app.globalData.uid = res.data.data.uid
        this.setData({
          delect_time: res.data.data.delete_time
        })
        this.getNumdata(res)
        if (res.data.data.delete_time != 0) {
          config.mytoast('您已被拉黑', (res) => {

          })
        }
        this.getData(res)
      } else {
        config.mytoast('服务器错误,请稍后再试', (res) => { })
      }
    }, (res) => { })
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
    return app.globalData.shareInfo
  }
})