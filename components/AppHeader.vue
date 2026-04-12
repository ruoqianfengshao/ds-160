<template>
  <header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo / Brand -->
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold text-blue-600">
            DS-160 助手
          </NuxtLink>
        </div>

        <!-- Navigation -->
        <nav v-if="isAuthenticated" class="flex items-center space-x-4">
          <NuxtLink
            to="/dashboard"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            仪表板
          </NuxtLink>
          
          <NuxtLink
            to="/profile"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            个人资料
          </NuxtLink>

          <!-- User Info -->
          <div class="flex items-center space-x-3 border-l pl-4">
            <span class="text-sm text-gray-700">
              {{ userEmail }}
            </span>
            <button
              @click="handleLogout"
              class="text-sm text-gray-700 hover:text-red-600 px-3 py-2 rounded-md font-medium"
            >
              退出登录
            </button>
          </div>
        </nav>

        <!-- Guest Navigation -->
        <nav v-else class="flex items-center space-x-4">
          <NuxtLink
            to="/login"
            class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            登录
          </NuxtLink>
          <NuxtLink
            to="/signup"
            class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
          >
            注册
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const router = useRouter()

// 从 cookie 或 localStorage 获取用户信息
const isAuthenticated = ref(false)
const userEmail = ref('')

onMounted(() => {
  // 检查 JWT cookie
  const token = useCookie('auth_token')
  
  if (token.value) {
    isAuthenticated.value = true
    
    // 尝试解析 JWT 获取邮箱（简单解码，不验证）
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      userEmail.value = payload.email || payload.sub || '用户'
    } catch {
      // Fallback：调用 API 获取用户信息
      fetchUserInfo()
    }
  }
})

async function fetchUserInfo() {
  try {
    const response = await $fetch('/api/user/me')
    if (response && response.email) {
      userEmail.value = response.email
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error)
  }
}

function handleLogout() {
  // 清除 cookie
  const token = useCookie('auth_token')
  token.value = null
  
  // 清除 localStorage
  localStorage.clear()
  
  // 跳转到首页
  router.push('/login')
}
</script>
