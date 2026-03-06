<script setup lang="ts">
import { paymentRepository } from '~/repositories/payment'
import { projectsRepository } from '~/repositories/projects'

definePageMeta({
  layout: 'dashboard',
})

const { $api } = useNuxtApp()
const paymentRepo = paymentRepository($api)
const projectsRepo = projectsRepository($api)
const toast = useToast()

const selectedProjectId = ref<number | null>(null)
const isModalOpen = ref(false)
const editingPaymentMethod = ref<any>(null)

const { data: projectsData } = await useAsyncData('dashboard-projects-filter-payments', () => projectsRepo.getMyProjects())
const projects = computed(() => projectsData.value || [])

const { data: paymentMethods, pending, refresh } = await useAsyncData(
  'dashboard-payments-list',
  async () => {
    if (selectedProjectId.value) {
      return await paymentRepo.getPaymentMethodsByProject(selectedProjectId.value)
    }
    return await paymentRepo.getAllPaymentMethods()
  },
  { watch: [selectedProjectId] }
)

const projectOptions = computed(() => [
  { label: 'All Projects', value: null },
  ...projects.value.map(p => ({ label: p.title, value: p.id }))
])

const openAddModal = () => {
  editingPaymentMethod.value = null
  isModalOpen.value = true
}

const openEditModal = (pm: any) => {
  editingPaymentMethod.value = pm
  isModalOpen.value = true
}

const deletePaymentMethod = async (id: number) => {
  try {
    await paymentRepo.deletePaymentMethod(id)
    toast.add({ title: 'Payment method deleted', color: 'success' })
    refresh()
  } catch (err) {
    toast.add({ title: 'Failed to delete payment method', color: 'error' })
  }
}

const getProjectTitle = (projectId: number) => {
  const p = projects.value.find(p => p.id === projectId)
  return p ? p.title : `Project #${projectId}`
}
</script>

<template>
  <div class="space-y-10 pb-20">
    <!-- Header Section -->
    <div class="relative rounded-[32px] overflow-hidden p-8 md:p-12 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.06]">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div>
          <h1 class="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Payment <span class="text-emerald-400">Methods</span>
          </h1>
          <p class="text-gray-400 font-medium max-w-lg leading-relaxed">
            Manage how your customers pay you. Add Telebirr, CBE, and other methods with QR codes per project.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div class="w-full sm:w-64">
             <USelectMenu
                v-model="selectedProjectId"
                :options="projectOptions"
                value-attribute="value"
                option-attribute="label"
                placeholder="Filter by Project"
                size="xl"
                class="w-full"
                icon="i-heroicons-funnel"
                :ui-menu="{ 
                  content: 'rounded-2xl bg-app-section border-white/10 text-white',
                }"
             />
          </div>
          <UButton 
            label="Add Method"
            icon="i-heroicons-plus" 
            color="primary" 
            size="xl" 
            class="rounded-2xl px-6 font-bold" 
            @click="openAddModal" 
          />
        </div>
      </div>
      <!-- Decorative Glow -->
      <div class="absolute -top-24 -right-24 size-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
    </div>

    <!-- Payments List -->
    <div v-if="paymentMethods?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="pm in paymentMethods" 
        :key="pm.id" 
        class="group relative p-[1px] rounded-[32px] bg-gradient-to-br from-white/5 to-transparent hover:from-emerald-500/20 transition-all duration-500"
      >
        <div class="bg-app-section/60 backdrop-blur-3xl rounded-[31px] p-8 space-y-6 h-full flex flex-col">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div class="size-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg group-hover:border-emerald-500/30 transition-colors">
                <UIcon :name="pm.type.toLowerCase() === 'telebirr' ? 'i-heroicons-device-phone-mobile' : 'i-heroicons-banknotes'" class="size-8 text-emerald-400" />
              </div>
              <div>
                <h4 class="font-black text-white text-xl tracking-tight leading-none mb-1">{{ pm.type }}</h4>
                <span class="text-[10px] text-emerald-500 font-black uppercase tracking-tighter bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10">
                  {{ pm.project?.title || getProjectTitle(pm.projectId) }}
                </span>
              </div>
            </div>
            <UBadge :label="pm.isActive ? 'Active' : 'Inactive'" :color="pm.isActive ? 'success' : 'neutral'" variant="soft" class="rounded-lg" />
          </div>

          <div class="space-y-3 grow">
            <div>
              <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Account Name</p>
              <p class="text-white font-black text-lg">{{ pm.accountName }}</p>
            </div>
            <div>
              <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Account Number</p>
              <p class="text-emerald-400 font-mono text-xl">{{ pm.accountNumber }}</p>
            </div>
          </div>

          <div v-if="pm.qrCode" class="relative group/qr aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/20 p-4">
             <img :src="pm.qrCode" class="size-full object-contain" />
             <div class="absolute inset-0 bg-black/60 opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center">
                <UButton icon="i-heroicons-magnifying-glass-plus" variant="ghost" color="neutral" label="View QR" class="font-bold text-white" />
             </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
             <UButton icon="i-heroicons-pencil-square" variant="soft" color="neutral" size="sm" class="rounded-xl" @click="openEditModal(pm)" />
             <UPopconfirm title="Delete Method?" @confirm="deletePaymentMethod(pm.id)">
               <UButton icon="i-heroicons-trash" variant="soft" color="error" size="sm" class="rounded-xl" />
             </UPopconfirm>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!pending" class="flex flex-col items-center justify-center py-40 rounded-[40px] border-2 border-dashed border-white/5 text-center px-6">
       <div class="relative mb-8">
          <div class="absolute -inset-6 bg-emerald-500/5 blur-3xl rounded-full" />
          <div class="size-24 rounded-3xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10">
             <UIcon name="i-heroicons-currency-dollar" class="size-12 text-emerald-500/20" />
          </div>
       </div>
       <h3 class="text-3xl font-black text-white tracking-tight">No <span class="text-emerald-400">Payment Methods</span></h3>
       <p class="text-gray-500 font-medium max-w-sm mt-4 leading-relaxed">
         Start by adding a payment method for your projects so customers can pay you easily.
       </p>
       <UButton 
          label="Add First Method" 
          color="primary" 
          class="mt-10 font-black px-8 py-3 rounded-2xl" 
          @click="openAddModal" 
       />
    </div>

    <DashboardPaymentsPaymentMethodModal 
      v-model:open="isModalOpen" 
      :payment-method="editingPaymentMethod" 
      :projects="projects"
      :selected-project-id="selectedProjectId"
      @success="refresh" 
    />
  </div>
</template>
