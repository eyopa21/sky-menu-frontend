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

const authRepo = authRepository($api)

const items = [{
  label: 'Account',
  icon: 'i-heroicons-user',
  slot: 'account' as const,
  description: 'Manage your personal balance and profile details.'
}, {
  label: 'Privacy & Security',
  icon: 'i-heroicons-shield-check',
  slot: 'security' as const,
  description: 'Update your password and secure your account.'
}, {
  label: 'Subscription',
  icon: 'i-heroicons-credit-card',
  slot: 'subscription' as const,
  content: 'Coming soon...'
}, {
  label: 'Support',
  icon: 'i-heroicons-lifebuoy',
  slot: 'support' as const,
  content: 'Coming soon...'
}] satisfies TabsItem[]

const route = useRoute()
const router = useRouter()


async function onLogout() {
  try {
    loading.value = true
    // We might not have a logoutDto if the backend doesn't strictly need it, 
    // but the repo has it. Let's pass an empty if needed.
    // authRepo.logout({ refreshToken: authStore.session?.refreshToken || '' })
    
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
  <div class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <div class="flex items-center justify-between mb-12">
        <div>
            <h1 class="text-3xl font-bold text-white tracking-tight">Settings</h1>
            <p class="text-gray-400 mt-2">Manage your account and app preferences.</p>
        </div>
        <UButton
          label="Logout"
          icon="i-heroicons-arrow-left-on-rectangle"
          color="error"
          variant="outline"
          class="font-bold rounded-xl"
          @click="logoutModalOpen = true"
        />
      </div>

      <UTabs 
        :items="items" 
       
        class="w-full" 
        :ui="{ list: { background: 'bg-white/5', marker: 'bg-emerald-500', tab: { active: 'text-black font-bold' } } }"
      >
        <template #account="{ item }">
          <div class="mt-8 space-y-4">
            <p v-if="item.description" class="text-sm text-gray-400">{{ item.description }}</p>
            <SettingsAccount />
          </div>
        </template>

        <template #security="{ item }">
          <div class="mt-8 space-y-4">
            <p v-if="item.description" class="text-sm text-gray-400">{{ item.description }}</p>
            <SettingsSecurity />
          </div>
        </template>
        
        <template #subscription="{ item }">
          <div class="mt-8">
            <UCard class="bg-white/5 border-white/10">
                <p class="text-gray-400 italic">{{ item.content }}</p>
            </UCard>
          </div>
        </template>

        <template #support="{ item }">
          <div class="mt-8">
            <UCard class="bg-white/5 border-white/10">
                <p class="text-gray-400 italic">{{ item.content }}</p>
            </UCard>
          </div>
        </template>
      </UTabs>

      <UModal v-model:open="logoutModalOpen" title="Confirm Logout" description="Are you sure you want to log out of your account?">
        <template #footer>
            <div class="flex justify-end gap-3">
                <UButton label="Cancel" color="gray" variant="ghost" @click="logoutModalOpen = false" />
                <UButton label="Logout" color="error" :loading="loading" @click="onLogout" />
            </div>
        </template>
      </UModal>
    </div>
  </div>
</template>
