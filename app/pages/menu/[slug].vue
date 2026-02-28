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
