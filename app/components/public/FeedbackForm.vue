<script setup lang="ts">
import { feedbackRepository } from '~/repositories/feedback'

const props = defineProps<{
  projectId: number
  primaryColor?: string
}>()

const emit = defineEmits(['success'])

const { $api } = useNuxtApp()
const { uploadFile } = useFileUploader()
const feedbackRepo = feedbackRepository($api)
const toast = useToast()

const loading = ref(false)
const rating = ref(5)
const feedbackFiles = ref<File[]>([])

const state = reactive({
  name: '',
  email: '',
  comment: '',
})

const setRating = (val: number) => {
  rating.value = val
}

async function onSubmit() {
  try {
    loading.value = true
    
    // Upload images first
    const uploadPromises = feedbackFiles.value.map(file => uploadFile(file))
    const uploadResults = await Promise.allSettled(uploadPromises)
    
    const imageUrls = uploadResults
      .filter(res => res.status === 'fulfilled' && res.value)
      .map(res => (res as PromiseFulfilledResult<{ url: string }>).value.url)

    await feedbackRepo.submitFeedback({
      projectId: props.projectId,
      name: state.name,
      email: state.email || undefined,
      rating: rating.value,
      comment: state.comment,
      images: imageUrls,
    })

    toast.add({ title: 'Feedback submitted! Thank you.', color: 'success' })
    
    // Reset form
    state.name = ''
    state.email = ''
    state.comment = ''
    rating.value = 5
    feedbackFiles.value = []
    
    emit('success')
  } catch (err) {
    console.error('Submit feedback:', err)
    toast.add({ title: 'Failed to submit feedback.', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-app-section rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-white/5 transition-colors duration-500">
    <div class="space-y-8">
      <div class="text-center space-y-2">
        <h3 class="text-3xl font-black italic uppercase tracking-tight text-gray-900 dark:text-white">Share your experience</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Your feedback helps us improve our service and quality.</p>
      </div>

      <div class="flex justify-center gap-2">
        <button 
          v-for="i in 5" 
          :key="i"
          type="button"
          class="size-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          :class="i <= rating ? 'text-amber-400' : 'text-gray-200'"
          @click="setRating(i)"
        >
          <UIcon 
            :name="i <= rating ? 'i-heroicons-star-20-solid' : 'i-heroicons-star-20-solid'" 
            class="size-10 pt-1" 
          />
        </button>
      </div>

      <UForm :state="state" class="space-y-6" @submit="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UFormField label="Name" name="name" required>
            <UInput 
              v-model="state.name" 
              placeholder="Your name" 
              class="w-full"
              size="lg"
              variant="outline"
              :ui="{ base: 'rounded-2xl' }"
            />
          </UFormField>
          <UFormField label="Email (Optional)" name="email">
            <UInput 
              v-model="state.email" 
              type="email" 
              placeholder="your@email.com" 
              class="w-full"
              size="lg"
              variant="outline"
              :ui="{ base: 'rounded-2xl' }"
            />
          </UFormField>
        </div>

        <UFormField label="Comment" name="comment" required>
          <UTextarea 
            v-model="state.comment" 
            placeholder="Tell us about your experience..." 
            class="w-full"
            :rows="4"
            variant="outline"
            :ui="{ base: 'rounded-2xl' }"
          />
        </UFormField>

        <UFormField label="Photos" name="images">
          <AppFileUploader 
            v-model:files="feedbackFiles" 
            name="images" 
            multiple 
            accept="image/*" 
          />
        </UFormField>

        <div class="pt-4">
          <UButton 
            type="submit" 
            label="Submit Feedback" 
            size="xl" 
            block 
            class="rounded-2xl font-black uppercase tracking-[0.2em] py-5 shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all"
            :style="{ 
              backgroundColor: primaryColor || '#4a3423',
              boxShadow: `0 20px 40px -12px ${primaryColor || '#4a3423'}4D`
            }"
            :loading="loading"
          />
        </div>
      </UForm>
    </div>
  </div>
</template>
