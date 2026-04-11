<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">DS</span>
            </div>
            <span class="font-semibold text-xl">DS-160 Helper</span>
          </NuxtLink>

          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink to="/" class="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </NuxtLink>
            <NuxtLink to="/features" class="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </NuxtLink>
            <NuxtLink to="/pricing" class="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </NuxtLink>
            <NuxtLink to="/dashboard" class="btn-primary">
              Get Started
            </NuxtLink>
          </div>

          <!-- Mobile menu button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                v-if="!mobileMenuOpen"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                v-else
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Mobile menu -->
        <div 
          v-if="mobileMenuOpen"
          class="md:hidden py-4 space-y-4 border-t border-gray-100"
        >
          <NuxtLink 
            to="/" 
            class="block py-2 text-gray-600 hover:text-gray-900"
            @click="mobileMenuOpen = false"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/features" 
            class="block py-2 text-gray-600 hover:text-gray-900"
            @click="mobileMenuOpen = false"
          >
            Features
          </NuxtLink>
          <NuxtLink 
            to="/pricing" 
            class="block py-2 text-gray-600 hover:text-gray-900"
            @click="mobileMenuOpen = false"
          >
            Pricing
          </NuxtLink>
          <NuxtLink 
            to="/dashboard" 
            class="block btn-primary text-center"
            @click="mobileMenuOpen = false"
          >
            Get Started
          </NuxtLink>
        </div>
      </nav>
    </header>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">DS</span>
              </div>
              <span class="font-semibold text-xl">DS-160 Helper</span>
            </div>
            <p class="text-gray-600 max-w-md">
              Streamline your visa application process with our intelligent assistant. 
              Save time, reduce errors, and apply with confidence.
            </p>
          </div>

          <div>
            <h3 class="font-semibold mb-4">Product</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/features" class="text-gray-600 hover:text-gray-900">
                  Features
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/pricing" class="text-gray-600 hover:text-gray-900">
                  Pricing
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/dashboard" class="text-gray-600 hover:text-gray-900">
                  Dashboard
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold mb-4">Support</h3>
            <ul class="space-y-2">
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p>&copy; 2024 DS-160 Helper. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)
</script>
