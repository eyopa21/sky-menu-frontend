<script setup lang="ts">
import { CategoryValidationSchema, type TCategoryValidationSchema } from '~/zod/categories/CategoryValidation'
import { categoriesRepository } from '~/repositories/categories'
import { useFileUploader } from '~/composables/upload-file'

const props = defineProps<{
  projectId: number
  category?: any // If provided, we are in edit mode
}>()

const emit = defineEmits(['success', 'close'])

const { $api } = useNuxtApp()
const categoriesRepo = categoriesRepository($api)
const toast = useToast()
const { uploadFile } = useFileUploader()

const isOpen = defineModel<boolean>('open', { default: false })
const loading = ref(false)

const state = reactive({
  name: props.category?.name || '',
  description: props.category?.description || '',
  imageUrl: props.category?.imageUrl || '',
})

const imageFile = ref<File | undefined>(undefined)

async function onSubmit(event: { data: TCategoryValidationSchema }) {
  try {
    loading.value = true
    
    let imageUrl = state.imageUrl
    if (imageFile.value) {
      const uploadRes = await uploadFile(imageFile.value)
      if (uploadRes) {
        imageUrl = uploadRes.url
      }
    }

    const payload = {
      ...event.data,
      imageUrl,
      projectId: props.projectId,
    }

    if (props.category) {
      await categoriesRepo.updateCategory(props.category.id, payload)
      toast.add({ title: 'Category updated successfully!', color: 'success' })
    } else {
      await categoriesRepo.createCategory(payload)
      toast.add({ title: 'Category created successfully!', color: 'success' })
    }

    emit('success')
    isOpen.value = false
  } catch (err) {
    console.error('Category error:', err)
    toast.add({ title: 'Something went wrong.', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal v-model:open="isOpen" :title="category ? 'Edit Category' : 'Add New Category'">
    <template #content>
      <UForm
        :schema="CategoryValidationSchema"
        :state="state"
        class="space-y-6 p-6"
        @submit="onSubmit"
      >
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" placeholder="e.g., Appetizers, Main Course" class="w-full" />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea v-model="state.description" placeholder="Short description for this category..." :rows="3" />
        </UFormField>

        <UFormField label="Category Image" name="imageUrl">
          <AppFileUploader v-model="imageFile" name="category-image" />
          <p v-if="state.imageUrl && !imageFile" class="text-xs text-gray-400 mt-2">Current image: {{ state.imageUrl }}</p>
        </UFormField>

        <div class="flex justify-end gap-3 pt-6 border-t border-white/10">
          <UButton variant="ghost" label="Cancel" @click="isOpen = false" />
          <UButton type="submit" :label="category ? 'Save Changes' : 'Create Category'" :loading="loading" color="success" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
