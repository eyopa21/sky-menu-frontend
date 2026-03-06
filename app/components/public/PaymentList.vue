<script setup lang="ts">
import { paymentRepository } from '~/repositories/payment'

const props = defineProps<{
  projectId: number
  primaryColor?: string
}>()

const { $api } = useNuxtApp()
const paymentRepo = paymentRepository($api)

const { data: paymentMethods, pending } = await useAsyncData(
  `public-payments-${props.projectId}`,
  () => paymentRepo.getPaymentMethodsByProject(props.projectId)
)

const activeMethods = computed(() => paymentMethods.value?.filter(pm => pm.isActive) || [])

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  const toast = useToast()
  toast.add({ title: 'Copied to clipboard', color: 'success' })
}
</script>

<template>
  <div class="space-y-8">
    <div v-if="pending" class="space-y-4">
      <USkeleton v-for="i in 2" :key="i" class="h-40 w-full rounded-3xl" />
    </div>

    <div v-else-if="activeMethods.length" class="grid grid-cols-1 gap-6">
      <div 
        v-for="pm in activeMethods" 
        :key="pm.id" 
        class="group relative overflow-hidden rounded-[32px] bg-app-section border border-gray-100 dark:border-white/5 shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start"
      >
        <!-- Icon/QR Section -->
        <div class="shrink-0 space-y-4 flex flex-col items-center">
           <div class="size-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
              <UIcon :name="pm.type.toLowerCase() === 'telebirr' ? 'i-heroicons-device-phone-mobile' : 'i-heroicons-banknotes'" class="size-10 text-emerald-500" />
           </div>
           
           <div v-if="pm.qrCode" class="size-32 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 p-2 bg-white dark:bg-black/20">
              <img :src="pm.qrCode" class="size-full object-contain" />
           </div>
        </div>

        <!-- Details Section -->
        <div class="grow space-y-6 text-center md:text-left w-full">
           <div>
              <h3 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{{ pm.type }}</h3>
              <p class="text-emerald-500 text-[10px] font-black uppercase tracking-widest mt-1">Official Payment Method</p>
           </div>

           <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-1">
                 <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Account Holder</p>
                 <p class="text-lg font-black text-gray-800 dark:text-gray-200">{{ pm.accountName }}</p>
              </div>
              <div class="space-y-1">
                 <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Account Number</p>
                 <div class="flex items-center justify-center md:justify-start gap-2">
                    <p class="text-xl font-black text-emerald-500 font-mono">{{ pm.accountNumber }}</p>
                    <UButton 
                      icon="i-heroicons-document-duplicate" 
                      variant="ghost" 
                      color="neutral" 
                      size="xs" 
                      class="rounded-lg" 
                      @click="copyToClipboard(pm.accountNumber)" 
                    />
                 </div>
              </div>
           </div>

           <div class="pt-4 border-t border-gray-50 dark:border-white/5">
              <p class="text-xs text-gray-400 font-medium leading-relaxed">
                Please ensure the account name matches before completing your transaction. Scan the QR code or use the account number provided above.
              </p>
           </div>
        </div>

        <!-- Decor -->
        <div class="absolute -bottom-6 -right-6 size-24 bg-emerald-500/5 blur-3xl rounded-full" />
      </div>
    </div>

    <div v-else class="text-center py-20 px-6 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-white/5">
       <div class="size-20 rounded-3xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-heroicons-credit-card" class="size-10 text-gray-300" />
       </div>
       <h4 class="text-xl font-black text-gray-900 dark:text-white">No Payment Methods Available</h4>
       <p class="text-gray-500 dark:text-gray-400 font-medium max-w-xs mx-auto mt-2">
         This establishment hasn't configured any digital payment methods yet.
       </p>
    </div>
  </div>
</template>
