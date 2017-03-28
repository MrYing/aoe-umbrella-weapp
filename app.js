//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
        success: function (res) {
          console.log(res)
          wx.request({
            url: 'https://api.xiaofengketang.com/jersey/wx/jscode2session', //仅为示例，并非真实的接口地址
            data: {
              js_code: res.code
            },
            header: {
                'content-type': 'application/json'
            },
            method:"GET",
            success: function(ress) {
              console.log(ress)
            }
          })
        }
      })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})