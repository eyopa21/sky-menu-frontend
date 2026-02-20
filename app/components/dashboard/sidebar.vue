<script setup lang="ts">
const items = ref([
  {
    label: 'General',
    icon: 'i-heroicons-envelope',
    badge: 5,
    open: true,
    items: [
      {
        label: 'Menu Items',
        icon: 'i-mdi-food',
        shortcut: '⌘+N',
      },
      {
        label: 'QR Code',
        icon: 'i-mdi-qrcode-edit',
      },
      {
        label: 'Feedbacks',
        icon: 'i-mdi-comment',
        badge: 5,
      },
      {
        label: 'Analytics',
        icon: 'i-mdi-chart-bar',
        shortcut: '⌘+T',
      },
    ],
  },
  {
    label: 'Settings',
    icon: 'i-heroicons-chart-bar',
    shortcut: '⌘+R',
    open: false,
    items: [
      {
        label: 'Menu Details',
        icon: 'i-mdi-cog-sync',
      },
      {
        label: 'Design',
        icon: 'i-mdi-brush',
      },
      {
        label: 'Users',
        icon: 'i-mdi-account-group',
        badge: 8,
      },
    ],
  },
  {
    label: 'Help',
    icon: 'i-heroicons-user',
    shortcut: '⌘+W',
    open: false,
    items: [
      {
        label: 'About us',
        icon: 'i-mdi-account-details',
        shortcut: '⌘+O',
      },
      {
        label: 'Support',
        icon: 'i-mdi-chat-question',
        shortcut: '⌘+P',
      },
    ],
  },
])

function toggleSection(index: number) {
  items.value[index].open = !items.value[index].open
}
</script>

<template>
  <div class="fixed h-screen w-80 border-r border-gray-800 bg-[#09090b]">
    <div class="flex h-full flex-col">
      <div class="flex shrink-0 items-center justify-between px-6 pt-6">
        <span class="inline-flex items-center gap-2">
          <UIcon name="i-heroicons-cloud-arrow-up" class="size-8 text-white" />
          <span class="text-2xl font-bold text-white">SKy Menu</span>
        </span>
      </div>
      
      <div class="px-4 py-4">
        <USeparator class="opacity-20" />
      </div>

      <div class="flex-1 overflow-y-auto px-4">
        <div v-for="(section, index) in items" :key="index" class="mb-2">
          <button
            class="flex w-full cursor-pointer items-center justify-between rounded-lg p-3 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            @click="toggleSection(index)"
          >
            <div class="flex items-center gap-3">
              <UIcon :name="section.icon" class="size-5" />
              <span>{{ section.label }}</span>
            </div>
            <UIcon 
              name="i-heroicons-chevron-down" 
              class="size-4 transform transition-transform"
              :class="{ 'rotate-180': section.open }"
            />
          </button>
          
          <div v-show="section.open" class="mt-1 space-y-1 pl-4">
            <NuxtLink
              v-for="(subItem, subKey) in section.items"
              :key="subKey"
              class="flex cursor-pointer items-center rounded-lg p-3 text-sm font-medium text-gray-500 hover:bg-white/5 hover:text-white transition-colors"
            >
              <UIcon v-if="subItem.icon" :name="subItem.icon" class="mr-3 size-5" />
              <span>{{ subItem.label }}</span>
              <UBadge
                v-if="subItem.badge"
                :label="subItem.badge.toString()"
                size="sm"
                variant="soft"
                class="ml-auto"
              />
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="mt-auto p-4">
        <USeparator class="mb-4 opacity-20" />
        <NuxtLink 
          to="/account/settings"
          class="flex items-center gap-3 rounded-lg p-3 text-white hover:bg-white/5 cursor-pointer transition-colors"
        >
          <UAvatar
            :src="currentUser?.avatar || 'https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/avatars/amyelsner.png'"
            :alt="currentUser?.full_name || 'User'"
            size="md"
          />
          <div class="flex flex-col min-w-0">
            <span class="text-sm font-bold truncate">{{ currentUser?.full_name || 'User' }}</span>
            <span class="text-xs text-gray-500 truncate">{{ currentUser?.email || 'No email' }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
