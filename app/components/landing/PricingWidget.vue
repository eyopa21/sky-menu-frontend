<script setup lang="ts">
const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for small cafes or personal projects.',
    icon: 'i-heroicons-sparkles',
    color: 'emerald',
    features: [
      'Responsive Layout',
      'Unlimited QR Scans',
      'Basic Analytics',
      'Community Support'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'ghost' as const
  },
  {
    name: 'Startup',
    price: '$19',
    description: 'Ideal for growing restaurants and businesses.',
    icon: 'i-heroicons-rocket-launch',
    color: 'emerald',
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
    description: 'Custom solutions for large restaurant chains.',
    icon: 'i-heroicons-building-office-2',
    color: 'emerald',
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
  <div id="pricing" class="py-24 px-6 lg:px-20 bg-[#09090b]">
    <div class="mx-auto max-w-7xl">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Matchless Pricing
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          Choose the plan that fits your business needs. No hidden fees.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        <UCard
          v-for="(plan, index) in plans"
          :key="index"
          class="relative bg-white/5 border-white/10 flex flex-col transition-all hover:-translate-y-2 group"
          :class="{ 'ring-2 ring-emerald-500': plan.popular }"
          :ui="{ body: { padding: 'p-8 flex flex-col h-full' } }"
        >
          <div v-if="plan.popular" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
            Most Popular
          </div>

          <div class="mb-8">
            <div 
                class="size-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6"
            >
              <UIcon :name="plan.icon" class="size-6" />
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">{{ plan.name }}</h3>
            <div class="flex items-baseline gap-1 mb-4">
              <span class="text-4xl font-extrabold text-white">{{ plan.price }}</span>
              <span class="text-gray-400 text-sm">/per month</span>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed">
              {{ plan.description }}
            </p>
          </div>

          <USeparator class="opacity-10 mb-8" />

          <ul class="space-y-4 mb-10 flex-grow">
            <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3 text-sm text-gray-300">
              <UIcon name="i-heroicons-check-circle" class="size-5 text-emerald-500 shrink-0" />
              <span>{{ feature }}</span>
            </li>
          </ul>

          <UButton
            :label="plan.buttonText"
            :variant="plan.buttonVariant"
            color="emerald"
            block
            size="xl"
            class="rounded-xl font-bold transition-all group-hover:scale-105"
            to="/auth/login"
          />
        </UCard>
      </div>
    </div>
  </div>
</template>
