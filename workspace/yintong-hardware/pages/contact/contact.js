// pages/contact/contact.js - 联系我们逻辑
const app = getApp()

Page({
  data: {
    phoneNumber: '13008985306',
    address: '浙江省宁波市慈溪市槐树路 282 号',
    email: '', // 可选，有则填写
    latitude: 30.1756, // 公司地址纬度
    longitude: 121.2531, // 公司地址经度
    markers: []
  },

  onLoad() {
    const { latitude, longitude } = this.data
    
    // 设置地图标记
    this.setData({
      phoneNumber: app.globalData.phone,
      address: app.globalData.address,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      markers: [{
        id: 1,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        name: '慈溪坎墩银通五金配件厂',
        callout: {
          content: '慈溪坎墩银通五金配件厂',
          display: 'ALWAYS',
          padding: 10,
          borderRadius: 5,
          bgColor: '#1E88E5',
          color: '#ffffff'
        }
      }]
    })
  },

  // 一键拨号
  makePhoneCall() {
    const phone = this.data.phoneNumber
    if (phone && phone !== '0574-XXXXXXXX') {
      wx.makePhoneCall({
        phoneNumber: phone.replace(/-/g, ''),
        fail() {
          wx.showToast({
            title: '拨号失败',
            icon: 'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '请先设置电话号码',
        icon: 'none'
      })
    }
  },

  // 复制地址
  copyAddress() {
    const { address } = this.data
    wx.setClipboardData({
      data: address,
      success() {
        wx.showToast({
          title: '地址已复制',
          icon: 'success',
          duration: 1500
        })
      },
      fail() {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        })
      }
    })
  },

  // 打开地图导航
  openMap() {
    const { latitude, longitude, address } = this.data
    
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: '慈溪银通五金有限公司',
      address: address,
      scale: 16,
      fail() {
        wx.showToast({
          title: '打开地图失败',
          icon: 'none'
        })
      }
    })
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '慈溪坎墩银通五金配件厂 - 专业非标紧固件定制',
      path: '/pages/index/index',
      imageUrl: '/images/share-card.jpg' // 可自定义分享图片
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '慈溪坎墩银通五金配件厂 - 专业非标紧固件定制',
      query: '',
      imageUrl: '/images/share-card.jpg'
    }
  }
})
