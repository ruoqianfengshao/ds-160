<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- Progress Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <button 
          class="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          @click="goToDashboard"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回
        </button>
        <span class="text-gray-500 text-sm">
          步骤 {{ currentStep }} / 12 · 已完成 {{ progress }}%
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-primary-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
    
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Sidebar - Step Navigation -->
      <div class="lg:w-64 flex-shrink-0">
        <div class="card sticky top-24">
          <h3 class="font-semibold text-gray-900 mb-4">填写步骤</h3>
          <nav class="space-y-1">
            <NuxtLink 
              v-for="step in steps"
              :key="step.num"
              :to="`/app/form/step-${step.num}`"
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
              :class="{
                'bg-primary-100 text-primary-700 font-medium': step.num === currentStep,
                'text-green-600': isStepCompleted(step.num),
                'text-gray-500 hover:bg-gray-100': !isStepCompleted(step.num) && step.num !== currentStep
              }"
            >
              <span v-if="isStepCompleted(step.num)" class="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
                ✓
              </span>
              <span v-else-if="step.num === currentStep" class="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs">
                {{ step.num }}
              </span>
              <span v-else class="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs">
                {{ step.num }}
              </span>
              <span class="truncate">{{ step.title }}</span>
            </NuxtLink>
          </nav>
        </div>
      </div>
      
      <!-- Main Form Area -->
      <div class="flex-1">
        <div class="card">
          <!-- Step Header -->
          <div class="mb-6 pb-6 border-b border-gray-100">
            <div class="flex items-center gap-3 mb-2">
              <span class="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                {{ currentStep }}
              </span>
              <h2 class="text-xl font-bold text-gray-900">{{ currentStepConfig.title }}</h2>
            </div>
            <p class="text-gray-600">{{ currentStepConfig.description }}</p>
          </div>
          
          <!-- Form Fields -->
          <form @submit.prevent="handleNext" class="space-y-6">
            <template v-for="field in currentStepConfig.fields" :key="field.name">
              <!-- High Risk Warning -->
              <div v-if="field.highRisk" class="high-risk-warning">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p class="font-medium text-warning-800">高风险字段</p>
                    <p class="text-sm text-warning-700 mt-1">{{ field.warning }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Text Input -->
              <div v-if="field.type === 'text'" class="space-y-2">
                <label :for="field.name" class="block text-sm font-medium text-gray-700">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500 ml-1">*</span>
                </label>
                <input
                  :id="field.name"
                  v-model="formData[field.name]"
                  type="text"
                  class="input-field"
                  :placeholder="field.placeholder"
                  :class="{ 'error': errors[field.name] }"
                />
                <p v-if="field.hint" class="text-sm text-gray-500">{{ field.hint }}</p>
                <p v-if="errors[field.name]" class="text-sm text-red-500">{{ errors[field.name] }}</p>
              </div>
              
              <!-- Date Input -->
              <div v-else-if="field.type === 'date'" class="space-y-2">
                <label :for="field.name" class="block text-sm font-medium text-gray-700">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500 ml-1">*</span>
                </label>
                <input
                  :id="field.name"
                  v-model="formData[field.name]"
                  type="date"
                  class="input-field"
                  :class="{ 'error': errors[field.name] }"
                />
                <p v-if="field.hint" class="text-sm text-gray-500">{{ field.hint }}</p>
                <p v-if="errors[field.name]" class="text-sm text-red-500">{{ errors[field.name] }}</p>
              </div>
              
              <!-- Select -->
              <div v-else-if="field.type === 'select'" class="space-y-2">
                <label :for="field.name" class="block text-sm font-medium text-gray-700">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500 ml-1">*</span>
                </label>
                <select
                  :id="field.name"
                  v-model="formData[field.name]"
                  class="input-field"
                  :class="{ 'error': errors[field.name] }"
                >
                  <option value="">请选择</option>
                  <option v-for="option in field.options" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
                <p v-if="field.hint" class="text-sm text-gray-500">{{ field.hint }}</p>
                <p v-if="errors[field.name]" class="text-sm text-red-500">{{ errors[field.name] }}</p>
              </div>
              
              <!-- Radio Group -->
              <div v-else-if="field.type === 'radio'" class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500 ml-1">*</span>
                </label>
                <div class="space-y-3">
                  <label 
                    v-for="option in field.options" 
                    :key="option.value"
                    class="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    :class="{ 'border-primary-500 bg-primary-50': formData[field.name] === option.value }"
                  >
                    <input
                      type="radio"
                      :name="field.name"
                      :value="option.value"
                      v-model="formData[field.name]"
                      class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="text-gray-700">{{ option.label }}</span>
                  </label>
                </div>
                <p v-if="field.hint" class="text-sm text-gray-500">{{ field.hint }}</p>
                <p v-if="errors[field.name]" class="text-sm text-red-500">{{ errors[field.name] }}</p>
              </div>
              
              <!-- Textarea -->
              <div v-else-if="field.type === 'textarea'" class="space-y-2">
                <label :for="field.name" class="block text-sm font-medium text-gray-700">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  :id="field.name"
                  v-model="formData[field.name]"
                  rows="4"
                  class="input-field resize-none"
                  :placeholder="field.placeholder"
                  :class="{ 'error': errors[field.name] }"
                ></textarea>
                <p v-if="field.hint" class="text-sm text-gray-500">{{ field.hint }}</p>
                <p v-if="errors[field.name]" class="text-sm text-red-500">{{ errors[field.name] }}</p>
              </div>
              
              <!-- File Upload -->
              <div v-else-if="field.type === 'file'" class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500 ml-1">*</span>
                </label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
                     @click="$refs.fileInput.click()"
                     @dragover.prevent
                     @drop.prevent="handleFileDrop"
                >
                  <input 
                    ref="fileInput" 
                    type="file" 
                    class="hidden" 
                    accept="image/*"
                    @change="handleFileSelect"
                  />
                  <div v-if="!formData[field.name]">
                    <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-gray-600 mb-1">点击或拖拽上传照片</p>
                    <p class="text-sm text-gray-400">{{ field.hint }}</p>
                  </div>
                  <div v-else class="flex items-center justify-center gap-4">
                    <img :src="formData[field.name]" alt="Preview" class="w-24 h-24 object-cover rounded-lg" />
                    <div>
                      <p class="text-green-600 font-medium">照片已上传</p>
                      <button type="button" class="text-sm text-red-500 hover:text-red-700 mt-1" @click.stop="formData[field.name] = ''">
                        重新上传
                      </button>
                    </div>
                  </div>
                </div>
                <p v-if="errors[field.name]" class="text-sm text-red-500">{{ errors[field.name] }}</p>
              </div>
            </template>
            
            <!-- Form Actions -->
            <div class="flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                class="btn-secondary"
                :disabled="currentStep === 1"
                @click="handlePrev"
              >
                <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                上一步
              </button>
              
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="btn-secondary"
                  @click="handleSave"
                >
                  保存草稿
                </button>
                
                <button
                  type="submit"
                  class="btn-primary"
                >
                  {{ currentStep === 12 ? '完成' : '下一步' }}
                  <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Help Sidebar -->
      <div class="lg:w-64 flex-shrink-0 hidden xl:block">
        <div class="card sticky top-24">
          <h3 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            填写提示
          </h3>
          <div class="text-sm text-gray-600 space-y-3">
            <p v-for="tip in currentStepConfig.tips" :key="tip">
              {{ tip }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sync Modal -->
    <div v-if="showSyncModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showSyncModal = false">
      <div class="bg-white rounded-2xl p-8 max-w-md mx-4 animate-fade-in">
        <div v-if="formStore.syncInProgress" class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">正在同步到DS-160官网...</h3>
          <p class="text-gray-500">请稍候，正在连接并填充表单</p>
        </div>
        <div v-else-if="formStore.syncSuccess" class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">同步成功！</h3>
          <p class="text-gray-500 mb-4">已成功同步到DS-160官网</p>
          <p class="text-sm text-gray-400">剩余 {{ Math.max(0, 3 - formStore.syncCount) }} 次免费同步</p>
          <button class="btn-primary mt-6 w-full" @click="showSyncModal = false">
            完成
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormStore, type FormData } from '~/stores/form'

definePageMeta({
  layout: 'app'
})

const route = useRoute()
const router = useRouter()
const formStore = useFormStore()

const currentStep = computed(() => parseInt(route.params.step as string) || 1)
const progress = computed(() => formStore.progress)

const showSyncModal = ref(false)

// Load draft on mount
onMounted(() => {
  if (!formStore.isDraftSaved) {
    formStore.loadDraft()
  }
  if (!formStore.isDraftSaved) {
    formStore.createNewDraft()
  }
})

const formData = computed(() => {
  const stepData = formStore.formData[formStore.currentStepData as keyof FormData] || {}
  return stepData as Record<string, any>
})

const errors = ref<Record<string, string>>({})

const steps = [
  { num: 1, title: '个人信息' },
  { num: 2, title: '护照信息' },
  { num: 3, title: '联系方式' },
  { num: 4, title: '旅行信息' },
  { num: 5, title: '旅行伙伴' },
  { num: 6, title: '美国联系人' },
  { num: 7, title: '家庭信息' },
  { num: 8, title: '工作教育' },
  { num: 9, title: '安全问题1' },
  { num: 10, title: '安全问题2' },
  { num: 11, title: '以往旅行' },
  { num: 12, title: '照片确认' }
]

const isStepCompleted = (step: number) => {
  return step < currentStep.value
}

// Step configurations
const stepConfigs: Record<number, any> = {
  1: {
    title: '个人信息',
    description: '请填写您的基本信息，包括姓名、性别、出生日期等。中文名和英文名都需要填写。',
    tips: [
      '姓名的中文填写您的身份证上的名字',
      '英文名请使用拼音，例如：张三填写为 San Zhang',
      '其他名字指您曾用名或别名（如有）'
    ],
    fields: [
      { name: 'fullName', label: '中文全名', type: 'text', required: true, placeholder: '例如：张三', hint: '请填写您身份证上的姓名' },
      { name: 'givenName', label: '名字（Given Name）', type: 'text', required: true, placeholder: '例如：San', hint: '使用拼音，首字母大写' },
      { name: 'familyName', label: '姓氏（Family Name）', type: 'text', required: true, placeholder: '例如：Zhang', hint: '使用拼音，首字母大写' },
      { name: 'sex', label: '性别', type: 'select', required: true, options: [{ value: 'male', label: '男' }, { value: 'female', label: '女' }] },
      { name: 'dateOfBirth', label: '出生日期', type: 'date', required: true, hint: '请使用公历日期' },
      { name: 'cityOfBirth', label: '出生城市', type: 'text', required: true, placeholder: '例如：上海' },
      { name: 'countryOfBirth', label: '出生国家', type: 'select', required: true, options: [{ value: 'CN', label: '中国' }] },
      { name: 'nationality', label: '国籍', type: 'select', required: true, options: [{ value: 'CN', label: '中国' }] },
      { name: 'nationalIdNumber', label: '身份证号码', type: 'text', required: true, placeholder: '18位身份证号码' }
    ]
  },
  2: {
    title: '护照信息',
    description: '请准确填写您的护照信息，护照号码和有效期非常重要。',
    tips: [
      '护照号码通常在护照照片页的右上角',
      '确保护照有效期至少超过您预计入境美国日期6个月以上',
      '护照签发日期不能晚于有效期截止日期'
    ],
    fields: [
      { name: 'passportNumber', label: '护照号码', type: 'text', required: true, placeholder: '例如：E12345678', hint: '通常为E开头加8位数字' },
      { name: 'passportBookNumber', label: '护照本号码', type: 'text', required: false, placeholder: '通常在护照最后一页' },
      { name: 'countryOfIssuance', label: '护照签发国', type: 'select', required: true, options: [{ value: 'CN', label: '中国' }] },
      { name: 'issueDate', label: '护照签发日期', type: 'date', required: true },
      { name: 'expirationDate', label: '护照有效期截止日', type: 'date', required: true, hint: '请检查护照上的有效期' },
      { name: 'passportTaken', label: '护照是否曾被扣押', type: 'radio', required: true, options: [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }] }
    ]
  },
  3: {
    title: '联系方式',
    description: '请填写您的详细联系方式，包括居住地址和联系电话。',
    tips: [
      '地址需要填写详细，包括省市区',
      '电话号码请包含国际区号，如：+86-138-1234-5678',
      'Email地址将用于接收重要通知'
    ],
    fields: [
      { name: 'streetAddress', label: '街道地址', type: 'text', required: true, placeholder: 'XX路XX号XX室' },
      { name: 'city', label: '城市', type: 'text', required: true, placeholder: '例如：上海' },
      { name: 'state', label: '省份', type: 'text', required: true, placeholder: '例如：上海市' },
      { name: 'postalCode', label: '邮政编码', type: 'text', required: true, placeholder: '6位数字' },
      { name: 'country', label: '国家', type: 'select', required: true, options: [{ value: 'CN', label: '中国' }] },
      { name: 'phoneNumber', label: '主要联系电话', type: 'text', required: true, placeholder: '+86-138-1234-5678' },
      { name: 'secondaryPhone', label: '备用电话', type: 'text', required: false, placeholder: '选填' },
      { name: 'emailAddress', label: '电子邮件', type: 'text', required: true, placeholder: 'example@email.com' }
    ]
  },
  4: {
    title: '旅行信息',
    description: '请填写您本次赴美的旅行计划和目的。',
    tips: [
      '旅行目的选择最符合您主要目的的选项',
      '预计停留时间以月为单位',
      '如果访问多个州，请填写所有计划访问的州'
    ],
    fields: [
      { name: 'purposeOfTrip', label: '旅行目的', type: 'select', required: true, options: [
        { value: 'tourism', label: '旅游 (B2)' },
        { value: 'business', label: '商务 (B1)' },
        { value: 'student', label: '学生 (F1)' },
        { value: 'transit', label: '过境' }
      ]},
      { name: 'specificPurpose', label: '具体目的', type: 'textarea', required: false, placeholder: '请简要描述您的旅行目的' },
      { name: 'expectedArrivalDate', label: '预计到达日期', type: 'date', required: true },
      { name: 'expectedDepartureDate', label: '预计离境日期', type: 'date', required: false },
      { name: 'intendedLengthOfStay', label: '计划停留时间', type: 'text', required: true, placeholder: '例如：3个月' },
      { name: 'placeToBeVisited', label: '访问地点（城市）', type: 'text', required: true, placeholder: '例如：洛杉矶、纽约' },
      { name: 'statesToBeVisited', label: '访问州份', type: 'text', required: false, placeholder: '例如：加利福尼亚州、纽约州' }
    ]
  },
  5: {
    title: '旅行伙伴',
    description: '如果本次旅行有同行人员，请填写相关信息。',
    tips: [
      '如果没有同行人员，请选择"否"',
      '同行人关系可选择：配偶、子女、父母、兄弟姐妹、其他'
    ],
    fields: [
      { name: 'isTravelingWithSomeone', label: '是否有同行人', type: 'radio', required: true, options: [
        { value: 'yes', label: '是' },
        { value: 'no', label: '否' }
      ]},
      { name: 'companionName', label: '同行人姓名', type: 'text', required: false, placeholder: '同行人的英文名' },
      { name: 'companionRelationship', label: '与同行人关系', type: 'select', required: false, options: [
        { value: 'spouse', label: '配偶' },
        { value: 'child', label: '子女' },
        { value: 'parent', label: '父母' },
        { value: 'sibling', label: '兄弟姐妹' },
        { value: 'other', label: '其他' }
      ]},
      { name: 'companionAddress', label: '同行人地址', type: 'text', required: false, placeholder: '同行人的居住地址' }
    ]
  },
  6: {
    title: '美国联系人',
    description: '请填写您在美国的联系人信息或拟入住的酒店。',
    tips: [
      '如果您住在酒店，只需填写酒店信息',
      '如果访问亲友，请填写亲友的联系信息',
      '联系人信息必须是真实可联系的'
    ],
    fields: [
      { name: 'hasUsContact', label: '是否有美国联系人', type: 'radio', required: true, options: [
        { value: 'yes', label: '是' },
        { value: 'no', label: '否' }
      ]},
      { name: 'contactName', label: '联系人姓名', type: 'text', required: false, placeholder: '联系人姓名' },
      { name: 'contactOrganization', label: '组织/机构名称', type: 'text', required: false, placeholder: '如酒店名称或公司名称' },
      { name: 'contactAddress', label: '联系人地址', type: 'text', required: false, placeholder: '完整的美国地址' },
      { name: 'contactPhone', label: '联系人电话', type: 'text', required: false, placeholder: '美国电话号码' },
      { name: 'contactEmail', label: '联系人邮箱', type: 'text', required: false, placeholder: 'Email地址' }
    ]
  },
  7: {
    title: '家庭信息',
    description: '请填写您的家庭成员信息，包括父母、配偶和子女。',
    tips: [
      '父母信息为必填项',
      '如无配偶或子女，请选择相应选项',
      '出生日期请使用公历日期'
    ],
    fields: [
      { name: 'fatherFirstName', label: '父亲名字', type: 'text', required: true, placeholder: '父亲的英文名' },
      { name: 'fatherLastName', label: '父亲姓氏', type: 'text', required: true, placeholder: '父亲的英文姓' },
      { name: 'fatherDateOfBirth', label: '父亲出生日期', type: 'date', required: false },
      { name: 'fatherCityOfBirth', label: '父亲出生城市', type: 'text', required: false, placeholder: '城市名' },
      { name: 'fatherCountryOfBirth', label: '父亲出生国家', type: 'select', required: true, options: [{ value: 'CN', label: '中国' }] },
      { name: 'motherFirstName', label: '母亲名字', type: 'text', required: true, placeholder: '母亲的英文名' },
      { name: 'motherLastName', label: '母亲姓氏', type: 'text', required: true, placeholder: '母亲的英文姓' },
      { name: 'motherDateOfBirth', label: '母亲出生日期', type: 'date', required: false },
      { name: 'motherCityOfBirth', label: '母亲出生城市', type: 'text', required: false, placeholder: '城市名' },
      { name: 'motherCountryOfBirth', label: '母亲出生国家', type: 'select', required: true, options: [{ value: 'CN', label: '中国' }] },
      { name: 'hasSpouse', label: '是否有配偶', type: 'radio', required: true, options: [
        { value: 'yes', label: '是' },
        { value: 'no', label: '否' }
      ]},
      { name: 'hasChildren', label: '是否有子女', type: 'radio', required: true, options: [
        { value: 'yes', label: '是' },
        { value: 'no', label: '否' }
      ]}
    ]
  },
  8: {
    title: '工作/教育',
    description: '请填写您当前的工作和学历信息。',
    tips: [
      '如果您是学生，选择"学生"作为职业',
      '雇主电话必须是可验证的',
      '收入信息仅用于统计分析'
    ],
    fields: [
      { name: 'presentOccupation', label: '当前职业', type: 'select', required: true, options: [
        { value: 'employed', label: '受雇' },
        { value: 'self-employed', label: '自雇' },
        { value: 'student', label: '学生' },
        { value: 'retired', label: '退休' },
        { value: 'unemployed', label: '待业' },
        { value: 'homemaker', label: '家庭主妇/夫' }
      ]},
      { name: 'employerName', label: '雇主/单位名称', type: 'text', required: false, placeholder: '公司或机构名称' },
      { name: 'employerAddress', label: '雇主地址', type: 'text', required: false, placeholder: '单位详细地址' },
      { name: 'employerPhone', label: '雇主电话', type: 'text', required: false, placeholder: '公司总机' },
      { name: 'monthlyIncome', label: '月收入', type: 'text', required: false, placeholder: '人民币' },
      { name: 'hasEducation', label: '是否有高等教育学历', type: 'radio', required: true, options: [
        { value: 'yes', label: '是' },
        { value: 'no', label: '否' }
      ]},
      { name: 'highestEducation', label: '最高学历', type: 'select', required: false, options: [
        { value: 'highschool', label: '高中' },
        { value: 'college', label: '大学' },
        { value: 'master', label: '硕士' },
        { value: 'doctor', label: '博士' }
      ]},
      { name: 'schoolName', label: '学校名称', type: 'text', required: false, placeholder: '毕业院校' }
    ]
  },
  9: {
    title: '安全问题（1）',
    description: '此部分涉及可能影响签证审核的重要问题，请如实回答。',
    tips: [
      '这些问题必须如实回答，虚假陈述可能导致拒签或更严重后果',
      '如有相关情况，请详细说明'
    ],
    fields: [
      { 
        name: 'hasGovernmentRole', 
        label: '是否曾担任政府重要职务', 
        type: 'radio', 
        required: true, 
        highRisk: true,
        warning: '此字段涉及签证审核关键信息，请如实填写。如有相关情况，签证官可能会深入询问。',
        options: [
          { value: 'yes', label: '是' },
          { value: 'no', label: '否' }
        ]
      },
      { name: 'governmentDetails', label: '请说明职务详情', type: 'textarea', required: false, placeholder: '' },
      { 
        name: 'hasCriminalRecord', 
        label: '是否有犯罪记录', 
        type: 'radio', 
        required: true, 
        highRisk: true,
        warning: '无论何种性质的犯罪记录都必须如实申报。故意隐瞒可能导致永久拒签。',
        options: [
          { value: 'yes', label: '是' },
          { value: 'no', label: '否' }
        ]
      },
      { name: 'criminalDetails', label: '请说明犯罪详情', type: 'textarea', required: false, placeholder: '' },
      { 
        name: 'hasViolatedLaw', 
        label: '是否曾违反法律', 
        type: 'radio', 
        required: true, 
        highRisk: true,
        warning: '包括但不限于交通违章、治安处罚等。请如实申报。',
        options: [
          { value: 'yes', label: '是' },
          { value: 'no', label: '否' }
        ]
      },
      { 
        name: 'seekingUnlawfulEntry', 
        label: '是否曾试图非法进入美国', 
        type: 'radio', 
        required: true, 
        highRisk: true,
        warning: '此问题关乎移民倾向，请如实回答。',
        options: [
          { value: 'yes', label: '是' },
          { value: 'no', label: '否' }
        ]
      }
    ]
  },
  10: {
    title: '安全问题（2）',
    description: '请继续回答以下安全问题，这些信息对签证审核非常重要。',
    tips: [
      '这些是DS-160表格的标准安全问题',
      '请根据实际情况如实回答'
    ],
    fields: [
      { 
        name: 'hasTerrorismConnection', 
        label: '是否与恐怖活动有关联', 
        type: 'radio', 
        required: true, 
        highRisk: true,
        warning: '这是必填问题，涉及国家安全。如实申报不会自动导致拒签。',
        options: [
          { value: 'yes', label: '是' },
          { value: 'no', label: '否' }
        ]
      },
      { name: 'terrorismDetails', label: '请说明详情', type: 'textarea', required: false },
      { 
        name: 'hasViolentBehavior', 
        label: '是否有暴力或破坏行为', 
        type: 'radio', 
        required: true, 
        highRisk: true,
        options: [
          { value: 'yes', label: '是' },
          { value: 'no', label: '否' }
        ]
      },
      { 
        name: 'hasDrugRelated', 
        label: '是否涉及毒品相关活动', 
        type: 'radio', 
        required: true, 
        highRisk: true,
        warning: '请如实回答。持有或使用毒品史不会自动导致拒签。',
        options: [
          { value: 'yes', label: '是' },
          { value: 'no', label: '否' }
        ]
      },
      { 
        name: 'hasCommunicableDisease', 
        label: '是否有传染性疾病', 
        type: 'radio', 
        required: true, 
        highRisk: true,
        options: [
          { value: 'yes', label: '是' },
          { value: 'no', label: '否' }
        ]
      },
      { 
        name: 'hasMentalHealthIssue', 
        label: '是否有严重精神障碍', 
        type: 'radio', 
        required: true, 
        highRisk: true,
        options: [
          { value: 'yes', label: '是' },
          { value: 'no', label: '否' }
        ]
      }
    ]
  },
  11: {
    title: '以往旅行',
    description: '请如实填写您以往的美国入境和签证历史。',
    tips: [
      '以住签证记录会被核实，请确保信息准确',
      '拒签历史不会自动导致再次拒签，但必须如实申报'
    ],
    fields: [
      { 
        name: 'previousUsVisit', 
        label: '是否曾去过美国', 
        type: 'radio', 
        required: true, 
        highRisk: true,
        warning: '请如实填写入境记录。签证官可查验您的旅行历史。',
        options: [
          { value: 'yes', label: '是' },
          { value: 'no', label: '否' }
        ]
      },
      { name: 'previousVisitDates', label: '上次访问日期', type: 'date', required: false },
      { name: 'previousVisaType', label: '上次签证类型', type: 'text', required: false, placeholder: '如：B1/B2' },
      { 
        name: 'previousVisaDenial', 
        label: '是否曾被美国拒签', 
        type: 'radio', 
        required: true, 
        highRisk: true,
        warning: '拒签历史必须如实申报。拒签后重新申请是可以的，但隐瞒拒签史将导致严重后果。',
        options: [
          { value: 'yes', label: '是' },
          { value: 'no', label: '否' }
        ]
      },
      { name: 'denialDetails', label: '请说明拒签详情', type: 'textarea', required: false, placeholder: '请简要说明拒签原因和时间' },
      { 
        name: 'currentUsVisa', 
        label: '当前是否有美国签证', 
        type: 'radio', 
        required: true, 
        highRisk: true,
        options: [
          { value: 'yes', label: '是' },
          { value: 'no', label: '否' }
        ]
      },
      { 
        name: 'immigrationApplication', 
        label: '是否申请过美国移民', 
        type: 'radio', 
        required: true, 
        highRisk: true,
        options: [
          { value: 'yes', label: '是' },
          { value: 'no', label: '否' }
        ]
      }
    ]
  },
  12: {
    title: '照片确认',
    description: '请上传符合美国签证要求的照片。',
    tips: [
      '照片必须为正方形，白色或浅色背景',
      '照片必须最近6个月内拍摄',
      '表情自然，双眼睁开，不能戴眼镜'
    ],
    fields: [
      { 
        name: 'hasDigitalPhoto', 
        label: '是否有符合要求的电子照片', 
        type: 'radio', 
        required: true, 
        options: [
          { value: 'yes', label: '有' },
          { value: 'no', label: '没有' }
        ]
      },
      { name: 'photoPath', label: '上传照片', type: 'file', required: false, hint: '支持 JPG 格式，最大 240KB，建议尺寸：600x600 像素' },
      { 
        name: 'photoConfirmed', 
        label: '确认照片符合要求', 
        type: 'radio', 
        required: true, 
        options: [
          { value: 'yes', label: '确认' },
          { value: 'no', label: '不确认' }
        ]
      }
    ]
  }
}

