<script setup lang="ts">
import type { Project } from '~/repositories/projects/response/projects'
import type { MenuItem } from '~/repositories/menu-items/response/menu-items'
import type { Category } from '~/repositories/categories/response/categories'

const props = defineProps<{
  project: Project
  categories: Category[]
  menuItemsByCategory: Record<number, MenuItem[]>
}>()

const emit = defineEmits<{
  (e: 'openItemDetail', item: MenuItem): void
}>()
</script>

<template>
  <div class="min-h-screen bg-app-bg text-gray-900 font-sans p-8 md:p-16">
    <header class="max-w-3xl mx-auto space-y-8 mb-20 text-center">
      <div v-if="project.logo" class="size-24 mx-auto rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <img :src="project.logo" class="size-full object-cover" />
      </div>
      <div class="space-y-3">
        <h1 class="text-5xl font-black tracking-tight uppercase italic leading-none">{{ project.title }}</h1>
        <p class="text-gray-400 text-sm font-bold uppercase tracking-[0.2em]">{{ project.description }}</p>
      </div>
    </header>

    <main class="max-w-3xl mx-auto space-y-24">
      <section 
        v-for="cat in categories.filter(c => menuItemsByCategory[c.id]?.length > 0)" 
        :key="cat.id"
        class="space-y-10"
      >
        <h2 
          class="text-2xl font-black border-b-4 pb-4 inline-block pr-12 uppercase tracking-[0.2em] italic"
          :style="{ borderBottomColor: project.primaryColor || '#111827', color: project.primaryColor || '#111827' }"
        >
          {{ cat.name }}
        </h2>
        
        <div class="divide-y divide-gray-100">
          <div 
            v-for="item in menuItemsByCategory[cat.id]" 
            :key="item.id"
            class="py-10 flex justify-between gap-10 group cursor-pointer hover:bg-gray-50/50 transition-colors px-4 -mx-4 rounded-xl"
            @click="emit('openItemDetail', item)"
          >
            <div class="space-y-3 flex-1">
              <h3 
                class="text-2xl font-black uppercase tracking-tight transition-colors leading-none italic group-hover:opacity-70"
                :style="{ color: project.primaryColor || '#111827' }"
              >
                {{ item.name }}
              </h3>
              <p class="text-gray-500 text-sm leading-relaxed font-medium opacity-80 line-clamp-2">{{ item.description }}</p>
              
              <div v-if="item.tags?.length" class="flex gap-2 pt-1">
                <span 
                  v-for="tag in item.tags" 
                  :key="tag" 
                  class="text-[8px] font-black uppercase tracking-widest"
                  :style="{ color: project.accentColor || '#d1d5db' }"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="text-right shrink-0 flex flex-col items-end gap-2">
               <span 
                class="text-xl font-black tracking-tighter"
                :style="{ color: project.primaryColor || '#111827' }"
               >
                {{ project.currency }} {{ item.price }}
               </span>
               <div v-if="!item.isAvailable" class="text-[9px] text-red-500 font-extrabold uppercase tracking-widest bg-red-50 px-2 py-1 rounded">Sold Out</div>
               <UButton 
                 v-else
                 label="Detail" 
                 variant="ghost" 
                 size="xs" 
                 class="opacity-0 group-hover:opacity-100 transition-opacity font-black uppercase tracking-widest text-[9px]" 
                 :style="{ color: project.accentColor || project.primaryColor || '#111827' }"
               />
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="max-w-3xl mx-auto mt-40 py-16 border-t border-gray-100 text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] space-y-4">
      <div class="flex justify-center gap-10">
        <p v-if="project.address">{{ project.address }}</p>
        <p v-if="project.phone">{{ project.phone }}</p>
      </div>
      <p>&copy; {{ new Date().getFullYear() }} {{ project.title }} — Powered by SkyMenu</p>
    </footer>
  </div>
</template>
