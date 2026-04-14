// DS-160 Form Helper - Content Script
// 注入到 ceac.state.gov 页面，实现自动填充功能

console.log('[DS-160 Helper] Content script loaded')

// 检测当前页面类型
function detectPageType() {
  const url = window.location.href
  
  if (url.includes('/ceac/')) {
    return 'ds160-form'
  }
  
  return 'unknown'
}

// 提取当前表单步骤
function getCurrentStep() {
  // 尝试从 URL 或页面内容中提取步骤信息
  const url = window.location.href
  const match = url.match(/step[_-]?(\d+)/i)
  
  if (match) {
    return parseInt(match[1])
  }
  
  // 从页面标题提取
  const title = document.title
  const titleMatch = title.match(/step\s*(\d+)/i)
  if (titleMatch) {
    return parseInt(titleMatch[1])
  }
  
  return null
}

// 获取表单所有字段
function extractFormData() {
  const formData = {}
  
  // 获取所有 input 字段
  document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
    if (input.name || input.id) {
      const key = input.name || input.id
      formData[key] = input.value
    }
  })
  
  // 获取所有 select 字段
  document.querySelectorAll('select').forEach(select => {
    if (select.name || select.id) {
      const key = select.name || select.id
      formData[key] = select.value
    }
  })
  
  // 获取所有 textarea 字段
  document.querySelectorAll('textarea').forEach(textarea => {
    if (textarea.name || textarea.id) {
      const key = textarea.name || textarea.id
      formData[key] = textarea.value
    }
  })
  
  // 获取所有 radio/checkbox 字段
  document.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked').forEach(input => {
    if (input.name || input.id) {
      const key = input.name || input.id
      formData[key] = input.value || 'checked'
    }
  })
  
  return formData
}

// 填充表单字段
function fillFormData(data) {
  let filledCount = 0
  
  // 填充 text/email/tel 输入框
  Object.entries(data).forEach(([key, value]) => {
    const input = document.querySelector(`input[name="${key}"], input[id="${key}"]`)
    if (input && (input.type === 'text' || input.type === 'email' || input.type === 'tel')) {
      input.value = value
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
      filledCount++
    }
  })
  
  // 填充 select 下拉框
  Object.entries(data).forEach(([key, value]) => {
    const select = document.querySelector(`select[name="${key}"], select[id="${key}"]`)
    if (select) {
      select.value = value
      select.dispatchEvent(new Event('change', { bubbles: true }))
      filledCount++
    }
  })
  
  // 填充 textarea
  Object.entries(data).forEach(([key, value]) => {
    const textarea = document.querySelector(`textarea[name="${key}"], textarea[id="${key}"]`)
    if (textarea) {
      textarea.value = value
      textarea.dispatchEvent(new Event('input', { bubbles: true }))
      filledCount++
    }
  })
  
  return filledCount
}

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[DS-160 Helper] Received message:', request)
  
  switch (request.action) {
    case 'detectPage':
      const pageType = detectPageType()
      const currentStep = getCurrentStep()
      sendResponse({
        pageType,
        currentStep,
        url: window.location.href
      })
      break
      
    case 'extractForm':
      const formData = extractFormData()
      sendResponse({
        success: true,
        data: formData,
        fieldCount: Object.keys(formData).length
      })
      break
      
    case 'fillForm':
      try {
        const filledCount = fillFormData(request.data)
        sendResponse({
          success: true,
          filledCount
        })
      } catch (error) {
        sendResponse({
          success: false,
          error: error.message
        })
      }
      break
      
    case 'saveProgress':
      // 提取当前表单数据并保存
      const progressData = extractFormData()
      chrome.storage.local.set({
        [`ds160_step_${getCurrentStep()}`]: {
          data: progressData,
          timestamp: Date.now(),
          url: window.location.href
        }
      }, () => {
        sendResponse({ success: true })
      })
      return true // 保持消息通道开放
      
    default:
      sendResponse({ success: false, error: 'Unknown action' })
  }
  
  return true
})

// 页面加载完成后自动检测
window.addEventListener('load', () => {
  const pageType = detectPageType()
  if (pageType === 'ds160-form') {
    console.log('[DS-160 Helper] DS-160 form page detected')
    
    // 在页面上显示一个小提示
    const banner = document.createElement('div')
    banner.id = 'ds160-helper-banner'
    banner.innerHTML = `
      <div style="
        position: fixed;
        top: 10px;
        right: 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: sans-serif;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      ">
        <span>🚀</span>
        <span>DS-160 Helper 已启用</span>
        <button style="
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        " onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `
    document.body.appendChild(banner)
    
    // 5秒后自动隐藏
    setTimeout(() => {
      const el = document.getElementById('ds160-helper-banner')
      if (el) {
        el.style.transition = 'opacity 0.3s'
        el.style.opacity = '0'
        setTimeout(() => el.remove(), 300)
      }
    }, 5000)
  }
})
