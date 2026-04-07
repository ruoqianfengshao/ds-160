// app.js
const util = require('./utils/util.js')

App({
  onLaunch() {
    // 小程序启动时执行
    console.log('浙江保丽加科技有限公司小程序启动')
    
    // 检查更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: (res) => {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
        }
      })
    }
  },
  
  globalData: {
    userInfo: null,
    // 公司信息
    companyName: '浙江保丽加科技有限公司',
    companyPhone: '0570-7057158',
    companyEmail: '361098754@qq.com',
    companyAddress: '浙江省衢州市龙游县塔石镇平坦村',
    companyDescription: '浙江保丽加科技有限公司成立于 2013 年，集科研、制造、销售、施工于一体，主营内外墙涂料、真石漆等产品',
    // 地图坐标（衢州龙游）
    latitude: 29.0667,
    longitude: 119.3667,
    // 工具函数
    util: util
  }
})
