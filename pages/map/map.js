// map.js
Page({
  data: {
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    let that = this ;
    let controlId = e.controlId ;
    console.log(controlId) ;
    if("1" == controlId){
        wx.redirectTo({
            url: '../register/register'
        })
    }else if("2" == controlId){
        wx.scanCode({
            success: (res) => {
                console.log(res) ;
                wx.showModal({
                    title: "开锁密码",
                    content: "12435",
                    showCancel: false,
                    confirmText: "确定"
                })
            }
        })
    }else if("3" == controlId){
        wx.createMapContext('map').moveToLocation();
        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                that.updateLocation(res.latitude, res.longitude) ;
                that.updateMarkers(res.latitude, res.longitude) ;
            }
        }) ;
    }else if("4" == controlId){
        wx.showModal({
            title: "充值",
            content: "开发中，敬请期待",
            showCancel: false
        })
    }
    
  },
  
  onReady:function (e) {
    console.log("map.onready")
    this.mapCtx = wx.createMapContext('map');
    this.mapCtx.moveToLocation();
  },
  onLoad: function (e) {
    console.log("map.onload")
    let that = this ;

    this.mapCtx = wx.createMapContext('map');
    this.mapCtx.moveToLocation();
    
    wx.getLocation({
        type: 'wgs84',
        success: function(res) {
            that.updateLocation(res.latitude, res.longitude) ;
            that.updateMarkers(res.latitude, res.longitude) ;
        }
    }) ;

    wx.getSystemInfo({
        success: function(res) {
            that.updateControls(res.windowWidth, res.windowHeight) ;
        }
    })
  },

  onShareAppMessage: function () {
   // return custom share data when user share.
  },

  updateLocation(latitude, longitude){
    this.setData({
        latitude: latitude,
        longitude: longitude
    }) ;
  },

  updateMarkers(latitude, longitude){
    let markers = [] ;
    for(let i = 1; i < 5; i++){
        let marker = {
            iconPath: "/resources/umbrella.png",
            id: i,
            latitude: latitude - Math.random().toFixed(1)/500,
            longitude: longitude + Math.random().toFixed(1)/1000,
            width: 30,
            height: 30
        } ;
        markers.push(marker) ;
    }
    for(let i = 1; i < 5; i++){
        let marker = {
            iconPath: "/resources/umbrella.png",
            id: i,
            latitude: latitude + Math.random().toFixed(1)/500,
            longitude: longitude - Math.random().toFixed(1)/1000,
            width: 30,
            height: 30
        } ;
        markers.push(marker) ;
    }
    this.setData({
        markers: markers
    }) ;
  },

  updateControls(windowWidth,windowHeight){
    let that = this ;
    let left = (+windowWidth) / 2 - 30;
    let top  = (+windowHeight) - 100 ;

    let resetControl = {
        id: 3,
        iconPath: '/resources/resetlocation.png',
        position: {
            left: 15,
            top: top + 10,
            width: 30,
            height: 30
        },
        clickable: true
    } ;

    let recharge = {
        id: 4,
        iconPath: '/resources/recharge.png',
        position: {
            left: (+windowWidth) - (15 + 30),
            top: top + 10,
            width: 30,
            height: 30
        },
        clickable: true
    } ;

    wx.login({
        success: function (res) {
            if(res.errMsg == "login:ok"){
                wx.request({
                    url: 'https://api.xiaofengketang.com/jersey/wx/jscode2session',
                    data: {
                        js_code: res.code
                    },
                    header: {
                        'content-type': 'application/json'
                    },
                    method:"GET",
                    success: function(ress) {
                        wx.setStorageSync('openId', ress.data.openid) ;
                        if(ress.errMsg == "request:ok" && ress.data.message_rest.type == "S"){
                            that.setData({
                                controls: [
                                    resetControl,
                                    recharge,
                                    {
                                        id: 2,
                                        iconPath: '/resources/scan.png',
                                        position: {
                                            left: left,
                                            top: top,
                                            width: 55,
                                            height: 55
                                        },
                                        clickable: true
                                    }
                                ]
                            }) ;
                        }else{
                            that.setData({
                                controls: [
                                    resetControl,
                                    {
                                        id: 1,
                                        iconPath: '/resources/register.png',
                                        position: {
                                            left: left,
                                            top: top,
                                            width: 55,
                                            height: 55
                                        },
                                        clickable: true
                                    }
                                ]
                            }) ;
                        }
                    },
                    fail: function(ress){
                        that.setData({
                            controls: [
                                resetControl,
                                {
                                    id: 1,
                                    iconPath: '/resources/register.png',
                                    position: {
                                        left: left,
                                        top: top,
                                        width: 55,
                                        height: 55
                                    },
                                    clickable: true
                                }
                            ]
                        }) ;
                    }
                })
            }
        }
    })
  }
})