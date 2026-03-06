<script setup lang="ts">
const features = [
  {
    title: 'Easy to Use',
    description: 'Intuitive interface designed for speed and efficiency. No training required.',
    icon: 'i-heroicons-users',
    color: 'yellow',
    gradient: 'from-yellow-500/10 to-transparent'
  },
  {
    title: 'Fresh Design',
    description: 'Modern aesthetics that make your menu stand out from the competition.',
    icon: 'i-heroicons-swatch',
    color: 'cyan',
    gradient: 'from-cyan-500/10 to-transparent'
  },
  {
    title: 'Well Documented',
    description: 'Comprehensive guides and examples to get you started in minutes.',
    icon: 'i-heroicons-book-open',
    color: 'indigo',
    gradient: 'from-indigo-500/10 to-transparent'
  },
  {
    title: 'Responsive Layout',
    description: 'Perfect viewing experience on any device — phone, tablet, or desktop.',
    icon: 'i-heroicons-device-phone-mobile',
    color: 'slate',
    gradient: 'from-slate-400/10 to-transparent'
  },
  {
    title: 'Clean Code',
    description: 'Built with Nuxt 4 and the latest web standards for performance.',
    icon: 'i-heroicons-code-bracket',
    color: 'orange',
    gradient: 'from-orange-500/10 to-transparent'
  },
  {
    title: 'Dark Mode',
    description: 'Beautiful dark interface that reduces eye strain and looks stunning.',
    icon: 'i-heroicons-moon',
    color: 'emerald',
    gradient: 'from-emerald-500/10 to-transparent'
  },
  {
    title: 'Ready to Deploy',
    description: 'From setup to live in minutes. Instant deployment for your restaurant.',
    icon: 'i-heroicons-rocket-launch',
    color: 'teal',
    gradient: 'from-teal-500/10 to-transparent'
  },
  {
    title: 'Modern Practices',
    description: 'Leveraging the best of modern web technology for peak performance.',
    icon: 'i-heroicons-globe-alt',
    color: 'blue',
    gradient: 'from-blue-500/10 to-transparent'
  },
  {
    title: 'Privacy First',
    description: 'Your data is encrypted, secure, and always under your control.',
    icon: 'i-heroicons-shield-check',
    color: 'purple',
    gradient: 'from-purple-500/10 to-transparent'
  }
]
</script>

<template>
  <div id="features" class="py-28 px-6 lg:px-20 relative overflow-hidden transition-colors duration-500 bg-app-bg">
    <!-- Subtle divider glow -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-8 bg-emerald-500/5 blur-xl" />

    <div class="mx-auto max-w-7xl relative z-10">
      <!-- Section header -->
      <div class="text-center mb-20 overflow-hidden">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/15 mb-4 dark:bg-emerald-500/10 dark:border-emerald-500/15 light:bg-emerald-50 light:border-emerald-100 transition-colors">
          <UIcon name="i-heroicons-sparkles" class="size-3.5 text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
          <span class="text-xs font-bold text-emerald-400 dark:text-emerald-400 light:text-emerald-700 tracking-wider uppercase">Capabilities</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white dark:text-white light:text-gray-900 transition-colors">
          Everything you need for
          <span class="text-emerald-400 dark:text-emerald-400 light:text-emerald-600"> Exceptional Dining</span>
        </h2>
        <p class="text-lg max-w-2xl mx-auto leading-relaxed text-gray-400 dark:text-gray-400 light:text-gray-600 transition-colors">
          A thoughtfully designed suite of tools to power your digital menu — designed for modern hospitality.
        </p>
      </div>

      <!-- Feature cards grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="group relative p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border bg-white/[0.03] dark:bg-white/[0.03] light:bg-white border-white/[0.06] dark:border-white/[0.06] light:border-gray-200 hover:border-emerald-500/20 dark:hover:border-emerald-500/20 light:hover:border-emerald-300 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5"
        >
          <!-- Hover gradient bg -->
          <div :class="`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${feature.gradient} transition-opacity duration-500`" />

          <div class="relative z-10">
            <div
              :class="`size-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 shadow-inner bg-${feature.color}-500/10 text-${feature.color}-400 dark:bg-${feature.color}-500/10 dark:text-${feature.color}-400 light:bg-${feature.color}-50 light:text-${feature.color}-600`"
            >
              <UIcon :name="feature.icon" class="size-6" />
            </div>
            <h3 class="text-lg font-bold mb-3 transition-colors text-white dark:text-white light:text-gray-900">{{ feature.title }}</h3>
            <p class="text-sm leading-relaxed transition-colors text-gray-400 dark:text-gray-400 light:text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>

      <!-- Testimonial -->
      <div class="mt-32 relative group">
        <div class="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full scale-110 opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
        <div class="relative p-[1px] rounded-[40px] bg-gradient-to-br from-emerald-500/20 via-white/5 to-transparent shadow-2xl transition-all duration-500 hover:scale-[1.005]">
          <div class="rounded-[39px] py-16 px-6 md:px-24 text-center transition-colors duration-500 bg-app-section dark:bg-app-section light:bg-white">
            <div class="flex flex-col items-center">
              <div class="relative mb-10">
                <div class="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-full animate-pulse" />
                <UAvatar
                  src="/cultural-hero.png"
                  size="xl"
                  class="relative ring-[6px] ring-emerald-500/20 dark:ring-emerald-500/20 light:ring-emerald-50 transition-all grayscale group-hover:grayscale-0 duration-700 h-24 w-24 rounded-full object-cover"
                />
              </div>
              <div class="flex gap-1 mb-8 transition-transform group-hover:scale-105 duration-500">
                <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="size-5 text-yellow-500" />
              </div>
              <p class="text-2xl md:text-3xl italic leading-relaxed max-w-4xl font-light mb-10 transition-colors text-gray-300 dark:text-gray-300 light:text-gray-600">
                "The transition to SKy Menu transformed how our customers interact with our offerings. The blend of tradition and modern ease is truly world-class."
              </p>
              <div class="h-px w-12 bg-emerald-500/30 mb-6" />
              <h4 class="text-xl font-bold mb-1 transition-colors text-white dark:text-white light:text-gray-900">Joséphine Miller</h4>
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 dark:text-emerald-400 light:text-emerald-700">Founder, Peak Table</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
