<template>
  <div>
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-primary-50 to-primary-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            功能介绍
          </h1>
          <p class="text-xl text-gray-600">
            DS-160 Helper 为您提供全方位的辅助填写体验，让复杂的签证表格变得简单
          </p>
        </div>
      </div>
    </section>
    
    <!-- Features -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card">
            <div class="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">12步引导式填写</h3>
            <p class="text-gray-600">
              将复杂的DS-160表格拆分为12个简单步骤，每一步只处理相关内容，降低认知负担，告别信息过载。
            </p>
          </div>
          
          <!-- Feature 2 -->
          <div class="card">
            <div class="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">全程中文说明</h3>
            <p class="text-gray-600">
              每个字段都有中文白话解释和填写示例，例如："例如：张三"，让您无需翻译软件也能准确填写。
            </p>
          </div>
          
          <!-- Feature 3 -->
          <div class="card">
            <div class="w-14 h-14 bg-warning-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">高风险字段警示</h3>
            <p class="text-gray-600">
              智能识别可能影响签证结果的字段，用橙色警告框标注，提醒您如实、谨慎填写。
            </p>
          </div>
          
          <!-- Feature 4 -->
          <div class="card">
            <div class="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">自动保存草稿</h3>
            <p class="text-gray-600">
              每次字段变更后自动保存到本地浏览器，中断后回来可继续填写，再也不用担心超时丢失。
            </p>
          </div>
          
          <!-- Feature 5 -->
          <div class="card">
            <div class="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">实时数据校验</h3>
            <p class="text-gray-600">
              填写时实时检查数据格式和一致性，提前发现并提示问题，确保信息准确无误。
            </p>
          </div>
          
          <!-- Feature 6 -->
          <div class="card">
            <div class="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <svg class="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">移动端适配</h3>
            <p class="text-gray-600">
              响应式设计，手机、平板、电脑都能流畅使用，随时随地填写您的申请表格。
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Step Details -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">填写步骤详情</h2>
          <p class="text-xl text-gray-600">每一页都经过精心设计，确保填写体验流畅</p>
        </div>
        
        <div class="space-y-6">
          <div v-for="step in steps" :key="step.num" class="bg-white rounded-2xl p-6 border border-gray-100">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
                  {{ step.num }}
                </div>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ step.title }}</h3>
                <p class="text-gray-600 mb-4">{{ step.desc }}</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in step.tags" :key="tag" class="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div v-if="step.highRisk" class="flex-shrink-0">
                <span class="inline-flex items-center px-3 py-1 bg-warning-100 text-warning-700 text-sm font-medium rounded-full">
                  <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  含高风险字段
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          开始使用 DS-160 Helper
        </h2>
        <p class="text-xl text-gray-600 mb-10">
          免费体验引导式填写，让您的签证申请更轻松
        </p>
        <NuxtLink to="/app/dashboard" class="btn-primary text-lg px-8 py-4">
          立即开始
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const steps = [
  { 
    num: 1, 
    title: '个人信息', 
    desc: '填写您的姓名（中文和英文拼音）、性别、出生日期、出生地点、国籍等信息',
    tags: ['姓名', '出生日期', '国籍'],
    highRisk: false
  },
  { 
    num: 2, 
    title: '护照信息', 
    desc: '填写护照号码、护照签发日期、有效期等护照相关信息',
    tags: ['护照号', '有效期'],
    highRisk: false
  },
  { 
    num: 3, 
    title: '联系方式', 
    desc: '填写您的居住地址、电话号码、电子邮件等联系方式',
    tags: ['地址', '电话', '邮箱'],
    highRisk: false
  },
  { 
    num: 4, 
    title: '旅行信息', 
    desc: '填写本次赴美的目的、预计到达日期、计划停留时间等信息',
    tags: ['旅行目的', '行程计划'],
    highRisk: false
  },
  { 
    num: 5, 
    title: '旅行伙伴', 
    desc: '如果有同行人员，填写同行人的相关信息',
    tags: ['同行人'],
    highRisk: false
  },
  { 
    num: 6, 
    title: '美国联系人', 
    desc: '填写在美国的联系人信息或拟入住的酒店信息',
    tags: ['联系人', '酒店'],
    highRisk: false
  },
  { 
    num: 7, 
    title: '家庭信息', 
    desc: '填写父母和配偶（如有）的个人信息',
    tags: ['父母', '配偶', '子女'],
    highRisk: false
  },
  { 
    num: 8, 
    title: '工作/教育', 
    desc: '填写当前职业、工作单位信息，以及教育背景',
    tags: ['职业', '雇主', '教育'],
    highRisk: false
  },
  { 
    num: 9, 
    title: '安全问题（1）', 
    desc: '填写与政府职务、犯罪记录、法律违反相关的安全问题',
    tags: ['犯罪记录', '违法行为', '高风险'],
    highRisk: true
  },
  { 
    num: 10, 
    title: '安全问题（2）', 
    desc: '填写与恐怖主义、毒品、传染病等相关的安全问题',
    tags: ['恐怖主义', '毒品', '高风险'],
    highRisk: true
  },
  { 
    num: 11, 
    title: '以往旅行', 
    desc: '填写是否曾去过美国、是否被拒签过、是否持有美国签证等信息',
    tags: ['拒签历史', '美国入境记录', '高风险'],
    highRisk: true
  },
  { 
    num: 12, 
    title: '照片确认', 
    desc: '上传符合要求的签证照片，并进行最终确认',
    tags: ['照片上传', '最终确认'],
    highRisk: false
  }
]
</script>
