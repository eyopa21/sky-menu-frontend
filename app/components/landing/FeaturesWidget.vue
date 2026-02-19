<script setup lang="ts">
const features = [
  {
    title: 'Easy to Use',
    description: 'Intuitive interface designed for speed and efficiency.',
    icon: 'i-heroicons-users',
    color: 'yellow'
  },
  {
    title: 'Fresh Design',
    description: 'Modern aesthetics that make your menu stand out.',
    icon: 'i-heroicons-swatch',
    color: 'cyan'
  },
  {
    title: 'Well Documented',
    description: 'Everything you need to get started in minutes.',
    icon: 'i-heroicons-book-open',
    color: 'indigo'
  },
  {
    title: 'Responsive Layout',
    description: 'Perfect viewing experience on any device.',
    icon: 'i-heroicons-device-phone-mobile',
    color: 'slate'
  },
  {
    title: 'Clean Code',
    description: 'Built with Nuxt 4 and the latest best practices.',
    icon: 'i-heroicons-code-bracket',
    color: 'orange'
  },
  {
    title: 'Dark Mode',
    description: 'Beautiful dark interface for modern establishments.',
    icon: 'i-heroicons-moon',
    color: 'emerald'
  },
  {
    title: 'Ready to Use',
    description: 'Immediate deployment for your restaurant.',
    icon: 'i-heroicons-rocket-launch',
    color: 'teal'
  },
  {
    title: 'Modern Practices',
    description: 'Leveraging the best of modern web technology.',
    icon: 'i-heroicons-globe-alt',
    color: 'blue'
  },
  {
    title: 'Privacy',
    description: 'Your data is secure and under your control.',
    icon: 'i-heroicons-shield-check',
    color: 'purple'
  }
]
</script>

<template>
  <div id="features" class="py-24 px-6 lg:px-20 bg-[#09090b]">
    <div class="mx-auto max-w-7xl">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Marvelous Features
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          Everything you need to manage your digital menu with style and ease.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <UCard
          v-for="(feature, index) in features"
          :key="index"
          class="bg-white/5 border-white/5 hover:border-emerald-500/50 transition-all hover:-translate-y-1 group"
          :ui="{ body: { padding: 'p-8' } }"
        >
          <div class="flex flex-col h-full">
            <div 
                class="size-12 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110"
                :class="[`bg-${feature.color}-500/10 text-${feature.color}-500`]"
            >
              <UIcon :name="feature.icon" class="size-6" />
            </div>
            <h3 class="text-xl font-bold text-white mb-3">{{ feature.title }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">{{ feature.description }}</p>
          </div>
        </UCard>
      </div>

      <!-- Testimonial Section -->
      <div class="mt-32 relative group">
        <div class="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full" />
        <UCard class="relative bg-white/5 border-white/10 backdrop-blur-xl py-12 px-6 md:px-20 text-center rounded-3xl overflow-hidden">
          <div class="flex flex-col items-center">
            <div class="size-20 rounded-full bg-zinc-800 flex items-center justify-center mb-8 border-4 border-emerald-500/20">
              <UAvatar 
                src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/avatars/amyelsner.png" 
                size="xl" 
                class="size-full rounded-full"
              />
            </div>
            <h4 class="text-2xl font-bold text-white mb-1">Joséphine Miller</h4>
            <p class="text-emerald-500 text-sm font-medium mb-6 uppercase tracking-widest">Peak Interactive</p>
            <p class="text-xl md:text-2xl text-gray-300 italic leading-relaxed max-w-3xl font-light">
              "The transition to SKy Menu transformed how our customers interact with our offerings. The Appetito-style interface is not just beautiful, it's incredibly effective."
            </p>
            <div class="mt-10 flex gap-1 justify-center">
                <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="size-5 text-yellow-500" />
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
