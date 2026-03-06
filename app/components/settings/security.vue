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
  <div class="relative group">
    <!-- Glow behind card -->
    <div class="absolute -inset-2 bg-purple-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

    <div class="p-[1px] rounded-[32px] bg-gradient-to-br from-white/10 to-transparent dark:from-white/10 light:from-gray-200 transition-all duration-500 shadow-sm">
      <UCard
        class="bg-app-section/80 dark:bg-app-section/80 light:bg-white border-none rounded-[31px] backdrop-blur-2xl"
        :ui="{ body: { padding: 'p-8 md:p-12' } }"
      >
        <UForm
          :schema="ResetPasswordValidationSchema"
          :state="state"
          class="space-y-12"
          @submit="onSubmit"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 dark:border-white/5 light:border-gray-100 pb-10">
            <div>
              <h2 class="text-2xl font-black text-white dark:text-white light:text-gray-900 tracking-tight">Security Access</h2>
              <p class="text-gray-500 dark:text-gray-500 light:text-gray-600 font-medium max-w-sm">Keep your administrative access safe and updated.</p>
            </div>
            <UButton
              type="submit"
              label="Update Access"
              icon="i-heroicons-shield-check"
              :loading="loading"
              class="rounded-xl font-black px-8 py-3 bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all w-full md:w-auto"
            />
          </div>

          <div class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <!-- New Password -->
                <UFormField label="New Security Password" name="password">
                  <div class="relative group/input">
                    <UInput
                        v-model="state.password"
                        type="password"
                        icon="i-heroicons-lock-closed"
                        placeholder="••••••••"
                        size="xl"
                        class="w-full"
                        :ui="{ 
                        base: 'rounded-2xl border-white/10 dark:border-white/10 light:border-gray-200 bg-white/5 dark:bg-white/5 light:bg-gray-50 focus:ring-emerald-500',
                        icon: { leading: { wrapper: 'text-purple-500/50' } }
                        }"
                    />
                  </div>
                </UFormField>

                <!-- Confirm Password -->
                <UFormField label="Confirm Security Password" name="confirmPassword">
                  <div class="relative group/input">
                    <UInput
                        v-model="state.confirmPassword"
                        type="password"
                        icon="i-heroicons-check-circle"
                        placeholder="••••••••"
                        size="xl"
                        class="w-full"
                        :ui="{ 
                        base: 'rounded-2xl border-white/10 dark:border-white/10 light:border-gray-200 bg-white/5 dark:bg-white/5 light:bg-gray-50 focus:ring-emerald-500',
                        icon: { leading: { wrapper: 'text-purple-500/50' } }
                        }"
                    />
                  </div>
                </UFormField>
            </div>

            <div class="rounded-2xl p-6 bg-purple-500/5 border border-purple-500/10 flex items-start gap-4">
                <UIcon name="i-heroicons-information-circle" class="size-5 text-purple-400 shrink-0 mt-0.5" />
                <p class="text-xs text-gray-500 leading-relaxed">
                    Make sure your password is at least 8 characters long and includes a mix of letters, numbers, and symbols for maximum security.
                </p>
            </div>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>
