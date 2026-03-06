<script setup lang="ts">
import { projectsRepository } from '~/repositories/projects'
import PaymentList from '~/components/public/PaymentList.vue'

const route = useRoute()
const { $api } = useNuxtApp()
const projectsRepo = projectsRepository($api)

const slug = computed(() => route.params.slug as string)

const { data: project, error } = await useAsyncData(
  `public-project-payment-${slug.value}`,
  () => projectsRepo.getProjectBySlug(slug.value)
)

if (error.value || !project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found or not published',
  })
}

const goBack = () => {
  navigateTo(`/menu/${slug.value}`)
}

useHead({
  title: `Payment Methods - ${project.value?.title || 'Menu'}`,
  meta: [
    { name: 'description', content: `View payment methods for ${project.value?.title}` }
  ]
})
</script>

<template>
  <div 
    v-if="project" 
    class="min-h-screen bg-app-bg selection:bg-emerald-500/20"
  >
    <!-- Simple Header -->
    <header class="sticky top-0 z-50 backdrop-blur-3xl border-b border-gray-100 dark:border-white/5 bg-app-bg/70">
       <div class="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
          <UButton 
            variant="ghost" 
            color="neutral" 
            icon="i-heroicons-arrow-left" 
            label="Back to Menu"
            class="rounded-xl font-black text-xs uppercase tracking-widest pl-0" 
            @click="goBack" 
          />
          <div class="flex items-center gap-3">
             <div 
               v-if="project.logo" 
               class="size-8 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10"
             >
                <img :src="project.logo" class="size-full object-cover" />
             </div>
             <span class="font-black text-sm tracking-tight text-gray-900 dark:text-white">{{ project.title }}</span>
          </div>
       </div>
    </header>

    <main class="max-w-3xl mx-auto px-6 py-12 space-y-16">
       <!-- Narrative Block -->
       <div class="space-y-4 text-center md:text-left">
          <h1 class="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Secure <span class="text-emerald-500">Payments</span>
          </h1>
          <p class="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed max-w-2xl">
            Choose your preferred way to pay. Scan QR codes for instant transactions or use the account details below.
          </p>
       </div>

       <!-- Payment List Section -->
       <div class="space-y-8 pb-32">
          <div class="flex items-center gap-3 px-2">
             <div class="h-6 w-1 bg-emerald-500 rounded-full" />
             <h3 class="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-white/40">Available Methods</h3>
          </div>
          
          <PaymentList 
            :project-id="project.id" 
            :primary-color="project.primaryColor || undefined" 
          />
       </div>
    </main>

    <!-- Background Decor (Light Theme) -->
    <div class="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-30 dark:opacity-0">
        <div class="absolute -top-24 -right-24 size-96 bg-emerald-100 blur-[100px] rounded-full" />
        <div class="absolute bottom-24 -left-24 size-96 bg-emerald-50 blur-[100px] rounded-full" />
    </div>
  </div>
</template>
