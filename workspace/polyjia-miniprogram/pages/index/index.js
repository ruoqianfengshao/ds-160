// pages/index/index.js
const app = getApp()

Page({
  data: {
    businessList: [
      {
        id: 1,
        icon: '🔬',
        name: '技术研发',
        desc: '创新技术解决方案'
      },
      {
        id: 2,
        icon: '🏭',
        name: '生产制造',
        desc: '高品质产品生产'
      },
      {
        id: 3,
        icon: '📦',
        name: '产品销售',
        desc: '全方位销售服务'
      },
      {
        id: 4,
        icon: '🤝',
        name: '技术支持',
        desc: '专业售后服务'
      }
    ],
    newsList: [
      {
        id: 1,
        title: '公司参加行业技术交流会',
        date: '2026-03-20'
      },
      {
        id: 2,
        title: '新产品研发成功并投入生产',
        date: '2026-03-15'
      },
      {
        id: 3,
        title: '公司与多家企业达成战略合作',
        date: '2026-03-10'
      }
    ]
  },

  onLoad() {
    this.setData({
      globalData: app.globalData
    })
  },

  goToAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },

  goToNews() {
    wx.navigateTo({
      url: '/pages/news/news'
    })
  },

  goToNewsList() {
    wx.navigateTo({
      url: '/pages/news/news'
    })
  },

  makeCall() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.companyPhone,
      success: () => {
        console.log('拨打电话成功')
      },
      fail: () => {
        console.log('拨打电话失败')
      }
    })
  }
})
