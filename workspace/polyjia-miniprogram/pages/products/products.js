// pages/products/products.js
Page({
  data: {
    currentCategory: 'all',
    filteredProducts: [],
    products: [
      {
        id: 1,
        category: 'product1',
        icon: '🔧',
        name: '智能设备系列',
        description: '高性能智能设备，满足多样化需求',
        tags: ['热销', '新品']
      },
      {
        id: 2,
        category: 'product1',
        icon: '⚙️',
        name: '工业自动化产品',
        description: '提升生产效率的自动化解决方案',
        tags: ['推荐']
      },
      {
        id: 3,
        category: 'product2',
        icon: '💻',
        name: '技术咨询与服务',
        description: '专业技术团队提供全方位技术支持',
        tags: ['服务']
      },
      {
        id: 4,
        category: 'product2',
        icon: '🔬',
        name: '研发定制服务',
        description: '根据客户需求提供定制化研发服务',
        tags: ['定制']
      },
      {
        id: 5,
        category: 'product3',
        icon: '📊',
        name: '行业解决方案',
        description: '针对特定行业的整体解决方案',
        tags: ['方案']
      },
      {
        id: 6,
        category: 'product3',
        icon: '🌐',
        name: '数字化转型方案',
        description: '助力企业数字化转型',
        tags: ['热门', '方案']
      }
    ],
    advantages: [
      {
        id: 1,
        icon: '✅',
        title: '品质保证',
        desc: '严格的质量控制体系'
      },
      {
        id: 2,
        icon: '🚀',
        title: '快速响应',
        desc: '24 小时客户服务支持'
      },
      {
        id: 3,
        icon: '💰',
        title: '性价比高',
        desc: '优质产品价格合理'
      },
      {
        id: 4,
        icon: '🤝',
        title: '售后无忧',
        desc: '完善的售后服务体系'
      }
    ]
  },

  onLoad() {
    this.updateFilteredProducts();
  },

  // 更新过滤后的产品列表
  updateFilteredProducts() {
    let filtered = [];
    if (this.data.currentCategory === 'all') {
      filtered = this.data.products;
    } else {
      filtered = this.data.products.filter(p => p.category === this.data.currentCategory);
    }
    this.setData({
      filteredProducts: filtered
    });
  },

  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category
    }, () => {
      this.updateFilteredProducts();
    });
  },

  goToProductDetail(e) {
    const productId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '产品详情开发中',
      icon: 'none'
    });
  }
})
