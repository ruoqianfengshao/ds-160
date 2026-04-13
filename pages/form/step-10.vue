<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation :current-step="10" step-title="照片上传" />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-2">照片上传</h2>
        <p class="text-sm text-gray-500 mb-6">Photo Upload</p>
        <p class="text-gray-600 mb-8">请上传符合要求的签证照片。</p>
        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-lg font-medium text-gray-700 mb-2">上传照片 / Upload Photo</p>
            <p class="text-sm text-gray-500 mb-4">支持 JPG, JPEG 格式，文件大小不超过 240KB</p>
            <input type="file" accept="image/jpeg,image/jpg" class="hidden" @change="handleFileUpload" ref="fileInput" />
            <button type="button" @click="$refs.fileInput.click()" class="btn-primary">选择文件 / Choose File</button>
          </div>
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h4 class="font-semibold text-blue-900 mb-2">照片要求 / Photo Requirements:</h4>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• 尺寸：2x2英寸（51x51mm）/ Size: 2x2 inches (51x51mm)</li>
              <li>• 分辨率：600x600像素 / Resolution: 600x600 pixels</li>
              <li>• 白色或浅色背景 / White or off-white background</li>
              <li>• 6个月内拍摄 / Taken within 6 months</li>
              <li>• 正面照，眼睛直视镜头 / Front view, eyes looking at camera</li>
            </ul>
          </div>
          <div class="text-sm text-gray-500 text-center py-4">
            <svg class="w-4 h-4 inline mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            您的填写进度会自动保存
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useDS160Store } from '~/stores/ds160'
definePageMeta({ layout: 'default' })
const store = useDS160Store()
const router = useRouter()
const fileInput = ref(null)
const formData = reactive({
  photoUploaded: store.formData.photoConfirmation.photoUploaded || false,
  photoUrl: store.formData.photoConfirmation.photoUrl || '',
})
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    formData.photoUploaded = true
    formData.photoUrl = URL.createObjectURL(file)
    store.updateStepData(10, formData)
  }
}
watch(formData, () => { store.updateStepData(10, formData) }, { deep: true })
function saveAndContinue() {
  store.updateStepData(10, formData)
  store.goToStep(11)
  router.push('/form/step-11')
}
onMounted(() => {
  store.initializeFromStorage()
  store.goToStep(10)
})
</script>
