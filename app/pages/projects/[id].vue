<script setup lang="ts">
import { projectsRepository } from '~/repositories/projects'
import { UpdateProjectValidationSchema, type TUpdateProjectValidationSchema } from '~/zod/projects/UpdateProjectValidation'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const projectsRepo = projectsRepository($api)
const toast = useToast()

const id = computed(() => Number(route.params.id))
const loading = ref(false)
const isEditing = ref(false)

const { data: project, status, refresh } = await useAsyncData(`project-${id.value}`, () => projectsRepo.getProjectById(id.value))

const state = reactive({
  title: project.value?.title || '',
  description: project.value?.description || '',
  currency: project.value?.currency || 'ETB',
  address: project.value?.address || '',
  phone: project.value?.phone || '',
  website: project.value?.website || '',
  isPublished: project.value?.isPublished || false,
  primaryColor: project.value?.primaryColor || '#10b981',
  accentColor: project.value?.accentColor || '#3b82f6',
})

watch(project, (newVal) => {
  if (newVal) {
    state.title = newVal.title
    state.description = newVal.description
    state.currency = newVal.currency
    state.address = newVal.address || ''
    state.phone = newVal.phone || ''
    state.website = newVal.website || ''
    state.isPublished = newVal.isPublished
    state.primaryColor = newVal.primaryColor || '#10b981'
    state.accentColor = newVal.accentColor || '#3b82f6'
  }
}, { immediate: true })

async function onSubmit(event: { data: TUpdateProjectValidationSchema }) {
  try {
    loading.value = true
    await projectsRepo.updateProject(id.value, event.data)
    toast.add({ title: 'Project updated successfully!', color: 'success' })
    isEditing.value = false
    refresh()
  } catch (err) {
    console.error('Update project:', err)
    toast.add({ title: 'Failed to update project.', color: 'error' })
  } finally {
    loading.value = false
  }
}

const deleteProject = async () => {
  try {
    await projectsRepo.deleteProject(id.value)
    toast.add({ title: 'Project deleted', color: 'success' })
    router.push('/projects')
  } catch (err) {
    toast.add({ title: 'Failed to delete project', color: 'error' })
  }
}
</script>

