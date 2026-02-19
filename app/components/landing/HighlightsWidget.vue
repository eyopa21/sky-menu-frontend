<template>
  <div id="highlights" class="py-24 px-6 lg:px-20 bg-[#09090b]">
    <div class="mx-auto max-w-7xl">
      <div class="text-center mb-24">
        <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Powerful Everywhere
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          Scale your digital presence across all platforms with our unified management system.
        </p>
      </div>

      <!-- Feature 1: Mobile -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
        <div class="lg:col-span-6 order-2 lg:order-1">
          <div class="relative group">
            <div class="absolute -inset-4 bg-emerald-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div class="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm overflow-hidden aspect-square flex items-center justify-center">
                <img src="/demo/images/landing/mockup.svg" class="w-2/3 h-auto drop-shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700" alt="Mobile Mockup">
            </div>
          </div>
        </div>

        <div class="lg:col-span-6 order-1 lg:order-2 space-y-6 text-center lg:text-left">
          <div class="inline-flex size-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 mx-auto lg:mx-0">
            <UIcon name="i-heroicons-device-phone-mobile" class="size-8" />
          </div>
          <h3 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Mobile First Experiences
          </h3>
          <p class="text-gray-400 text-lg leading-relaxed">
            Your customers deserve a frictionless mobile experience. Our Appetito-inspired menus are optimized for every screen size, ensuring fast loading times and intuitive navigation.
          </p>
          <ul class="space-y-4 pt-4 text-left inline-block lg:block">
            <li v-for="i in ['Instant Load Times', 'Touch-Optimized UI', 'Offline Support']" :key="i" class="flex items-center gap-3 text-gray-300">
                <UIcon name="i-heroicons-check-circle" class="size-5 text-emerald-500" />
                <span>{{ i }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Feature 2: Desktop -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div class="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div class="inline-flex size-16 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-500 mx-auto lg:mx-0">
            <UIcon name="i-heroicons-computer-desktop" class="size-8" />
          </div>
          <h3 class="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Comprehensive Admin Tools
          </h3>
          <p class="text-gray-400 text-lg leading-relaxed">
            Manage your entire operation from a powerful desktop dashboard. Real-time analytics, bulk edits, and seamless integration with your existing workflow.
          </p>
          <div class="pt-6">
              <UButton 
                label="Explore Dashboard" 
                icon="i-heroicons-arrow-right" 
                trailing 
                variant="link" 
                color="emerald" 
                class="p-0 text-lg"
              />
          </div>
        </div>

        <div class="lg:col-span-6">
          <div class="relative group">
            <div class="absolute -inset-4 bg-yellow-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div class="relative bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
                <img src="/demo/images/landing/mockup-desktop.svg" class="w-full h-auto drop-shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700" alt="Desktop Mockup">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
