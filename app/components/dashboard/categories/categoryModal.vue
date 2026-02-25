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

watch(() => props.category, (newVal) => {
  state.name = newVal?.name || ''
  state.description = newVal?.description || ''
  state.imageUrl = newVal?.imageUrl || ''
}, { immediate: true })

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
  <USlideover v-model:open="isOpen">
    <template #header>
      <div class="flex items-center justify-between w-full h-full">
        <h3 class="text-xl font-bold text-white">{{ category ? 'Edit Category' : 'Add New Category' }}</h3>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark"
          @click="isOpen = false"
        />
      </div>
    </template>

    <template #body>
      <UForm
        :id="'category-form-' + (category?.id || 'new')"
        :schema="CategoryValidationSchema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <UFormField label="Name" name="name" required>
          <UInput v-model="state.name" placeholder="e.g., Appetizers, Main Course" class="w-full" />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea v-model="state.description" placeholder="Short description for this category..." :rows="3" />
        </UFormField>

        <UFormField label="Category Image" name="imageUrl">
          <div v-if="state.imageUrl && !imageFile" class="relative group aspect-video rounded-xl overflow-hidden border border-white/10 mb-4 bg-zinc-900 shadow-inner">
            <img :src="state.imageUrl" class="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <UButton
                color="error"
                variant="soft"
                icon="i-heroicons-trash"
                size="sm"
                @click="state.imageUrl = ''"
              >
                Remove
              </UButton>
            </div>
            <div class="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs text-white border border-white/10">
              Current Cover
            </div>
          </div>
          <AppFileUploader v-model="imageFile" name="category-image" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <UButton variant="ghost" label="Cancel" @click="isOpen = false" />
        <UButton
          type="submit"
          :form="'category-form-' + (category?.id || 'new')"
          :label="category ? 'Save Changes' : 'Create Category'"
          :loading="loading"
          color="success"
        />
      </div>
    </template>
  </USlideover>
</template>
