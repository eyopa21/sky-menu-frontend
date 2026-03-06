<script setup lang="ts">
const props = defineProps<{
  title: string
  description: string
  confirmButtonText?: string
  cancelButtonText?: string
  loading?: boolean
  color?: 'error' | 'warning' | 'primary' | 'success' | 'neutral'
}>()

const emit = defineEmits(['confirm', 'cancel'])
const isOpen = defineModel<boolean>('open', { default: false })

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  isOpen.value = false
  emit('cancel')
}
</script>

<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <div class="p-8 space-y-8 text-center bg-[#0d0d0f] border border-white/10 rounded-[32px] overflow-hidden">
        <div class="mx-auto size-20 rounded-3xl bg-red-500/10 flex items-center justify-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="size-10 text-red-500" />
        </div>
        
        <div class="space-y-3">
          <h3 class="text-2xl font-black text-white uppercase tracking-tighter">{{ title }}</h3>
          <p class="text-zinc-500 font-medium leading-relaxed">{{ description }}</p>
        </div>

        <div class="flex flex-col gap-4 pt-4">
          <UButton
            :label="confirmButtonText || 'Confirm Action'"
            :color="color || 'error'"
            block
            size="xl"
            class="rounded-2xl font-black uppercase tracking-widest text-[11px] py-4 shadow-lg active:scale-95 transition-all"
            :loading="loading"
            @click="onConfirm"
          />
          <UButton
            :label="cancelButtonText || 'Cancel'"
            variant="ghost"
            color="neutral"
            block
            size="xl"
            class="rounded-2xl font-bold uppercase tracking-widest text-[10px] py-3 opacity-60 hover:opacity-100 transition-all"
            @click="onCancel"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
