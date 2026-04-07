// pages/contact/contact.js
const app = getApp()

Page({
  data: {
    companyInfo: {
      name: '浙江保丽加科技有限公司',
      phone: '0570-7057158',
      email: '361098754@qq.com',
      address: '浙江省衢州市龙游县塔石镇平坦村'
    },
    formData: {
      name: '',
      phone: '',
      message: ''
    }
  },

  onLoad() {
    
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    const formData = this.data.formData;
    formData[field] = value;
    this.setData({ formData });
  },

  makeCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.companyInfo.phone,
      success: () => {
        console.log('拨打电话成功')
      },
      fail: () => {
        wx.showToast({
          title: '拨打失败',
          icon: 'none'
        })
      }
    })
  },

  sendEmail() {
    wx.setClipboardData({
      data: this.data.companyInfo.email,
      success: () => {
        wx.showToast({
          title: '邮箱已复制',
          icon: 'success'
        })
      }
    })
  },

  copyAddress() {
    wx.setClipboardData({
      data: this.data.companyInfo.address,
      success: () => {
        wx.showToast({
          title: '地址已复制',
          icon: 'success'
        })
      }
    })
  },

  openMap() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        wx.openLocation({
          latitude: 30.2741,
          longitude: 120.1551,
          name: this.data.companyInfo.name,
          address: this.data.companyInfo.address,
          scale: 16
        })
      },
      fail: () => {
        wx.showToast({
          title: '定位失败',
          icon: 'none'
        })
      }
    })
  },

  submitMessage() {
    const { name, phone, message } = this.data.formData;
    
    if (!name || !phone || !message) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 模拟提交
    wx.showLoading({
      title: '提交中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '留言提交成功',
        icon: 'success'
      });
      
      // 清空表单
      this.setData({
        formData: {
          name: '',
          phone: '',
          message: ''
        }
      });
    }, 1000);
  }
})
