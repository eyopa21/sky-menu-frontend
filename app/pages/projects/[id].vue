<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import { projectsRepository } from '~/repositories/projects'
import { categoriesRepository } from '~/repositories/categories'
import { menusRepository } from '~/repositories/menus'
import CategoryModal from '~/components/dashboard/categories/categoryModal.vue'
import MenuItemModal from '~/components/dashboard/menu-items/menuItemModal.vue'
import ProjectModal from '~/components/dashboard/projects/ProjectModal.vue'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const projectsRepo = projectsRepository($api)
const categoriesRepo = categoriesRepository($api)
const menusRepo = menusRepository($api)
const toast = useToast()

const id = computed(() => Number(route.params.id))
const loading = ref(false)

const isProjectModalOpen = ref(false)
const isCategoryModalOpen = ref(false)
const selectedCategory = ref<any>(null)

const isItemModalOpen = ref(false)
const selectedItem = ref<any>(null)

const activeTab = ref('0')
const tabs = [
  { label: 'Information', icon: 'i-heroicons-information-circle', slot: 'info' },
  { label: 'Categories', icon: 'i-heroicons-squares-2x2', slot: 'categories' },
  { label: 'Menu Items', icon: 'i-heroicons-list-bullet', slot: 'items' }
]

const { data: project, refresh: refreshProject } = await useAsyncData(`project-${id.value}`, () => projectsRepo.getProjectById(id.value))
const { data: categories, refresh: refreshCategories } = await useAsyncData(`categories-${id.value}`, () => categoriesRepo.getCategoriesByProjectId(id.value))

const publicMenuUrl = computed(() => {
  if (!project.value?.slug) return ''
  if (process.client) {
    return `${window.location.origin}/menu/${project.value.slug}`
  }
  return `/menu/${project.value.slug}`
})

const copyMenuLink = async () => {
  try {
    await navigator.clipboard.writeText(publicMenuUrl.value)
    toast.add({ title: 'Link copied to clipboard!', color: 'success' })
  } catch (err) {
    toast.add({ title: 'Failed to copy link.', color: 'error' })
  }
}

