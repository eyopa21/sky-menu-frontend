<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'

const items = ref<MenuItem[]>([
  {
    label: 'General',
    icon: 'pi pi-envelope',
    badge: 5,
    visible: true,
    items: [
      {
        label: 'Menu Items',
        icon: 'mdi:food',
        shortcut: '⌘+N',
      },
      {
        label: 'QR Code',
        icon: 'mdi:qrcode-edit',
      },
      {
        label: 'Feedbacks',
        icon: 'mdi:comment',
        badge: 5,
      },
      {
        label: 'Analytics',
        icon: 'mdi:chart-bar',
        shortcut: '⌘+T',
      },
    ],
  },
  {
    label: 'Settings',
    icon: 'pi pi-chart-bar',
    shortcut: '⌘+R',
    items: [
      {
        label: 'Menu Details',
        icon: 'mdi:cog-sync',
        // badge: 3,
      },
      {
        label: 'Design',
        icon: 'mdi:brush',
      },
      {
        label: 'Users',
        icon: 'mdi:account-group',
        badge: 8,
      },
    ],
  },
  {
    label: 'Help',
    icon: 'pi pi-user',
    shortcut: '⌘+W',
    items: [
      {
        label: 'About us',
        icon: 'mdi:account-details',
        shortcut: '⌘+O',
      },
      {
        label: 'Support',
        icon: 'mdi:chat-question',
        shortcut: '⌘+P',
      },
    ],
  },
])
</script>

<template>
  <div class="fixed h-screen w-80 border-r  border-gray-800 ">
    <div class="flex h-full flex-col">
      <div class="flex shrink-0 items-center justify-between px-6 pt-4">
        <span class="inline-flex items-center gap-2">
          LOgo
          <span class="text-2xl font-semibold text-primary">SKy Menu</span>
        </span>
      </div>
      <Separator />
      <div class="overflow-y-auto">
        <ul v-for="(i, key) in items" :key="key" class="m-0 list-none p-4">
          <li>
            <div
              v-ripple
              v-styleclass="{
                selector: '@next',
                enterFromClass: 'hidden',
                enterActiveClass: 'animate-slidedown',
                leaveToClass: 'hidden',
                leaveActiveClass: 'animate-slideup',
              }"
              class="p-ripple flex cursor-pointer items-center justify-between p-4 text-surface-500 dark:text-surface-400"
            >
              <span class="font-medium">{{ i.label }}</span>
              <!-- <i class="pi pi-chevron-down" />s -->
              <Icon name="mdi:menu-down" class="size-8" />
            </div>
            <ul class="m-0 list-none overflow-hidden p-0">
              <li v-for="(subItem, subKey) in i.items" :key="subKey">
                <a v-ripple class="p-ripple flex cursor-pointer items-center rounded p-4 text-surface-700 transition-colors duration-150 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800">
                  <Icon v-if="subItem.icon" :name="subItem.icon" class=" mr-2" />
                  <span class="font-medium">{{ subItem.label }}</span>
                  <span v-if="subItem.badge" class="ml-auto inline-flex items-center justify-center rounded-full bg-primary text-primary-contrast" style="min-width: 1.5rem; height: 1.5rem">{{ subItem.badge }}</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="mt-auto">
        <hr class="mx-4 mb-4 border-0 border-t border-surface-200 dark:border-surface-700">
        <a v-ripple class="p-ripple m-4 flex cursor-pointer items-center gap-2 rounded p-4 text-surface-700 transition-colors duration-150 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800">
          <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
          <span class="font-bold">Amy Elsner</span>
        </a>
      </div>
    </div>
  </div>
</template>
