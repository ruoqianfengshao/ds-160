// pages/cases/cases.js - 案例展示逻辑
const app = getApp()

Page({
  data: {
    cases: [
      // 示例案例数据，后续替换为实际案例
      {
        id: 1,
        title: '某机械厂零配件供应',
        description: '为某知名机械厂提供精密螺丝、螺母等紧固件，年供应量达 100 万件，客户满意度 99% 以上。',
        industry: '机械制造',
        coverImage: '/images/case1.jpg',
        images: ['/images/case1-1.jpg', '/images/case1-2.jpg']
      },
      {
        id: 2,
        title: '家电企业冲压件定制',
        description: '为某家电企业提供定制化冲压件，从设计到生产一站式服务，帮助客户降低采购成本 30%。',
        industry: '家电行业',
        coverImage: '/images/case2.jpg',
        images: ['/images/case2-1.jpg', '/images/case2-2.jpg']
      }
    ]
  },

  onLoad() {
    // 可在 onLoad 中从云数据库获取最新案例
  },

  // 预览案例图片
  previewCaseImages(e) {
    const caseItem = e.currentTarget.dataset.case
    
    if (caseItem.images && caseItem.images.length > 0 && caseItem.coverImage !== '/images/case1.jpg') {
      wx.previewImage({
        current: caseItem.coverImage,
        urls: caseItem.images,
        fail() {
          wx.showToast({
            title: '预览失败',
            icon: 'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '暂无图片',
        icon: 'none'
      })
    }
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
