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

const colorMode = useColorMode()
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const activeCategory = ref<number | null>(null)

const categoriesWithItems = computed(() => {
  return props.categories.filter(cat => 
    props.menuItemsByCategory[cat.id]?.length > 0
  ) || []
})

onMounted(() => {
  if (categoriesWithItems.value.length > 0) {
    activeCategory.value = categoriesWithItems.value[0].id
  }
})

const scrollToCategory = (categoryId: number) => {
  activeCategory.value = categoryId
}

const activeCategoryItems = computed(() => {
  if (!activeCategory.value) return []
  return props.menuItemsByCategory[activeCategory.value] || []
})
</script>

<template>
  <div 
    v-if="project" 
    class="min-h-screen bg-app-bg selection:bg-emerald-500/20"
  >
    <!-- Top Nav -->
    <nav class="sticky top-0 z-50 bg-app-bg/80 backdrop-blur-xl border-b border-gray-200/40 dark:border-white/5 py-5 transition-colors duration-500">
      <div class="max-w-7xl mx-auto px-8 h-10 flex items-center justify-between">
        <div class="flex items-center gap-5">
          <div class="size-11 rounded-xl overflow-hidden shadow-sm bg-app-section border border-black/5 dark:border-white/10">
            <img v-if="project.logo" :src="project.logo" class="size-full object-cover" />
          </div>
          <span 
            class="text-2xl font-black uppercase tracking-[-0.04em] text-gray-900 dark:text-white"
            :style="{ color: isDark ? 'white' : (project.primaryColor || '#2d241c') }"
          >
            {{ project.title }}
          </span>
        </div>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
            <a 
              href="#" 
              class="transition-opacity hover:opacity-70"
              :style="{ color: isDark ? 'white' : (project.primaryColor || '#2d241c') }"
            >
              Menu
            </a>
          </div>
          <div class="h-4 w-px bg-gray-200 dark:bg-white/10 mx-2" />
          <UButton
            :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
            color="neutral"
            variant="ghost"
            class="rounded-xl"
            @click="isDark = !isDark"
          />
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-8 py-8 space-y-16">
      <!-- Hero Banner -->
      <section class="relative h-[440px] rounded-[32px] overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] group border border-transparent dark:border-white/5">
        <img v-if="project.coverImage" :src="project.coverImage" class="size-full object-cover transition-transform duration-[3000ms] group-hover:scale-105" />
        <div v-else class="size-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-900" />
        <div class="absolute inset-0 bg-black/10 transition-opacity duration-700 group-hover:bg-black/5" />
        
        <div class="absolute top-16 right-20 text-right text-white select-none">
          <h2 class="text-7xl font-black tracking-tighter italic uppercase drop-shadow-2xl leading-[0.9]">{{ project.title }}</h2>
          <p class="text-sm font-bold tracking-[0.5em] uppercase opacity-90 mt-3 pr-1 drop-shadow-lg">Foods and Pastry</p>
        </div>

        <!-- Pagination Dots -->
        <div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-white shadow-md"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-white/40 shadow-sm border border-white/10"></div>
        </div>
      </section>

      <!-- Choose your menu -->
      <section class="space-y-6">
        <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400/70 ml-2">Choose your menu</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="cat in categoriesWithItems.slice(0, 3)" 
            :key="cat.id"
            class="relative h-64 rounded-3xl overflow-hidden cursor-pointer group shadow-[0_12px_32px_-8px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_20px_48px_-12px_rgba(0,0,0,0.2)] hover:-translate-y-1 border border-transparent dark:border-white/10"
            @click="scrollToCategory(cat.id)"
          >
            <img v-if="cat.imageUrl" :src="cat.imageUrl" class="size-full object-cover transition-transform duration-1000 group-hover:scale-110 blur-[0.5px] group-hover:blur-0" />
            <div class="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/15" />
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border border-white/0 group-hover:border-white/10 transition-all rounded-3xl">
              <h4 class="text-2xl font-black text-white italic uppercase tracking-tight drop-shadow-lg">{{ cat.name }}</h4>
              <p class="text-[9px] text-white/70 font-black uppercase tracking-[0.4em] mt-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">{{ cat.name }}</p>
            </div>
            <div v-if="activeCategory === cat.id" class="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full shadow-md" />
          </div>
        </div>
      </section>

      <!-- Category Filter Tabs -->
      <div class="flex flex-wrap gap-5 pb-2">
        <button
          v-for="cat in categoriesWithItems"
          :key="cat.id"
          class="px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-300 active:scale-95"
          :class="activeCategory === cat.id 
            ? 'text-white shadow-2xl' 
            : 'bg-white dark:bg-zinc-900 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-200/50 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20'"
          :style="activeCategory === cat.id ? { 
            backgroundColor: project.primaryColor || '#4a3423',
            boxShadow: `0 25px 50px -12px ${(project.primaryColor || '#4a3423')}4D`
          } : {}"
          @click="activeCategory = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Active Category Section -->
      <section v-if="activeCategory" class="space-y-10 animate-fade-in pt-4">
        <div class="space-y-3 ml-2">
          <h2 
            class="text-[52px] font-black italic uppercase tracking-[-0.06em] leading-none text-gray-900 dark:text-white"
            :style="{ color: isDark ? 'white' : (project.primaryColor || '#2d241c') }"
          >
            {{ categories.find(c => c.id === activeCategory)?.name }}
          </h2>
          <p class="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.4em] pl-1">
            Browse our selection of artisan {{ categories.find(c => c.id === activeCategory)?.name.toLowerCase() }}
          </p>
        </div>

        <!-- Sub-filters -->
        <div class="flex gap-4 ml-1">
          <button 
            class="px-8 py-4 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.3em] shadow-xl hover:brightness-110 transition-all font-sans"
            :style="{ 
              backgroundColor: project.primaryColor || '#4a3423',
              boxShadow: `0 20px 25px -5px ${(project.primaryColor || '#4a3423')}1A`
            }"
          >
            All Items
          </button>
          <button class="px-8 py-4 bg-white dark:bg-zinc-900 text-gray-400 dark:text-gray-500 font-black rounded-xl text-[9px] uppercase tracking-[0.3em] border border-gray-200 dark:border-white/5 transition-all hover:border-gray-400 dark:hover:border-white/20 hover:text-gray-900 dark:hover:text-white">Recommended</button>
        </div>

        <!-- Items List -->
        <div class="space-y-5 pb-24">
          <div 
            v-for="item in activeCategoryItems" 
            :key="item.id"
            class="bg-white dark:bg-zinc-900/40 rounded-3xl p-7 flex flex-col sm:flex-row items-center gap-10 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] border border-white/60 dark:border-white/5 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.12)] transition-all duration-500 group cursor-pointer active:scale-[0.99]"
            @click="emit('openItemDetail', item)"
          >
            <!-- Circular image (now with subtle radius) -->
            <div class="size-32 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center border-2 border-[#f1f0ee] dark:border-white/5 shadow-inner overflow-hidden shrink-0 group-hover:scale-105 transition-all duration-500">
               <img v-if="item.images?.length" :src="item.images[0]" class="size-full object-cover transition-transform duration-700 group-hover:rotate-2" />
               <UIcon v-else name="i-heroicons-cake" class="size-14 text-gray-100 dark:text-zinc-700 transition-colors group-hover:text-gray-200" />
            </div>
            
            <div class="flex-1 min-w-0 space-y-3 text-center sm:text-left">
               <div>
                  <h4 
                    class="text-2xl font-black italic uppercase tracking-tight transition-colors line-clamp-1 leading-none group-hover:text-[var(--hover-color)] text-gray-900 dark:text-white"
                    :style="{ '--hover-color': project.primaryColor || '#4a3423' }"
                  >
                    {{ item.name }}
                  </h4>
                  <p class="text-sm text-gray-400 dark:text-gray-500 font-medium leading-relaxed max-w-2xl line-clamp-2 mt-2 opacity-80">{{ item.description }}</p>
               </div>
               <div class="flex items-center justify-center sm:justify-start gap-5 pt-1">
                  <span 
                    class="text-xl font-black tabular-nums tracking-[-0.04em]"
                    :style="{ color: isDark ? 'white' : (project.primaryColor || '#4a3423') }"
                  >
                    {{ props.project.currency }} {{ item.price }}
                  </span>
                  <div class="h-1 w-1 rounded-full bg-gray-300 dark:bg-zinc-700"></div>
                  <span v-if="item.isAvailable" class="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-500/70">In Stock</span>
                  <span v-else class="text-[9px] font-black uppercase tracking-[0.2em] text-red-400/70">Unavailable</span>
               </div>
            </div>

            <div class="pr-0 sm:pr-4 shrink-0 w-full sm:w-auto">
               <UButton 
                 label="View Detail" 
                 variant="solid" 
                 class="text-white rounded-xl px-12 py-4 font-black uppercase text-[10px] tracking-[0.3em] active:scale-95 transition-all font-sans w-full sm:w-auto"
                 :style="{ 
                   backgroundColor: project.primaryColor || '#4a3423',
                   boxShadow: `0 12px 24px -8px ${(project.primaryColor || '#4a3423')}4D`
                 }"
                 @click.stop="emit('openItemDetail', item)"
               />
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.selection-bg-custom::selection {
  background-color: var(--selection-bg);
}
</style>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out both;
}
</style>
