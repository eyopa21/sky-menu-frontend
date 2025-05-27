<script setup lang="ts">
import type { TabListPassThroughOptionType } from 'primevue/tablist'

const tabs: TabListPassThroughOptionType = [{
  label: 'Account',
  value: 'account',
}, {
  label: 'Privacy & Security',
  value: 'security',
}, {
  label: 'Subscription & Billing',
  value: 'subscription-billing',
}, {
  label: 'Support',
  value: 'support',
}]

const currentTab = ref('account')
</script>

<template>
  <Tabs v-model:value="currentTab" class="mx-auto max-w-[55rem] pb-6 pt-16 lg:pb-52">
    <div
      class="bg-white/16 mx-auto flex w-full max-w-[calc(100%-3rem)] flex-col items-center gap-2 rounded-3xl p-2 shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)] backdrop-blur-[48px] md:flex-row md:rounded-full lg:max-w-none"
    >
      <a
        v-for="i in tabs" :key="i.value" aria-current="page"
        :class="[currentTab === i.value ? 'bg-white/10 text-white' : 'bg-transparent']"

        class="text-white/64 flex h-10 w-full select-none items-center justify-center rounded-full backdrop-blur-[48px] transition-all hover:bg-white/10 md:flex-1 md:rounded-full"
        @click="currentTab = i.value"
      ><span
        class="font-medium"
      >{{ i.label }}</span></a>
    </div>

    <TabPanels class="mt-8">
      <TabPanel value="account">
        <SettingsAccount />
      </TabPanel>
      <TabPanel value="security">
        <SettingsSecurity />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>
