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
      // ensure date_of_birth is a Date object for the repository if expected, 
      // but the backend might handle string too. UpdateAccountValidationSchema uses z.date()
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
  <UCard
    class="bg-white/5 border-white/10 backdrop-blur-xl"
    :ui="{ body: { padding: 'p-6 md:p-12' } }"
  >
    <UForm
      :schema="UpdateAccountValidationSchema"
      :state="state"
      class="space-y-10"
      @submit="onSubmit"
    >
      <div class="border-b border-white/10 pb-10">
        <h2 class="text-xl font-bold text-white">Your Account</h2>
        <p class="text-sm text-gray-400">Update your personal information.</p>
      </div>

      <div class="space-y-8">
        <UFormField label="Full Name" name="full_name" class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
          <UInput
            v-model="state.full_name"
            icon="i-heroicons-user"
            placeholder="John Doe"
            class="w-full"
            size="lg"
            :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
          />
        </UFormField>

        <UFormField label="Phone Number" name="phone_number" class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
          <UInput
            v-model="state.phone_number"
            icon="i-heroicons-phone"
            placeholder="0911..."
            class="w-full"
            size="lg"
            :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
          />
        </UFormField>

        <UFormField label="Date of Birth" name="date_of_birth" class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
          <UInput
            v-model="state.date_of_birth"
            type="date"
            icon="i-heroicons-calendar"
            class="w-full"
            size="lg"
            :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
          />
        </UFormField>

        <UFormField label="Gender" name="sex" class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
          <USelect
            v-model="state.sex"
            :options="[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]"
            class="w-full"
            size="lg"
            :ui="{ base: 'bg-white/5 border-white/10' }"
          />
        </UFormField>

        <UFormField label="Email (Permanent)" class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <UInput
                :model-value="currentUser?.email"
                icon="i-heroicons-envelope"
                disabled
                class="w-full opacity-60 cursor-not-allowed"
                size="lg"
                :ui="{ base: 'bg-white/5 border-white/10' }"
            />
        </UFormField>
      </div>

      <div class="flex justify-end pt-10 border-t border-white/10">
        <UButton
          type="submit"
          label="Save Changes"
          icon="i-heroicons-check"
          :loading="loading"
          size="xl"
          class="bg-emerald-500 text-black hover:bg-emerald-400 font-bold px-8 shadow-lg shadow-emerald-500/10"
        />
      </div>
    </UForm>
  </UCard>
</template>
