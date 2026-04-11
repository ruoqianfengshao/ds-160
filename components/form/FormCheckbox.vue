<template>
  <div class="mb-4">
    <label class="flex items-center cursor-pointer group">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
        :disabled="disabled"
        class="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500
               disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      />
      <span 
        class="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors"
        :class="{ 'opacity-50': disabled }"
      >
        {{ label }}
        <span v-if="required" class="text-red-500 ml-1">*</span>
      </span>
    </label>
    <p v-if="hint" class="mt-1 ml-8 text-sm text-gray-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  modelValue: boolean
  required?: boolean
  disabled?: boolean
  hint?: string
}

withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>
