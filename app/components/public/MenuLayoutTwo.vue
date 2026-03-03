<script setup lang="ts">
import { PageFlip } from 'page-flip'
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

const bookContainer = ref<HTMLElement | null>(null)
let flipbook: any = null

// Logic to chunk items into pages (e.g., 3-4 items per page for premium feel)
const pages = computed(() => {
  const result: any[] = []
  
  // Page 1: Cover
  result.push({ type: 'cover' })

  // Page 2: intro
  result.push({ type: 'intro' })

  // Categories & Items
  props.categories?.forEach(cat => {
    const items = props.menuItemsByCategory[cat.id] || []
    if (items.length === 0) return

    // Add Category Header Page or Start
    // For simplicity, let's group by category and chunk items
    const chunkSize = 3
    for (let i = 0; i < items.length; i += chunkSize) {
      result.push({
        type: 'items',
        category: cat,
        items: items.slice(i, i + chunkSize),
        isFirstInCat: i === 0
      })
    }
  })

  // Final Page: Contact
  result.push({ type: 'contact' })
  
  return result
})

onMounted(async () => {
  if (import.meta.client && bookContainer.value) {
    await nextTick()
    
    flipbook = new PageFlip(bookContainer.value, {
      width: 550,
      height: 733,
      size: 'stretch',
      minWidth: 315,
      maxWidth: 1000,
      minHeight: 420,
      maxHeight: 1350,
      maxShadowOpacity: 0.5,
      showCover: true,
      mobileScrollSupport: false,
      usePortrait: true,
      startPage: 0
    })

    flipbook.loadFromHTML(document.querySelectorAll('.page'))
  }
})

onUnmounted(() => {
  if (flipbook) {
    flipbook.destroy()
  }
})

