<script setup lang="ts">
import { feedbackRepository } from '~/repositories/feedback'
import { projectsRepository } from '~/repositories/projects'

definePageMeta({
  layout: 'dashboard',
})

const { $api } = useNuxtApp()
const feedbackRepo = feedbackRepository($api)
const projectsRepo = projectsRepository($api)

const page = ref(1)
const limit = ref(10)
const selectedProjectId = ref<number | null>(null)

const { data: projectsData } = await useAsyncData('dashboard-projects-filter', () => projectsRepo.getMyProjects())
const projects = computed(() => projectsData.value || [])

const { data: feedbackPagination, pending, refresh } = await useAsyncData(
  'dashboard-feedbacks-list',
  () => feedbackRepo.getPaginatedFeedbacks({
    page: page.value,
    limit: limit.value,
    projectId: selectedProjectId.value || undefined,
  }),
  { watch: [page, selectedProjectId] }
)

const feedbacks = computed(() => feedbackPagination.value?.data || [])
const totalFeedbacks = computed(() => feedbackPagination.value?.total || 0)
const lastPage = computed(() => feedbackPagination.value?.lastPage || 1)

const projectOptions = computed(() => [
  { label: 'All Projects', value: null },
  ...projects.value.map(p => ({ label: p.title, value: p.id }))
])

const getProjectTitle = (projectId: number) => {
  const p = projects.value.find(p => p.id === projectId)
  return p ? p.title : `Project #${projectId}`
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="space-y-10 pb-20">
    <!-- Header Section -->
    <div class="relative rounded-[32px] overflow-hidden p-8 md:p-12 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06]">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div>
          <h1 class="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Customer <span class="text-emerald-400">Feedbacks</span>
          </h1>
          <p class="text-gray-400 font-medium max-w-lg leading-relaxed">
            Global insights from all your establishments. Monitor satisfaction, track trends, and respond to your customers.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div class="w-full sm:w-64">
             <USelectMenu
                v-model="selectedProjectId"
                :options="projectOptions"
                value-attribute="value"
                option-attribute="label"
                placeholder="Filter by Project"
                size="xl"
                class="w-full"
                icon="i-heroicons-funnel"
                :ui-menu="{ 
                  content: 'rounded-2xl bg-app-section border-white/10 text-white',
                }"
             />
          </div>
          <UButton 
            icon="i-heroicons-arrow-path" 
            variant="soft" 
            color="primary" 
            size="xl" 
            class="rounded-2xl px-6" 
            :loading="pending"
            @click="() => refresh()" 
          />
        </div>
      </div>
      <!-- Decorative Glow -->
      <div class="absolute -top-24 -right-24 size-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
    </div>

    <!-- Feedbacks List -->
    <div v-if="feedbacks.length" class="space-y-6">
      <div 
        v-for="feedback in feedbacks" 
        :key="feedback.id" 
        class="group relative p-[1px] rounded-[32px] bg-gradient-to-br from-white/5 to-transparent hover:from-emerald-500/20 transition-all duration-500 cursor-pointer"
        @click="navigateTo(`/dashboard/feedbacks/${feedback.id}`)"
      >
        <div class="bg-app-section/60 backdrop-blur-3xl rounded-[31px] p-8 space-y-6">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div class="flex items-center gap-5">
              <div class="size-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 font-black text-2xl shadow-lg">
                {{ feedback.name.charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0">
                <h4 class="font-black text-white text-xl tracking-tight leading-none mb-1.5">{{ feedback.name }}</h4>
                <div class="flex items-center gap-3">
                  <span class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{{ formatDate(feedback.createdAt) }}</span>
                  <div class="size-1 rounded-full bg-white/10" />
                  <span class="text-[10px] text-emerald-500 font-black uppercase tracking-tighter bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10">
                    {{ feedback.project?.title || getProjectTitle(feedback.projectId) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-end gap-2">
                <div class="flex text-amber-400 gap-0.5">
                  <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-20-solid" :class="i <= feedback.rating ? 'text-amber-400' : 'text-gray-700'" class="size-5" />
                </div>
                <span class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{{ feedback.email || 'Anonymous Guest' }}</span>
            </div>
          </div>

          <div class="relative">
             <div class="absolute -left-4 top-0 bottom-0 w-1 bg-emerald-500/20 rounded-full" />
             <p class="text-gray-300 leading-relaxed font-medium pl-2 italic">
               "{{ feedback.comment.length > 200 ? feedback.comment.substring(0, 200) + '...' : feedback.comment }}"
             </p>
          </div>

          <div v-if="feedback.images?.length" class="flex items-center gap-3">
             <div v-for="(img, idx) in feedback.images.slice(0, 4)" :key="idx" class="size-16 rounded-xl overflow-hidden border border-white/10 group-hover:scale-105 transition-transform duration-500">
               <img :src="img" class="size-full object-cover opacity-60 group-hover:opacity-100" />
             </div>
             <div v-if="feedback.images.length > 4" class="size-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-gray-400">
                +{{ feedback.images.length - 4 }}
             </div>
          </div>
          
          <div class="flex items-center justify-end">
             <UButton label="View Details" variant="ghost" color="neutral" icon="i-heroicons-arrow-right" trailing class="rounded-xl font-bold text-xs" />
          </div>
        </div>
      </div>

      <!-- Pagination Core -->
      <div v-if="lastPage > 1" class="flex items-center justify-center pt-10">
        <UPagination 
          v-model="page" 
          :total="totalFeedbacks" 
          :page-count="limit" 
          size="lg"
          :ui="{
            root: 'rounded-xl',
          }"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!pending" class="flex flex-col items-center justify-center py-40 rounded-[40px] border-2 border-dashed border-white/5 text-center px-6">
       <div class="relative mb-8">
          <div class="absolute -inset-6 bg-emerald-500/5 blur-3xl rounded-full" />
          <div class="size-24 rounded-3xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10">
             <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="size-12 text-emerald-500/20" />
          </div>
       </div>
       <h3 class="text-3xl font-black text-white tracking-tight">Silence is <span class="text-emerald-400">Golden</span></h3>
       <p class="text-gray-500 font-medium max-w-sm mt-4 leading-relaxed">
         No feedbacks found for your selection. Once customers start sharing their experience, they'll appear here.
       </p>
       <UButton 
          v-if="selectedProjectId" 
          label="Clear Filter" 
          variant="ghost" 
          color="primary" 
          class="mt-10 font-black uppercase text-xs tracking-widest" 
          @click="selectedProjectId = null" 
       />
    </div>
  </div>
</template>
