<template>
  <div class="min-h-screen flex bg-[#09090b] text-white overflow-hidden">
    <!-- Left Side: Visual/Branding (Hidden on mobile) -->
    <div class="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-between overflow-hidden">
      <!-- Background Image with Overlay -->
      <div 
        class="absolute inset-0 bg-cover bg-center transition-transform duration-[20000ms] hover:scale-110"
        style="background-image: url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <!-- Top Branding -->
      <div class="relative z-10 flex items-center gap-3">
        <div class="size-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <UIcon name="i-heroicons-cloud-arrow-up" class="size-6 text-black" />
        </div>
        <span class="text-2xl font-bold tracking-tight">SKy Menu</span>
      </div>

      <!-- Bottom Content -->
      <div class="relative z-10 max-w-lg">
        <h2 class="text-4xl font-bold leading-tight mb-4">
          Revolutionize Your <span class="text-emerald-400">Restaurant Menu</span> Management.
        </h2>
        <p class="text-gray-400 text-lg">
          Join thousands of restaurants worldwide that trust SKy Menu for their digital presence and real-time menu updates.
        </p>
        
        <div class="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div class="flex -space-x-3">
                <UAvatar v-for="i in 4" :key="i" :src="`https://i.pravatar.cc/100?u=${i}`" size="sm" class="ring-2 ring-black" />
            </div>
            <div class="text-sm">
                <p class="font-medium">Loved by 500+ Chefs</p>
                <div class="flex items-center gap-1 text-emerald-400">
                    <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-20-solid" class="size-3" />
                </div>
            </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute -bottom-24 -left-24 size-96 bg-emerald-500/10 rounded-full blur-3xl" />
    </div>

    <!-- Right Side: Auth Forms -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
      <!-- Mobile Branding (Logo only visible on mobile) -->
      <div class="lg:hidden absolute top-8 left-8 flex items-center gap-2">
        <UIcon name="i-heroicons-cloud-arrow-up" class="size-8 text-emerald-500" />
        <span class="text-xl font-bold">SKy Menu</span>
      </div>

      <div class="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <slot />
      </div>

      <!-- Footer Links (Optional) -->
      <div class="absolute bottom-8 text-sm text-gray-500">
        &copy; 2026 SKy Menu. All rights reserved.
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-in {
  animation-fill-mode: both;
}
</style>
