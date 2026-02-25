<script setup lang="ts">
import { projectsRepository } from '~/repositories/projects'
import type { MenuItem } from '~/repositories/menu-items/response/menu-items'
import type { Category } from '~/repositories/categories/response/categories'
import PublicItemDetailSlideover from '~/components/public/ItemDetailSlideover.vue'

const route = useRoute()
const { $api } = useNuxtApp()
const projectsRepo = projectsRepository($api)

const slug = computed(() => route.params.slug as string)

const { data: project, error } = await useAsyncData(
  `public-project-${slug.value}`,
  () => projectsRepo.getProjectBySlug(slug.value)
)

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Project not found or not published',
  })
}

const activeCategory = ref<number | null>(null)
const selectedItem = ref<MenuItem | null>(null)
const isSlideoverOpen = ref(false)

const menuItemsByCategory = computed(() => {
  if (!project.value?.menu?.menuItems) return {}
  
  const grouped: Record<number, MenuItem[]> = {}
  project.value.menu.menuItems.forEach(item => {
    if (!grouped[item.categoryId]) {
      grouped[item.categoryId] = []
    }
    grouped[item.categoryId].push(item)
  })
  return grouped
})

const categoriesWithItems = computed(() => {
  return project.value?.categories?.filter(cat => 
    menuItemsByCategory.value[cat.id]?.length > 0
  ) || []
})

onMounted(() => {
  if (categoriesWithItems.value.length > 0) {
    activeCategory.value = categoriesWithItems.value[0].id
  }
})

const openItemDetail = (item: MenuItem) => {
  selectedItem.value = item
  isSlideoverOpen.value = true
}

