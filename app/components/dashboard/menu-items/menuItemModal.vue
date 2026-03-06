<script setup lang="ts">
import { MenuItemValidationSchema, type TMenuItemValidationSchema } from '~/zod/menu-items/MenuItemValidation'
import { menuItemsRepository } from '~/repositories/menu-items'
import { useFileUploader } from '~/composables/upload-file'
import type { FileUploadResponse } from '~/repositories/common/response/file-upload'

const props = defineProps<{
  menuId: number
  categories: any[]
  item?: any
}>()

const emit = defineEmits(['success', 'close'])

const { $api } = useNuxtApp()
const menuItemsRepo = menuItemsRepository($api)
const toast = useToast()
const { uploadFile } = useFileUploader()

const isOpen = defineModel<boolean>('open', { default: false })
const loading = ref(false)
const isDeleteItemModalOpen = ref(false)

const state = reactive({
  name: props.item?.name || '',
  description: props.item?.description || '',
  price: props.item?.price || 0,
  vatIncluded: props.item?.vatIncluded ?? true,
  isAvailable: props.item?.isAvailable ?? true,
  calories: props.item?.calories || undefined,
  preparationTime: props.item?.preparationTime || undefined,
  categoryId: props.item?.categoryId || (props.categories.length > 0 ? props.categories[0].id : undefined),
})

const imageFiles = ref<File[]>([])
const currentImages = ref<string[]>(props.item?.images || [])

watch(() => props.item, (newVal) => {
  state.name = newVal?.name || ''
  state.description = newVal?.description || ''
  state.price = newVal?.price || 0
  state.vatIncluded = newVal?.vatIncluded ?? true
  state.isAvailable = newVal?.isAvailable ?? true
  state.calories = newVal?.calories || undefined
  state.preparationTime = newVal?.preparationTime || undefined
  state.categoryId = newVal?.categoryId || (props.categories.length > 0 ? props.categories[0].id : undefined)
  
  currentImages.value = newVal?.images || []
  imageFiles.value = [] // Reset staged uploads when item changes
}, { immediate: true })

async function onSubmit(event: { data: TMenuItemValidationSchema }) {
  try {
    loading.value = true
    
    let uploadedImages: string[] = [...currentImages.value]
    
    if (imageFiles.value.length > 0) {
      const uploads = await Promise.all(imageFiles.value.map(file => uploadFile(file)))
      const validUploads = uploads.filter(u => !!u) as FileUploadResponse[]
      uploadedImages = [...uploadedImages, ...validUploads.map(u => u.url)]
    }

    if (uploadedImages.length === 0) {
      toast.add({ title: 'At least one image is required.', color: 'warning' })
      loading.value = false
      return
    }

    const payload = {
      ...event.data,
      menuId: props.menuId,
      images: uploadedImages,
    }

    if (props.item) {
      await menuItemsRepo.updateMenuItem(props.item.id, payload)
      toast.add({ title: 'Item updated successfully!', color: 'success' })
    } else {
      await menuItemsRepo.createMenuItem(payload)
      toast.add({ title: 'Item created successfully!', color: 'success' })
    }

    emit('success')
    isOpen.value = false
  } catch (err) {
    console.error('Menu item error:', err)
    toast.add({ title: 'Something went wrong.', color: 'error' })
  } finally {
    loading.value = false
  }
}

const removeImage = (index: number) => {
  currentImages.value.splice(index, 1)
}

const confirmDeleteItem = () => {
  isDeleteItemModalOpen.value = true
}

const deleteItem = async () => {
  if (!props.item?.id) return
  try {
    loading.value = true
    await menuItemsRepo.deleteMenuItem(props.item.id)
    toast.add({ title: 'Item deleted successfully!', color: 'success' })
    isDeleteItemModalOpen.value = false
    isOpen.value = false
    emit('success')
  } catch (err) {
    toast.add({ title: 'Failed to delete item.', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <USlideover v-model:open="isOpen">
    <template #header>
      <div class="flex items-center justify-between w-full h-full">
        <h3 class="text-xl font-bold text-white">{{ item ? 'Edit Menu Item' : 'Add Menu Item' }}</h3>
        <div class="flex items-center gap-2">
          <UButton 
            v-if="item"
            icon="i-heroicons-trash" 
            variant="soft" 
            color="error" 
            size="xs" 
            class="rounded-lg px-3" 
            label="Delete" 
            @click="confirmDeleteItem" 
          />
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            @click="isOpen = false"
          />
        </div>
      </div>
    </template>

    <template #body>
      <UForm
        :id="'menu-item-form-' + (item?.id || 'new')"
        :schema="MenuItemValidationSchema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <div class="space-y-6">
          <UFormField label="Name" name="name" required>
            <UInput v-model="state.name" placeholder="Item name" class="w-full" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Category" name="categoryId" required>
              <USelect v-model="state.categoryId" :items="categories.map(c => ({ label: c.name, value: c.id }))" class="w-full" />
            </UFormField>

            <UFormField label="Price" name="price" required>
              <UInput v-model="state.price" type="number" step="0.01" class="w-full" />
            </UFormField>
          </div>

          <UFormField label="Description" name="description">
            <UTextarea v-model="state.description" :rows="3" />
          </UFormField>

          <div class="flex flex-col gap-3 bg-zinc-900/50 p-4 rounded-xl border border-white/10">
            <UCheckbox v-model="state.vatIncluded" label="Price includes VAT" />
            <UCheckbox v-model="state.isAvailable" label="Item is Available" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Calories (kcal)" name="calories">
              <UInput v-model="state.calories" type="number" placeholder="Optional" class="w-full" />
            </UFormField>

            <UFormField label="Prep. Time (min)" name="preparationTime">
              <UInput v-model="state.preparationTime" type="number" placeholder="Optional" class="w-full" />
            </UFormField>
          </div>

          <div class="space-y-4">
            <label class="text-sm font-medium text-white px-1">Images</label>
            
            <!-- Existing Images -->
            <div v-if="currentImages.length > 0" class="grid grid-cols-3 gap-3">
              <div v-for="(img, index) in currentImages" :key="img" class="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-zinc-900">
                <img :src="img" class="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <UButton
                    color="error"
                    variant="soft"
                    icon="i-heroicons-trash"
                    size="sm"
                    class="rounded-full !p-2"
                    @click.prevent="removeImage(index)"
                  />
                </div>
                <div class="absolute top-2 left-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-md rounded text-[9px] text-zinc-300 border border-white/5">
                  Existing
                </div>
              </div>
            </div>

            <AppFileUploader v-model:files="imageFiles" name="menu-item-images" multiple accept="image/*" />
            <p class="text-[11px] text-zinc-500 px-1">At least one image is required to publish this item. You can select multiple files.</p>
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <UButton variant="ghost" label="Cancel" @click="isOpen = false" />
        <UButton
          type="submit"
          :form="'menu-item-form-' + (item?.id || 'new')"
          :label="item ? 'Save Changes' : 'Add Item'"
          :loading="loading"
          color="success"
        />
      </div>
    </template>
  </USlideover>

  <AppConfirmModal
    v-model:open="isDeleteItemModalOpen"
    title="Delete Item?"
    description="This will permanently remove this item from the menu. This action is irreversible."
    confirm-button-text="Delete Item"
    :loading="loading"
    @confirm="deleteItem"
  />
</template>
