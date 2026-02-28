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
  <div class="min-h-screen bg-white text-gray-900 font-sans p-6 md:p-12">
    <header class="max-w-3xl mx-auto space-y-6 mb-16 text-center">
      <div v-if="project.logo" class="size-20 mx-auto rounded-full overflow-hidden border border-gray-100 shadow-sm">
        <img :src="project.logo" class="size-full object-cover" />
      </div>
      <div>
        <h1 class="text-4xl font-bold tracking-tight">{{ project.title }}</h1>
        <p class="text-gray-500 mt-2">{{ project.description }}</p>
      </div>
    </header>

    <main class="max-w-3xl mx-auto space-y-20">
      <section 
        v-for="cat in categories.filter(c => menuItemsByCategory[c.id]?.length > 0)" 
        :key="cat.id"
        class="space-y-8"
      >
        <h2 class="text-2xl font-bold border-b-2 border-gray-900 pb-3 inline-block pr-8 uppercase tracking-widest">{{ cat.name }}</h2>
        
        <div class="divide-y divide-gray-100">
          <div 
            v-for="item in menuItemsByCategory[cat.id]" 
            :key="item.id"
            class="py-8 flex justify-between gap-8 group cursor-pointer"
            @click="emit('openItemDetail', item)"
          >
            <div class="space-y-2 flex-1">
              <h3 class="text-xl font-bold group-hover:text-emerald-600 transition-colors">{{ item.name }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{{ item.description }}</p>
            </div>
            <div class="text-right shrink-0">
               <span class="text-lg font-bold">{{ project.currency }} {{ item.price }}</span>
               <div v-if="!item.isAvailable" class="text-[10px] text-red-500 font-bold uppercase mt-1">Sold Out</div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="max-w-3xl mx-auto mt-32 py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
      <p>&copy; {{ new Date().getFullYear() }} {{ project.title }}</p>
      <p class="mt-2" v-if="project.address">{{ project.address }}</p>
      <p class="mt-1" v-if="project.phone">{{ project.phone }}</p>
    </footer>
  </div>
</template>
