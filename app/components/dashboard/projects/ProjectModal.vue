<script setup lang="ts">
import { projectsRepository } from '~/repositories/projects'
import { UpdateProjectValidationSchema, type TUpdateProjectValidationSchema } from '~/zod/projects/UpdateProjectValidation'

const props = defineProps<{
  project?: any // If provided, we are in edit mode
}>()

const emit = defineEmits(['success', 'deleted'])

const { $api } = useNuxtApp()
const projectsRepo = projectsRepository($api)
const toast = useToast()
const router = useRouter()

const isOpen = defineModel<boolean>('open', { default: false })
const loading = ref(false)
const isDeleteProjectModalOpen = ref(false)

const state = reactive({
  title: props.project?.title || '',
  description: props.project?.description || '',
  currency: props.project?.currency || 'USD',
  address: props.project?.address || '',
  phone: props.project?.phone || '',
  website: props.project?.website || '',
  isPublished: props.project?.isPublished || false,
  primaryColor: props.project?.primaryColor || '#10b981',
  accentColor: props.project?.accentColor || '#3b82f6',
  menuUIType: props.project?.menuUIType || 'one',
})

watch(() => props.project, (newVal) => {
  if (newVal) {
    state.title = newVal.title || ''
    state.description = newVal.description || ''
    state.currency = newVal.currency || 'USD'
    state.address = newVal.address || ''
    state.phone = newVal.phone || ''
    state.website = newVal.website || ''
    state.isPublished = newVal.isPublished || false
    state.primaryColor = newVal.primaryColor || '#10b981'
    state.accentColor = newVal.accentColor || '#3b82f6'
    state.menuUIType = newVal.menuUIType || 'one'
  }
}, { immediate: true })

async function onSubmit(event: { data: TUpdateProjectValidationSchema }) {
  try {
    loading.value = true
    if (props.project) {
      await projectsRepo.updateProject(props.project.id, event.data)
      toast.add({ title: 'Project updated successfully!', color: 'success' })
    } else {
      // For creation, we might need a different schema or just handle it here
      // But user focus is on refactoring current settings
      await projectsRepo.createProject({
        ...event.data,
        logo: '', // Handle logo separately if needed
        coverImage: null
      })
      toast.add({ title: 'Project created successfully!', color: 'success' })
    }
    emit('success')
    isOpen.value = false
  } catch (err) {
    console.error('Project settings error:', err)
    toast.add({ title: 'Failed to save project settings.', color: 'error' })
  } finally {
    loading.value = false
  }
}

const confirmDeleteProject = () => {
  isDeleteProjectModalOpen.value = true
}