<template>
  <div class="space-y-8 pb-20 w-full px-4 md:px-0">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <UButton
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="neutral"
          @click="router.push('/projects')"
        />
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            {{ project?.title }}
            <UBadge
              :label="project?.isPublished ? 'Published' : 'Draft'"
              :color="project?.isPublished ? 'success' : 'warning'"
              variant="soft"
              size="sm"
            />
          </h1>
          <p class="text-gray-400 mt-1">Project Details & Management</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <UPopconfirm title="Delete Project?" description="This will permanently remove this project and all its data." @confirm="deleteProject">
          <UButton
            icon="i-heroicons-trash"
            color="error"
            variant="soft"
            label="Delete"
          />
        </UPopconfirm>
        <UButton
          :label="isEditing ? 'Cancel Edit' : 'Edit Project'"
          :icon="isEditing ? 'i-heroicons-x-mark' : 'i-heroicons-pencil-square'"
          :variant="isEditing ? 'ghost' : 'solid'"
          @click="isEditing = !isEditing"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Summary & Preview -->
      <div class="space-y-6 lg:col-span-1">
        <UCard class="bg-white/5 border-white/10 overflow-hidden shadow-xl shadow-black/20" :ui="{ body: 'p-0' }">
          <div class="relative h-48 w-full bg-zinc-900 border-b border-white/10 flex items-center justify-center overflow-hidden">
            <img v-if="project?.coverImage" :src="project.coverImage" class="h-full w-full object-cover opacity-60" />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
            
            <div class="absolute -bottom-10 left-6">
              <div class="size-24 rounded-2xl bg-zinc-800 border-4 border-zinc-950 overflow-hidden shadow-2xl">
                <img v-if="project?.logo" :src="project.logo" class="size-full object-cover" />
                <div v-else class="size-full flex items-center justify-center">
                  <UIcon name="i-heroicons-photo" class="size-10 text-gray-700" />
                </div>
              </div>
            </div>
          </div>
          <div class="p-6 pt-12 space-y-4">
            <div>
              <h2 class="text-xl font-bold text-white">{{ project?.title }}</h2>
              <p class="text-sm text-gray-400 mt-1 italic">{{ project?.description }}</p>
            </div>
            
            <div class="pt-4 space-y-3 border-t border-white/5">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Currency</span>
                <span class="text-white font-medium">{{ project?.currency }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">Created</span>
                <span class="text-white font-medium">{{ project ? new Date(project.createdAt).toLocaleDateString() : '-' }}</span>
              </div>
            </div>
            
            <UButton block color="success" class="mt-4" icon="i-heroicons-eye">Preview Menu</UButton>
          </div>
        </UCard>
        
        <!-- Stats/Quick Info -->
        <UCard class="bg-white/5 border-white/10" title="Quick Stats">
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
              <div class="text-2xl font-bold text-white">0</div>
              <div class="text-xs text-gray-500 uppercase tracking-wider">Categories</div>
            </div>
            <div class="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
              <div class="text-2xl font-bold text-white">0</div>
              <div class="text-xs text-gray-500 uppercase tracking-wider">Items</div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Right Column: Settings / Form -->
      <div class="lg:col-span-2">
        <UCard class="bg-white/5 border-white/10 shadow-xl shadow-black/20 overflow-visible">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-white">Project Information</h2>
            </div>
          </template>

          <div class="space-y-8 p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Business Name</label>
                <p class="text-lg text-white font-medium">{{ project?.title }}</p>
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Slug</label>
                <p class="text-lg text-emerald-400 font-mono">/{{ project?.slug }}</p>
              </div>
              <div class="md:col-span-2 space-y-1">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Description</label>
                <p class="text-white leading-relaxed">{{ project?.description }}</p>
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Phone Number</label>
                <p class="text-white">{{ project?.phone || 'Not provided' }}</p>
              </div>
              <div class="space-y-1">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Website</label>
                <p class="text-white">{{ project?.website || 'Not provided' }}</p>
              </div>
              <div class="md:col-span-2 space-y-1">
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Address</label>
                <p class="text-white">{{ project?.address || 'Not provided' }}</p>
              </div>
            </div>
            
            <div class="pt-6 border-t border-white/10 space-y-4">
              <h3 class="text-sm font-bold text-white uppercase tracking-widest">Design Tokens</h3>
              <div class="flex items-center gap-6">
                <div class="flex items-center gap-3">
                  <div class="size-8 rounded-lg border border-white/20 shadow-inner" :style="{ backgroundColor: project?.primaryColor || '#10b981' }" />
                  <span class="text-sm text-gray-300">Primary Color</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="size-8 rounded-lg border border-white/20 shadow-inner" :style="{ backgroundColor: project?.accentColor || '#3b82f6' }" />
                  <span class="text-sm text-gray-300">Accent Color</span>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Edit Project Slideover -->
    <USlideover v-model:open="isEditing" title="Edit Project Settings">
      <template #content>
        <UForm
          :schema="UpdateProjectValidationSchema"
          :state="state"
          class="space-y-6 p-6"
          @submit="onSubmit"
        >
          <div class="space-y-6">
            <UFormField label="Title" name="title" required>
              <UInput v-model="state.title" class="w-full" />
            </UFormField>

            <UFormField label="Description" name="description" required>
              <UTextarea v-model="state.description" :rows="4" class="w-full" />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Currency" name="currency">
                <UInput v-model="state.currency" placeholder="USD, ETB, etc." />
              </UFormField>

              <UFormField label="Phone" name="phone">
                <UInput v-model="state.phone" />
              </UFormField>
            </div>

            <UFormField label="Website" name="website">
              <UInput v-model="state.website" placeholder="https://..." />
            </UFormField>

            <UFormField label="Address" name="address">
              <UInput v-model="state.address" />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Primary Color" name="primaryColor">
                <div class="flex items-center gap-3">
                  <UInput v-model="state.primaryColor" type="color" class="size-10 p-1 bg-transparent" />
                  <UInput v-model="state.primaryColor" class="flex-1" />
                </div>
              </UFormField>

              <UFormField label="Accent Color" name="accentColor">
                <div class="flex items-center gap-3">
                  <UInput v-model="state.accentColor" type="color" class="size-10 p-1 bg-transparent" />
                  <UInput v-model="state.accentColor" class="flex-1" />
                </div>
              </UFormField>
            </div>

            <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-white">Project Visibility</h4>
                <p class="text-xs text-gray-400">Published projects are visible to the public.</p>
              </div>
              <USwitch v-model="state.isPublished" color="success" />
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-6 border-t border-white/10">
            <UButton variant="ghost" label="Cancel" @click="isEditing = false" />
            <UButton type="submit" label="Save Changes" :loading="loading" color="success" />
          </div>
        </UForm>
      </template>
    </USlideover>
  </div>
</template>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
