<script setup lang="ts">
import { feedbackRepository } from '~/repositories/feedback'
import type { FeedbackStats } from '~/repositories/feedback/response/feedback'

const props = defineProps<{
  projectId: number
  primaryColor?: string
}>()

const { $api } = useNuxtApp()
const feedbackRepo = feedbackRepository($api)

const { data: stats, refresh } = await useAsyncData(
  `feedback-stats-${props.projectId}`,
  () => feedbackRepo.getProjectFeedbackStats(props.projectId)
)

defineExpose({ refresh })
</script>

<template>
  <div v-if="stats" class="flex flex-col items-center text-center space-y-4 py-12">
    <div class="space-y-1">
      <div class="flex items-center justify-center gap-2">
        <span class="text-6xl font-black tracking-tighter" :style="{ color: primaryColor || '#2d241c' }">
          {{ stats.averageRating || 0 }}
        </span>
        <div class="flex flex-col items-start">
           <div class="flex text-amber-400">
             <UIcon v-for="i in 5" :key="i" :name="i <= Math.round(stats.averageRating) ? 'i-heroicons-star-20-solid' : 'i-heroicons-star-20-solid'" :class="i <= Math.round(stats.averageRating) ? 'text-amber-400' : 'text-gray-200'" class="size-6" />
           </div>
           <span class="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{{ stats.total }} Reviews</span>
        </div>
      </div>
      <h3 class="text-xl font-black uppercase tracking-tight text-gray-900 italic">Customer Love</h3>
    </div>
    <p class="text-sm text-gray-500 max-w-xs font-medium leading-relaxed">
      We pride ourselves on providing the best experience for our customers.
    </p>
  </div>
</template>
