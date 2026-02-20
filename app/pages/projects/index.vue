<script setup lang="ts">
import { projectsRepository } from '~/repositories/projects'

definePageMeta({
  layout: 'dashboard',
})

const layout = ref<'grid' | 'list'>('grid')

// Mock data preserved from original for UI demonstration
const { $api } = useNuxtApp()
const projectsRepo = projectsRepository($api)
const toast = useToast()

const { data: projects, status, refresh } = await useAsyncData('projects', () => projectsRepo.getMyProjects())

const deleteProject = async (id: number) => {
  try {
    await projectsRepo.deleteProject(id)
    toast.add({ title: 'Project deleted', color: 'success' })
    refresh()
  } catch (err) {
    toast.add({ title: 'Failed to delete project', color: 'error' })
  }
}
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
    <div v-else-if="layout === 'grid' && projects?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="project in projects"
        :key="project.id"
        class="overflow-hidden bg-white/5 border-white/10 hover:border-emerald-500/50 transition-colors group cursor-pointer"
        :ui="{ body: { padding: 'p-0' } }"
        @click="navigateTo(`/projects/${project.id}`)"
      >
        <template #header>
          <div class="relative h-48 w-full bg-zinc-900 flex items-center justify-center overflow-hidden">
            <img v-if="project.coverImage" :src="project.coverImage" class="h-full w-full object-cover" />
            <UIcon v-else name="i-heroicons-photo" class="size-12 text-gray-700" />
            <div class="absolute top-4 left-4 flex gap-2">
              <UBadge
                :label="project.isPublished ? 'Published' : 'Draft'"
                :color="project.isPublished ? 'success' : 'warning'"
                variant="subtle"
              />
            </div>
          </div>
        </template>
        
        <div class="p-5 space-y-4">
          <div class="flex items-start justify-between">
            <div class="flex gap-3">
              <div v-if="project.logo" class="size-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                <img :src="project.logo" class="size-full object-cover" />
              </div>
              <div>
                <h3 class="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                  {{ project.title }}
                </h3>
                <p class="text-sm text-gray-400 line-clamp-1 mt-1">
                  {{ project.description }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <span class="text-sm font-medium text-gray-400">{{ project.currency }}</span>
            <div class="flex items-center gap-2">
              <UButton icon="i-heroicons-pencil-square" variant="ghost" color="neutral" size="sm" @click.stop="navigateTo(`/projects/${project.id}`)" />
              <UButton label="View Menu" color="emerald" size="sm" variant="soft" />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- List Layout -->
    <div v-else-if="layout === 'list' && projects?.length" class="space-y-4">
      <UCard
        v-for="project in projects"
        :key="project.id"
        class="bg-white/5 border-white/10 hover:border-emerald-500/50 transition-colors cursor-pointer"
        :ui="{ body: { padding: 'p-4' } }"
        @click="navigateTo(`/projects/${project.id}`)"
      >
        <div class="flex items-center gap-6">
          <div class="size-24 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0 overflow-hidden border border-white/10">
            <img v-if="project.logo" :src="project.logo" class="size-full object-cover" />
            <UIcon v-else name="i-heroicons-photo" class="size-8 text-gray-700" />
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-lg text-white">{{ project.title }}</h3>
                  <UBadge :label="project.isPublished ? 'Published' : 'Draft'" size="xs" variant="soft" :color="project.isPublished ? 'success' : 'warning'" />
                </div>
                <p class="text-sm text-gray-400 line-clamp-2 italic">{{ project.description }}</p>
                <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span v-if="project.address" class="flex items-center gap-1">
                    <UIcon name="i-heroicons-map-pin" class="size-3" />
                    {{ project.address }}
                  </span>
                  <span v-if="project.phone" class="flex items-center gap-1">
                    <UIcon name="i-heroicons-phone" class="size-3" />
                    {{ project.phone }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 pl-4 border-l border-white/10">
            <UButton icon="i-heroicons-pencil-square" variant="ghost" color="neutral" @click.stop="navigateTo(`/projects/${project.id}`)" />
            <UPopconfirm title="Are you sure?" description="This action cannot be undone." @confirm="deleteProject(project.id)">
              <UButton icon="i-heroicons-trash" variant="ghost" color="error" @click.stop />
            </UPopconfirm>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <div v-else-if="status === 'success' || status === 'error'" class="flex flex-col items-center justify-center py-20 bg-white/5 border border-dashed border-white/10 rounded-xl">
      <UIcon name="i-heroicons-folder-plus" class="size-16 text-gray-600 mb-4" />
      <h3 class="text-xl font-bold text-white mb-2">No projects found</h3>
      <p class="text-gray-400 mb-6">Start by creating your first digital menu project.</p>
      <DashboardProjectsNewProject @success="refresh" />
    </div>
  </div>
</template>