const flipNext = () => flipbook?.flipNext()
const flipPrev = () => flipbook?.flipPrev()
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center py-10 px-4 overflow-hidden selection:bg-emerald-500/30 font-sans">
    
    <!-- Flipbook Container -->
    <div class="relative w-full max-w-6xl aspect-[1.5/1] flex flex-col items-center">
      
      <div ref="bookContainer" class="flipbook shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] rounded-lg overflow-hidden">
        
        <!-- COVER PAGE -->
        <div class="page page-cover bg-zinc-900 overflow-hidden relative" data-density="hard">
           <div class="absolute inset-0">
             <img v-if="project.coverImage" :src="project.coverImage" class="size-full object-cover opacity-30 blur-sm scale-110" />
             <div class="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950" />
           </div>
           
           <div class="relative h-full flex flex-col items-center justify-center p-12 text-center">
              <div class="size-32 rounded-[2rem] bg-zinc-800 border-4 border-white/5 shadow-2xl mb-12 overflow-hidden rotate-3">
                 <img v-if="project.logo" :src="project.logo" class="size-full object-cover" />
              </div>
              <h1 class="text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-4 drop-shadow-2xl">
                {{ project.title }}
              </h1>
              <div class="w-16 h-1 bg-emerald-500/50 rounded-full mb-8" />
              <p class="text-xs font-black text-gray-400 uppercase tracking-[0.4em] opacity-60">Digital Experience</p>
           </div>
           
           <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 animate-bounce">
              <UIcon name="i-heroicons-hand-raised" class="size-5 text-emerald-500/40" />
              <span class="text-[9px] font-black text-white/20 uppercase tracking-widest">Flip to open</span>
           </div>
        </div>

        <!-- INTRO PAGE -->
        <div class="page bg-[#fdfcfb] text-zinc-900 border-l border-zinc-200 shadow-inner">
           <div class="p-16 h-full flex flex-col justify-center text-center space-y-10">
              <div class="space-y-4">
                 <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Our Story</h2>
                 <p class="text-xl font-medium leading-[1.8] text-zinc-600 italic">
                   "{{ project.description }}"
                 </p>
              </div>
              <div class="h-[1px] w-24 bg-zinc-200 mx-auto" />
              <div class="grid grid-cols-2 gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                 <div>
                    <p class="mb-2 text-zinc-300">Contact</p>
                    <p class="text-zinc-900">{{ project.phone }}</p>
                 </div>
                 <div>
                    <p class="mb-2 text-zinc-300">Location</p>
                    <p class="text-zinc-900 truncate px-4">{{ project.address }}</p>
                 </div>
              </div>
           </div>
        </div>

        <!-- CONTENT PAGES -->
        <div v-for="(p, idx) in pages.filter(x => x.type === 'items')" :key="idx" class="page bg-[#fdfcfb] text-zinc-900 border-l border-zinc-200 shadow-inner relative">
           <div class="p-12 h-full flex flex-col">
              
              <!-- Category Header -->
              <div v-if="p.isFirstInCat" class="mb-10 pt-4">
                 <h2 class="text-4xl font-black italic uppercase tracking-tighter leading-none" :style="{ color: project.primaryColor || '#10b981' }">
                   {{ p.category.name }}
                 </h2>
                 <div class="h-1 w-12 bg-zinc-200 mt-4 rounded-full" />
              </div>
              <div v-else class="mb-14" />

              <!-- Items List -->
              <div class="flex-1 space-y-12">
                 <div 
                   v-for="item in p.items" 
                   :key="item.id" 
                   class="group flex gap-6 items-start cursor-pointer transition-transform active:scale-95" 
                   @click="emit('openItemDetail', item)"
                 >
                    <div class="relative size-24 shrink-0 rounded-2xl overflow-hidden border border-zinc-100 shadow-lg grayscale-[20%] group-hover:grayscale-0 transition-all duration-500">
                       <img v-if="item.images?.length" :src="item.images[0]" class="size-full object-cover transition-transform group-hover:scale-110" />
                       <div v-else class="size-full bg-zinc-50 flex items-center justify-center">
                          <UIcon name="i-heroicons-cake" class="size-10 text-zinc-200" />
                       </div>
                       <div v-if="!item.isAvailable" class="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                          <span class="text-[7px] font-black uppercase bg-red-500 text-white px-2 py-0.5 rounded shadow-sm">Sold Out</span>
                       </div>
                    </div>
                    
                    <div class="flex-1 min-w-0 pt-1">
                       <div class="flex items-center justify-between mb-2">
                          <h4 class="text-lg font-black uppercase tracking-tight leading-none group-hover:text-emerald-700 transition-colors">{{ item.name }}</h4>
                          <span class="text-sm font-black font-mono tracking-tighter text-zinc-400 group-hover:text-emerald-600 transition-colors">{{ project.currency }} {{ item.price }}</span>
                       </div>
                       <p class="text-[11px] text-zinc-400 leading-relaxed line-clamp-2 font-medium">
                          {{ item.description }}
                       </p>
                    </div>
                 </div>
              </div>

              <!-- Page Number -->
              <div class="mt-auto pt-8 flex items-center justify-center border-t border-zinc-100 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300">
                 Page {{ idx + 1 }}
              </div>
           </div>
        </div>

        <!-- CONTACT / BACK COVER -->
        <div class="page bg-zinc-900 overflow-hidden relative" data-density="hard">
           <div class="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
              <div class="size-16 rounded-xl bg-zinc-800 border border-white/5 mb-8 overflow-hidden grayscale opacity-50">
                 <img v-if="project.logo" :src="project.logo" class="size-full object-cover" />
              </div>
              <h2 class="text-2xl font-black text-white italic uppercase tracking-tighter opacity-80 mb-12">
                Thank You
              </h2>
              
              <div class="space-y-6">
                 <div class="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                    <UIcon name="i-heroicons-globe-alt" class="size-4" />
                    <span>www.{{ project.slug }}.sky-menu.app</span>
                 </div>
                 <div class="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.3em]">
                    Powered by SkyMenu
                 </div>
              </div>
           </div>
        </div>

      </div>

      <!-- Controls -->
      <div class="mt-12 flex items-center gap-12">
         <button @click="flipPrev" class="size-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white group active:scale-95 shadow-2xl">
            <UIcon name="i-heroicons-chevron-left" class="size-6 transition-transform group-hover:-translate-x-1" />
         </button>
         
         <div class="flex flex-col items-center text-center">
            <div class="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Interact</div>
            <div class="flex gap-2">
               <div class="size-1 rounded-full bg-emerald-500" />
               <div class="size-1 rounded-full bg-white/20" />
               <div class="size-1 rounded-full bg-white/20" />
            </div>
         </div>

         <button @click="flipNext" class="size-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white group active:scale-95 shadow-2xl">
            <UIcon name="i-heroicons-chevron-right" class="size-6 transition-transform group-hover:translate-x-1" />
         </button>
      </div>

    </div>

  </div>
</template>

<style scoped>
.flipbook {
  background-color: transparent;
}

.page {
  width: 550px;
  height: 733px;
  background-color: #fdfcfb;
  box-shadow: inset 0 0 100px rgba(0,0,0,0.02);
}

.page-cover {
  background-color: #18181b !important;
  border-left: 15px solid #000;
}

/* Realistic Paper Gradient */
.page:not(.page-cover)::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 5%, rgba(0,0,0,0) 95%, rgba(0,0,0,0.05) 100%);
  pointer-events: none;
}

.page:not(.page-cover)::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://www.transparenttextures.com/patterns/natural-paper.png');
  opacity: 0.15;
  pointer-events: none;
}

/* Animation for the bounce icon */
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
.animate-bounce {
  animation: bounce-subtle 2s infinite ease-in-out;
}
</style>
