<script setup lang="ts">
const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for small cafes or personal projects.',
    icon: 'i-heroicons-sparkles',
    accentColor: 'text-gray-400',
    features: [
      'Responsive Layout',
      'Unlimited QR Scans',
      'Basic Analytics',
      'Community Support'
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'ghost' as const
  },
  {
    name: 'Startup',
    price: '$19',
    period: '/month',
    description: 'Ideal for growing restaurants and businesses.',
    icon: 'i-heroicons-rocket-launch',
    accentColor: 'text-emerald-400',
    features: [
      'All Free features',
      'Advanced Menu Customization',
      'Priority Support',
      'Multiple Menu Templates'
    ],
    buttonText: 'Start Free Trial',
    buttonVariant: 'solid' as const,
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: '/month',
    description: 'Custom solutions for large restaurant chains.',
    icon: 'i-heroicons-building-office-2',
    accentColor: 'text-purple-400',
    features: [
      'All Startup features',
      'Unlimited Menu Items',
      'API Access',
      'Dedicated Account Manager'
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'ghost' as const
  }
]
</script>

<template>
  <div id="pricing" class="py-28 px-6 lg:px-20 relative overflow-hidden transition-colors duration-500 bg-[#09090b] dark:bg-[#09090b] light:bg-[#fcfdfd]">
    <!-- Top divider glow -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-px bg-gradient-to-r from-transparent via-white/10 dark:via-white/10 light:via-gray-200 to-transparent" />
    <!-- Background accent -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none opacity-40" />

    <div class="mx-auto max-w-7xl relative z-10">
      <!-- Section header -->
      <div class="text-center mb-20">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-5 transition-colors bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-50 border-emerald-500/15 dark:border-emerald-500/15 light:border-emerald-100">
          <UIcon name="i-heroicons-tag" class="size-3.5 text-emerald-400 dark:text-emerald-400 light:text-emerald-600" />
          <span class="text-xs font-bold text-emerald-400 dark:text-emerald-400 light:text-emerald-700 tracking-wider uppercase">Investment</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight transition-colors text-white dark:text-white light:text-gray-900">
          Simple & Transparent
          <span class="text-emerald-400 dark:text-emerald-400 light:text-emerald-600"> Pricing</span>
        </h2>
        <p class="text-lg max-w-2xl mx-auto leading-relaxed transition-colors text-gray-400 dark:text-gray-400 light:text-gray-600">
          Scale your hospitality business with a plan that fits your growth. No long-term commitments.
        </p>
      </div>

      <!-- Plans grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          class="relative group"
        >
          <!-- Popular glow -->
          <div
            v-if="plan.popular"
            class="absolute -inset-1.5 rounded-[40px] bg-gradient-to-b from-emerald-500 to-teal-700 blur-xl opacity-20 dark:opacity-40 light:opacity-20 group-hover:opacity-60 transition-opacity"
          />

          <!-- Card border gradient wrapper -->
          <div
            class="relative h-full p-[1px] rounded-[36px] transition-all duration-300 transform group-hover:-translate-y-1"
            :class="plan.popular
              ? 'bg-gradient-to-b from-emerald-500 to-teal-700 shadow-2xl'
              : 'bg-gradient-to-b from-white/10 to-white/5 dark:from-white/10 light:from-gray-200 group-hover:from-emerald-400/30'"
          >
            <div class="relative h-full rounded-[35px] p-10 flex flex-col transition-colors duration-500 shadow-sm"
              :class="plan.popular ? 'bg-[#0a1a12] dark:bg-[#0a1a12] light:bg-[#f0fdf4]' : 'bg-[#0d0d0f] dark:bg-[#0d0d0f] light:bg-white'"
            >
              <!-- Popular badge -->
              <div
                v-if="plan.popular"
                class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[11px] font-extrabold px-5 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap shadow-xl"
              >
                ✦ Best Value
              </div>

              <!-- Plan header -->
              <div class="mb-10">
                <div class="size-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-colors"
                  :class="plan.popular ? 'bg-emerald-500/20 dark:bg-emerald-500/20 light:bg-emerald-500/10' : 'bg-white/5 dark:bg-white/5 light:bg-gray-50'"
                >
                  <UIcon :name="plan.icon" class="size-7" :class="plan.accentColor" />
                </div>
                <h3 class="text-2xl font-bold mb-1 transition-colors text-white dark:text-white light:text-gray-900">{{ plan.name }}</h3>
                <div class="flex items-baseline gap-1 mb-4">
                  <span class="text-5xl font-black transition-colors" :class="plan.popular ? 'text-emerald-400 dark:text-emerald-400 light:text-emerald-600' : 'text-white dark:text-white light:text-gray-900'">{{ plan.price }}</span>
                  <span class="text-sm font-bold opacity-60 transition-colors text-gray-500 dark:text-gray-500 light:text-gray-700">{{ plan.period }}</span>
                </div>
                <p class="text-sm leading-relaxed transition-colors text-gray-400 dark:text-gray-400 light:text-gray-600">{{ plan.description }}</p>
              </div>

              <!-- Divider -->
              <div class="h-px w-full bg-white/5 dark:bg-white/5 light:bg-gray-100 mb-10" />

              <!-- Features -->
              <ul class="space-y-5 mb-12 flex-grow">
                <li
                  v-for="feature in plan.features"
                  :key="feature"
                  class="flex items-center gap-4 transition-colors text-gray-400 dark:text-gray-400 light:text-gray-700 active:text-white"
                >
                  <div class="size-6 rounded-full flex items-center justify-center shrink-0 border border-transparent transition-all group-hover:scale-110 shadow-sm"
                    :class="plan.popular ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-500 dark:bg-white/5 light:bg-gray-50 light:text-gray-400'"
                  >
                    <UIcon name="i-heroicons-check" class="size-3.5" />
                  </div>
                  <span class="text-sm font-medium">{{ feature }}</span>
                </li>
              </ul>

              <!-- CTA Button -->
              <NuxtLink
                to="/auth/login"
                class="flex items-center justify-center gap-2 w-full py-4.5 rounded-2xl text-base font-bold transition-all duration-300 hover:scale-[1.02] shadow-sm transform"
                :class="plan.popular
                  ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_4px_20px_0_rgba(52,211,153,0.3)] hover:shadow-[0_8px_40px_0_rgba(52,211,153,0.5)]'
                  : 'bg-white/5 dark:bg-white/5 light:bg-[#fcfdfd] text-gray-300 dark:text-gray-300 light:text-gray-900 border border-white/10 dark:border-white/10 light:border-gray-200 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-emerald-50 hover:text-white dark:hover:text-white light:hover:text-emerald-700 hover:border-emerald-500/30'"
              >
                {{ plan.buttonText }}
                <UIcon name="i-heroicons-arrow-right" class="size-5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Enterprise note -->
      <div class="mt-16 text-center">
        <p class="inline-flex items-center gap-3 px-6 py-3 rounded-full border bg-white/[0.03] dark:bg-white/[0.03] light:bg-white border-white/5 dark:border-white/5 light:border-gray-200 text-sm transition-colors text-gray-500 dark:text-gray-500 light:text-gray-600">
          Need custom enterprise features? 
          <a href="mailto:hello@skymenu.app" class="font-bold underline decoration-emerald-500/30 underline-offset-4 decoration-2 transition-colors text-emerald-400 dark:text-emerald-400 light:text-emerald-700 hover:text-emerald-300">Start a conversation</a>
        </p>
      </div>
    </div>
  </div>
</template>
