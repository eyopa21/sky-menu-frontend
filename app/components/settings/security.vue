<script setup lang="ts">
import { ref, reactive } from 'vue'
import { authRepository } from '~/repositories/auth'
import { ResetPasswordValidationSchema, type TResetPasswordValidationSchema } from '~/zod/ResetPasswordValidation'
import { getErrorMessage } from '~/utils/error'

const { $api } = useNuxtApp()
const toast = useToast()
const loading = ref(false)
const authRepo = authRepository($api)

const state = reactive({
  password: '',
  confirmPassword: '',
})

async function onSubmit(event: { data: TResetPasswordValidationSchema }) {
  try {
    loading.value = true
    const data = await authRepo.changePassword({
      password: event.data.password,
    })
    
    if (data) {
      toast.add({ title: 'Password updated successfully!', color: 'success' })
      state.password = ''
      state.confirmPassword = ''
    }
  } catch (err: any) {
    console.error('Password update error:', err)
    const description = getErrorMessage(err)
    toast.add({ title: 'Update failed', description, color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UCard
    class="bg-white/5 border-white/10 backdrop-blur-xl"
    :ui="{ body: { padding: 'p-6 md:p-12' } }"
  >
    <UForm
      :schema="ResetPasswordValidationSchema"
      :state="state"
      class="space-y-10"
      @submit="onSubmit"
    >
        <div class="border-b border-white/10 pb-10">
            <h2 class="text-xl font-bold text-white">Security</h2>
            <p class="text-sm text-gray-400">Change your password to keep your account secure.</p>
        </div>

        <div class="space-y-8">
            <UFormField label="New Password" name="password" class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                <UInput
                    v-model="state.password"
                    type="password"
                    icon="i-heroicons-lock-closed"
                    placeholder="••••••••"
                    class="w-full"
                    size="lg"
                    :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
                />
            </UFormField>

            <UFormField label="Confirm Password" name="confirmPassword" class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                <UInput
                    v-model="state.confirmPassword"
                    type="password"
                    icon="i-heroicons-check-circle"
                    placeholder="••••••••"
                    class="w-full"
                    size="lg"
                    :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
                />
            </UFormField>
        </div>

        <div class="flex justify-end pt-10 border-t border-white/10">
            <UButton
                type="submit"
                label="Update Password"
                icon="i-heroicons-shield-check"
                :loading="loading"
                size="xl"
                class="bg-emerald-500 text-black hover:bg-emerald-400 font-bold px-8 shadow-lg shadow-emerald-500/10"
            />
        </div>
    </UForm>
  </UCard>
</template>
