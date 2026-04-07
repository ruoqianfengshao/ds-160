// pages/about/about.js - 关于我们逻辑
Page({
  data: {
    companyIntro: '慈溪坎墩银通五金配件厂是一家专注于非标准紧固件及异形金属零部件冷墩加工的专业制造企业，致力于为客户提供高品质、高精度的定制化产品解决方案。\n\n本厂以非标件研发与生产为核心业务，不从事标准件批量生产，能够根据客户图纸或样品快速完成工艺设计与产品制造，满足多样化、小批量及高要求的定制需求。\n\n本厂拥有多工位冷墩设备及完善的后续加工能力，涵盖冷墩成型、攻牙、车削、滚丝、热处理及表面处理等关键工序，形成了较为完整的非标件加工体系。\n\n产品主要包括各类异形螺栓、特殊螺母、连接件、销轴、定位件及功能性紧固件，广泛应用于机械设备、汽车零部件、自动化设备、电子电器、新能源、航空航天、家电等领域。\n\n本厂坚持以质量为核心，建立了严格的质量控制流程，从原材料采购到成品出厂实施全过程检测与管理，确保产品尺寸精度稳定、性能可靠。\n\n凭借灵活的生产组织能力和快速响应机制，本厂能够有效缩短交付周期，为客户提供稳定、可靠的非标件配套服务。\n\n未来，本厂将持续深耕非标紧固件细分领域，不断提升技术水平与制造能力，致力于成为客户值得信赖的长期合作伙伴。', // 后续可替换为实际简介
    equipment: [
      '多工位冷墩设备',
      '冷墩成型设备',
      '攻牙设备',
      '车削设备',
      '滚丝设备',
      '热处理设备',
      '表面处理设备',
      '精密检测设备'
    ], // 后续可调整
    certificates: [
      '/images/cert1.jpg', // 后续替换为实际证书图片
      '/images/cert2.jpg'
    ]
  },

  onLoad() {
    // 可在 onLoad 中从全局配置或云数据库获取最新信息
  },

  // 预览证书图片
  previewCertificate(e) {
    const index = e.currentTarget.dataset.index
    const { certificates } = this.data
    
    if (certificates.length > 0 && certificates[index] !== '/images/cert1.jpg') {
      wx.previewImage({
        current: certificates[index],
        urls: certificates,
        fail() {
          wx.showToast({
            title: '预览失败',
            icon: 'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '请先上传证书图片',
        icon: 'none'
      })
    }
  }
})
