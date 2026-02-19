<script setup lang="ts">
import { projectsRepository } from '~/repositories/projects'

definePageMeta({
  layout: 'dashboard',
})

const layout = ref<'grid' | 'list'>('grid')

// Mock data preserved from original for UI demonstration
const products = ref([
  {
    id: '1000',
    name: 'Gourmet Burger',
    description: 'Fresh beef patty with secret sauce',
    category: 'Main Course',
    price: 15.99,
    rating: 4.8,
    status: 'In Stock',
  },
  {
    id: '1001',
    name: 'Classic Pizza',
    description: 'Hand-tossed dough with premium toppings',
    category: 'Pizza',
    price: 12.50,
    rating: 4.5,
    status: 'In Stock',
  },
  {
    id: '1002',
    name: 'Pasta Carbonara',
    description: 'Creamy sauce with authentic Italian pancetta',
    category: 'Pasta',
    price: 14.00,
    rating: 4.2,
    status: 'Low Stock',
  },
])

const { $api } = useNuxtApp()
const projectsRepo = projectsRepository($api)

const { data: projects, status } = await useAsyncData('projects', () => projectsRepo.getMyProjects())

const items = computed(() => {
  // If we have real projects, we could map them here. 
  // For now, using the products array to showcase the UI migration.
  return products.value
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">My Projects</h1>
        <p class="text-sm text-gray-400">Manage and preview your digital menus.</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center rounded-lg bg-white/5 p-1">
          <UButton
            icon="i-heroicons-squares-2x2"
            :variant="layout === 'grid' ? 'solid' : 'ghost'"
            size="sm"
            color="neutral"
            @click="layout = 'grid'"
          />
          <UButton
            icon="i-heroicons-list-bullet"
            :variant="layout === 'list' ? 'solid' : 'ghost'"
            size="sm"
            color="neutral"
            @click="layout = 'list'"
          />
        </div>
        <DashboardProjectsNewProject />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="status === 'pending'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <USkeleton v-for="i in 3" :key="i" class="h-64 w-full rounded-xl" />
    </div>

    <!-- Grid Layout -->
    <div v-else-if="layout === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="item in items"
        :key="item.id"
        class="overflow-hidden bg-white/5 border-white/10 hover:border-emerald-500/50 transition-colors group cursor-pointer"
        :ui="{ body: { padding: 'p-0' } }"
      >
        <template #header>
          <div class="relative h-48 w-full bg-zinc-900 flex items-center justify-center">
            <UIcon name="i-heroicons-photo" class="size-12 text-gray-700" />
            <UBadge
              :label="item.category"
              color="emerald"
              variant="subtle"
              class="absolute top-4 left-4"
            />
          </div>
        </template>
        
        <div class="p-5 space-y-4">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                {{ item.name }}
              </h3>
              <p class="text-sm text-gray-400 line-clamp-2 mt-1">
                {{ item.description }}
              </p>
            </div>
            <div class="flex items-center gap-1 text-yellow-500 font-medium">
              <UIcon name="i-heroicons-star-solid" class="size-4" />
              <span class="text-sm">{{ item.rating }}</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <span class="text-xl font-bold text-white">${{ item.price }}</span>
            <div class="flex items-center gap-2">
              <UButton icon="i-heroicons-heart" variant="ghost" color="neutral" size="sm" />
              <UButton label="Customize" color="emerald" size="sm" />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- List Layout -->
    <div v-else class="space-y-4">
      <UCard
        v-for="item in items"
        :key="item.id"
        class="bg-white/5 border-white/10 hover:border-emerald-500/50 transition-colors cursor-pointer"
        :ui="{ body: { padding: 'p-4' } }"
      >
        <div class="flex items-center gap-6">
          <div class="size-24 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
            <UIcon name="i-heroicons-photo" class="size-8 text-gray-700" />
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div>
                <UBadge :label="item.category" size="xs" variant="soft" color="emerald" class="mb-1" />
                <h3 class="font-bold text-lg text-white">{{ item.name }}</h3>
                <p class="text-sm text-gray-400 truncate">{{ item.description }}</p>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold text-white">${{ item.price }}</div>
                <div class="flex items-center gap-1 text-yellow-500 text-xs justify-end">
                  <UIcon name="i-heroicons-star-solid" class="size-3" />
                  <span>{{ item.rating }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 pl-4 border-l border-white/10">
            <UButton icon="i-heroicons-pencil-square" variant="ghost" color="neutral" />
            <UButton icon="i-heroicons-trash" variant="ghost" color="error" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
