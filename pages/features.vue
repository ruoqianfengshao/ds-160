<template>
  <div class="bg-white">
    <!-- Hero -->
    <section class="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="section-heading">Powerful Features</h1>
          <p class="body-text text-xl mt-4">
            Everything you need to complete your DS-160 application 
            accurately and efficiently.
          </p>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
          <!-- Feature 1 -->
          <div class="flex gap-6">
            <div class="flex-shrink-0">
              <div class="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
                <svg class="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="text-2xl font-semibold mb-3">12-Step Guided Process</h3>
              <p class="text-gray-600 leading-relaxed">
                Break down the complex DS-160 form into manageable steps. 
                Our intelligent wizard guides you through personal information, 
                passport details, travel plans, and security questions with clear instructions.
              </p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="flex gap-6">
            <div class="flex-shrink-0">
              <div class="w-14 h-14 bg-warning-100 rounded-xl flex items-center justify-center">
                <svg class="w-7 h-7 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="text-2xl font-semibold mb-3">High-Risk Field Alerts</h3>
              <p class="text-gray-600 leading-relaxed">
                Critical fields are highlighted with orange borders and warning icons. 
                Get contextual tips and best practices for fields that commonly cause 
                application delays or rejections.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="flex gap-6">
            <div class="flex-shrink-0">
              <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="text-2xl font-semibold mb-3">Automatic Save</h3>
              <p class="text-gray-600 leading-relaxed">
                Your progress is automatically saved to your browser's local storage 
                after every change. Close your browser and come back anytime—your 
                work is never lost.
              </p>
            </div>
          </div>

          <!-- Feature 4 -->
          <div class="flex gap-6">
            <div class="flex-shrink-0">
              <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="text-2xl font-semibold mb-3">Cloud Sync (3 Free)</h3>
              <p class="text-gray-600 leading-relaxed">
                Sync your draft to the cloud up to 3 times for free. 
                Access your application from multiple devices and keep 
                a secure backup of your work.
              </p>
            </div>
          </div>

          <!-- Feature 5 -->
          <div class="flex gap-6">
            <div class="flex-shrink-0">
              <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg class="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="text-2xl font-semibold mb-3">Real-Time Validation</h3>
              <p class="text-gray-600 leading-relaxed">
                Instant feedback on required fields, date formats, and data consistency. 
                Catch errors before they become problems. See your progress percentage 
                update in real-time.
              </p>
            </div>
          </div>

          <!-- Feature 6 -->
          <div class="flex gap-6">
            <div class="flex-shrink-0">
              <div class="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center">
                <svg class="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="text-2xl font-semibold mb-3">Fully Responsive</h3>
              <p class="text-gray-600 leading-relaxed">
                Work seamlessly on desktop, tablet, or mobile. 
                Our interface adapts perfectly to any screen size, 
                ensuring a smooth experience wherever you are.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Flow -->
    <section class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="section-heading">The Process</h2>
          <p class="body-text text-xl mt-4 max-w-3xl mx-auto">
            Follow our streamlined 12-step process to complete your DS-160
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1-4
            </div>
            <h3 class="text-xl font-semibold mb-2">Personal & Passport</h3>
            <p class="text-gray-600">
              Start with your personal information, contact details, 
              passport info, and travel plans.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              5-8
            </div>
            <h3 class="text-xl font-semibold mb-2">Family & Work</h3>
            <p class="text-gray-600">
              Add travel companions, US travel history, 
              family details, and employment information.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              9-12
            </div>
            <h3 class="text-xl font-semibold mb-3">Security & Review</h3>
            <p class="text-gray-600">
              Complete security questions, travel history, 
              and upload your photo for final review.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          Ready to Experience It?
        </h2>
        <p class="body-text text-xl mb-8">
          Start your DS-160 application now and see how easy it can be.
        </p>
        <NuxtLink to="/dashboard" class="btn-primary text-lg px-8 py-4">
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