const deleteProject = async () => {
  if (!props.project?.id) return
  try {
    loading.value = true
    await projectsRepo.deleteProject(props.project.id)
    toast.add({ title: 'Project deleted', color: 'success' })
    isDeleteProjectModalOpen.value = false
    isOpen.value = false
    router.push('/projects')
  } catch (err) {
    toast.add({ title: 'Failed to delete project', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <USlideover 
    v-model:open="isOpen"
    :ui="{ 
      content: 'bg-[#0d0d0f] dark:bg-[#0d0d0f] light:bg-white border-white/10 dark:border-white/10 light:border-gray-200' 
    }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full h-full px-4 text-white">
        <div class="flex items-center gap-3">
           <div class="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-cog-6-tooth" class="size-5 text-emerald-500" />
           </div>
           <h3 class="text-xl font-black uppercase tracking-tighter">{{ project ? 'Project Config' : 'New Project' }}</h3>
        </div>
        <div class="flex items-center gap-2">
           <UButton 
              v-if="project"
              icon="i-heroicons-trash" 
              color="error" 
              variant="soft" 
              size="xs"
              class="rounded-lg" 
              @click="confirmDeleteProject"
            />
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="lg"
            class="rounded-xl"
            @click="isOpen = false"
          />
        </div>
      </div>
    </template>

    <template #body>
      <UForm
        id="project-settings-form"
        :schema="UpdateProjectValidationSchema"
        :state="state"
        class="space-y-10 px-4 pb-20"
        @submit="onSubmit"
      >
        <div class="space-y-8">
          <UFormField label="Legal Name" name="title" required>
            <UInput v-model="state.title" size="xl" class="w-full" :ui="{ base: 'rounded-2xl border-white/10 dark:border-white/10 light:border-gray-200 bg-white/5 focus:ring-emerald-500 text-white' }" />
          </UFormField>

          <UFormField label="Brand Story" name="description" required>
            <UTextarea v-model="state.description" :rows="4" size="xl" class="w-full" :ui="{ base: 'rounded-2xl border-white/10 dark:border-white/10 light:border-gray-200 bg-white/5 focus:ring-emerald-500 text-white' }" />
          </UFormField>

          <div class="grid grid-cols-2 gap-6">
            <UFormField label="Currency" name="currency">
              <UInput v-model="state.currency" placeholder="USD, ETB..." size="xl" class="w-full" :ui="{ base: 'rounded-2xl border-white/10 dark:border-white/10 light:border-gray-200 bg-white/5 text-white' }" />
            </UFormField>

            <UFormField label="Contact" name="phone">
              <UInput v-model="state.phone" size="xl" class="w-full" :ui="{ base: 'rounded-2xl border-white/10 dark:border-white/10 light:border-gray-200 bg-white/5 text-white' }" />
            </UFormField>
          </div>

          <UFormField label="Official Website" name="website">
            <UInput v-model="state.website" placeholder="https://..." size="xl" class="w-full" :ui="{ base: 'rounded-2xl border-white/10 dark:border-white/10 light:border-gray-200 bg-white/5 text-white' }" />
          </UFormField>

          <UFormField label="Physical Presence" name="address">
            <UInput v-model="state.address" size="xl" class="w-full" :ui="{ base: 'rounded-2xl border-white/10 dark:border-white/10 light:border-gray-200 bg-white/5 text-white' }" />
          </UFormField>

          <!-- Brand Identity -->
          <div class="p-6 rounded-3xl bg-white/[0.03] dark:bg-white/[0.03] light:bg-gray-50 border border-white/5 dark:border-white/5 light:border-gray-200 space-y-6">
              <div class="flex items-center gap-2 mb-2">
                 <UIcon name="i-heroicons-paint-brush" class="size-4 text-emerald-500" />
                 <h4 class="text-xs font-black uppercase tracking-widest text-white">Brand Identity</h4>
              </div>
              <div class="grid grid-cols-2 gap-8">
                  <UFormField label="Primary" name="primaryColor">
                      <div class="flex items-center gap-3">
                      <UInput v-model="state.primaryColor" type="color" class="size-12 p-1.5 bg-transparent border-none" />
                      <UInput v-model="state.primaryColor" size="sm" class="flex-1 font-mono text-[10px] text-white" :ui="{ base: 'rounded-xl border-white/10 bg-white/5 uppercase' }" />
                      </div>
                  </UFormField>

                  <UFormField label="Accent" name="accentColor">
                      <div class="flex items-center gap-3">
                      <UInput v-model="state.accentColor" type="color" class="size-12 p-1.5 bg-transparent border-none" />
                      <UInput v-model="state.accentColor" size="sm" class="flex-1 font-mono text-[10px] text-white" :ui="{ base: 'rounded-xl border-white/10 bg-white/5 uppercase' }" />
                      </div>
                  </UFormField>
              </div>
          </div>

          <!-- Menu UI Type -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 px-1">
              <UIcon name="i-heroicons-computer-desktop" class="size-4 text-emerald-500" />
              <h4 class="text-xs font-black uppercase tracking-widest text-white">Menu UI Style</h4>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div 
                v-for="type in ['one', 'two', 'three']" 
                :key="type"
                class="relative cursor-pointer transition-all active:scale-95"
                @click="state.menuUIType = type as 'one' | 'two' | 'three'"
              >
                <div 
                  class="p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 bg-white/[0.03]"
                  :class="state.menuUIType === type ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-white/5'"
                >
                  <div class="size-10 rounded-xl flex items-center justify-center bg-white/[0.05]" :class="state.menuUIType === type ? 'text-emerald-500' : 'text-gray-500'">
                     <span class="text-lg font-black uppercase">{{ type }}</span>
                  </div>
                  <p class="text-[10px] font-black uppercase tracking-widest" :class="state.menuUIType === type ? 'text-emerald-400' : 'text-gray-500'">Style {{ type }}</p>
                </div>
                <div v-if="state.menuUIType === type" class="absolute -top-1 -right-1 size-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#0d0d0f]">
                  <UIcon name="i-heroicons-check" class="size-3 text-black font-black" />
                </div>
              </div>
            </div>
          </div>

          <!-- Public switch -->
          <div class="flex items-center justify-between p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
            <div class="space-y-1">
              <h4 class="text-sm font-black text-white uppercase tracking-widest leading-none">Global Launch</h4>
              <p class="text-[10px] text-gray-500 font-bold uppercase">Toggle visibility to the world</p>
            </div>
            <USwitch v-model="state.isPublished" color="success" size="lg" />
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 w-full p-4">
        <div class="flex-1" />
        <UButton variant="ghost" label="Dismiss" class="rounded-xl font-bold" @click="isOpen = false" />
        <UButton type="submit" form="project-settings-form" :label="'Commit Changes'" :loading="loading" color="emerald" class="rounded-xl font-black px-8 py-3 shadow-lg shadow-emerald-500/10 active:scale-95 transition-all" />
      </div>
    </template>
  </USlideover>

  <AppConfirmModal
    v-model:open="isDeleteProjectModalOpen"
    title="Delete Project?"
    description="This will move the project to trash and hide it from the public. This action is irreversible."
    confirm-button-text="Delete Project"
    :loading="loading"
    @confirm="deleteProject"
  />
</template>
