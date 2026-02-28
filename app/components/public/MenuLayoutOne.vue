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
  <div class="min-h-screen bg-[#f1f0ee] text-gray-900 font-sans selection:bg-[#4a3423]/10">
    <!-- Top Nav -->
    <nav class="sticky top-0 z-50 bg-[#f1f0ee]/80 backdrop-blur-xl border-b border-gray-200/50 py-4">
      <div class="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="size-10 rounded-full overflow-hidden shadow-inner bg-zinc-800">
            <img v-if="project.logo" :src="project.logo" class="size-full object-cover" />
          </div>
          <span class="text-2xl font-black uppercase tracking-tighter text-[#2d241c]">{{ project.title }}</span>
        </div>
        <div class="flex items-center gap-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
          <a href="#" class="text-[#2d241c]">Menu</a>
          <a href="#" class="hover:text-gray-900 transition-colors">About</a>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-6 py-6 space-y-12">
      <!-- Hero Banner -->
      <section class="relative h-[420px] rounded-[48px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] group">
        <img v-if="project.coverImage" :src="project.coverImage" class="size-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
        <div v-else class="size-full bg-gradient-to-br from-gray-200 to-gray-300" />
        <div class="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/5" />
        
        <div class="absolute top-12 right-16 text-right text-white select-none">
          <h2 class="text-7xl font-black tracking-tighter italic uppercase drop-shadow-2xl leading-none">{{ project.title }}</h2>
          <p class="text-sm font-black tracking-[0.4em] uppercase opacity-90 mt-2 pr-1 drop-shadow-lg">Foods and Pastry</p>
        </div>

        <!-- Pagination Dots -->
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5">
          <div class="w-2.5 h-2.5 rounded-full bg-white shadow-lg"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-white/40 shadow-lg"></div>
        </div>
      </section>

      <!-- Choose your menu -->
      <section class="space-y-4">
        <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400/80 ml-2">Choose your menu</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="cat in categoriesWithItems.slice(0, 3)" 
            :key="cat.id"
            class="relative h-60 rounded-[40px] overflow-hidden cursor-pointer group shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1"
            @click="scrollToCategory(cat.id)"
          >
            <img v-if="cat.imageUrl" :src="cat.imageUrl" class="size-full object-cover transition-transform duration-1000 group-hover:scale-110 blur-[1px] group-hover:blur-0" />
            <div class="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/20" />
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-6 border-4 border-transparent group-hover:border-white/10 transition-all rounded-[40px]">
              <h4 class="text-2xl font-black text-white italic uppercase tracking-tight drop-shadow-lg">{{ cat.name }}</h4>
              <p class="text-[10px] text-white/80 font-black uppercase tracking-[0.3em] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">{{ cat.name }}</p>
            </div>
            <div v-if="activeCategory === cat.id" class="absolute bottom-6 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-white rounded-full shadow-lg" />
          </div>
        </div>
      </section>

      <!-- Category Filter Tabs -->
      <div class="flex flex-wrap gap-4 pb-2">
        <button
          v-for="cat in categoriesWithItems"
          :key="cat.id"
          class="px-8 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
          :class="activeCategory === cat.id 
            ? 'bg-[#4a3423] text-white shadow-xl shadow-[#4a3423]/20' 
            : 'bg-white text-gray-400/80 hover:text-gray-900 border border-gray-100/50'"
          @click="activeCategory = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Active Category Section -->
      <section v-if="activeCategory" class="space-y-8 animate-fade-in pt-4">
        <div class="space-y-2 ml-1">
          <h2 class="text-[44px] font-black text-[#2d241c] italic uppercase tracking-tighter leading-none">
            {{ categories.find(c => c.id === activeCategory)?.name }}
          </h2>
          <p class="text-[11px] text-gray-400 font-black uppercase tracking-[0.3em] pl-0.5">
            {{ categories.find(c => c.id === activeCategory)?.name }}
          </p>
        </div>

        <!-- Sub-filters -->
        <div class="flex gap-4">
          <button class="px-7 py-3.5 bg-[#4a3423] text-white rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#4a3423]/10">All</button>
          <button class="px-7 py-3.5 bg-white text-gray-400 font-black rounded-[18px] text-[10px] uppercase tracking-[0.2em] border border-gray-100 transition-colors hover:bg-gray-50">Filter Options</button>
        </div>

        <!-- Items List -->
        <div class="space-y-4 pb-20">
          <div 
            v-for="item in activeCategoryItems" 
            :key="item.id"
            class="bg-white rounded-[32px] p-6 flex items-center gap-8 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.06)] border border-white/50 hover:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.12)] transition-all duration-500 group cursor-pointer active:scale-98"
            @click="emit('openItemDetail', item)"
          >
            <!-- Circular image -->
            <div class="size-24 rounded-full bg-gray-50 flex items-center justify-center border-4 border-[#f8f7f5] shadow-inner overflow-hidden shrink-0 group-hover:rotate-6 transition-transform">
               <img v-if="item.images?.length" :src="item.images[0]" class="size-full object-cover rounded-full" />
               <UIcon v-else name="i-heroicons-cake" class="size-12 text-gray-200" />
            </div>
            
            <div class="flex-1 min-w-0 space-y-2">
               <div>
                 <h4 class="text-2xl font-black text-[#2d241c] italic uppercase tracking-tight group-hover:text-[#4a3423] transition-colors line-clamp-1">{{ item.name }}</h4>
                 <p class="text-xs text-gray-400 font-medium leading-relaxed max-w-2xl line-clamp-2 mt-1">{{ item.description }}</p>
               </div>
               <div class="flex items-center gap-4 pt-1">
                  <span class="text-lg font-black text-[#4a3423] tabular-nums tracking-tighter">{{ props.project.currency }} {{ item.price }}</span>
                  <div class="h-1 w-1 rounded-full bg-gray-300"></div>
                  <span v-if="item.isAvailable" class="text-[9px] font-black uppercase tracking-widest text-[#10b981]">In Stock</span>
                  <span v-else class="text-[9px] font-black uppercase tracking-widest text-red-400">Out of Stock</span>
               </div>
            </div>

            <div class="pr-4 shrink-0">
               <UButton 
                 label="View" 
                 variant="solid" 
                 class="bg-[#4a3423] hover:bg-[#2d241c] text-white rounded-2xl px-12 py-4 font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-[#4a3423]/20 active:scale-95 transition-all"
                 @click.stop="emit('openItemDetail', item)"
               />
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Floating UI Button (Matches Bottom Right of Image) -->
    <div class="fixed bottom-10 right-10 z-[60]">
       <div class="size-20 rounded-[28px] bg-[#4a3423] flex items-center justify-center text-white shadow-[0_24px_48px_-8px_rgba(74,52,35,0.4)] cursor-pointer hover:scale-105 active:scale-90 transition-all group overflow-hidden">
          <div class="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
          <UIcon name="i-heroicons-credit-card" class="size-9 relative z-10" />
       </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out both;
}
</style>
