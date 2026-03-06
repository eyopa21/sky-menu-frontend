<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)
const colorMode = useColorMode()

const mobileOpen = ref(false)

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Highlights', href: '#highlights' },
  { label: 'Pricing', href: '#pricing' },
]

const authLinks = [
  { label: 'Projects', href: '/projects', icon: 'i-heroicons-folder-open' },
  { label: 'Account Settings', href: '/account/settings', icon: 'i-heroicons-cog-8-tooth' },
]

const isDark = computed(() => colorMode.value === 'dark')

function toggleColorMode() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

function scrollTo(href: string) {
  mobileOpen.value = false
  if (href.startsWith('#')) {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  } else {
    navigateTo(href)
  }
}
</script>

<template>
  <!-- Top gradient accent line -->
  <div class="fixed top-0 left-0 right-0 z-[60] h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-80" />

  <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-6 lg:px-12 border-b border-white/[0.06] dark:border-white/[0.06] light:border-gray-200 bg-app-bg/80 dark:bg-app-bg/80 light:bg-white/90 backdrop-blur-xl shadow-[0_4px_30px_0_rgba(0,0,0,0.5)] dark:shadow-[0_4px_30px_0_rgba(0,0,0,0.5)] light:shadow-sm transition-all duration-500">

    <!-- Logo -->
    <NuxtLink to="/" class="flex items-center gap-2.5 group shrink-0">
      <div class="relative size-8">
        <div class="absolute inset-0 bg-emerald-500 rounded-lg blur-md opacity-20 dark:opacity-40 light:opacity-20 group-hover:opacity-80 transition-opacity duration-300" />
        <div class="relative size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
          <UIcon name="i-heroicons-cloud-arrow-up" class="size-4 text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
        </div>
      </div>
      <span class="text-lg font-bold tracking-tight">
        <span class="text-white dark:text-white light:text-gray-900 transition-colors">SKy</span><span class="text-emerald-400 dark:text-emerald-400 light:text-emerald-600">Menu</span>
      </span>
    </NuxtLink>

    <!-- Desktop nav -->
    <nav class="hidden md:flex items-center gap-0.5">
      <button
        v-for="link in navLinks"
        :key="link.label"
        class="group relative px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-emerald-700 transition-colors duration-200 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-emerald-50"
        @click="scrollTo(link.href)"
      >
        {{ link.label }}
        <span class="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-px w-0 bg-gradient-to-r from-emerald-500 to-teal-400 group-hover:w-5 transition-all duration-300 rounded-full" />
      </button>

      <template v-if="isLoggedIn">
        <div class="w-px h-5 bg-white/10 dark:bg-white/10 light:bg-gray-200 mx-2" />
        <NuxtLink
          v-for="link in authLinks"
          :key="link.label"
          :to="link.href"
          class="group relative px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-emerald-700 transition-colors duration-200 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-emerald-50 flex items-center gap-1.5"
        >
          <UIcon :name="link.icon" class="size-3.5 text-emerald-500/60 group-hover:text-emerald-400 light:group-hover:text-emerald-600 transition-colors" />
          {{ link.label }}
          <span class="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-px w-0 bg-gradient-to-r from-emerald-500 to-teal-400 group-hover:w-5 transition-all duration-300 rounded-full" />
        </NuxtLink>
      </template>
    </nav>

    <!-- Right section -->
    <div class="flex items-center gap-2">

      <!-- Color mode toggle -->
      <button
        class="group relative size-9 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-emerald-700 border border-white/[0.06] dark:border-white/[0.06] light:border-gray-200 hover:border-white/15 dark:hover:border-white/15 light:hover:border-emerald-300 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-emerald-50 transition-all duration-200 shadow-sm"
        :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        @click="toggleColorMode"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 rotate-90 scale-50"
          enter-to-class="opacity-100 rotate-0 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 rotate-0 scale-100"
          leave-to-class="opacity-0 -rotate-90 scale-50"
          mode="out-in"
        >
          <UIcon
            v-if="isDark"
            key="sun"
            name="i-heroicons-sun"
            class="size-4 text-yellow-400"
          />
          <UIcon
            v-else
            key="moon"
            name="i-heroicons-moon"
            class="size-4 text-indigo-600"
          />
        </Transition>
      </button>

      <template v-if="isLoggedIn">
        <NavAccountMenu />
      </template>

      <template v-else>
        <NuxtLink
          to="/auth/login"
          class="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-emerald-700 transition-colors duration-200 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-emerald-50"
        >
          Sign in
        </NuxtLink>
        <NuxtLink
          to="/auth/login"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-black dark:text-black light:text-white bg-emerald-400 dark:bg-emerald-400 light:bg-emerald-600 hover:bg-emerald-300 dark:hover:bg-emerald-300 light:hover:bg-emerald-500 rounded-lg transition-all duration-300 shadow-[0_0_16px_0_rgba(52,211,153,0.35)] dark:shadow-[0_0_28px_0_rgba(52,211,153,0.55)] light:shadow-md hover:scale-[1.03]"
        >
          Get Started
          <UIcon name="i-heroicons-arrow-right" class="size-4" />
        </NuxtLink>
      </template>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden p-2 rounded-lg text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-emerald-700 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-emerald-50 transition-all duration-200 border border-white/[0.06] dark:border-white/[0.06] light:border-gray-200 hover:border-white/15 dark:hover:border-white/15"
        @click="mobileOpen = !mobileOpen"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 rotate-90"
          enter-to-class="opacity-100 rotate-0"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 rotate-0"
          leave-to-class="opacity-0 -rotate-90"
          mode="out-in"
        >
          <UIcon
            :key="mobileOpen ? 'x' : 'bars'"
            :name="mobileOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
            class="size-5"
          />
        </Transition>
      </button>
    </div>
  </header>

  <!-- Mobile menu -->
  <Transition
    enter-active-class="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
    enter-from-class="opacity-0 -translate-y-3"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-3"
  >
    <div
      v-if="mobileOpen"
      class="md:hidden fixed top-16 left-0 right-0 z-40 bg-app-bg/95 dark:bg-app-bg/95 light:bg-white/95 backdrop-blur-xl border-b border-white/[0.06] dark:border-white/[0.06] light:border-gray-200 p-4 space-y-1 shadow-2xl transition-colors duration-500"
    >
      <button
        v-for="link in navLinks"
        :key="link.label"
        class="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-emerald-700 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-emerald-50 transition-all duration-200 flex items-center gap-2"
        @click="scrollTo(link.href)"
      >
        {{ link.label }}
      </button>

      <template v-if="isLoggedIn">
        <div class="my-2 h-px bg-white/5 dark:bg-white/5 light:bg-gray-100" />
        <NuxtLink
          v-for="link in authLinks"
          :key="link.label"
          :to="link.href"
          class="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-emerald-700 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-emerald-50 transition-all duration-200"
          @click="mobileOpen = false"
        >
          <UIcon :name="link.icon" class="size-4 text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
          {{ link.label }}
        </NuxtLink>
      </template>

      <template v-else>
        <div class="my-2 h-px bg-white/5 dark:bg-white/5 light:bg-gray-100" />
        <NuxtLink
          to="/auth/login"
          class="flex items-center justify-center gap-1.5 w-full py-3.5 text-sm font-semibold text-black dark:text-black light:text-white bg-emerald-400 dark:bg-emerald-400 light:bg-emerald-600 hover:bg-emerald-300 dark:hover:bg-emerald-300 light:hover:bg-emerald-500 rounded-xl transition-all duration-300 shadow-[0_0_16px_0_rgba(52,211,153,0.3)]"
          @click="mobileOpen = false"
        >
          Get Started Free
          <UIcon name="i-heroicons-arrow-right" class="size-4" />
        </NuxtLink>
      </template>

      <!-- Color mode toggle in mobile -->
      <div class="my-2 h-px bg-white/5 dark:bg-white/5 light:bg-gray-100" />
      <button
        class="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-emerald-700 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-emerald-50 transition-all duration-200"
        @click="toggleColorMode"
      >
        <UIcon :name="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'" class="size-4" :class="isDark ? 'text-yellow-400' : 'text-indigo-600'" />
        {{ isDark ? 'Light Mode' : 'Dark Mode' }}
      </button>
    </div>
  </Transition>
</template>
