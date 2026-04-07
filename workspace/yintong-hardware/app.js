// app.js - 慈溪银通五金有限公司小程序入口
App({
  onLaunch() {
    console.log('慈溪银通五金小程序启动');
  },

  globalData: {
    companyName: '慈溪坎墩银通五金配件厂',
    phone: '13008985306', // 联系电话
    address: '浙江省宁波市慈溪市槐树路 282 号',
    latitude: 30.1756, // 公司地址纬度
    longitude: 121.2531 // 公司地址经度
  }
})
