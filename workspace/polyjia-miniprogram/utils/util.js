// utils/util.js - 通用工具函数

/**
 * 格式化日期时间
 * @param {Date} date 日期对象
 * @param {string} fmt 格式字符串
 */
const formatTime = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return fmt
    .replace('YYYY', year)
    .replace('MM', String(month).padStart(2, '0'))
    .replace('DD', String(day).padStart(2, '0'))
    .replace('HH', String(hour).padStart(2, '0'))
    .replace('mm', String(minute).padStart(2, '0'))
    .replace('ss', String(second).padStart(2, '0'))
}

/**
 * 显示加载提示
 * @param {string} title 提示文字
 */
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
const hideLoading = () => {
  wx.hideLoading()
}

/**
 * 显示成功提示
 * @param {string} title 提示文字
 */
const showSuccess = (title = '操作成功') => {
  wx.showToast({
    title,
    icon: 'success',
    duration: 2000
  })
}

/**
 * 显示错误提示
 * @param {string} title 提示文字
 */
const showError = (title = '操作失败') => {
  wx.showToast({
    title,
    icon: 'none',
    duration: 2000
  })
}

/**
 * 验证手机号
 * @param {string} phone 手机号
 */
const validatePhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email 邮箱地址
 */
const validateEmail = (email) => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

module.exports = {
  formatTime,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  validatePhone,
  validateEmail
}
