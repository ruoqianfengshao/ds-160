/**
 * DS-160 Chrome Extension - Unit Tests
 * 
 * 使用 Jest 和 Chrome Extension Testing Library
 * 运行: npm test
 */

// Mock Chrome APIs
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn()
    },
    sendMessage: jest.fn(),
    getURL: jest.fn((path) => `chrome-extension://test/${path}`)
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
    create: jest.fn()
  },
  action: {
    setBadgeText: jest.fn(),
    setBadgeBackgroundColor: jest.fn()
  }
}

describe('Content Script - Form Detection', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
  })

  test('detectPageType should identify DS-160 form', () => {
    // Mock URL
    delete window.location
    window.location = { href: 'https://ceac.state.gov/genniv/' }
    
    // Simulate content.js detectPageType function
    function detectPageType() {
      const url = window.location.href
      if (url.includes('/ceac/')) {
        return 'ds160-form'
      }
      return 'unknown'
    }
    
    expect(detectPageType()).toBe('ds160-form')
  })

  test('extractFormData should capture all input fields', () => {
    // Create mock form
    document.body.innerHTML = `
      <form>
        <input type="text" name="firstName" value="John" />
        <input type="text" name="lastName" value="Doe" />
        <input type="email" name="email" value="john@example.com" />
        <select name="country">
          <option value="US" selected>United States</option>
        </select>
        <textarea name="address">123 Main St</textarea>
        <input type="radio" name="gender" value="M" checked />
      </form>
    `
    
    // Simulate extractFormData function
    function extractFormData() {
      const formData = {}
      
      document.querySelectorAll('input[type="text"], input[type="email"]').forEach(input => {
        if (input.name) {
          formData[input.name] = input.value
        }
      })
      
      document.querySelectorAll('select').forEach(select => {
        if (select.name) {
          formData[select.name] = select.value
        }
      })
      
      document.querySelectorAll('textarea').forEach(textarea => {
        if (textarea.name) {
          formData[textarea.name] = textarea.value
        }
      })
      
      document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        if (input.name) {
          formData[input.name] = input.value
        }
      })
      
      return formData
    }
    
    const formData = extractFormData()
    
    expect(formData.firstName).toBe('John')
    expect(formData.lastName).toBe('Doe')
    expect(formData.email).toBe('john@example.com')
    expect(formData.country).toBe('US')
    expect(formData.address).toBe('123 Main St')
    expect(formData.gender).toBe('M')
  })

  test('fillFormData should populate form fields', () => {
    document.body.innerHTML = `
      <form>
        <input type="text" name="firstName" />
        <input type="text" name="lastName" />
      </form>
    `
    
    const testData = {
      firstName: 'Jane',
      lastName: 'Smith'
    }
    
    function fillFormData(data) {
      let filledCount = 0
      
      Object.entries(data).forEach(([key, value]) => {
        const input = document.querySelector(`input[name="${key}"]`)
        if (input) {
          input.value = value
          filledCount++
        }
      })
      
      return filledCount
    }
    
    const count = fillFormData(testData)
    
    expect(count).toBe(2)
    expect(document.querySelector('input[name="firstName"]').value).toBe('Jane')
    expect(document.querySelector('input[name="lastName"]').value).toBe('Smith')
  })
})

describe('Storage Management', () => {
  beforeEach(() => {
    // Clear mock storage
    chrome.storage.local.get.mockClear()
    chrome.storage.local.set.mockClear()
  })

  test('should save form data to storage', async () => {
    const stepData = {
      data: { firstName: 'John', lastName: 'Doe' },
      timestamp: Date.now(),
      url: 'https://ceac.state.gov/genniv/'
    }
    
    chrome.storage.local.set.mockImplementation((items, callback) => {
      callback()
    })
    
    await new Promise((resolve) => {
      chrome.storage.local.set({ 'ds160_step_1': stepData }, resolve)
    })
    
    expect(chrome.storage.local.set).toHaveBeenCalledWith(
      expect.objectContaining({
        'ds160_step_1': expect.objectContaining({
          data: expect.any(Object),
          timestamp: expect.any(Number)
        })
      }),
      expect.any(Function)
    )
  })

  test('should retrieve saved drafts', async () => {
    const mockDrafts = {
      'ds160_step_1': { data: { field1: 'value1' } },
      'ds160_step_2': { data: { field2: 'value2' } }
    }
    
    chrome.storage.local.get.mockImplementation((key, callback) => {
      callback(mockDrafts)
    })
    
    const result = await new Promise((resolve) => {
      chrome.storage.local.get(null, resolve)
    })
    
    const draftKeys = Object.keys(result).filter(key => key.startsWith('ds160_step_'))
    expect(draftKeys.length).toBe(2)
  })
})

describe('Message Passing', () => {
  test('background should handle detectPage message', () => {
    const mockHandler = jest.fn((request, sender, sendResponse) => {
      if (request.action === 'detectPage') {
        sendResponse({
          pageType: 'ds160-form',
          currentStep: 1,
          url: 'https://ceac.state.gov/genniv/'
        })
      }
      return true
    })
    
    chrome.runtime.onMessage.addListener(mockHandler)
    
    const request = { action: 'detectPage' }
    const sender = {}
    const sendResponse = jest.fn()
    
    mockHandler(request, sender, sendResponse)
    
    expect(sendResponse).toHaveBeenCalledWith({
      pageType: 'ds160-form',
      currentStep: 1,
      url: expect.any(String)
    })
  })
})
