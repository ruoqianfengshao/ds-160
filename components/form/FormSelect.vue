<template>
  <div class="mb-4">
    <label 
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      <div class="flex items-baseline gap-2">
        <span>{{ label }}</span>
        <span v-if="required" class="text-red-500">*</span>
      </div>
      <div v-if="secondaryLabel" class="text-xs text-gray-500 font-normal mt-0.5">
        {{ secondaryLabel }}
      </div>
    </label>

    <select
      :id="selectId"
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :required="required"
      :disabled="disabled"
      :class="[
        'input-field',
        {
          'opacity-50 cursor-not-allowed': disabled,
          'text-gray-400': !modelValue
        }
      ]"
    >
      <option value="" disabled>{{ placeholder || 'Select an option' }}</option>
      <option 
        v-for="option in options" 
        :key="typeof option === 'string' ? option : option.value"
        :value="typeof option === 'string' ? option : option.value"
      >
        {{ typeof option === 'string' ? option : option.label }}
      </option>
    </select>

    <p v-if="hint" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
type Option = string | { value: string; label: string }

interface Props {
  label?: string
  secondaryLabel?: string
  modelValue: string
  options: Option[]
  placeholder?: string
  required?: boolean
  disabled?: boolean
  hint?: string
}

withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectId = computed(() => `select-${Math.random().toString(36).substring(7)}`)
</script>
