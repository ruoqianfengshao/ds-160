<template>
  <div 
    class="relative"
    :class="{ 'mb-4': !noMargin }"
  >
    <label 
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- High-risk field warning -->
    <div 
      v-if="isHighRisk"
      class="mb-2 p-3 bg-warning-50 border-l-4 border-warning-500 rounded"
    >
      <div class="flex items-start">
        <svg class="w-5 h-5 text-warning-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-semibold text-warning-800 mb-1">
            {{ highRiskInfo.reason }}
          </p>
          <ul class="text-xs text-warning-700 space-y-1">
            <li v-for="(tip, idx) in highRiskInfo.tips" :key="idx" class="flex items-start">
              <span class="mr-1">•</span>
              <span>{{ tip }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="[
        'input-field',
        {
          'input-high-risk': isHighRisk,
          'opacity-50 cursor-not-allowed': disabled
        }
      ]"
    />

    <p v-if="hint" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useDS160Store } from '~/stores/ds160'

interface Props {
  label?: string
  modelValue: string | number
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  hint?: string
  fieldPath?: string
  noMargin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  noMargin: false,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const store = useDS160Store()
const inputId = computed(() => `input-${Math.random().toString(36).substring(7)}`)

const highRiskInfo = computed(() => {
  if (!props.fieldPath) return null
  return store.isHighRiskField(props.fieldPath)
})

const isHighRisk = computed(() => !!highRiskInfo.value)
</script>