const currentStepConfig = computed(() => stepConfigs[currentStep.value] || stepConfigs[1])

// Update form data
const updateField = (field: string, value: any) => {
  formStore.updateField(formStore.currentStepData as keyof FormData, field, value)
  errors.value[field] = ''
}

// Watch for form data changes
watch(formData, (newData) => {
  Object.keys(newData).forEach(key => {
    updateField(key, newData[key])
  })
}, { deep: true })

const validateForm = () => {
  errors.value = {}
  const config = currentStepConfig.value
  let isValid = true
  
  config.fields.forEach((field: any) => {
    if (field.required && !formData.value[field.name]) {
      errors.value[field.name] = '此字段为必填项'
      isValid = false
    }
  })
  
  return isValid
}

const handleNext = () => {
  if (!validateForm()) return
  
  if (currentStep.value === 12) {
    // Final step - show sync option
    formStore.nextStep()
    router.push('/app/form/step-12-confirmation')
  } else {
    formStore.nextStep()
    router.push(`/app/form/step-${currentStep.value + 1}`)
  }
}

const handlePrev = () => {
  if (currentStep.value > 1) {
    formStore.prevStep()
    router.push(`/app/form/step-${currentStep.value - 1}`)
  }
}

const handleSave = () => {
  formStore.saveDraft()
}

const goToDashboard = () => {
  router.push('/app/dashboard')
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = formData.value
      data['photoPath'] = e.target?.result as string
      updateField('photoPath', e.target?.result)
    }
    reader.readAsDataURL(file)
  }
}

const handleFileDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      updateField('photoPath', e.target?.result)
    }
    reader.readAsDataURL(file)
  }
}
</script>
