<script setup lang="ts">
import { feedbackRepository } from '~/repositories/feedback'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const { $api } = useNuxtApp()
const feedbackRepo = feedbackRepository($api)
const toast = useToast()

const id = computed(() => +route.params.id)

const { data: feedback, pending, error } = await useAsyncData(
  `feedback-detail-${id.value}`,
  () => feedbackRepo.getFeedbackById(id.value)
)

const isImageModalOpen = ref(false)
const selectedImage = ref('')

const openImage = (url: string) => {
  selectedImage.value = url
  isImageModalOpen.value = true
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goBack = () => {
  navigateTo('/dashboard/feedbacks')
}

// Metadata for SEO
useHead({
  title: feedback.value ? `Feedback from ${feedback.value.name}` : 'Feedback Details',
})
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-12 pb-32">
    <!-- Navigation / Breadcrumbs -->
    <div class="flex items-center justify-between">
      <UButton 
        label="Back to Feedbacks" 
        variant="ghost" 
        color="neutral" 
        icon="i-heroicons-arrow-left" 
        class="rounded-xl font-black text-xs uppercase tracking-widest pl-0" 
        @click="goBack" 
      />
      
      <div v-if="feedback" class="flex items-center gap-3">
         <div class="h-10 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <span class="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">ID: #{{ feedback.id }}</span>
         </div>
      </div>
    </div>

    <div v-if="pending" class="space-y-12 animate-pulse">
       <div class="h-40 bg-white/5 rounded-[40px]" />
       <div class="h-80 bg-white/5 rounded-[40px]" />
    </div>

    <div v-else-if="feedback" class="space-y-10 animate-fade-in">
       <!-- Customer Profile Banner -->
       <div class="p-[1px] rounded-[48px] bg-gradient-to-br from-white/10 to-transparent">
          <div class="bg-app-section/80 backdrop-blur-3xl rounded-[47px] p-10 md:p-14 flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-14">
             <div class="size-32 rounded-[40px] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl relative group overflow-hidden">
                <span class="text-6xl font-black text-emerald-400 relative z-10">{{ feedback.name.charAt(0).toUpperCase() }}</span>
                <div class="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
             
             <div class="flex-1 text-center md:text-left space-y-4">
                <div class="space-y-2">
                   <h1 class="text-5xl font-black text-white tracking-tight uppercase italic leading-none">{{ feedback.name }}</h1>
                   <div class="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">{{ feedback.email || 'Guest User' }}</span>
                      <div class="size-1.5 rounded-full bg-white/10" />
                      <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">{{ formatDate(feedback.createdAt) }}</span>
                   </div>
                </div>

                <div class="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div class="flex text-amber-400 gap-1 bg-white/[0.03] px-4 py-2 rounded-2xl border border-white/5">
                        <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-20-solid" :class="i <= feedback.rating ? 'text-amber-400' : 'text-gray-800'" class="size-6" />
                        <span class="ml-2 font-black text-white">{{ feedback.rating }}.0</span>
                    </div>

                    <UButton 
                      :label="feedback.project?.title" 
                      variant="soft" 
                      color="emerald" 
                      icon="i-heroicons-paper-clip"
                      class="rounded-xl font-bold"
                    />
                </div>
             </div>
          </div>
       </div>

       <!-- Feedback Content -->
       <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div class="lg:col-span-8 space-y-10">
             <div class="p-10 bg-white/[0.03] rounded-[40px] border border-white/5 space-y-8">
                <div class="flex items-center gap-3 px-2">
                   <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="size-5 text-emerald-500" />
                   <h3 class="text-sm font-black uppercase tracking-widest text-white/60">Customer Narrative</h3>
                </div>
                <p class="text-2xl text-gray-300 leading-relaxed font-medium pl-2 italic">
                  "{{ feedback.comment }}"
                </p>
             </div>

             <!-- Photo Evidence -->
             <div v-if="feedback.images?.length" class="space-y-6">
                <div class="flex items-center gap-3 px-4">
                   <UIcon name="i-heroicons-camera" class="size-5 text-emerald-500" />
                   <h3 class="text-sm font-black uppercase tracking-widest text-white/60">Uploaded Evidence ({{ feedback.images.length }})</h3>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
                   <div 
                      v-for="(img, idx) in feedback.images" 
                      :key="idx" 
                      class="relative aspect-square rounded-[32px] overflow-hidden border border-white/10 group cursor-pointer"
                      @click="openImage(img)"
                   >
                      <img :src="img" class="size-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <UIcon name="i-heroicons-magnifying-glass-plus" class="size-8 text-white" />
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <!-- Sidebar Info -->
          <div class="lg:col-span-4 space-y-10">
             <div class="p-8 bg-emerald-500/5 rounded-[40px] border border-emerald-500/10 space-y-8">
                <div class="space-y-4">
                   <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60">Action Required</h4>
                   <p class="text-gray-400 text-sm font-medium leading-relaxed">Consider responding to this user if they provided an email address or address the issues mentioned.</p>
                   <UButton 
                      v-if="feedback.email"
                      :label="`Email ${feedback.name}`" 
                      block 
                      color="emerald" 
                      variant="solid" 
                      class="rounded-2xl font-black uppercase py-4" 
                   />
                </div>
                
                <div class="h-px bg-emerald-500/10 w-full" />
                
                <div class="space-y-4">
                   <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60">Source Project</h4>
                   <div class="flex items-center gap-4">
                      <div class="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                         <img v-if="feedback.project?.logo" :src="feedback.project.logo" class="size-full object-cover" />
                         <UIcon v-else name="i-heroicons-rocket-launch" class="size-6 text-gray-700" />
                      </div>
                      <div class="min-w-0">
                         <p class="text-white font-black truncate">{{ feedback.project?.title }}</p>
                         <NuxtLink :to="`/projects/${feedback.projectId}`" class="text-[10px] text-emerald-400 font-bold uppercase hover:underline">View Project Dashboard</NuxtLink>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>

    <!-- Error State -->
    <div v-else class="py-40 text-center space-y-6">
       <div class="size-20 rounded-3xl bg-red-500/10 mx-auto flex items-center justify-center border border-red-500/20">
          <UIcon name="i-heroicons-exclamation-triangle" class="size-10 text-red-500/50" />
       </div>
       <h3 class="text-3xl font-black text-white tracking-tight">Transmission <span class="text-red-500">Lost</span></h3>
       <p class="text-gray-500 font-medium max-w-sm mx-auto">
         We couldn't retrieve the details for this specific feedback. It might have been intercepted or moved.
       </p>
       <UButton label="Return to Dashboard" variant="ghost" color="neutral" class="font-black uppercase text-xs" @click="goBack" />
    </div>

    <!-- Image Modal -->
    <UModal v-model:open="isImageModalOpen" :ui="{ width: 'max-w-6xl' }">
      <div class="p-4 space-y-4">
        <div class="flex justify-end">
            <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" size="xl" @click="isImageModalOpen = false" />
        </div>
        <div class="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-app-bg">
           <img :src="selectedImage" class="w-full h-auto max-h-[80vh] object-contain mx-auto shadow-2xl" />
        </div>
      </div>
    </UModal>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
