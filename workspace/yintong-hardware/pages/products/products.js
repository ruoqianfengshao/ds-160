// pages/products/products.js - 产品中心逻辑
const app = getApp()

Page({
  data: {
    currentCategory: 'all',
    categories: ['异形螺栓', '特殊螺母', '连接件', '销轴', '定位件', '功能性紧固件', '其他定制件'], // 后续可调整
    products: [
      // 示例产品数据，后续替换为实际产品图片
      {
        id: 1,
        name: '异形螺栓定制',
        description: '根据客户图纸定制，多工位冷墩成型，尺寸精度稳定',
        category: '异形螺栓',
        image: '/images/product1.jpg'
      },
      {
        id: 2,
        name: '特殊螺母加工',
        description: '非标螺母冷墩加工，支持攻牙、滚丝等后续工艺',
        category: '特殊螺母',
        image: '/images/product2.jpg'
      },
      {
        id: 3,
        name: '精密连接件',
        description: '应用于机械设备、汽车零部件等领域的高精度连接件',
        category: '连接件',
        image: '/images/product3.jpg'
      },
      {
        id: 4,
        name: '销轴定位件',
        description: '冷墩成型 + 车削加工，适用于自动化设备、电子电器',
        category: '销轴',
        image: '/images/product4.jpg'
      },
      {
        id: 5,
        name: '功能性紧固件',
        description: '新能源、航空航天等特殊领域的高要求紧固件',
        category: '功能性紧固件',
        image: '/images/product5.jpg'
      }
    ]
  },

  onLoad() {
    this.filterProducts()
  },

  // 选择分类
  selectCategory(e) {
    const category = e.currentTarget.dataset.category
    this.setData({
      currentCategory: category
    })
    this.filterProducts()
  },

  // 筛选产品
  filterProducts() {
    const { currentCategory, products } = this.data
    let filtered = products
    
    if (currentCategory !== 'all') {
      filtered = products.filter(item => item.category === currentCategory)
    }
    
    this.setData({
      filteredProducts: filtered
    })
  },

  // 跳转到产品详情（暂时用 toast 提示，后续可扩展详情页）
  goToDetail(e) {
    const product = e.currentTarget.dataset.product
    wx.showToast({
      title: '如需了解更多，请致电咨询',
      icon: 'none',
      duration: 2000
    })
  },

  // 一键拨号
  makePhoneCall() {
    const phone = app.globalData.phone
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
