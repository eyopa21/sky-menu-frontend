<script setup lang="ts">
const items = [{
  label: 'Account',
  icon: 'i-heroicons-user',
  value: 'account',
  slot: 'account'
}, {
  label: 'Privacy & Security',
  icon: 'i-heroicons-shield-check',
  value: 'security',
  slot: 'security'
}, {
  label: 'Subscription',
  icon: 'i-heroicons-credit-card',
  value: 'subscription',
  content: 'Coming soon...'
}, {
  label: 'Support',
  icon: 'i-heroicons-lifebuoy',
  value: 'support',
  content: 'Coming soon...'
}]

const route = useRoute()
const router = useRouter()

const selected = computed({
  get () {
    const index = items.findIndex((item) => item.value === route.query.tab)
    if (index === -1) {
      return 0
    }

    return index
  },
  set (value) {
    router.replace({ query: { tab: items[value].value } })
  }
})
</script>

<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-4xl">
      <div class="mb-12">
        <h1 class="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p class="text-gray-400 mt-2">Manage your account and app preferences.</p>
      </div>

      <UTabs :items="items" v-model="selected" class="w-full" :ui="{ list: { background: 'bg-white/5', marker: 'bg-emerald-500', tab: { active: 'text-black font-bold' } } }">
        <template #account>
          <div class="mt-8">
            <SettingsAccount />
          </div>
        </template>

        <template #security>
          <div class="mt-8">
            <SettingsSecurity />
          </div>
        </template>
        
        <template #item="{ item }">
          <div v-if="item.content" class="mt-8">
            <UCard class="bg-white/5 border-white/10">
                <p class="text-gray-400 italic">{{ item.content }}</p>
            </UCard>
          </div>
        </template>
      </UTabs>
    </div>
  </div>
</template>
