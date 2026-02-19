<script setup lang="ts">
function smoothScroll(id: string) {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}
</script>

<template>
  <nav class="flex items-center justify-between py-6 px-6 lg:px-20 bg-black/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-[100]">
    <NuxtLink to="/" class="flex items-center gap-2">
      <UIcon name="i-heroicons-cloud-arrow-up" class="size-10 text-emerald-500" />
      <span class="text-2xl font-bold text-white tracking-tight">SKy Menu</span>
    </NuxtLink>

    <div class="hidden lg:flex items-center gap-8">
      <ul class="flex items-center gap-8 list-none p-0 m-0">
        <li>
          <button @click="smoothScroll('hero')" class="text-gray-400 hover:text-white transition-colors font-medium text-sm">Home</button>
        </li>
        <li>
          <button @click="smoothScroll('features')" class="text-gray-400 hover:text-white transition-colors font-medium text-sm">Features</button>
        </li>
        <li>
          <button @click="smoothScroll('highlights')" class="text-gray-400 hover:text-white transition-colors font-medium text-sm">Highlights</button>
        </li>
        <li>
          <button @click="smoothScroll('pricing')" class="text-gray-400 hover:text-white transition-colors font-medium text-sm">Pricing</button>
        </li>
      </ul>

      <div class="flex items-center gap-2 ml-4">
        <UButton
          label="Login"
          variant="ghost"
          color="neutral"
          to="/auth/login"
          class="font-bold"
        />
        <UButton
          label="Register"
          color="emerald"
          to="/auth/login"
          class="font-bold rounded-full px-6"
        />
      </div>
    </div>

    <!-- Mobile Menu Toggle -->
    <UButton
      icon="i-heroicons-bars-3"
      variant="ghost"
      color="neutral"
      class="lg:hidden"
    />
  </nav>
</template>
