<script setup lang="ts">
import type { TabListPassThroughOptionType } from 'primevue/tablist';


const tabs: TabListPassThroughOptionType = [{
    label: 'Account',
    value: 'account',
},
{
    label: 'Privacy & Security',
    value: 'security',
}, {
    label: 'Subscription & Billing',
    value: 'subscription-billing',
}, {
    label: 'Support',
    value: 'support',
}];



const currentTab = ref('account');


</script>

<template>
    <Tabs v-model:value="currentTab" class="pt-16 pb-6 lg:pb-52 max-w-[55rem] mx-auto">

        <div
            class="w-full flex md:flex-row flex-col items-center gap-2 p-2 max-w-[calc(100%-3rem)] lg:max-w-none mx-auto rounded-3xl md:rounded-full bg-white/16 backdrop-blur-[48px] shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)]">
            <a 
            v-for="i in tabs" :key="i.value" aria-current="page" 
            :class="['md:rounded-full', currentTab === i.value ? 'bg-white/10 text-white' : 'bg-transparent']"
            
                class="md:flex-1 w-full h-10 flex items-center justify-center rounded-full backdrop-blur-[48px] transition-all select-none text-white/64 hover:bg-white/10"
                @click="currentTab = i.value"><span
                    class="font-medium">{{i.label}}</span></a>
        </div>


        <TabPanels class="mt-8">
            <TabPanel value="account">
               <SettingsAccount/>
            </TabPanel>
            <TabPanel value="security">
                <SettingsSecurity/>
            </TabPanel>
            
        </TabPanels>

        
    </Tabs>
</template>