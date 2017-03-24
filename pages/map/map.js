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
    console.log(e.controlId)
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
  },
  
  onReady:function (e) {
    this.mapCtx = wx.createMapContext('map');
    this.mapCtx.moveToLocation();
  },
  onLoad: function (e) {
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
            latitude: latitude,
            longitude: longitude,
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
    let left = (+windowWidth) / 2 - 30;
    let top  = (windowHeight) - 100 ;
    this.setData({
        controls: [
            {
                id: 1,
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
  }
})