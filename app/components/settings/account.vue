<script setup lang="ts">
import { ref, reactive } from 'vue'
import { userRepository } from '~/repositories/users'
import { useAuthStore } from '~/store/auth'
import { UpdateAccountValidationSchema, type TUpdateAccountValidationSchema } from '~/zod/AccountUpdate'

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { session } = storeToRefs(authStore)
const toast = useToast()
const userRepo = userRepository($api)
const currentUser = session.value?.user
const loading = ref(false)

const state = reactive({
  full_name: currentUser?.full_name || '',
  phone_number: currentUser?.phone_number || '',
  date_of_birth: currentUser?.date_of_birth || '',
  sex: currentUser?.sex || 'male',
})

async function onSubmit(event: { data: TUpdateAccountValidationSchema }) {
  if (currentUser?.id) {
    try {
      loading.value = true
      const data = await userRepo.updateMyAccount(currentUser.id, event.data)
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
      toast.add({ title: err.message || 'An error occurred.', color: 'error' })
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
        <p class="text-sm text-gray-400">This will be displayed on your profile.</p>
      </div>

      <div class="space-y-8">
        <UFormField label="Full Name" name="full_name" class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
          <UInput
            v-model="state.full_name"
            icon="i-heroicons-user"
            placeholder="Full name"
            class="w-full"
            variant="ghost"
            :ui="{ base: 'bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl' }"
          />
        </UFormField>

        <UFormField label="Phone Number" name="phone_number" class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
          <UInput
            v-model="state.phone_number"
            icon="i-heroicons-phone"
            placeholder="Phone number"
            class="w-full"
            variant="ghost"
            :ui="{ base: 'bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl' }"
          />
        </UFormField>

        <UFormField label="Date of Birth" name="date_of_birth" class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
          <UInput
            v-model="state.date_of_birth"
            type="date"
            icon="i-heroicons-calendar"
            class="w-full"
            variant="ghost"
            :ui="{ base: 'bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl' }"
          />
        </UFormField>

        <UFormField label="Gender" name="sex" class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
          <URadioGroup
            v-model="state.sex"
            :options="[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]"
            class="flex gap-4"
          />
        </UFormField>

        <UFormField label="Email" class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <UInput
                :model-value="currentUser?.email"
                icon="i-heroicons-envelope"
                disabled
                class="w-full opacity-60 cursor-not-allowed"
                variant="ghost"
                :ui="{ base: 'bg-white/5 border-white/10 text-white rounded-xl' }"
            />
        </UFormField>
      </div>

      <div class="flex justify-end pt-10 border-t border-white/10">
        <UButton
          type="submit"
          label="Save Changes"
          icon="i-heroicons-check"
          :loading="loading"
          size="lg"
          class="rounded-xl px-8"
        />
      </div>
    </UForm>
  </UCard>
</template>
