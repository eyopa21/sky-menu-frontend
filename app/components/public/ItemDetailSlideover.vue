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
      content: 'max-w-2xl mx-auto h-[85vh] rounded-t-[3rem]' 
    }"
  >
    <template #body>
      <div v-if="item" class="h-full bg-zinc-950 flex flex-col overflow-hidden -m-6 rounded-t-[3rem]">
        <!-- Close Handle (Visual indicator) -->
        <div class="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/20 rounded-full z-50 pointer-events-none" />
        
        <div class="flex-1 overflow-y-auto no-scrollbar pb-8">
          <!-- Item Image Gallery -->
          <div class="relative h-[30vh] bg-zinc-900 overflow-hidden">
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
            <div v-else class="size-full flex items-center justify-center">
              <UIcon name="i-heroicons-photo" class="size-16 text-zinc-800" />
            </div>

            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
            
            <UButton
              color="neutral"
              variant="soft"
              icon="i-heroicons-x-mark"
              circular
              size="sm"
              class="absolute top-5 right-5 backdrop-blur-md bg-zinc-900/50 z-50"
              @click="isOpen = false"
            />
          </div>

          <div class="px-6 py-8 space-y-8">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-2">
                <h2 class="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                  {{ item.name }}
                </h2>
                <div v-if="item.tags?.length" class="flex flex-wrap gap-2">
                  <span 
                    v-for="tag in item.tags" 
                    :key="tag"
                    class="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10"
                    :style="{ color: project.accentColor || '#3b82f6', borderColor: (project.accentColor || '#3b82f6') + '20' }"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="text-2xl font-black font-mono tracking-tighter whitespace-nowrap" :style="{ color: project.accentColor || '#3b82f6' }">
                {{ project.currency }} {{ item.price }}
              </div>
            </div>

            <p v-if="item.description" class="text-lg text-gray-400 font-medium leading-relaxed">
              {{ item.description }}
            </p>

            <div class="grid grid-cols-2 gap-3">
              <div v-if="item.calories" class="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                <div class="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <UIcon name="i-heroicons-fire" class="size-5 text-orange-500" />
                </div>
                <div>
                  <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Calories</p>
                  <p class="text-base font-bold text-white">{{ item.calories }} kcal</p>
                </div>
              </div>
              <div v-if="item.preparationTime" class="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                <div class="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <UIcon name="i-heroicons-clock" class="size-5 text-blue-500" />
                </div>
                <div>
                  <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest">Prep Time</p>
                  <p class="text-base font-bold text-white">{{ item.preparationTime }} min</p>
                </div>
              </div>
            </div>

            <div v-if="item.allergens?.length" class="space-y-3">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-gray-500">Allergens</h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="allergen in item.allergens" 
                  :key="allergen"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/5 text-red-500 border border-red-500/10 rounded-lg text-[10px] font-black uppercase tracking-widest"
                >
                  <div class="size-1 rounded-full bg-red-500" />
                  {{ allergen }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Area -->
        <div class="p-6 bg-zinc-900 border-t border-white/5 flex items-center justify-between gap-4 pb-10">
          <div class="flex flex-col">
            <span class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Status</span>
            <div class="flex items-center gap-2">
              <div class="size-2 rounded-full" :class="item.isAvailable ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'" />
              <span class="text-xs font-black uppercase text-white tracking-widest">{{ item.isAvailable ? 'Available' : 'Sold Out' }}</span>
            </div>
          </div>
          <UButton
            size="lg"
            label="Close"
            color="neutral"
            variant="soft"
            class="px-8 bg-white/5 hover:bg-white/10 font-black uppercase tracking-widest text-xs rounded-2xl"
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
