<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem'
import { authRepository } from '~/repositories/auth'
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const { session } = storeToRefs(authStore)
const accountMenu = useTemplateRef('accountMenu')

const accountItems = ref<MenuItem[]>([
  {
    separator: true,
  },
  {
    label: 'New',
    icon: 'pi pi-plus',
    shortcut: '⌘+N',
  },
  {
    label: 'Search',
    icon: 'pi pi-search',
    shortcut: '⌘+S',
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        to: '/account/settings',
      },
      {
        label: 'Messages',
        icon: 'pi pi-inbox',
        badge: 2,
      },
      {
        separator: true,
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        shortcut: '⌘+Q',
        class: 'bg-red-500',
        command() {
          logout()
        },

      },
    ],
  },
  {
    separator: true,
  },
])

const toast = useToast()
const loading = ref(false)
const { $api } = useNuxtApp()
const authRepo = authRepository($api)
async function logout() {
  try {
    loading.value = true
    const data = await authRepo.logout({
      accessToken: session.value!.accessToken,
      refreshToken: session.value!.refreshToken,
    })

    authStore.logout()

    console.log({ data })

    navigateTo('auth/login')
    toast.add({ severity: 'success', summary: 'Logout successful!', life: 3000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: err.message, life: 3000 })
  } finally {
    loading.value = false
  }
}
function toggle(event: Event) {
  accountMenu.value?.toggle(event)
}
</script>

<template>
  <Avatar
    image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle"
    class="cursor-pointer" @click="toggle"
  />

  <Menu ref="accountMenu" :model="accountItems" class="w-full md:w-60" popup>
    <template #start>
      <span class="inline-flex items-center gap-1 p-2">

        <span class="text-xl font-semibold">SKY<span class="text-primary">APP</span></span>
      </span>
    </template>
    <template #submenulabel="{ item }">
      <span class="font-bold text-primary">{{ item.label }}</span>
    </template>
    <template #item="{ item, props }">
      <NuxtLink v-ripple :to="item.to" class="flex items-center" v-bind="props.action">
        <span :class="item.icon" />
        <span>{{ item.label }}</span>
        <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
        <span
          v-if="item.shortcut"
          class="ml-auto rounded border p-1 text-xs border-surface bg-emphasis text-muted-color"
        >{{
          item.shortcut }}</span>
      </NuxtLink>
    </template>
  </Menu>
</template>