const scrollToCategory = (categoryId: number) => {
  activeCategory.value = categoryId
  const el = document.getElementById(`category-${categoryId}`)
  if (el) {
    const yOffset = -100 
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

useHead({
  title: project.value?.title || 'Menu',
  meta: [
    { name: 'description', content: project.value?.description || 'Browse our menu' }
  ]
})
</script>

<template>
  <div v-if="project" class="min-h-screen bg-zinc-950 text-white font-sans selection:bg-emerald-500/30">
    <!-- Hero Section -->
    <header class="relative h-[40vh] md:h-[50vh] overflow-hidden">
      <img 
        v-if="project.coverImage" 
        :src="project.coverImage" 
        class="absolute inset-0 w-full h-full object-cover scale-105"
      />
      <div v-else class="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
      
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      
      <div class="absolute inset-0 flex flex-col items-center justify-end pb-12 px-4 text-center">
        <div class="size-24 md:size-32 rounded-3xl bg-zinc-900 border-4 border-zinc-950 overflow-hidden shadow-2xl mb-6 group transition-transform hover:scale-105 duration-500">
          <img v-if="project.logo" :src="project.logo" class="size-full object-cover" />
          <div v-else class="size-full flex items-center justify-center bg-zinc-800">
            <h1 class="text-4xl font-bold text-white/20">{{ project.title.charAt(0) }}</h1>
          </div>
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 uppercase italic drop-shadow-lg">
          {{ project.title }}
        </h1>
        <p class="text-lg text-gray-300 max-w-lg font-medium drop-shadow-md mb-6">
          {{ project.description }}
        </p>

        <!-- Quick Contacts in Header -->
        <div class="flex flex-wrap justify-center gap-4 text-sm font-bold uppercase tracking-widest text-white/60">
          <a v-if="project.phone" :href="`tel:${project.phone}`" class="flex items-center gap-2 hover:text-white transition-colors bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <UIcon name="i-heroicons-phone" class="size-4" />
            <span>Call</span>
          </a>
          <a v-if="project.address" :href="`https://maps.google.com/?q=${project.address}`" target="_blank" class="flex items-center gap-2 hover:text-white transition-colors bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <UIcon name="i-heroicons-map-pin" class="size-4" />
            <span>Map</span>
          </a>
          <a v-if="project.website" :href="project.website" target="_blank" class="flex items-center gap-2 hover:text-white transition-colors bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <UIcon name="i-heroicons-globe-alt" class="size-4" />
            <span>Web</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Sticky Navigation -->
    <nav class="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-3 overflow-x-auto no-scrollbar scroll-smooth shadow-2xl shadow-black/40">
      <div class="flex items-center gap-3 px-4 max-w-5xl mx-auto min-w-max">
        <button
          v-for="cat in categoriesWithItems"
          :key="cat.id"
          class="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border"
          :class="activeCategory === cat.id 
            ? 'shadow-lg shadow-emerald-500/20 scale-105' 
            : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-white'"
          :style="activeCategory === cat.id ? { 
            backgroundColor: project.primaryColor || '#10b981',
            borderColor: project.primaryColor || '#10b981',
            color: '#fff'
          } : {}"
          @click="scrollToCategory(cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>
    </nav>

    <!-- Menu Content -->
    <main class="max-w-5xl mx-auto px-4 py-12 space-y-16">
      <section 
        v-for="cat in categoriesWithItems" 
        :id="`category-${cat.id}`" 
        :key="cat.id"
        class="space-y-8 scroll-mt-24"
      >
        <div class="flex items-center gap-4">
          <div 
            class="h-10 w-1.5 rounded-full" 
            :style="{ backgroundColor: project.primaryColor || '#10b981' }"
          />
          <div>
            <h2 class="text-3xl font-black text-white uppercase tracking-tighter italic">
              {{ cat.name }}
            </h2>
            <p v-if="cat.description" class="text-gray-400 text-sm mt-1 uppercase tracking-widest font-semibold opacity-60">
              {{ cat.description }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="item in menuItemsByCategory[cat.id]" 
            :key="item.id"
            @click="openItemDetail(item)"
            class="group bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden hover:bg-zinc-900/60 hover:border-white/10 transition-all duration-500 hover:-translate-y-1 shadow-xl hover:shadow-2xl hover:shadow-black/50 cursor-pointer"
          >
            <div class="relative aspect-[4/3] overflow-hidden bg-zinc-800">
              <img 
                v-if="item.images?.length" 
                :src="item.images[0]" 
                class="size-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div v-else class="size-full flex items-center justify-center">
                <UIcon name="i-heroicons-photo" class="size-12 text-zinc-700" />
              </div>
              
              <div class="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xl">
                <span class="text-lg font-black font-mono tracking-tighter" :style="{ color: project.accentColor || '#3b82f6' }">
                  {{ project.currency }} {{ item.price }}
                </span>
              </div>

              <div v-if="!item.isAvailable" class="absolute inset-0 bg-zinc-950/60 backdrop-blur-[2px] flex items-center justify-center">
                <span class="px-6 py-2 bg-red-500/90 text-white text-sm font-black uppercase tracking-widest rounded-full shadow-2xl scale-110">
                  Sold Out
                </span>
              </div>
            </div>

            <div class="p-6 space-y-3">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300 leading-tight">
                  {{ item.name }}
                </h3>
              </div>
              <p class="text-gray-400 text-sm line-clamp-2 leading-relaxed font-medium">
                {{ item.description }}
              </p>
              
              <!-- Tags on Card -->
              <div v-if="item.tags?.length" class="flex flex-wrap gap-2 pt-2">
                <span 
                  v-for="tag in item.tags.slice(0, 2)" 
                  :key="tag"
                  class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5"
                >
                  {{ tag }}
                </span>
                <span v-if="item.tags.length > 2" class="text-[10px] font-black text-white/20">+{{ item.tags.length - 2 }}</span>
              </div>

              <div class="pt-4 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500 border-t border-white/5">
                <div v-if="item.calories" class="flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                  <UIcon name="i-heroicons-fire" class="size-4" />
                  <span>{{ item.calories }} kcal</span>
                </div>
                <div v-if="item.preparationTime" class="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                  <UIcon name="i-heroicons-clock" class="size-4" />
                  <span>{{ item.preparationTime }} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Item Detail Slideover -->
    <PublicItemDetailSlideover
      v-model:open="isSlideoverOpen"
      :project="project"
      :item="selectedItem"
    />

    <!-- Footer / Contact -->
    <footer class="bg-zinc-900/50 border-t border-white/5 py-20 mt-20">
      <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
        <div class="space-y-6 max-w-md">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="size-20 rounded-2xl bg-zinc-800 border-2 border-white/10 overflow-hidden shadow-xl shadow-black/40">
              <img v-if="project.logo" :src="project.logo" class="size-full object-cover" />
            </div>
            <div>
              <h4 class="text-2xl font-black text-white italic uppercase tracking-tighter">{{ project.title }}</h4>
              <p class="text-gray-400 font-medium tracking-wide mt-1">{{ project.description }}</p>
            </div>
          </div>
          <div class="space-y-3 pt-4 border-t border-white/5">
            <p v-if="project.address" class="flex items-center justify-center md:justify-start gap-3 text-gray-300 font-medium">
              <UIcon name="i-heroicons-map-pin" class="size-5 text-emerald-500" />
              {{ project.address }}
            </p>
            <p v-if="project.phone" class="flex items-center justify-center md:justify-start gap-3 text-gray-300 font-medium">
              <UIcon name="i-heroicons-phone" class="size-5 text-emerald-500" />
              <a :href="`tel:${project.phone}`" class="hover:text-emerald-400 transition-colors">{{ project.phone }}</a>
            </p>
          </div>
        </div>
        
        <div class="flex flex-col items-center md:items-end gap-6">
          <div class="flex gap-4">
            <UButton 
              v-if="project.website" 
              :to="project.website" 
              target="_blank" 
              icon="i-heroicons-globe-alt" 
              color="neutral" 
              variant="ghost" 
              size="lg"
              class="hover:bg-emerald-500/10 hover:text-emerald-400"
            />
          </div>
          <p class="text-xs font-black uppercase tracking-[0.2em] text-gray-600">
            Powered by SkyMenu
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