const downloadQRCode = () => {
  const canvas = document.querySelector('#qr-code-canvas canvas') as HTMLCanvasElement
  if (!canvas) return
  
  const link = document.createElement('a')
  link.download = `${project.value?.slug}-qr-code.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
  toast.add({ title: 'QR Code downloaded!', color: 'success' })
}

const openAddCategory = () => {
  selectedCategory.value = null
  isCategoryModalOpen.value = true
}

const openEditCategory = (category: any) => {
  selectedCategory.value = category
  isCategoryModalOpen.value = true
}

const openAddItem = () => {
  selectedItem.value = null
  isItemModalOpen.value = true
}

const openEditItem = (item: any) => {
  selectedItem.value = item
  isItemModalOpen.value = true
}

const createMenu = async () => {
  try {
    loading.value = true
    await menusRepo.createMenu(id.value, project.value?.title || 'Main Menu')
    toast.add({ title: 'Menu created successfully!', color: 'success' })
    refreshProject()
  } catch (err) {
    toast.add({ title: 'Failed to create menu.', color: 'error' })
  } finally {
    loading.value = false
  }
}

const goToCategories = () => {
  activeTab.value = '1'
}
</script>

<template>
  <div class="space-y-10 pb-20 w-full" v-if="project">
    <!-- Header Section (Premium) -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 px-4">
      <div class="flex items-center gap-8">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="soft"
          color="neutral"
          class="rounded-xl p-3.5 shadow-sm active:scale-95 transition-all"
          @click="router.push('/projects')"
        />
        <div class="relative group">
          <div class="flex items-center gap-5">
             <h1 class="text-3xl md:text-5xl font-black text-white dark:text-white light:text-gray-900 tracking-tight leading-none group-hover:text-emerald-400 transition-colors">
              {{ project.title }}
            </h1>
            <UBadge
              :label="project.isPublished ? 'Live' : 'Drafting'"
              :color="project.isPublished ? 'success' : 'warning'"
              class="rounded-lg font-black tracking-tighter uppercase px-3 py-1.5 backdrop-blur-md"
            />
          </div>
          <p class="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2.5 pl-1">Project Management Dashboard</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <UButton
          v-if="project.isPublished"
          :to="`/menu/${project.slug}`"
          target="_blank"
          icon="i-heroicons-eye"
          color="success"
          variant="soft"
          class="rounded-xl font-black px-6 py-3.5 transition-all"
          label="Live Preview"
        />
        <UButton
          label="Settings"
          icon="i-heroicons-cog-6-tooth"
          class="rounded-xl font-black px-7 py-3.5 bg-white dark:bg-white light:bg-gray-900 dark:text-black light:text-white hover:bg-emerald-400 dark:hover:bg-emerald-400 light:hover:bg-emerald-600 transition-all shadow-xl shadow-black/20"
          @click="isProjectModalOpen = true"
        />
      </div>
    </div>

    <!-- Layout Container -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      <!-- Left Overlay Column: Identity Card -->
      <div class="lg:col-span-4 space-y-10">
        <div class="p-[1px] rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent shadow-2xl">
          <div class="bg-[#0d0d0f] dark:bg-[#0d0d0f] light:bg-white rounded-[23px] overflow-hidden backdrop-blur-3xl">
            <!-- Cover Art -->
            <div class="relative h-64 w-full overflow-hidden shrink-0 group/cover border-b border-white/5">
              <img v-if="project.coverImage" :src="project.coverImage" class="h-full w-full object-cover transition-transform duration-[3000ms] group-hover/cover:scale-110 opacity-60" />
              <div class="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-transparent" />
              
              <div class="absolute -bottom-12 left-8 z-10 transition-transform duration-500 group-hover/cover:translate-y-[-4px]">
                <div class="size-28 rounded-2xl bg-zinc-900 border-[8px] border-zinc-950 dark:border-zinc-950 light:border-white shadow-2xl overflow-hidden">
                  <img v-if="project.logo" :src="project.logo" class="size-full object-cover" />
                  <div v-else class="size-full flex items-center justify-center">
                    <UIcon name="i-heroicons-photo" class="size-10 text-gray-700/50" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Ident info -->
            <div class="p-8 pt-16 space-y-6">
              <div>
                <h2 class="text-2xl font-black text-white dark:text-white light:text-gray-900 tracking-tight">{{ project.title }}</h2>
                <p class="text-[11px] font-black tracking-widest uppercase text-emerald-400 mt-1">/{{ project.slug }}</p>
              </div>

              <div class="space-y-4">
                 <div class="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-gray-50 border border-white/5 dark:border-white/5 light:border-gray-200">
                    <div>
                        <p class="text-[10px] font-black text-emerald-500/60 transition-colors group-hover:text-emerald-400 uppercase tracking-widest mb-1 leading-none">Currency</p>
                        <p class="text-lg font-black text-white dark:text-white light:text-gray-900 leading-none">{{ project.currency }}</p>
                    </div>
                    <UIcon name="i-heroicons-banknotes" class="size-8 text-emerald-500/20" />
                 </div>

                 <div class="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-gray-50 border border-white/5 dark:border-white/5 light:border-gray-200">
                    <div>
                        <p class="text-[10px] font-black text-purple-500/60 uppercase tracking-widest mb-1 leading-none">Established</p>
                        <p class="text-lg font-black text-white dark:text-white light:text-gray-900 leading-none">{{ new Date(project.createdAt).toLocaleDateString() }}</p>
                    </div>
                    <UIcon name="i-heroicons-calendar" class="size-8 text-purple-500/20" />
                 </div>
              </div>

              <div class="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                 <UIcon name="i-heroicons-exclamation-circle" class="size-5 text-amber-500 mt-0.5" />
                 <p class="text-xs text-amber-500/80 leading-relaxed font-bold">
                    Draft projects are only visible to your team. Publish the project to share your menu with the world.
                 </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Digital Access (QR Code) - REFINED -->
        <div class="p-[1px] rounded-[40px] bg-gradient-to-br from-white/10 to-transparent shadow-2xl">
          <div class="bg-[#0d0d0f] dark:bg-[#0d0d0f] light:bg-white rounded-[39px] p-8 space-y-8 flex flex-col items-center text-center">
            <div class="space-y-2">
              <h3 class="text-xl font-black text-white dark:text-white light:text-gray-900 uppercase tracking-tighter">Digital Access</h3>
              <p class="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none">Scanning opens live menu</p>
            </div>

            <div class="relative group/qr">
               <div class="p-4 rounded-[40px] bg-white shadow-2xl transition-transform duration-500 group-hover/qr:scale-105 active:scale-95 cursor-pointer" id="qr-code-canvas">
                  <QrcodeVue
                    :value="publicMenuUrl"
                    :size="160"
                    level="H"
                    render-as="canvas"
                    foreground="#0d0d0f"
                    background="#ffffff"
                  />
               </div>
               <!-- Animated border overlay -->
               <div class="absolute -inset-2 border-2 border-dashed border-emerald-500/20 rounded-[48px] animate-[spin_20s_linear_infinite]" />
            </div>

            <div class="w-full space-y-3">
              <UButton
                icon="i-heroicons-arrow-down-tray"
                label="Download QR Code"
                color="neutral"
                variant="soft"
                class="w-full rounded-2xl font-black py-4 transition-all hover:bg-emerald-500/10 hover:text-emerald-400 active:scale-95"
                @click="downloadQRCode"
              />
              <UButton
                icon="i-heroicons-link"
                label="Copy Menu Link"
                color="neutral"
                variant="ghost"
                class="w-full rounded-2xl font-bold py-3 text-xs opacity-60 hover:opacity-100 transition-all"
                @click="copyMenuLink"
              />
            </div>
          </div>
        </div>

        <!-- Quick Activity Stats -->
        <div class="grid grid-cols-2 gap-4">
           <div class="group p-6 rounded-[28px] bg-white/[0.02] dark:bg-white/[0.02] light:bg-white border border-white/[0.05] dark:border-white/[0.05] light:border-gray-200 text-center transition-all hover:bg-emerald-500/5 hover:border-emerald-500/20 cursor-default">
              <div class="text-3xl font-black text-white dark:text-white light:text-gray-900 group-hover:text-emerald-400 transition-colors">{{ categories?.length || 0 }}</div>
              <div class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Categories</div>
           </div>
           <div class="group p-6 rounded-[28px] bg-white/[0.02] dark:bg-white/[0.02] light:bg-white border border-white/[0.05] dark:border-white/[0.05] light:border-gray-200 text-center transition-all hover:bg-purple-500/5 hover:border-purple-500/20 cursor-default">
              <div class="text-3xl font-black text-white dark:text-white light:text-gray-900 group-hover:text-purple-400 transition-colors">{{ project.menu?.menuItems?.length || 0 }}</div>
              <div class="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Items</div>
           </div>
        </div>
      </div>

      <!-- Right Column: Tabs Content (Premium Layout) -->
      <div class="lg:col-span-8">
        <div class="mb-4">
             <UTabs v-model="activeTab" :items="tabs" class="w-full" :ui="{ list: { base: 'rounded-2xl py-2', background: 'bg-white/[0.03] dark:bg-white/[0.03] light:bg-gray-100', marker: { base: 'bg-emerald-400 dark:bg-emerald-400 light:bg-emerald-500 rounded-xl' } } }">
                <template #info>
                    <div class="mt-8 space-y-6 animate-fade-in">
                       <div class="p-[1px] rounded-[32px] bg-gradient-to-br from-white/10 to-transparent">
                          <UCard class="bg-[#0d0d0f] dark:bg-[#0d0d0f] light:bg-white border-none rounded-[31px]">
                             <div class="p-4 md:p-8 space-y-12">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                                   <div class="space-y-2">
                                      <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Legal Brand Name</label>
                                      <div class="p-4 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-gray-50 border border-white/5 dark:border-white/5 light:border-gray-200 text-lg font-bold text-white dark:text-white light:text-gray-900">
                                         {{ project.title }}
                                      </div>
                                   </div>
                                   <div class="space-y-2">
                                      <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Project Root Slug</label>
                                      <div class="p-4 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-gray-50 border border-white/5 dark:border-white/5 light:border-gray-200 text-lg font-mono font-black text-emerald-400">
                                         /{{ project.slug }}
                                      </div>
                                   </div>
                                   <div class="md:col-span-2 space-y-2">
                                      <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Brand Description</label>
                                      <div class="p-5 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-gray-50 border border-white/5 dark:border-white/5 light:border-gray-200 text-gray-300 dark:text-gray-300 light:text-gray-700 leading-relaxed font-medium">
                                         {{ project.description || 'No description provided.' }}
                                      </div>
                                   </div>
                                   <div class="space-y-2">
                                      <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Public Contact</label>
                                      <div class="p-4 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-gray-50 border border-white/5 dark:border-white/5 light:border-gray-200 text-white dark:text-white light:text-gray-900 font-bold">
                                         {{ project.phone || 'Private line' }}
                                      </div>
                                   </div>
                                   <div class="space-y-2">
                                      <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Digital Presence</label>
                                      <div class="p-4 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-gray-50 border border-white/5 dark:border-white/5 light:border-gray-200 text-white dark:text-white light:text-gray-900 font-bold truncate">
                                         {{ project.website || 'sky-menu.app' }}
                                      </div>
                                   </div>
                                </div>
                                
                                <div class="pt-8 border-t border-white/5 dark:border-white/5 light:border-gray-100 flex flex-col md:flex-row gap-12">
                                   <div class="flex-1 space-y-4">
                                      <h3 class="text-xs font-black text-white dark:text-white light:text-gray-900 uppercase tracking-widest pr-4 border-r border-emerald-500/20 inline-block">Design Identity</h3>
                                      <div class="flex items-center gap-10">
                                         <div class="relative group/color transition-transform active:scale-95">
                                            <div class="size-14 rounded-2xl border-4 border-white/10 dark:border-white/10 light:border-gray-200 shadow-2xl transition-all group-hover/color:rotate-6" :style="{ backgroundColor: project.primaryColor || '#10b981' }" />
                                            <p class="text-[10px] font-black text-gray-500 mt-2 text-center uppercase">Primary</p>
                                         </div>
                                         <div class="relative group/color transition-transform active:scale-95">
                                            <div class="size-14 rounded-2xl border-4 border-white/10 dark:border-white/10 light:border-gray-200 shadow-2xl transition-all group-hover/color:-rotate-6" :style="{ backgroundColor: project.accentColor || '#3b82f6' }" />
                                            <p class="text-[10px] font-black text-gray-500 mt-2 text-center uppercase">Accent</p>
                                         </div>
                                      </div>
                                   </div>
                                   <div class="flex-1 space-y-4">
                                       <h3 class="text-xs font-black text-white dark:text-white light:text-gray-900 uppercase tracking-widest pr-4 border-r border-emerald-500/20 inline-block">Location Matrix</h3>
                                       <div class="p-4 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-gray-50 border border-white/5 dark:border-white/5 light:border-gray-200 flex items-center gap-3">
                                          <UIcon name="i-heroicons-map-pin" class="size-5 text-emerald-500" />
                                          <span class="text-sm font-bold text-white dark:text-white light:text-gray-900 truncate">{{ project.address || 'Global Digital Menu' }}</span>
                                       </div>
                                   </div>
                                </div>
                             </div>
                          </UCard>
                       </div>
                    </div>
                </template>

                <template #categories>
                    <div class="mt-8 space-y-6 animate-fade-in">
                       <div class="flex items-center justify-between px-2">
                           <div>
                               <h3 class="text-2xl font-black text-white dark:text-white light:text-gray-900 tracking-tight">Menu Categories</h3>
                               <p class="text-sm text-gray-500 font-medium">Categorize your menus for effortless browsing.</p>
                           </div>
                           <UButton icon="i-heroicons-plus-circle" label="New Category" color="success" class="rounded-xl font-black px-6 active:scale-95 transition-all shadow-lg shadow-emerald-500/10" @click="openAddCategory" />
                       </div>

                       <div v-if="categories?.length" class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                          <div v-for="category in categories" :key="category.id" class="p-[1px] rounded-[28px] bg-gradient-to-br from-white/5 to-transparent hover:from-white/10 transition-all duration-500">
                             <div class="bg-[#0d0d0f]/60 dark:bg-[#0d0d0f]/60 light:bg-white backdrop-blur-3xl rounded-[27px] p-5 group flex gap-5">
                                <div class="relative shrink-0">
                                   <div v-if="category.imageUrl" class="size-20 rounded-2xl overflow-hidden border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                      <img :src="category.imageUrl" class="size-full object-cover" />
                                   </div>
                                   <div v-else class="size-20 rounded-2xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-gray-50 flex items-center justify-center border border-white/10">
                                      <UIcon name="i-heroicons-tag" class="text-emerald-500/20 size-10" />
                                   </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                   <h4 class="font-black text-white dark:text-white light:text-gray-900 text-lg tracking-tight">{{ category.name }}</h4>
                                   <p class="text-[11px] text-gray-500 line-clamp-2 mt-1 font-medium">{{ category.description }}</p>
                                   <div class="flex items-center gap-1 mt-3 transition-transform">
                                      <UButton icon="i-heroicons-pencil-square" variant="soft" color="neutral" size="xs" class="rounded-lg" @click="openEditCategory(category)" />
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                       
                       <div v-else class="rounded-[40px] border-2 border-dashed border-white/5 dark:border-white/5 light:border-gray-200 py-24 flex flex-col items-center justify-center text-center px-6">
                           <div class="size-20 rounded-3xl bg-emerald-500/5 flex items-center justify-center mb-6">
                              <UIcon name="i-heroicons-squares-plus" class="size-10 text-emerald-500/40" />
                           </div>
                           <h4 class="text-2xl font-black text-white dark:text-white light:text-gray-900 tracking-tight">Empty Categories</h4>
                           <p class="text-gray-500 font-medium max-w-sm mt-3 leading-relaxed">Let's build your menu structure. Create categories to start organizing your culinary items.</p>
                           <UButton icon="i-heroicons-plus" label="Build First Category" color="success" class="mt-10 rounded-xl font-black px-10 active:scale-95 transition-all" @click="openAddCategory" />
                       </div>
                    </div>
                </template>

                <template #items>
                    <div class="mt-8 space-y-6 animate-fade-in">
                        <div v-if="project.menu">
                           <div class="flex items-center justify-between px-2 mb-6">
                               <div>
                                   <h3 class="text-2xl font-black text-white dark:text-white light:text-gray-900 tracking-tight">Menu Items List</h3>
                                   <p class="text-sm text-gray-500 font-medium">Add, update and manage your delicious items.</p>
                               </div>
                               <UButton
                                 icon="i-heroicons-plus-circle"
                                 label="New Item"
                                 color="success"
                                 class="rounded-xl font-black px-6 active:scale-95 transition-all shadow-lg shadow-emerald-500/10"
                                 :disabled="!categories?.length"
                                 @click="openAddItem"
                               />
                           </div>

                           <div v-if="project.menu.menuItems?.length" class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                              <div v-for="item in project.menu.menuItems" :key="item.id" class="p-[1px] rounded-[32px] bg-gradient-to-br from-white/5 to-transparent hover:from-white/10 transition-all duration-500">
                                 <div class="bg-[#0d0d0f]/60 dark:bg-[#0d0d0f]/60 light:bg-white backdrop-blur-3xl rounded-[31px] p-6 group flex gap-6">
                                    <div class="relative shrink-0 flex items-center">
                                       <div v-if="item.images?.length" class="size-24 rounded-[26px] overflow-hidden border border-white/10 shadow-2xl group-hover:rotate-2 transition-transform duration-500">
                                          <img :src="item.images[0]" class="size-full object-cover" />
                                       </div>
                                       <div v-else class="size-24 rounded-[26px] bg-white/[0.03] dark:bg-white/[0.03] light:bg-gray-50 flex items-center justify-center border border-white/10">
                                          <UIcon name="i-heroicons-cake" class="text-purple-500/20 size-12" />
                                       </div>
                                       <div v-if="!item.isAvailable" class="absolute -top-1 -right-1 z-10 size-6 rounded-full bg-red-500 border-2 border-black flex items-center justify-center">
                                          <UIcon name="i-heroicons-x-mark" class="size-3 text-white font-bold" />
                                       </div>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                       <div class="flex items-center justify-between">
                                           <h4 class="font-black text-white dark:text-white light:text-gray-900 text-lg tracking-tight truncate">{{ item.name }}</h4>
                                           <span class="text-emerald-400 font-black font-mono text-base">{{ project?.currency }} {{ item.price }}</span>
                                       </div>
                                       <p class="text-[11px] text-gray-500 line-clamp-2 mt-1.5 font-bold leading-relaxed">{{ item.description }}</p>
                                       
                                       <div class="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                                          <UButton icon="i-heroicons-pencil-square" variant="soft" color="neutral" size="xs" class="rounded-lg px-3" label="Edit" @click="openEditItem(item)" />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           
                           <div v-else class="rounded-[40px] border-2 border-dashed border-white/5 dark:border-white/5 light:border-gray-200 py-24 flex flex-col items-center justify-center text-center px-6">
                               <div class="size-20 rounded-3xl bg-purple-500/5 flex items-center justify-center mb-6">
                                  <UIcon name="i-heroicons-cake" class="size-10 text-purple-500/40" />
                               </div>
                               <h4 class="text-2xl font-black text-white dark:text-white light:text-gray-900 tracking-tight">Menu Empty</h4>
                               <p class="text-gray-500 font-medium max-w-sm mt-3 leading-relaxed">
                                  {{ categories?.length ? 'Your categories are ready. Add your first signature dish to the menu.' : 'Build category architecture before populating your menu items.' }}
                                </p>
                               <UButton
                                 v-if="categories?.length"
                                 icon="i-heroicons-plus"
                                 label="Cook First Item"
                                 color="success"
                                 class="mt-10 rounded-xl font-black px-10 active:scale-95 transition-all"
                                 @click="openAddItem"
                               />
                               <UButton
                                 v-else
                                 icon="i-heroicons-squares-2x2"
                                 label="Build Architecture"
                                 variant="ghost"
                                 class="mt-10 rounded-xl font-black px-10"
                                 @click="goToCategories"
                               />
                           </div>
                        </div>

                        <div v-else class="rounded-[40px] border-2 border-dashed border-white/5 dark:border-white/5 light:border-gray-200 py-24 flex flex-col items-center justify-center text-center px-6">
                           <div class="size-20 rounded-3xl bg-emerald-500/5 flex items-center justify-center mb-6">
                              <UIcon name="i-heroicons-book-open" class="size-10 text-emerald-500/40" />
                           </div>
                           <h4 class="text-2xl font-black text-white dark:text-white light:text-gray-900 tracking-tight">Main Menu Required</h4>
                           <p class="text-gray-500 font-medium max-w-sm mt-3 leading-relaxed">This project is not yet initialized. We need to create the main menu core before adding items.</p>
                           <UButton label="Initialize your Menu" color="success" class="mt-10 rounded-xl font-black px-10 :loading=loading active:scale-95 transition-all shadow-lg shadow-emerald-500/10" @click="createMenu" />
                        </div>
                    </div>
                </template>
             </UTabs>
        </div>
      </div>
    </div>

    <!-- Specialized Project Modal -->
    <ProjectModal
      v-model:open="isProjectModalOpen"
      :project="project"
      @success="refreshProject"
    />

    <!-- Specialized Category Modal -->
    <CategoryModal
      v-if="isCategoryModalOpen"
      v-model:open="isCategoryModalOpen"
      :project-id="id"
      :category="selectedCategory"
      @success="refreshCategories"
    />

    <!-- Specialized Menu Item Modal -->
    <MenuItemModal
      v-if="isItemModalOpen && project.menu"
      v-model:open="isItemModalOpen"
      :menu-id="project.menu.id"
      :categories="categories || []"
      :item="selectedItem"
      @success="refreshProject"
    />

    />
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
}
</style>
