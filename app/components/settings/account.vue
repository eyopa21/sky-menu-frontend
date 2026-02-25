<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { userRepository } from '~/repositories/users'
import { useAuthStore } from '~/store/auth'
import { UpdateAccountValidationSchema, type TUpdateAccountValidationSchema } from '~/zod/AccountUpdate'
import { getErrorMessage } from '~/utils/error'

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { session } = storeToRefs(authStore)
const toast = useToast()
const userRepo = userRepository($api)
const currentUser = computed(() => session.value?.user)
const loading = ref(false)

const formatDate = (date: any) => {
  if (!date) return ''
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    return d.toISOString().split('T')[0]
  } catch (e) {
    return ''
  }
}

const state = reactive({
  full_name: currentUser.value?.full_name || '',
  phone_number: currentUser.value?.phone_number || '',
  date_of_birth: formatDate(currentUser.value?.date_of_birth),
  sex: currentUser.value?.sex || 'male',
})

watch(currentUser, (user) => {
  if (user) {
    state.full_name = user.full_name || ''
    state.phone_number = user.phone_number || ''
    state.date_of_birth = formatDate(user.date_of_birth)
    state.sex = user.sex || 'male'
  }
}, { immediate: true })

async function onSubmit(event: { data: TUpdateAccountValidationSchema }) {
  if (currentUser.value?.id) {
    try {
      loading.value = true
      const data = await userRepo.updateMyAccount(currentUser.value.id, event.data)
      if (data) {
        authStore.updateSession({
          accessToken: session.value?.accessToken!,
          refreshToken: session.value?.refreshToken!,
          user: data,
        })
        toast.add({ title: 'Profile updated successfully!', color: 'success' })
      }
    } catch (err: any) {
      console.error('Update error:', err)
      const description = getErrorMessage(err)
      toast.add({ title: 'Update failed', description, color: 'error' })
    } finally {
      loading.value = false
    }
  }
}
</script>

<template>
  <div class="relative group">
    <!-- Glow behind card -->
    <div class="absolute -inset-2 bg-emerald-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

    <div class="p-[1px] rounded-[32px] bg-gradient-to-br from-white/10 to-transparent dark:from-white/10 light:from-gray-200 transition-all duration-500 shadow-sm">
      <UCard
        class="bg-[#0d0d0f]/80 dark:bg-[#0d0d0f]/80 light:bg-white border-none rounded-[31px] backdrop-blur-2xl"
        :ui="{ body: { padding: 'p-8 md:p-12' } }"
      >
        <UForm
          :schema="UpdateAccountValidationSchema"
          :state="state"
          class="space-y-12"
          @submit="onSubmit"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 dark:border-white/5 light:border-gray-100 pb-10">
            <div>
              <h2 class="text-2xl font-black text-white dark:text-white light:text-gray-900 tracking-tight">Public Profile</h2>
              <p class="text-gray-500 dark:text-gray-500 light:text-gray-600 font-medium max-w-sm">Manage how your restaurant brand is represented.</p>
            </div>
            <UButton
              type="submit"
              label="Save Profile"
              icon="i-heroicons-check-circle"
              :loading="loading"
              class="rounded-xl font-black px-8 py-3 bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all w-full md:w-auto"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <!-- Full Name -->
            <UFormField label="Full Name" name="full_name">
              <UInput
                v-model="state.full_name"
                icon="i-heroicons-user"
                placeholder="The name as it will appear"
                size="xl"
                class="w-full"
                :ui="{ 
                  base: 'rounded-2xl border-white/10 dark:border-white/10 light:border-gray-200 bg-white/5 dark:bg-white/5 light:bg-gray-50 focus:ring-emerald-500',
                  icon: { leading: { wrapper: 'text-emerald-500/50' } }
                }"
              />
            </UFormField>

            <!-- Phone -->
            <UFormField label="Contact Number" name="phone_number">
              <UInput
                v-model="state.phone_number"
                icon="i-heroicons-phone"
                placeholder="Phone number for orders"
                size="xl"
                class="w-full"
                :ui="{ 
                  base: 'rounded-2xl border-white/10 dark:border-white/10 light:border-gray-200 bg-white/5 dark:bg-white/5 light:bg-gray-50 focus:ring-emerald-500',
                  icon: { leading: { wrapper: 'text-emerald-500/50' } }
                }"
              />
            </UFormField>

            <!-- DOB -->
            <UFormField label="Anniversary / Founded" name="date_of_birth">
              <UInput
                v-model="state.date_of_birth"
                type="date"
                icon="i-heroicons-calendar"
                size="xl"
                class="w-full"
                :ui="{ 
                  base: 'rounded-2xl border-white/10 dark:border-white/10 light:border-gray-200 bg-white/5 dark:bg-white/5 light:bg-gray-50 focus:ring-emerald-500',
                  icon: { leading: { wrapper: 'text-emerald-500/50' } }
                }"
              />
            </UFormField>

            <!-- Gender -->
            <UFormField label="Brand Segment" name="sex">
              <USelect
                v-model="state.sex"
                :options="[{ label: 'Male Segment', value: 'male' }, { label: 'Female Segment', value: 'female' }]"
                size="xl"
                class="w-full"
                :ui="{ 
                  base: 'rounded-2xl border-white/10 dark:border-white/10 light:border-gray-200 bg-white/5 dark:bg-white/5 light:bg-gray-50 focus:ring-emerald-500'
                }"
              />
            </UFormField>

            <!-- Email -->
            <UFormField label="Administrative Email" class="md:col-span-2">
              <UInput
                :model-value="currentUser?.email"
                icon="i-heroicons-envelope"
                disabled
                size="xl"
                class="w-full opacity-60 pointer-events-none"
                :ui="{ 
                  base: 'rounded-2xl border-white/5 dark:border-white/5 light:border-gray-100 bg-white/[0.02] dark:bg-white/[0.02] light:bg-gray-100/50 cursor-not-allowed',
                  icon: { leading: { wrapper: 'text-gray-500' } }
                }"
              />
              <p class="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest pl-2">Email is fixed to your identity</p>
            </UFormField>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>
