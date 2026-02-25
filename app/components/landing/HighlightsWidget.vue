<template>
  <div id="highlights" class="py-28 px-6 lg:px-20 relative overflow-hidden transition-colors duration-500 bg-[#09090b] dark:bg-[#09090b] light:bg-white">
    <!-- Section top divider -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-px bg-gradient-to-r from-transparent via-white/10 dark:via-white/10 light:via-gray-200 to-transparent" />

    <div class="mx-auto max-w-7xl relative z-10">
      <!-- Section header -->
      <div class="text-center mb-24">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-5 transition-colors bg-white/5 dark:bg-white/5 light:bg-gray-100 border-white/10 dark:border-white/10 light:border-gray-200">
          <UIcon name="i-heroicons-bolt" class="size-3.5 text-yellow-400" />
          <span class="text-xs font-bold text-yellow-400 dark:text-yellow-400 light:text-yellow-700 tracking-wider uppercase">Engineered for Excellence</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight transition-colors text-white dark:text-white light:text-gray-900">
          Seamlessly <span class="text-yellow-400 dark:text-yellow-400 light:text-yellow-600">Integrated</span>
        </h2>
        <p class="text-lg max-w-2xl mx-auto leading-relaxed transition-colors text-gray-400 dark:text-gray-400 light:text-gray-600">
          Experience a unified platform that maintains the soul of your hospitality while digitizing the experience.
        </p>
      </div>

      <!-- Feature 1: Mobile -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <div class="order-2 lg:order-1 relative group">
          <div class="absolute -inset-10 bg-purple-500/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div class="relative p-[1px] rounded-[40px] bg-gradient-to-br from-purple-500/20 via-white/5 to-transparent dark:via-white/5 light:via-gray-200 transition-all duration-500 shadow-2xl overflow-hidden">
            <div class="rounded-[39px] p-12 aspect-[4/3] flex items-center justify-center transition-colors duration-500 bg-[#0d0d0f] dark:bg-[#0d0d0f] light:bg-[#fafafa]">
              <img
                src="/demo/images/landing/mockup.svg"
                class="w-3/5 h-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)] grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105 group-hover:rotate-1"
                alt="Mobile Experience"
              />
            </div>
            <!-- Decorative overlay -->
            <div class="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent pointer-events-none" />
          </div>
          <!-- Abstract floaters -->
          <div class="absolute -top-6 -right-6 size-20 rounded-full border-2 border-purple-500/10 dark:border-purple-500/10 light:border-purple-200 animate-pulse hidden lg:block" />
        </div>

        <div class="order-1 lg:order-2 space-y-8">
          <div class="inline-flex size-16 items-center justify-center rounded-3xl transition-colors bg-purple-500/10 text-purple-400 dark:bg-purple-500/10 dark:text-purple-400 light:bg-purple-50 light:text-purple-600 shadow-sm">
            <UIcon name="i-heroicons-device-phone-mobile" class="size-8" />
          </div>
          <div class="space-y-4">
            <h3 class="text-4xl font-bold tracking-tight leading-tight transition-colors text-white dark:text-white light:text-gray-900">
              Mobile-First<br />Experience
            </h3>
            <p class="text-lg leading-relaxed transition-colors text-gray-400 dark:text-gray-400 light:text-gray-600">
              In a culture that values sharing, our mobile menus make communal ordering effortless. optimized for every device, everywhere.
            </p>
          </div>
          <ul class="space-y-5">
            <li
              v-for="item in ['Instant Performance', 'Touch-Perfect UI', 'Multi-Language Support']"
              :key="item"
              class="flex items-center gap-4 group cursor-default"
            >
              <div class="size-7 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:scale-110 bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-50">
                <UIcon name="i-heroicons-check" class="size-4 text-emerald-400 dark:text-emerald-400 light:text-emerald-600 font-bold" />
              </div>
              <span class="text-base font-medium transition-colors text-gray-300 dark:text-gray-300 light:text-gray-800">{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Feature 2: Desktop -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div class="space-y-8">
          <div class="inline-flex size-16 items-center justify-center rounded-3xl transition-colors bg-yellow-500/10 text-yellow-400 dark:bg-yellow-500/10 dark:text-yellow-400 light:bg-yellow-50 light:text-yellow-600 shadow-sm">
            <UIcon name="i-heroicons-computer-desktop" class="size-8" />
          </div>
          <div class="space-y-4">
            <h3 class="text-4xl font-bold tracking-tight leading-tight transition-colors text-white dark:text-white light:text-gray-900">
              Centralized<br />Administration
            </h3>
            <p class="text-lg leading-relaxed transition-colors text-gray-400 dark:text-gray-400 light:text-gray-600">
              Manage multi-branch operations with a single, beautiful dashboard. Real-time updates mean your guests always see the latest offerings.
            </p>
          </div>
          <ul class="space-y-5">
            <li
              v-for="item in ['Granular Analytics', 'Bulk Content Updates', 'Smart Inventory Sync']"
              :key="item"
              class="flex items-center gap-4 group cursor-default"
            >
              <div class="size-7 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:scale-110 bg-yellow-500/10 dark:bg-yellow-500/10 light:bg-yellow-50">
                <UIcon name="i-heroicons-check" class="size-4 text-yellow-400 dark:text-yellow-400 light:text-yellow-600 font-bold" />
              </div>
              <span class="text-base font-medium transition-colors text-gray-300 dark:text-gray-300 light:text-gray-800">{{ item }}</span>
            </li>
          </ul>
          <NuxtLink
            to="/auth/login"
            class="inline-flex items-center gap-2 font-bold transition-all pt-4 group text-emerald-400 dark:text-emerald-400 light:text-emerald-700 hover:gap-3"
          >
            Dashboard Explorer
            <UIcon name="i-heroicons-arrow-right" class="size-5" />
          </NuxtLink>
        </div>

        <div class="group relative">
          <div class="absolute -inset-10 bg-yellow-500/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div class="relative p-[1px] rounded-[40px] bg-gradient-to-br from-yellow-500/20 via-white/5 to-transparent dark:via-white/5 light:via-gray-200 transition-all duration-500 shadow-2xl overflow-hidden">
            <div class="rounded-[39px] p-10 aspect-video flex items-center justify-center transition-colors duration-500 bg-[#0d0d0f] dark:bg-[#0d0d0f] light:bg-[#fafafa]">
              <img
                src="/demo/images/landing/mockup-desktop.svg"
                class="w-full h-auto drop-shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-[1.02] group-hover:-rotate-0.5"
                alt="Admin Panel"
              />
            </div>
          </div>
          <!-- Premium floaters -->
          <div class="absolute -top-8 -left-8 p-5 rounded-2xl bg-[#111113] dark:bg-[#111113] light:bg-white border border-gray-200/10 dark:border-white/10 light:border-gray-200 shadow-2xl hidden lg:block transition-all duration-500 group-hover:translate-x-2 group-hover:-translate-y-1">
            <div class="flex items-center gap-4">
              <div class="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <UIcon name="i-heroicons-user-group" class="size-5 text-emerald-500" />
              </div>
              <div>
                <p class="text-[10px] uppercase tracking-widest font-bold text-gray-500">Live Traffic</p>
                <p class="text-sm font-bold text-white dark:text-white light:text-gray-900 transition-colors">1.4k Active Now</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
