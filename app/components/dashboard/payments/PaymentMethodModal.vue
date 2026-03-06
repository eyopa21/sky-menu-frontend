<script setup lang="ts">
import { paymentRepository } from '~/repositories/payment'
import { commonRepository } from '~/repositories/common'
import { PaymentMethodValidationSchema, type TPaymentMethodValidationSchema } from '~/zod/payments/PaymentMethodValidation'
import type { Project } from '~/repositories/projects/response/projects'

const props = defineProps<{
  paymentMethod?: any
  projects: Project[]
  selectedProjectId?: number | null
}>()

const emit = defineEmits(['success'])
const isOpen = defineModel<boolean>('open', { default: false })

const { $api } = useNuxtApp()
const paymentRepo = paymentRepository($api)
const commonRepo = commonRepository($api)
const toast = useToast()

const loading = ref(false)
const qrFile = ref<File | undefined>()

const state = reactive({
  projectId: props.selectedProjectId || undefined,
  type: 'Telebirr',
  accountName: '',
  accountNumber: '',
  qrCode: '',
  isActive: true,
})

watch(() => props.paymentMethod, (newVal) => {
  if (newVal) {
    state.projectId = newVal.projectId
    state.type = newVal.type
    state.accountName = newVal.accountName
    state.accountNumber = newVal.accountNumber
    state.qrCode = newVal.qrCode
    state.isActive = newVal.isActive
  } else {
    state.projectId = props.selectedProjectId || undefined
    state.type = 'Telebirr'
    state.accountName = ''
    state.accountNumber = ''
    state.qrCode = ''
    state.isActive = true
  }
}, { immediate: true })

const onSubmit = async (event: { data: TPaymentMethodValidationSchema }) => {
  loading.value = true
  try {
    // 1. Upload QR Code if a new file is selected
    if (qrFile.value) {
      const formData = new FormData()
      formData.append('file', qrFile.value)
      const uploadRes = await commonRepo.uploadSingleFile(formData)
      state.qrCode = uploadRes.url
    }

    const payload = {
      ...event.data,
      qrCode: state.qrCode
    }

    // 2. Create or Update Payment Method
    if (props.paymentMethod) {
      await paymentRepo.updatePaymentMethod(props.paymentMethod.id, payload)
      toast.add({ title: 'Payment method updated', color: 'success' })
    } else {
      await paymentRepo.createPaymentMethod(payload as any)
      toast.add({ title: 'Payment method added', color: 'success' })
    }

    emit('success')
    isOpen.value = false
    qrFile.value = undefined
  } catch (err: any) {
    toast.add({ 
      title: 'Failed to save payment method', 
      description: err.data?.message || err.message,
      color: 'error' 
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <USlideover 
    v-model:open="isOpen" 
    :ui="{ 
      content: 'bg-app-section border-white/10 dark:border-white/10 light:border-gray-200' 
    }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full h-full px-4 text-white">
        <div class="flex items-center gap-3">
           <div class="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-currency-dollar" class="size-5 text-emerald-500" />
           </div>
           <h3 class="text-xl font-black uppercase tracking-tighter">{{ paymentMethod ? 'Edit Method' : 'Add Method' }}</h3>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark"
          size="lg"
          class="rounded-xl"
          @click="isOpen = false"
        />
      </div>
    </template>

    <template #body>
      <UForm
        id="payment-method-form"
        :schema="PaymentMethodValidationSchema"
        :state="state"
        class="space-y-8 px-4 pb-20"
        @submit="onSubmit"
      >
        <div class="space-y-6">
          <UFormField label="Project" name="projectId" required>
            <USelectMenu
              v-model="state.projectId"
              :items="props.projects"
              value-key="id"
              label-key="title"
              placeholder="Select Project"
              size="xl"
              class="rounded-2xl w-full"
              :ui="{ base: 'bg-white/5 border-white/10 text-white' }"
              :ui-menu="{ content: 'bg-app-section border-white/10 text-white' }"
            />
          </UFormField>

          <UFormField label="Payment  Name" name="type" required>
            <UInput 
              v-model="state.type" 
              placeholder="e.g. Telebirr, CBE, Bank..." 
              size="xl" 
              class="rounded-2xl w-full" 
              :ui="{ base: 'bg-white/5 border-white/10 text-white' }" 
            />
          </UFormField>

          <UFormField label="Account Holder Name" name="accountName" required>
            <UInput v-model="state.accountName" placeholder="e.g. John Doe / Company Name" size="xl" class="rounded-2xl w-full" :ui="{ base: 'bg-white/5 border-white/10 text-white' }"  />
          </UFormField>

          <UFormField label="Account Number" name="accountNumber" required>
            <UInput v-model="state.accountNumber" placeholder="e.g. 10000********" size="xl" class="rounded-2xl w-full" :ui="{ base: 'bg-white/5 border-white/10 text-white' }" />
          </UFormField>

          <UFormField label="QR Code (Optional)" name="qrCode">
            <div class="space-y-4">
              <AppFileUploader v-model="qrFile" name="qrCode" accept="image/*" />
              <div v-if="state.qrCode && !qrFile" class="relative size-32 rounded-2xl overflow-hidden border border-white/10 p-2 bg-black/20 mx-auto">
                <img :src="state.qrCode" class="size-full object-contain" />
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <p class="text-[10px] text-white font-black uppercase">Current QR</p>
                </div>
              </div>
            </div>
          </UFormField>

          <div class="flex items-center justify-between p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 mt-8">
            <div class="space-y-1">
              <h4 class="text-sm font-black text-white uppercase tracking-widest leading-none">Active Status</h4>
              <p class="text-[10px] text-gray-500 font-bold uppercase transition-colors">{{ state.isActive ? 'Visible to customers' : 'Hidden from customers' }}</p>
            </div>
            <USwitch v-model="state.isActive" color="success" size="lg" />
          </div>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3 w-full p-4">
        <UButton variant="ghost" label="Dismiss" class="rounded-xl font-bold" @click="isOpen = false" />
        <UButton 
          type="submit" 
          form="payment-method-form"
          :label="paymentMethod ? 'Save Changes' : 'Create Method'" 
          :loading="loading" 
          color="success" 
          class="rounded-xl font-black px-8 py-3 shadow-lg shadow-emerald-500/10 active:scale-95 transition-all" 
        />
      </div>
    </template>
  </USlideover>
</template>
