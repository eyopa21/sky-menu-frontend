<script setup lang="ts">
import { projectsRepository } from '~/repositories/projects'
import type { MenuItem } from '~/repositories/menu-items/response/menu-items'
import type { Category } from '~/repositories/categories/response/categories'
import PublicItemDetailSlideover from '~/components/public/ItemDetailSlideover.vue'
import MenuLayoutOne from '~/components/public/MenuLayoutOne.vue'
import MenuLayoutTwo from '~/components/public/MenuLayoutTwo.vue'
import MenuLayoutThree from '~/components/public/MenuLayoutThree.vue'

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

const layouts = {
  one: MenuLayoutOne,
  two: MenuLayoutTwo,
  three: MenuLayoutThree
}

const activeCategory = ref<number | null>(null)
const selectedItem = ref<MenuItem | null>(null)
const isSlideoverOpen = ref(false)

const currentLayout = computed(() => {
  const type = project.value?.menuUIType as keyof typeof layouts
  return layouts[type] || MenuLayoutTwo
})

const menuItemsByCategory = computed(() => {
  if (!project.value?.menu?.menuItems) return {}
  
  const grouped: Record<number, MenuItem[]> = {}
  project.value?.menu?.menuItems?.forEach(item => {
    if (!grouped[item.categoryId]) {
      grouped[item.categoryId] = []
    }
    grouped[item.categoryId].push(item)
  })
  return grouped
})

const categoriesWithItems = computed(() => {
  if (!project.value?.categories) return []
  return project.value.categories.filter(cat => {
    const items = menuItemsByCategory.value?.[cat.id]
    return items && items.length > 0
  })
})

const openItemDetail = (item: MenuItem) => {
  selectedItem.value = item
  isSlideoverOpen.value = true
}

useHead({
  title: project.value?.title || 'Menu',
  meta: [
    { name: 'description', content: project.value?.description || 'Browse our menu' }
  ]
})
</script>

<template>
  <div v-if="project">
    <component 
      :is="currentLayout" 
      :project="project" 
      :categories="project.categories || []" 
      :menuItemsByCategory="menuItemsByCategory"
      @openItemDetail="openItemDetail"
    />

    <!-- Item Detail Slideover (Shared across layouts) -->
    <PublicItemDetailSlideover
      v-model:open="isSlideoverOpen"
      :project="project"
      :item="selectedItem"
    />

    <!-- Floating Action Buttons -->
    <div class="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
       <!-- Payment Button -->
       <div class="animate-bounce-subtle">
          <UTooltip text="View Payment Methods" :popper="{ placement: 'left' }">
             <UButton 
                icon="i-heroicons-credit-card" 
                size="xl" 
                class="rounded-full size-16 shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-4 border-white dark:border-[var(--color-app-bg)]"
                :style="{ backgroundColor: project.primaryColor || '#10b981', color: 'white' }"
                @click="navigateTo(`/menu/${slug}/payment`)"
             />
          </UTooltip>
       </div>

       <!-- Feedback Button -->
       <div class="animate-bounce-subtle" style="animation-delay: 0.5s">
          <UTooltip text="Share Feedback" :popper="{ placement: 'left' }">
             <UButton 
                icon="i-heroicons-chat-bubble-bottom-center-text" 
                size="xl" 
                class="rounded-full size-16 shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-4 border-white dark:border-[var(--color-app-bg)]"
                :style="{ backgroundColor: project.primaryColor || '#10b981', color: 'white' }"
                @click="navigateTo(`/menu/${slug}/feedback`)"
             />
          </UTooltip>
       </div>
    </div>
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

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
.animate-bounce-subtle {
  animation: bounce-subtle 3s ease-in-out infinite;
}
</style>
