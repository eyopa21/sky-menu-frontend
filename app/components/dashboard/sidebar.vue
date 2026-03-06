<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const currentUser = computed(() => authStore.session?.user)

const items = ref([
  {
    label: 'Main Dashboard',
    icon: 'i-heroicons-squares-2x2',
    open: true,
    items: [
      {
        label: 'My Projects',
        icon: 'i-heroicons-folder-open',
        to: '/projects',
        active: true
      },
      {
        label: 'QR Generation',
        icon: 'i-heroicons-qr-code',
      },
      {
        label: 'Analytics',
        icon: 'i-heroicons-chart-bar-square',
      },
    ],
  },
  {
    label: 'Resources',
    icon: 'i-heroicons-book-open',
    open: false,
    items: [
      {
        label: 'Feedbacks',
        icon: 'i-heroicons-chat-bubble-left-right',
        to: '/dashboard/feedbacks',
      },
      {
        label: 'Help Center',
        icon: 'i-heroicons-lifebuoy',
      },
    ],
  },
])

function toggleSection(index: number) {
  items.value[index].open = !items.value[index].open
}

const router = useRouter()
const activePath = computed(() => router.currentRoute.value.path)

function isActive(to?: string) {
  if (!to) return false
  return activePath.value.startsWith(to)
}
</script>

<template>
  <div class="fixed h-screen w-80 border-r border-white/5 dark:border-white/5 light:border-gray-100 bg-[#09090b]/95 dark:bg-[#09090b]/95 light:bg-[#fcfdfd] backdrop-blur-3xl z-50">
    <!-- Sidebar Decor -->
    <div class="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />

    <div class="flex h-full flex-col relative z-10">
      <div class="flex shrink-0 items-center gap-3 px-8 pt-10 mb-10">
        <div class="size-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
           <UIcon name="i-heroicons-cloud-arrow-up" class="size-6 text-black" />
        </div>
        <span class="text-2xl font-black text-white dark:text-white light:text-gray-900 tracking-tighter">SKy <span class="text-emerald-500">Menu</span></span>
      </div>
      
      <div class="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <div v-for="(section, index) in items" :key="index" class="mb-4">
          <button
            class="flex w-full cursor-pointer items-center justify-between rounded-2xl p-4 text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-500 light:text-gray-400 hover:bg-white/5 hover:text-white dark:hover:text-white light:hover:text-emerald-900 transition-all group"
            @click="toggleSection(index)"
          >
            <div class="flex items-center gap-3">
              <UIcon :name="section.icon" class="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span>{{ section.label }}</span>
            </div>
            <UIcon 
              name="i-heroicons-chevron-right" 
              class="size-3 transform transition-transform duration-300"
              :class="{ 'rotate-90': section.open }"
            />
          </button>
          
          <div v-show="section.open" class="mt-1 space-y-1">
            <NuxtLink
              v-for="(subItem, subKey) in section.items"
              :key="subKey"
              :to="subItem.to"
              class="flex cursor-pointer items-center rounded-2xl p-4 text-sm font-bold transition-all border border-transparent"
              :class="isActive(subItem.to)
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-500 light:text-gray-600 hover:bg-white/[0.04] dark:hover:bg-white/[0.04] light:hover:bg-gray-100 hover:text-white dark:hover:text-white light:hover:text-emerald-900'"
            >
              <UIcon v-if="subItem.icon" :name="subItem.icon" class="mr-4 size-5" />
              <span>{{ subItem.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- User Profile at Bottom -->
      <div class="mt-auto p-6 bg-gradient-to-t from-white/[0.02] to-transparent dark:from-white/[0.02] light:from-gray-50 border-t border-white/5 dark:border-white/5 light:border-gray-100">
        <NuxtLink 
          to="/account/settings"
          class="flex items-center gap-4 rounded-2xl p-3 text-white dark:text-white light:text-gray-900 hover:bg-white/[0.05] dark:hover:bg-white/[0.05] light:hover:bg-white cursor-pointer transition-all border border-transparent hover:border-white/5 dark:hover:border-white/5 light:hover:border-gray-200"
        >
          <div class="relative">
             <div class="absolute -inset-1 bg-emerald-500 rounded-full blur-md opacity-0 hover:opacity-20 transition-opacity" />
             <UAvatar
              :src="currentUser?.avatar_url || 'https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/avatars/amyelsner.png'"
              size="md"
              class="relative ring-2 ring-white/10 dark:ring-white/10 light:ring-gray-200"
            />
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-sm font-black truncate tracking-tight">{{ currentUser?.full_name || 'Architect' }}</span>
            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">{{ currentUser?.email || 'Admin Panel' }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
