// pages/index/index.js - 首页逻辑
const app = getApp()

Page({
  data: {
    banners: [
      '/images/banner1.jpg', // 后续替换为实际图片
      '/images/banner2.jpg',
      '/images/banner3.jpg'
    ],
    phoneNumber: '13008985306',
    address: '浙江省宁波市慈溪市槐树路 282 号',
    productCategories: [
      { name: '异形螺栓', image: '/images/cat-bolt.jpg' },
      { name: '特殊螺母', image: '/images/cat-nut.jpg' },
      { name: '连接件', image: '/images/cat-connector.jpg' },
      { name: '销轴', image: '/images/cat-pin.jpg' },
      { name: '定位件', image: '/images/cat-positioner.jpg' },
      { name: '功能性紧固件', image: '/images/cat-fastener.jpg' }
    ]
  },

  onLoad() {
    // 从全局配置获取公司信息
    this.setData({
      phoneNumber: app.globalData.phone,
      address: app.globalData.address
    })
  },

  // 跳转到产品中心（带分类参数）
  goToProducts(e) {
    let category = ''
    if (e && e.currentTarget.dataset.category) {
      category = e.currentTarget.dataset.category
    }
    
    wx.switchTab({
      url: '/pages/products/products' + (category ? `?category=${encodeURIComponent(category)}` : '')
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
  }
})
