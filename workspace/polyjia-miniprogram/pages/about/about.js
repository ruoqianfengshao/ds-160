// pages/about/about.js
Page({
  data: {
    timeline: [
      {
        year: '2026',
        event: '公司持续创新发展，拓展业务领域'
      },
      {
        year: '2025',
        event: '建立研发中心，加大技术创新投入'
      },
      {
        year: '2024',
        event: '通过 ISO9001 质量管理体系认证'
      },
      {
        year: '2023',
        event: '公司正式成立，开始运营'
      }
    ],
    honors: [
      { id: 1, name: '高新技术企业认定' },
      { id: 2, name: 'ISO9001 质量管理体系认证' },
      { id: 3, name: '科技创新企业奖' },
      { id: 4, name: '优秀供应商称号' }
    ]
  },

  onLoad() {
    
  }
})
