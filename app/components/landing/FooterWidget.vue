<template>
  <footer class="bg-[#09090b] border-t border-white/5 py-20 px-6 lg:px-20">
    <div class="mx-auto max-w-7xl">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
        <!-- Brand Section -->
        <div class="lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
          <NuxtLink to="/" class="flex items-center gap-2 mb-6">
            <UIcon name="i-heroicons-cloud-arrow-up" class="size-10 text-emerald-500" />
            <span class="text-2xl font-bold text-white tracking-tight">SKy Menu</span>
          </NuxtLink>
          <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
            The next generation of digital menu management. Empowering restaurants with stunning, Appetito-inspired visual menus.
          </p>
          <div class="mt-8 flex gap-4">
            <UButton icon="i-mdi-github" variant="ghost" color="neutral" size="sm" class="rounded-full bg-white/5" />
            <UButton icon="i-mdi-twitter" variant="ghost" color="neutral" size="sm" class="rounded-full bg-white/5" />
            <UButton icon="i-mdi-linkedin" variant="ghost" color="neutral" size="sm" class="rounded-full bg-white/5" />
          </div>
        </div>

        <!-- Links Sections -->
        <div class="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div class="flex flex-col gap-4">
            <h4 class="text-white font-bold text-sm uppercase tracking-widest">Company</h4>
            <ul class="space-y-3">
              <li><NuxtLink to="#" class="text-gray-400 hover:text-white transition-colors text-sm">About Us</NuxtLink></li>
              <li><NuxtLink to="#" class="text-gray-400 hover:text-white transition-colors text-sm">News</NuxtLink></li>
              <li><NuxtLink to="#" class="text-gray-400 hover:text-white transition-colors text-sm">Careers</NuxtLink></li>
            </ul>
          </div>

          <div class="flex flex-col gap-4">
            <h4 class="text-white font-bold text-sm uppercase tracking-widest">Resources</h4>
            <ul class="space-y-3">
              <li><NuxtLink to="#" class="text-gray-400 hover:text-white transition-colors text-sm">Get Started</NuxtLink></li>
              <li><NuxtLink to="#" class="text-gray-400 hover:text-white transition-colors text-sm">Learn</NuxtLink></li>
              <li><NuxtLink to="#" class="text-gray-400 hover:text-white transition-colors text-sm">Documentation</NuxtLink></li>
            </ul>
          </div>

          <div class="flex flex-col gap-4">
            <h4 class="text-white font-bold text-sm uppercase tracking-widest">Community</h4>
            <ul class="space-y-3">
              <li><NuxtLink to="#" class="text-gray-400 hover:text-white transition-colors text-sm">Discord</NuxtLink></li>
              <li><NuxtLink to="#" class="text-gray-400 hover:text-white transition-colors text-sm">Events</NuxtLink></li>
              <li><NuxtLink to="#" class="text-gray-400 hover:text-white transition-colors text-sm">FAQ</NuxtLink></li>
            </ul>
          </div>

          <div class="flex flex-col gap-4">
            <h4 class="text-white font-bold text-sm uppercase tracking-widest">Legal</h4>
            <ul class="space-y-3">
              <li><NuxtLink to="#" class="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</NuxtLink></li>
              <li><NuxtLink to="#" class="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</NuxtLink></li>
              <li><NuxtLink to="#" class="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</NuxtLink></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-gray-500 text-xs text-center md:text-left">
          &copy; 2026 SKy Menu. All rights reserved. Built with Nuxt 4 & Nuxt UI v3.
        </p>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <span>Status:</span>
          <span class="flex items-center gap-1.5 text-emerald-500">
            <div class="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Operational
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
