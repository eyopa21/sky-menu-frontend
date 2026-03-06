<script setup lang="ts">
import { projectsRepository } from '~/repositories/projects'

definePageMeta({
  layout: 'dashboard',
})

const layout = ref<'grid' | 'list'>('grid')
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
  <div class="space-y-12">
    <!-- Header / Banner Style (Consistent with Settings) -->
    <div class="relative rounded-[32px] overflow-hidden p-8 md:p-12 bg-gradient-to-br from-white/[0.03] to-transparent dark:from-white/[0.03] light:from-gray-100 border border-white/[0.06] dark:border-white/[0.06] light:border-gray-200">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div class="text-center md:text-left">
          <h1 class="text-3xl md:text-5xl font-black tracking-tight text-white dark:text-white light:text-gray-900 mb-3">
            My <span class="text-emerald-400">Projects</span>
          </h1>
          <p class="text-gray-400 dark:text-gray-400 light:text-gray-600 font-medium max-w-lg">
            Manage your digital menus, track performance, and scale your restaurant brand with ease.
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center rounded-2xl bg-white/5 dark:bg-white/5 light:bg-white p-1.5 border border-white/5 dark:border-white/5 light:border-gray-200 shadow-inner">
            <UButton
              icon="i-heroicons-squares-2x2"
              :variant="layout === 'grid' ? 'solid' : 'ghost'"
              size="md"
              class="rounded-xl transition-all font-bold"
              :color="layout === 'grid' ? 'emerald' : 'neutral'"
              @click="layout = 'grid'"
            />
            <UButton
              icon="i-heroicons-list-bullet"
              :variant="layout === 'list' ? 'solid' : 'ghost'"
              size="md"
              class="rounded-xl transition-all font-bold"
              :color="layout === 'list' ? 'emerald' : 'neutral'"
              @click="layout = 'list'"
            />
          </div>
          <DashboardProjectsNewProject @success="refresh" />
        </div>
      </div>
      <!-- Decorative Glow -->
      <div class="absolute -top-24 -right-24 size-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
    </div>

    <!-- Loading State -->
    <div v-if="status === 'pending'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 3" :key="i" class="h-80 w-full rounded-[3px] p-[1px] bg-white/5 bg-gradient-to-br from-emerald-500/20 to-transparent">
        <USkeleton class="h-full w-full rounded-[31px] bg-app-section" />
      </div>
    </div>

    <!-- Grid Layout -->
    <div v-else-if="layout === 'grid' && projects?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="project in projects"
        :key="project.id"
        class="group relative h-full rounded-[3px] p-[1px] bg-gradient-to-br from-white/10 via-transparent to-transparent hover:from-emerald-500/30 transition-all duration-700 cursor-pointer shadow-lg hover:shadow-emerald-500/10"
        @click="navigateTo(`/projects/${project.id}`)"
      >
        <div class="h-full flex flex-col rounded-[31px] overflow-hidden bg-app-section dark:bg-app-section light:bg-white backdrop-blur-3xl transition-colors duration-500">
          <!-- Cover Image Section -->
          <div class="relative h-44 w-full bg-zinc-900 overflow-hidden shrink-0">
            <img 
              v-if="project.coverImage" 
              :src="project.coverImage" 
              class="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
            />
            <div v-else class="size-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950">
              <UIcon name="i-heroicons-photo" class="size-12 text-zinc-700/50" />
            </div>
            
            <!-- Badges -->
            <div class="absolute top-4 left-4 z-10">
              <UBadge
                :label="project.isPublished ? 'Published' : 'Draft'"
                :color="project.isPublished ? 'success' : 'warning'"
                variant="subtle"
                class="rounded-lg font-black tracking-tighter uppercase px-2.5 py-1 backdrop-blur-md"
              />
            </div>

            <!-- Shine Overlay -->
            <div class="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>

          <!-- Content Section -->
          <div class="p-6 flex flex-col grow gap-4">
            <div class="flex gap-4">
               <div v-if="project.logo" class="size-12 rounded-2xl overflow-hidden shrink-0 border-2 border-white/10 group-hover:border-emerald-500/30 transition-colors shadow-2xl">
                <img :src="project.logo" class="size-full object-cover" />
              </div>
              <div class="min-w-0">
                <h3 class="font-black text-xl text-white dark:text-white light:text-gray-900 group-hover:text-emerald-400 transition-colors truncate">
                  {{ project.title }}
                </h3>
                <p class="text-[11px] font-bold text-gray-500 dark:text-gray-500 light:text-gray-400 uppercase tracking-widest mt-0.5">
                  {{ project.slug }}
                </p>
              </div>
            </div>

            <p class="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 line-clamp-2 leading-relaxed">
              {{ project.description }}
            </p>

            <div class="mt-auto pt-4 flex items-center justify-between border-t border-white/5 dark:border-white/5 light:border-gray-100">
               <div class="flex items-center gap-1.5 p-1 px-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-50">
                  <span class="text-[10px] font-black text-emerald-500 dark:text-emerald-400 light:text-emerald-600 uppercase tracking-tighter">{{ project.currency }}</span>
               </div>
               <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <UButton icon="i-heroicons-pencil-square" variant="ghost" color="neutral" size="sm" class="rounded-lg" @click.stop="navigateTo(`/projects/${project.id}`)" />
                  <UButton label="View Live" color="emerald" size="sm" variant="soft" class="rounded-xl font-black px-4" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List Layout -->
    <div v-else-if="layout === 'list' && projects?.length" class="space-y-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="group relative rounded-[3px] p-[1px] bg-gradient-to-r from-white/10 via-transparent to-transparent hover:from-emerald-500/30 transition-all duration-700 cursor-pointer"
        @click="navigateTo(`/projects/${project.id}`)"
      >
        <div class="flex items-center gap-8 p-6 rounded-[28px] overflow-hidden bg-app-section dark:bg-app-section light:bg-white shadow-sm transition-colors duration-500">
          <div class="size-28 rounded-2xl bg-zinc-900 flex items-center justify-center shrink-0 overflow-hidden border border-white/10 group-hover:border-emerald-500/30 transition-all">
            <img v-if="project.logo" :src="project.logo" class="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <UIcon v-else name="i-heroicons-photo" class="size-10 text-zinc-700/50" />
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="font-black text-2xl text-white dark:text-white light:text-gray-900 tracking-tight">{{ project.title }}</h3>
                  <UBadge :label="project.isPublished ? 'Published' : 'Draft'" font-black uppercase text-[10px] :color="project.isPublished ? 'success' : 'warning'" variant="soft" class="rounded-lg px-2" />
                </div>
                <p class="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 line-clamp-1 italic max-w-2xl">{{ project.description }}</p>
                
                <div class="flex flex-wrap items-center gap-6 mt-4 opacity-60 group-hover:opacity-100 transition-opacity">
                  <span v-if="project.address" class="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                    <UIcon name="i-heroicons-map-pin" class="size-4 text-emerald-500/70" />
                    {{ project.address }}
                  </span>
                  <span v-if="project.phone" class="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                    <UIcon name="i-heroicons-phone" class="size-4 text-emerald-500/70" />
                    {{ project.phone }}
                  </span>
                  <span class="flex items-center gap-1.5 text-xs font-black text-emerald-500/80">
                    <UIcon name="i-heroicons-banknotes" class="size-4" />
                    {{ project.currency }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col md:flex-row items-center gap-2 pl-8 border-l border-white/5 dark:border-white/5 light:border-gray-100">
            <UButton icon="i-heroicons-pencil-square" variant="ghost" color="neutral" class="rounded-xl p-3" @click.stop="navigateTo(`/projects/${project.id}`)" />
            <UPopconfirm title="Delete Project?" description="This will permanently remove this project and all its data." @confirm="deleteProject(project.id)">
              <UButton icon="i-heroicons-trash" variant="ghost" color="error" class="rounded-xl p-3" @click.stop />
            </UPopconfirm>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State (Redesigned) -->
    <div v-else-if="status === 'success' || status === 'error'" class="flex flex-col items-center justify-center py-32 rounded-[3px] p-[1px] bg-gradient-to-br from-white/5 via-transparent to-white/5 border border-dashed border-white/10 dark:border-white/10 light:border-gray-200">
      <div class="relative mb-8">
         <div class="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-full" />
         <div class="relative size-24 rounded-3xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <UIcon name="i-heroicons-folder-plus" class="size-12 text-emerald-500/50" />
         </div>
      </div>
      <h3 class="text-3xl font-black text-white dark:text-white light:text-gray-900 mb-2 tracking-tight">Expand Your <span class="text-emerald-400">Empire</span></h3>
      <p class="text-gray-400 dark:text-gray-400 light:text-gray-600 font-medium mb-10 max-w-sm text-center px-4">
        You haven't created any digital menus yet. Start by creating a project for your first establishment.
      </p>
      <DashboardProjectsNewProject @success="refresh" />
    </div>
  </div>
</template>
