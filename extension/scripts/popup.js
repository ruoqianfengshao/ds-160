// DS-160 Helper - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  const fillFormBtn = document.getElementById('fillForm')
  const saveDraftBtn = document.getElementById('saveDraft')
  const loadDraftBtn = document.getElementById('loadDraft')
  const clearDataBtn = document.getElementById('clearData')
  const messageDiv = document.getElementById('message')
  const loadingDiv = document.getElementById('loading')
  const pageStatusBadge = document.getElementById('pageStatus')
  const draftCountSpan = document.getElementById('draftCount')
  const currentStepSpan = document.getElementById('currentStep')
  
  let currentTab = null
  
  // 获取当前标签页
  async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    return tab
  }
  
  // 显示消息
  function showMessage(text, type = 'success') {
    messageDiv.textContent = text
    messageDiv.className = `message ${type}`
    setTimeout(() => {
      messageDiv.className = 'message'
    }, 3000)
  }
  
  // 显示/隐藏加载状态
  function setLoading(isLoading) {
    loadingDiv.className = isLoading ? 'loading active' : 'loading'
    fillFormBtn.disabled = isLoading
    saveDraftBtn.disabled = isLoading
    loadDraftBtn.disabled = isLoading
    clearDataBtn.disabled = isLoading
  }
  
  // 检测页面状态
  async function detectPage() {
    currentTab = await getCurrentTab()
    
    if (!currentTab.url.includes('ceac.state.gov')) {
      pageStatusBadge.textContent = '非 DS-160 页面'
      pageStatusBadge.className = 'status-badge badge-inactive'
      fillFormBtn.disabled = true
      saveDraftBtn.disabled = true
      return
    }
    
    try {
      const response = await chrome.tabs.sendMessage(currentTab.id, { action: 'detectPage' })
      
      if (response.pageType === 'ds160-form') {
        pageStatusBadge.textContent = '已检测到表单'
        pageStatusBadge.className = 'status-badge badge-active'
        
        if (response.currentStep) {
          currentStepSpan.textContent = `第 ${response.currentStep} 步`
        }
        
        fillFormBtn.disabled = false
        saveDraftBtn.disabled = false
      }
    } catch (error) {
      console.error('Failed to detect page:', error)
      pageStatusBadge.textContent = '检测失败'
      pageStatusBadge.className = 'status-badge badge-inactive'
    }
  }
  
  // 加载草稿数量
  async function loadDraftCount() {
    const items = await chrome.storage.local.get(null)
    const draftKeys = Object.keys(items).filter(key => key.startsWith('ds160_step_'))
    draftCountSpan.textContent = draftKeys.length
  }
  
  // 自动填充表单
  fillFormBtn.addEventListener('click', async () => {
    setLoading(true)
    
    try {
      currentTab = await getCurrentTab()
      
      // 从 storage 加载数据
      const step = parseInt(currentStepSpan.textContent.match(/\d+/)?.[0] || '0')
      const storageKey = `ds160_step_${step}`
      const result = await chrome.storage.local.get(storageKey)
      
      if (!result[storageKey]) {
        showMessage('没有找到该步骤的保存数据', 'error')
        setLoading(false)
        return
      }
      
      // 发送填充指令
      const response = await chrome.tabs.sendMessage(currentTab.id, {
        action: 'fillForm',
        data: result[storageKey].data
      })
      
      if (response.success) {
        showMessage(`成功填充 ${response.filledCount} 个字段`, 'success')
      } else {
        showMessage(`填充失败: ${response.error}`, 'error')
      }
    } catch (error) {
      console.error('Fill form error:', error)
      showMessage('填充失败: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  })
  
  // 保存草稿
  saveDraftBtn.addEventListener('click', async () => {
    setLoading(true)
    
    try {
      currentTab = await getCurrentTab()
      
      const response = await chrome.tabs.sendMessage(currentTab.id, {
        action: 'extractForm'
      })
      
      if (response.success) {
        const step = parseInt(currentStepSpan.textContent.match(/\d+/)?.[0] || '0')
        const storageKey = `ds160_step_${step}`
        
        await chrome.storage.local.set({
          [storageKey]: {
            data: response.data,
            timestamp: Date.now(),
            url: currentTab.url
          }
        })
        
        showMessage(`已保存 ${response.fieldCount} 个字段`, 'success')
        await loadDraftCount()
      }
    } catch (error) {
      console.error('Save draft error:', error)
      showMessage('保存失败: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  })
  
  // 加载草稿
  loadDraftBtn.addEventListener('click', async () => {
    // 打开草稿列表页面
    chrome.tabs.create({
      url: chrome.runtime.getURL('drafts.html')
    })
  })
  
  // 清除所有数据
  clearDataBtn.addEventListener('click', async () => {
    if (!confirm('确定要清除所有保存的数据吗？此操作不可恢复！')) {
      return
    }
    
    setLoading(true)
    
    try {
      await chrome.storage.local.clear()
      showMessage('所有数据已清除', 'success')
      await loadDraftCount()
      currentStepSpan.textContent = '--'
    } catch (error) {
      showMessage('清除失败: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  })
  
  // 初始化
  await detectPage()
  await loadDraftCount()
})
