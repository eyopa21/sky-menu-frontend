<script setup lang="ts">
import { authRepository } from '~/repositories/auth'
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const { session } = storeToRefs(authStore)
const toast = useToast()
const loading = ref(false)
const { $api } = useNuxtApp()
const authRepo = authRepository($api)

const items = [
  [{
    label: 'Profile',
    type: 'label',
    slot: 'header'
  }],
  [{
    label: 'Projects',
    icon: 'i-heroicons-folder-open',
    to: '/projects'
  }, {
    label: 'Account Settings',
    icon: 'i-heroicons-cog-8-tooth',
    to: '/account/settings'
  }],
  [{
    label: 'Logout',
    icon: 'i-heroicons-rectangle-left',
    kbds: ['meta', 'q'],
    color: 'error' as const,
    onSelect: () => logout()
  }]
]

async function logout() {
  try {
    loading.value = true
    if (session.value) {
      await authRepo.logout({
        accessToken: session.value.accessToken,
        refreshToken: session.value.refreshToken,
      })
    }
    authStore.logout()
    navigateTo('/auth/login')
    toast.add({ title: 'Logout successful!', color: 'success' })
  } catch (err: any) {
    toast.add({ title: err.message || 'Logout failed', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UDropdown :items="items" :ui="{ width: 'w-64' }">
    <div class="relative group cursor-pointer">
      <!-- Glow ring animation -->
      <div class="absolute -inset-0.5 rounded-full bg-emerald-500/30 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
      <UAvatar
        src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/avatars/amyelsner.png"
        alt="User Avatar"
        size="md"
        class="relative ring-2 ring-emerald-500/30 group-hover:ring-emerald-500/60 transition-all duration-300"
      />
    </div>

    <template #header="{ item }">
      <div class="flex flex-col gap-1 p-2">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {{ item.label }}
        </p>
        <p class="text-sm font-medium text-white truncate">
          {{ session?.user.full_name }}
        </p>
        <p class="text-xs text-gray-500 truncate">
          {{ session?.user.email }}
        </p>
      </div>
    </template>

    <template #item-label="{ item }">
      <span :class="[item.color === 'error' ? 'text-red-400' : 'text-gray-300']">{{ item.label }}</span>
    </template>
  </UDropdown>
</template>
