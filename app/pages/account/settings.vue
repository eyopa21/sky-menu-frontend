<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TabsItem } from '@nuxt/ui'
import { authRepository } from '~/repositories/auth'
import { useAuthStore } from '~/store/auth'
import SettingsAccount from '~/components/settings/account.vue'
import SettingsSecurity from '~/components/settings/security.vue'

definePageMeta({
  layout: 'default'
})

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const toast = useToast()
const loading = ref(false)
const logoutModalOpen = ref(false)

const user = computed(() => authStore.session?.user)

const tabs = [
  {
    id: 'account',
    label: 'Account Info',
    icon: 'i-heroicons-user-circle',
    description: 'Manage your public profile and personal details'
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'i-heroicons-shield-check',
    description: 'Update your password and secure your access'
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: 'i-heroicons-credit-card',
    description: 'Manage your subscription and payment methods'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'i-heroicons-bell',
    description: 'Configure how you receive updates and alerts'
  }
]

const activeTab = ref('account')

async function onLogout() {
  try {
    loading.value = true
    authStore.clearSession()
    navigateTo('/auth/login')
    toast.add({ title: 'Logged out successfully', color: 'success' })
  } catch (err: any) {
    console.error('Logout error:', err)
  } finally {
    loading.value = false
    logoutModalOpen.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-app-bg transition-colors duration-500 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] light:bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
    </div>

    <div class="mx-auto max-w-6xl relative z-10">
      <!-- Header / Banner -->
      <div class="relative mb-12 rounded-[32px] overflow-hidden p-8 md:p-12 bg-gradient-to-br from-white/[0.03] to-transparent dark:from-white/[0.03] light:from-gray-100 border border-white/[0.06] dark:border-white/[0.06] light:border-gray-200">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="relative group">
            <div class="absolute -inset-2 bg-emerald-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <UAvatar
              :src="user?.avatar_url || 'https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/avatars/amyelsner.png'"
              size="3xl"
              class="relative ring-4 ring-emerald-500/20 dark:ring-emerald-500/20 light:ring-emerald-100 h-24 w-24"
            />
          </div>
          <div class="text-center md:text-left flex-1">
            <h1 class="text-3xl md:text-4xl font-black tracking-tight text-white dark:text-white light:text-gray-900 mb-2">
              Account <span class="text-emerald-400">Settings</span>
            </h1>
            <p class="text-gray-400 dark:text-gray-400 light:text-gray-600 font-medium max-w-lg">
              Welcome back, <span class="text-white dark:text-white light:text-gray-900 font-bold">{{ user?.full_name || user?.email }}</span>. Manage your preferences and security below.
            </p>
          </div>
          <div class="flex items-center gap-4">
            <UButton
              label="Sign Out"
              icon="i-heroicons-arrow-left-on-rectangle"
              color="error"
              variant="soft"
              class="rounded-2xl font-black px-6 py-3 shadow-lg shadow-red-500/5 hover:scale-105 transition-transform"
              @click="logoutModalOpen = true"
            />
          </div>
        </div>
      </div>

      <!-- Dashboard Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Sidebar Navigation -->
        <div class="lg:col-span-4 space-y-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="w-full flex items-center gap-4 p-5 rounded-[22px] transition-all duration-300 border text-left group"
            :class="activeTab === tab.id
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/5'
              : 'bg-white/[0.02] dark:bg-white/[0.02] light:bg-white border-white/[0.06] dark:border-white/[0.06] light:border-gray-200 text-gray-500 hover:border-emerald-500/20 hover:bg-emerald-500/5 hover:text-gray-300 dark:hover:text-gray-300 light:hover:text-emerald-600 shadow-sm'"
            @click="activeTab = tab.id"
          >
            <div
              class="size-11 rounded-xl flex items-center justify-center transition-colors shadow-inner"
              :class="activeTab === tab.id ? 'bg-emerald-500 text-black' : 'bg-white/5 dark:bg-white/5 light:bg-gray-50 text-gray-500 dark:text-gray-500 light:text-gray-400 group-hover:text-emerald-400'"
            >
              <UIcon :name="tab.icon" class="size-5" />
            </div>
            <div>
              <p class="font-bold text-sm tracking-wide" :class="activeTab === tab.id ? 'text-emerald-400 dark:text-emerald-400 light:text-emerald-700' : 'text-gray-400 dark:text-gray-400 light:text-gray-600 transition-colors'">{{ tab.label }}</p>
              <p class="text-[11px] font-medium opacity-60 leading-tight">{{ tab.description }}</p>
            </div>
          </button>
        </div>

        <!-- Main Content Area -->
        <div class="lg:col-span-8">
          <Transition
            enter-active-class="transition-all duration-500 cubic-bezier(0.16,1,0.3,1)"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            mode="out-in"
          >
            <div :key="activeTab">
              <div v-if="activeTab === 'account'">
                <SettingsAccount />
              </div>
              <div v-else-if="activeTab === 'security'">
                <SettingsSecurity />
              </div>
              <div v-else class="relative group">
                 <div class="p-[1px] rounded-[32px] bg-gradient-to-br from-white/10 to-transparent dark:from-white/10 light:from-gray-200">
                    <UCard class="bg-app-section dark:bg-app-section light:bg-white border-none rounded-[31px] min-h-[400px] flex items-center justify-center text-center p-12 overflow-hidden shadow-sm">
                      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(52,211,153,0.05),transparent)] pointer-events-none" />
                      <div class="relative z-10 flex flex-col items-center">
                        <div class="size-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6">
                          <UIcon name="i-heroicons-sparkles" class="size-10 text-emerald-500/40" />
                        </div>
                        <h3 class="text-2xl font-black text-white dark:text-white light:text-gray-900 mb-3 tracking-tight">Feature Coming Soon</h3>
                        <p class="text-gray-500 max-w-xs mx-auto leading-relaxed">
                          We're working on something amazing here. Stay tuned for updates!
                        </p>
                      </div>
                    </UCard>
                 </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Logout Modal -->
      <UModal
        v-model:open="logoutModalOpen"
        :ui="{ 
          content: 'bg-app-section dark:bg-app-section light:bg-white border-white/10 dark:border-white/10 light:border-gray-200 rounded-[28px]' 
        }"
      >
        <template #content>
            <div class="p-8">
                <div class="flex items-center gap-4 mb-6">
                    <div class="size-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                        <UIcon name="i-heroicons-exclamation-triangle" class="size-6 text-red-500" />
                    </div>
                    <div>
                        <h3 class="text-xl font-black text-white dark:text-white light:text-gray-900">Confirm Logout</h3>
                        <p class="text-sm text-gray-500">Are you sure you want to end your session?</p>
                    </div>
                </div>
                <div class="flex justify-end gap-3 pt-6 border-t border-white/5">
                    <UButton label="Stay Logged In" color="gray" variant="ghost" class="rounded-xl font-bold" @click="logoutModalOpen = false" />
                    <UButton label="End Session" color="error" :loading="loading" class="rounded-xl font-black px-6 bg-red-500 text-white" @click="onLogout" />
                </div>
            </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
