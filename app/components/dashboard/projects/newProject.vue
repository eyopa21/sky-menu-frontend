<script setup lang="ts">
import { ref, reactive } from 'vue'
import { projectsRepository } from '~/repositories/projects'
import { CreateProjectValidationSchema, type TCreateProjectValidationSchema } from '~/zod/projects/CreateProjectValidation'

const { $api } = useNuxtApp()
const { uploadFile } = useFileUploader()
const toast = useToast()
const loading = ref(false)
const isOpen = ref(false)

const state = reactive({
  title: '',
  description: '',
  logo: undefined,
  coverImage: undefined,
})

const projectRepo = projectsRepository($api)

async function onSubmit(event: { data: TCreateProjectValidationSchema }) {
  try {
    loading.value = true
    
    // Note: In a real app, you'd handle file uploads before creating the project
    // This logic is preserved from the original component
    const results = await Promise.allSettled([
      event.data.logo ? uploadFile(event.data.logo) : Promise.resolve(null),
      event.data.coverImage ? uploadFile(event.data.coverImage) : Promise.resolve(null),
    ])

    const [logoUpload, coverImageUpload] = results

    if (logoUpload.status === 'rejected' || coverImageUpload.status === 'rejected') {
      throw new Error('One or more of your image uploads failed')
    }

    const data = await projectRepo.createProject({
      description: event.data.description,
      title: event.data.title,
      logo: logoUpload.status === 'fulfilled' ? logoUpload.value : '',
      coverImage: coverImageUpload.status === 'fulfilled' ? coverImageUpload.value : null,
    })

    if (data) {
      isOpen.value = false
      toast.add({ title: 'Project created successfully!', color: 'success' })
      // Clear state
      state.title = ''
      state.description = ''
    }
  } catch (err) {
    console.error('Create project:', err)
    toast.add({ title: 'An error occurred.', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <UButton label="New Project" icon="i-heroicons-plus" @click="isOpen = true" />

    <UModal v-model:open="isOpen" title="New Project" description="Create a new digital menu project.">
      <template #content>
        <UForm
          :schema="CreateProjectValidationSchema"
          :state="state"
          class="space-y-6"
          @submit="onSubmit"
        >
          <UFormField label="Title" name="title" required>
            <UInput
              v-model="state.title"
              placeholder="e.g. My Cafe Menu"
              icon="i-heroicons-tag"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Description" name="description">
            <UTextarea
              v-model="state.description"
              placeholder="Brief description of your restaurant or menu..."
              class="w-full"
              :rows="4"
            />
          </UFormField>

          <!-- File Uploaders would go here - preserved original comment logic -->
          <div class="flex justify-end gap-3">
            <UButton variant="ghost" label="Cancel" @click="isOpen = false" />
            <UButton type="submit" label="Create Project" :loading="loading" />
          </div>
        </UForm>
      </template>
    </UModal>
  </div>
</template>
