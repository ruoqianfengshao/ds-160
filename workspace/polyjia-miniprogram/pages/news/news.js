// pages/news/news.js
Page({
  data: {
    hasMore: true,
    newsList: [
      {
        id: 1,
        icon: '📰',
        title: '公司参加行业技术交流会',
        summary: '我司受邀参加 2026 年度行业技术交流峰会，与业内专家共同探讨技术发展趋势...',
        date: '2026-03-20',
        category: '公司动态'
      },
      {
        id: 2,
        icon: '🎉',
        title: '新产品研发成功并投入生产',
        summary: '经过研发团队的努力，公司新一代产品顺利通过测试，正式投入批量生产...',
        date: '2026-03-15',
        category: '产品研发'
      },
      {
        id: 3,
        icon: '🤝',
        title: '公司与多家企业达成战略合作',
        summary: '为进一步拓展市场，公司与多家知名企业签署战略合作协议，实现资源共享...',
        date: '2026-03-10',
        category: '合作共赢'
      },
      {
        id: 4,
        icon: '🏆',
        title: '荣获高新技术企业认定',
        summary: '公司凭借强大的研发实力和技术创新能力，成功通过国家高新技术企业认定...',
        date: '2026-03-05',
        category: '荣誉资质'
      },
      {
        id: 5,
        icon: '📈',
        title: '第一季度业绩稳步增长',
        summary: '2026 年第一季度，公司各项业务指标均实现稳步增长，开局良好...',
        date: '2026-03-01',
        category: '经营动态'
      }
    ]
  },

  onLoad() {
    
  },

  goToNewsDetail(e) {
    const newsId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '新闻详情开发中',
      icon: 'none'
    });
  },

  onReachBottom() {
    // 加载更多逻辑
    this.setData({
      hasMore: false
    });
  }
})
