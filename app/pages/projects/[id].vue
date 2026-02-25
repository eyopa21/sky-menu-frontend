<script setup lang="ts">
import { projectsRepository } from '~/repositories/projects'
import { categoriesRepository } from '~/repositories/categories'
import { menusRepository } from '~/repositories/menus'
import { menuItemsRepository } from '~/repositories/menu-items'
import { UpdateProjectValidationSchema, type TUpdateProjectValidationSchema } from '~/zod/projects/UpdateProjectValidation'
import CategoryModal from '~/components/dashboard/categories/categoryModal.vue'
import MenuItemModal from '~/components/dashboard/menu-items/menuItemModal.vue'

definePageMeta({
  layout: 'dashboard',
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const projectsRepo = projectsRepository($api)
const categoriesRepo = categoriesRepository($api)
const menusRepo = menusRepository($api)
const menuItemsRepo = menuItemsRepository($api)
const toast = useToast()

const id = computed(() => Number(route.params.id))
const loading = ref(false)
const isEditing = ref(false)

const isCategoryModalOpen = ref(false)
const selectedCategory = ref<any>(null)

const isItemModalOpen = ref(false)
const selectedItem = ref<any>(null)

const activeTab = ref(0)
const tabs = [
  { label: 'Information', icon: 'i-heroicons-information-circle', slot: 'info' },
  { label: 'Categories', icon: 'i-heroicons-squares-2x2', slot: 'categories' },
  { label: 'Menu Items', icon: 'i-heroicons-list-bullet', slot: 'items' }
]

const { data: project, refresh: refreshProject } = await useAsyncData(`project-${id.value}`, () => projectsRepo.getProjectById(id.value))
const { data: categories, refresh: refreshCategories } = await useAsyncData(`categories-${id.value}`, () => categoriesRepo.getCategoriesByProjectId(id.value))

// For now, we assume there's one menu per project as per the OneToOne relation in the backend
// We might need an endpoint to get menu by projectId, or it might be included in project relations if we update getProjectById
// Let's check if project already has the menu
const menu = computed(() => project.value?.menu)

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
    refreshProject()
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

const openAddCategory = () => {
  selectedCategory.value = null
  isCategoryModalOpen.value = true
}

const openEditCategory = (category: any) => {
  selectedCategory.value = category
  isCategoryModalOpen.value = true
}

const deleteCategory = async (categoryId: number) => {
  try {
    await categoriesRepo.deleteCategory(categoryId)
    toast.add({ title: 'Category deleted', color: 'success' })
    refreshCategories()
  } catch (err) {
    toast.add({ title: 'Failed to delete category', color: 'error' })
  }
}

const openAddItem = () => {
  selectedItem.value = null
  isItemModalOpen.value = true
}

const openEditItem = (item: any) => {
  selectedItem.value = item
  isItemModalOpen.value = true
}

const deleteItem = async (itemId: number) => {
  try {
    await menuItemsRepo.deleteMenuItem(itemId)
    toast.add({ title: 'Item deleted', color: 'success' })
    refreshProject() // Menu items are part of project relation
  } catch (err) {
    toast.add({ title: 'Failed to delete item', color: 'error' })
  }
}

const createMenu = async () => {
  try {
    loading.value = true
    await menusRepo.createMenu(id.value, project.value?.title || 'Main Menu')
    toast.add({ title: 'Menu created successfully!', color: 'success' })
    refreshProject()
  } catch (err) {
    toast.add({ title: 'Failed to create menu.', color: 'error' })
  } finally {
    loading.value = false
  }
}

const goToCategories = () => {
  activeTab.value = 1
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

      <!-- Right Column: Tabs for Settings / Categories / Items -->
      <div class="lg:col-span-2">
        <UTabs v-model="activeTab" :items="tabs" class="w-full">
          <template #info>
            <UCard class="bg-white/5 border-white/10 shadow-xl shadow-black/20 overflow-visible mt-4">
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
          </template>

          <template #categories>
            <div class="mt-4 space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold text-white">Menu Categories</h3>
                <UButton icon="i-heroicons-plus" label="Add Category" color="success" variant="soft" @click="openAddCategory" />
              </div>

              <div v-if="categories?.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UCard v-for="category in categories" :key="category.id" class="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
                  <div class="flex items-start gap-4">
                    <div v-if="category.imageUrl" class="size-16 rounded-lg overflow-hidden bg-zinc-800">
                      <img :src="category.imageUrl" class="size-full object-cover" />
                    </div>
                    <div v-else class="size-16 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <UIcon name="i-heroicons-tag" class="text-gray-600 size-8" />
                    </div>
                    <div class="flex-1">
                      <h4 class="font-bold text-white">{{ category.name }}</h4>
                      <p class="text-sm text-gray-400 line-clamp-2 mt-1">{{ category.description }}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <UButton icon="i-heroicons-pencil-square" variant="ghost" color="neutral" size="sm" @click="openEditCategory(category)" />
                      <UPopconfirm title="Delete Category?" @confirm="deleteCategory(category.id)">
                        <UButton icon="i-heroicons-trash" variant="ghost" color="error" size="sm" />
                      </UPopconfirm>
                    </div>
                  </div>
                </UCard>
              </div>
              <UCard v-else class="bg-white/5 border-white/10 border-dashed py-12 flex flex-col items-center justify-center text-center">
                <UIcon name="i-heroicons-square-2x2" class="size-12 text-gray-700 mb-4" />
                <h4 class="text-lg font-bold text-white">No Categories Yet</h4>
                <p class="text-gray-500 max-w-xs mt-2">Categories help organize your menu items for better customer experience.</p>
                <UButton icon="i-heroicons-plus" label="Create First Category" color="success" class="mt-6" @click="openAddCategory" />
              </UCard>
            </div>
          </template>

          <template #items>
            <div class="mt-4 space-y-4">
              <div v-if="project?.menu">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-bold text-white">Menu Items</h3>
                  <UButton
                    icon="i-heroicons-plus"
                    label="Add Item"
                    color="success"
                    variant="soft"
                    :disabled="!categories?.length"
                    @click="openAddItem"
                  />
                </div>

                <div v-if="project.menu.menuItems?.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UCard v-for="item in project.menu.menuItems" :key="item.id" class="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
                    <div class="flex items-start gap-4">
                      <div v-if="item.images?.length" class="size-20 rounded-lg overflow-hidden bg-zinc-800">
                        <img :src="item.images[0]" class="size-full object-cover" />
                      </div>
                      <div v-else class="size-20 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <UIcon name="i-heroicons-cake" class="text-gray-600 size-10" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-white truncate">{{ item.name }}</h4>
                        <p class="text-sm text-gray-400 line-clamp-1 mt-0.5">{{ item.description }}</p>
                        <div class="flex items-center gap-3 mt-2">
                          <span class="text-emerald-400 font-bold font-mono">{{ project?.currency }} {{ item.price }}</span>
                          <UBadge v-if="!item.isAvailable" label="Sold Out" color="error" variant="soft" size="xs" />
                        </div>
                      </div>
                      <div class="flex flex-col gap-1">
                        <UButton icon="i-heroicons-pencil-square" variant="ghost" color="neutral" size="sm" @click="openEditItem(item)" />
                        <UPopconfirm title="Delete Item?" @confirm="deleteItem(item.id)">
                          <UButton icon="i-heroicons-trash" variant="ghost" color="error" size="sm" />
                        </UPopconfirm>
                      </div>
                    </div>
                  </UCard>
                </div>
                <UCard v-else class="bg-white/5 border-white/10 border-dashed py-12 flex flex-col items-center justify-center text-center">
                  <UIcon name="i-heroicons-list-bullet" class="size-12 text-gray-700 mb-4" />
                  <h4 class="text-lg font-bold text-white">No Menu Items</h4>
                  <p class="text-gray-500 max-w-xs mt-2">
                    {{ categories?.length ? 'Start adding your delicious dishes to the menu.' : 'Create at least one category before adding menu items.' }}
                  </p>
                  <UButton
                    v-if="categories?.length"
                    icon="i-heroicons-plus"
                    label="Add First Item"
                    color="success"
                    class="mt-6"
                    @click="openAddItem"
                  />
                  <UButton
                    v-else
                    icon="i-heroicons-plus"
                    label="Go to Categories"
                    variant="ghost"
                    class="mt-6"
                    @click="goToCategories"
                  />
                </UCard>
              </div>
              <UCard v-else class="bg-white/5 border-white/10 border-dashed py-12 flex flex-col items-center justify-center text-center">
                <UIcon name="i-heroicons-book-open" class="size-12 text-gray-700 mb-4" />
                <h4 class="text-lg font-bold text-white">Menu Not Initialized</h4>
                <p class="text-gray-500 max-w-xs mt-2">You need to initialize a menu for this project before you can add items.</p>
                <UButton label="Initialize Menu" color="success" class="mt-6" :loading="loading" @click="createMenu" />
              </UCard>
            </div>
          </template>
        </UTabs>
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

    <!-- Category Modal -->
    <CategoryModal
      v-if="isCategoryModalOpen"
      v-model:open="isCategoryModalOpen"
      :project-id="id"
      :selected="selectedCategory"
      @success="refreshCategories"
    />

    <!-- MenuItem Modal -->
    <MenuItemModal
      v-if="isItemModalOpen && project?.menu"
      v-model:open="isItemModalOpen"
      :menu-id="project.menu.id"
      :categories="categories || []"
      :item="selectedItem"
      @success="refreshProject"
    />
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
