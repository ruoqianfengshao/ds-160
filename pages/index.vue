<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Simplify Your
            <span class="text-gradient"> DS-160 </span>
            Visa Application
          </h1>
          <p class="body-text text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
            Our intelligent assistant guides you through every step, 
            highlights critical fields, and auto-saves your progress. 
            Apply with confidence.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink to="/dashboard" class="btn-primary text-lg px-8 py-4">
              Start Your Application
            </NuxtLink>
            <NuxtLink to="/features" class="btn-secondary text-lg px-8 py-4">
              Learn More
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Decorative gradient -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-100 rounded-full blur-3xl opacity-20"></div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white border-y border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">12</div>
            <div class="text-gray-600">Steps Simplified</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">Auto</div>
            <div class="text-gray-600">Save Feature</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">3</div>
            <div class="text-gray-600">Free Cloud Syncs</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Preview -->
    <section class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="section-heading">Why DS-160 Helper?</h2>
          <p class="body-text text-xl mt-4 max-w-3xl mx-auto">
            Designed to make your visa application process smooth, 
            accurate, and stress-free.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card">
            <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Smart Validation</h3>
            <p class="text-gray-600">
              Real-time field validation ensures your application meets all requirements 
              before submission.
            </p>
          </div>

          <div class="card">
            <div class="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">High-Risk Alerts</h3>
            <p class="text-gray-600">
              Critical fields are highlighted with warnings and tips to prevent 
              costly mistakes.
            </p>
          </div>

          <div class="card">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Auto-Save</h3>
            <p class="text-gray-600">
              Your progress is automatically saved to your device. 
              Never lose your work.
            </p>
          </div>
        </div>

        <div class="text-center mt-12">
          <NuxtLink to="/features" class="btn-secondary">
            View All Features
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-primary-600">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Get Started?
        </h2>
        <p class="text-xl text-primary-100 mb-8">
          Join thousands who have successfully completed their DS-160 applications 
          with our assistance.
        </p>
        <NuxtLink 
          to="/dashboard" 
          class="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold 
                 hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Start Your Application
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>
