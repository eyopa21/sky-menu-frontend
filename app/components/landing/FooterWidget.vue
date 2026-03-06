<template>
  <footer class="relative overflow-hidden transition-colors duration-500 bg-app-bg">
    <!-- Top divider glow -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/8 dark:via-white/8 light:via-gray-200 to-transparent" />
    <!-- Background radial decor -->
    <div class="absolute top-0 left-1/4 w-96 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none opacity-20" />

    <div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-20 py-28">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-20 mb-20">
        <!-- Brand -->
        <div class="lg:col-span-4 flex flex-col group">
          <NuxtLink to="/" class="flex items-center gap-3 mb-8">
            <div class="relative size-12 flex items-center justify-center">
              <div class="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-500" />
              <div class="relative size-12 rounded-2xl border transition-all duration-300 group-hover:scale-110 flex items-center justify-center bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/10 dark:border-emerald-500/20 light:bg-emerald-50 light:border-emerald-200">
                <UIcon name="i-heroicons-cloud-arrow-up" class="size-6 text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
              </div>
            </div>
            <span class="text-2xl font-bold tracking-tight transition-colors text-white dark:text-white light:text-gray-900">
              SKy<span class="text-emerald-400 dark:text-emerald-400 light:text-emerald-600">Menu</span>
            </span>
          </NuxtLink>
          <p class="text-base leading-relaxed max-w-sm mb-10 transition-colors text-gray-500 dark:text-gray-500 light:text-gray-600">
            The next generation of digital menu management. Where Ethiopian tradition meets global digital innovation.
          </p>
          <div class="flex gap-4">
            <a
              v-for="social in [
                { icon: 'i-mdi-github', href: 'https://github.com' },
                { icon: 'i-mdi-twitter', href: 'https://twitter.com' },
                { icon: 'i-mdi-linkedin', href: 'https://linkedin.com' }
              ]"
              :key="social.icon"
              :href="social.href"
              target="_blank"
              class="size-11 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1 shadow-sm border bg-white/5 dark:bg-white/5 light:bg-white border-white/10 dark:border-white/10 light:border-gray-200 text-gray-400 dark:text-gray-400 light:text-gray-500 hover:text-emerald-400 dark:hover:text-emerald-400 light:hover:text-emerald-600 hover:border-emerald-500/30"
            >
              <UIcon :name="social.icon" class="size-5 shrink-0" />
            </a>
          </div>
        </div>

        <!-- Links Grid -->
        <div class="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-12 lg:gap-8">
          <!-- Platform Column -->
          <div class="flex flex-col gap-8">
            <h4 class="font-black text-[11px] uppercase tracking-[0.25em] transition-colors text-white dark:text-white light:text-gray-900">Platform</h4>
            <ul class="space-y-5">
              <li v-for="link in [
                { label: 'Capabilities', href: '#features' },
                { label: 'Live Echo', href: '#highlights' },
                { label: 'Pricing Plans', href: '#pricing' }
              ]" :key="link.label">
                <a :href="link.href" class="text-sm font-semibold transition-colors text-gray-500 dark:text-gray-500 light:text-gray-600 hover:text-emerald-400 dark:hover:text-emerald-400 light:hover:text-emerald-700">
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Apps Column -->
          <div class="flex flex-col gap-8">
            <h4 class="font-black text-[11px] uppercase tracking-[0.25em] transition-colors text-white dark:text-white light:text-gray-900">Ecosystem</h4>
            <ul class="space-y-5">
              <li v-for="link in [
                { label: 'Dashboards', to: '/projects', icon: 'i-heroicons-folder-open' },
                { label: 'Preferences', to: '/account/settings', icon: 'i-heroicons-cog-8-tooth' },
                { label: 'Habesha Auth', to: '/auth/login', icon: 'i-heroicons-shield-check' }
              ]" :key="link.label">
                <NuxtLink :to="link.to" class="text-sm font-semibold transition-colors text-gray-500 dark:text-gray-500 light:text-gray-600 hover:text-emerald-400 dark:hover:text-emerald-400 light:hover:text-emerald-700 flex items-center gap-3 group">
                  <UIcon :name="link.icon" class="size-4.5 opacity-40 group-hover:opacity-100 transition-all group-hover:scale-110" />
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Wisdom Column -->
          <div class="flex flex-col gap-8">
            <h4 class="font-black text-[11px] uppercase tracking-[0.25em] transition-colors text-white dark:text-white light:text-gray-100">Wisdom</h4>
            <ul class="space-y-5">
              <li v-for="item in ['Habesha Discord', 'Guest Blog', 'Success Stories']" :key="item">
                <a href="#" class="text-sm font-semibold transition-colors text-gray-500 dark:text-gray-500 light:text-gray-600 hover:text-emerald-400 dark:hover:text-emerald-400 light:hover:text-emerald-700">
                  {{ item }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Policy Column -->
          <div class="flex flex-col gap-8">
            <h4 class="font-black text-[11px] uppercase tracking-[0.25em] transition-colors text-white dark:text-white light:text-gray-900">Trust</h4>
            <ul class="space-y-5">
              <li v-for="item in ['Integrity Policy', 'Guest Terms', 'Ethics']" :key="item">
                <a href="#" class="text-sm font-semibold transition-colors text-gray-500 dark:text-gray-500 light:text-gray-600 hover:text-emerald-400 dark:hover:text-emerald-400 light:hover:text-emerald-700">
                  {{ item }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="pt-12 border-t transition-colors duration-500 border-white/[0.06] dark:border-white/[0.06] light:border-gray-200 flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <p class="text-sm font-medium transition-colors text-gray-600 dark:text-gray-600 light:text-gray-500">
            © 2026 SKy Menu Global. Architected in Addis Ababa.
          </p>
          <div class="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-800 hidden md:block" />
          <div class="flex items-center gap-3">
             <span class="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-emerald-500 dark:text-emerald-500 light:text-emerald-700 transition-colors">
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Digital Resilience: Active
            </span>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <div class="px-5 py-2 rounded-2xl border transition-colors shadow-sm text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-500 light:text-gray-600 bg-white/5 dark:bg-white/5 light:bg-white border-white/10 dark:border-white/10 light:border-gray-200">
            Nuxt UI Excellence
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
