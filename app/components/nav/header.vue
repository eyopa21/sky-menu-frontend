<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

const links = [
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/'
  },
  {
    label: 'Projects',
    icon: 'i-heroicons-magnifying-glass',
    badge: 3,
    children: [
      {
        label: 'Core',
        icon: 'i-heroicons-bolt',
        description: 'Manage your core projects.',
        to: '/projects'
      },
      {
        label: 'Blocks',
        icon: 'i-heroicons-server',
        description: 'Reusable UI blocks for your menu.',
        to: '/blocks'
      }
    ]
  }
]
</script>

<template>
  <div class="w-full border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <!-- Logo Section -->
      <div class="flex items-center gap-8">
        <NuxtLink to="/" class="flex items-center gap-2">
          <UIcon name="i-heroicons-cloud-arrow-up" class="size-8 text-emerald-500" />
          <span class="text-xl font-bold text-white tracking-tight">SKy Menu</span>
        </NuxtLink>

        <!-- Main Navigation -->
        <UNavigationMenu :items="links" class="hidden md:flex" />
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-4">
        <UInput
          icon="i-heroicons-magnifying-glass"
          placeholder="Search..."
          size="sm"
          class="hidden sm:block w-48"
          variant="ghost"
          :ui="{ base: 'bg-white/5 border-white/10' }"
        />

        <div v-if="isLoggedIn">
          <NavAccountMenu />
        </div>

        <div v-else class="flex items-center gap-2">
          <UButton
            label="Login"
            variant="ghost"
            to="/auth/login"
          />
          <UButton
            label="Get Started"
            to="/auth/login"
            color="emerald"
          />
        </div>
        
        <!-- Mobile Menu Toggle (simplified for now) -->
        <UButton
          icon="i-heroicons-bars-3"
          variant="ghost"
          class="md:hidden"
        />
      </div>
    </div>
  </div>
</template>
