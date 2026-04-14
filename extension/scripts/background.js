// DS-160 Helper - Background Service Worker

console.log('[DS-160 Helper] Background service worker initialized')

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[DS-160 Helper] Extension installed:', details.reason)
  
  if (details.reason === 'install') {
    // 首次安装，设置默认配置
    chrome.storage.local.set({
      'extension_version': '1.0.0',
      'install_date': Date.now(),
      'auto_save_enabled': true
    })
    
    // 打开欢迎页面
    chrome.tabs.create({
      url: 'https://github.com/ruoqianfengshao/ds-160'
    })
  }
})

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[DS-160 Helper] Background received message:', request)
  
  switch (request.action) {
    case 'notify':
      // 显示桌面通知
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: request.title || 'DS-160 Helper',
        message: request.message
      })
      sendResponse({ success: true })
      break
      
    case 'syncToCloud':
      // 同步数据到云端（未来功能）
      console.log('[DS-160 Helper] Cloud sync requested')
      sendResponse({ success: false, message: 'Cloud sync not implemented yet' })
      break
      
    default:
      sendResponse({ success: false, error: 'Unknown action' })
  }
  
  return true
})

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 当标签页加载完成且是 DS-160 网站时
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('ceac.state.gov')) {
    console.log('[DS-160 Helper] DS-160 page detected:', tab.url)
    
    // 设置扩展图标为激活状态
    chrome.action.setBadgeText({ text: '✓', tabId })
    chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId })
  }
})

// 定期自动保存（如果启用）
chrome.alarms.create('autoSave', { periodInMinutes: 5 })

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'autoSave') {
    const config = await chrome.storage.local.get('auto_save_enabled')
    
    if (config.auto_save_enabled) {
      // 获取所有 DS-160 标签页
      const tabs = await chrome.tabs.query({ url: 'https://ceac.state.gov/*' })
      
      for (const tab of tabs) {
        try {
          // 触发自动保存
          await chrome.tabs.sendMessage(tab.id, { action: 'saveProgress' })
          console.log('[DS-160 Helper] Auto-saved tab:', tab.id)
        } catch (error) {
          console.error('[DS-160 Helper] Auto-save failed for tab:', tab.id, error)
        }
      }
    }
  }
})
