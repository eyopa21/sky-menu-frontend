<script setup lang="ts">
import type { Project } from '~/repositories/projects/response/projects'
import type { MenuItem } from '~/repositories/menu-items/response/menu-items'

const props = defineProps<{
  project: Project
  item: MenuItem | null
}>()

const isOpen = defineModel<boolean>('open', { default: false })
</script>

<template>
  <USlideover 
    v-model:open="isOpen" 
    side="bottom" 
    :ui="{ 
      content: 'max-w-xl mx-auto h-[80vh] rounded-t-[32px] overflow-hidden' 
    }"
  >
    <template #body>
      <div v-if="item" class="h-full bg-[#f1f0ee] flex flex-col overflow-hidden -m-6 rounded-t-[32px]">
        <!-- Close Handle -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300/50 rounded-full z-50 pointer-events-none" />
        
        <div class="flex-1 overflow-y-auto no-scrollbar pb-10">
          <!-- Item Image Gallery -->
          <div class="relative h-[35vh] bg-gray-200 overflow-hidden">
            <template v-if="item.images?.length">
              <UCarousel 
                v-slot="{ item: img }" 
                :items="item.images" 
                :ui="{ item: 'basis-full' }" 
                class="h-full"
                indicators
              >
                <img :src="img" class="size-full object-cover" draggable="false" />
              </UCarousel>
            </template>
            <div v-else class="size-full flex items-center justify-center bg-gray-200">
              <UIcon name="i-heroicons-photo" class="size-20 text-gray-300" />
            </div>

            <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f1f0ee] to-transparent" />
            
            <UButton
              color="neutral"
              variant="soft"
              icon="i-heroicons-x-mark"
              circular
              size="md"
              class="absolute top-6 right-6 backdrop-blur-xl bg-white/40 border border-white/20 z-50 shadow-xl"
              @click="isOpen = false"
            />
          </div>

          <div class="px-8 py-4 space-y-10">
            <div class="space-y-4">
              <div class="flex items-start justify-between gap-6">
                <h2 
                  class="text-4xl font-black italic uppercase tracking-tight leading-[0.9]"
                  :style="{ color: project.primaryColor || '#2d241c' }"
                >
                  {{ item.name }}
                </h2>
                <div 
                  class="text-3xl font-black tracking-tighter tabular-nums whitespace-nowrap"
                  :style="{ color: project.accentColor || project.primaryColor || '#4a3423' }"
                >
                  {{ project.currency }} {{ item.price }}
                </div>
              </div>
              
              <div v-if="item.tags?.length" class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in item.tags" 
                  :key="tag"
                  class="text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg bg-white border border-gray-200"
                  :style="{ color: project.accentColor || '#9ca3af' }"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="space-y-2">
               <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Composition</h4>
               <p v-if="item.description" class="text-lg text-gray-600 font-medium leading-[1.6] opacity-90">
                {{ item.description }}
               </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div v-if="item.calories" class="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div class="size-11 rounded-xl bg-orange-500/5 flex items-center justify-center border border-orange-500/10">
                  <UIcon name="i-heroicons-fire" class="size-6 text-orange-500" />
                </div>
                <div>
                  <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Calories</p>
                  <p 
                    class="text-lg font-black"
                    :style="{ color: project.primaryColor || '#2d241c' }"
                  >
                    {{ item.calories }} <span class="text-xs opacity-40 uppercase">kcal</span>
                  </p>
                </div>
              </div>
              <div v-if="item.preparationTime" class="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div class="size-11 rounded-xl bg-blue-500/5 flex items-center justify-center border border-blue-500/10">
                  <UIcon name="i-heroicons-clock" class="size-6 text-blue-500" />
                </div>
                <div>
                  <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Wait Time</p>
                  <p 
                    class="text-lg font-black"
                    :style="{ color: project.primaryColor || '#2d241c' }"
                  >
                    {{ item.preparationTime }} <span class="text-xs opacity-40 uppercase">min</span>
                  </p>
                </div>
              </div>
            </div>

            <div v-if="item.allergens?.length" class="space-y-4">
               <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Potential Allergens</h4>
               <div class="flex flex-wrap gap-2.5">
                 <span 
                   v-for="allergen in item.allergens" 
                   :key="allergen"
                   class="flex items-center gap-2 px-4 py-2 bg-red-500/[0.03] text-red-500/80 border border-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm"
                 >
                   <div class="size-1.5 rounded-full bg-red-400 animate-pulse" />
                   {{ allergen }}
                 </span>
               </div>
            </div>
          </div>
        </div>
        
        <!-- Action Area -->
        <div class="px-8 py-8 bg-white border-t border-gray-100 flex items-center justify-between gap-6 pb-12 shadow-[0_-12px_32px_-12px_rgba(0,0,0,0.05)]">
          <div class="flex flex-col">
            <span class="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1.5">Availability</span>
            <div class="flex items-center gap-2.5">
              <div class="size-2 rounded-full" :class="item.isAvailable ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]'" />
              <span 
                class="text-[11px] font-black uppercase tracking-widest"
                :style="{ color: project.primaryColor || '#2d241c' }"
              >
                {{ item.isAvailable ? 'In Stock Now' : 'Currently Unavailable' }}
              </span>
            </div>
          </div>
          <UButton
            size="xl"
            label="Dismiss"
            color="neutral"
            variant="solid"
            class="px-14 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-xl shadow-xl active:scale-95 transition-all"
            :style="{ 
              backgroundColor: project.primaryColor || '#4a3423',
              boxShadow: `0 20px 25px -5px ${(project.primaryColor || '#4a3423')}33`
            }"
            @click="isOpen = false"
          />
        </div>
      </div>
    </template>
  </USlideover>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
