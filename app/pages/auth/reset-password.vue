<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { authRepository } from '~/repositories/auth'
import { ResetPasswordValidationSchema, type TResetPasswordValidationSchema } from '~/zod/ResetPasswordValidation'

definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const { $api } = useNuxtApp()
const toast = useToast()
const loading = ref(false)
const token = ref('')

const state = reactive({
  password: '',
  confirmPassword: '',
})

onMounted(() => {
  const t = route.query.token?.toString()
  if (!t) {
    toast.add({ title: 'Invalid Link', description: 'Missing reset token.', color: 'error' })
    navigateTo('/auth/login')
    return
  }
  token.value = t
})

const authRepo = authRepository($api)

async function onSubmit(event: { data: TResetPasswordValidationSchema }) {
  if (!token.value) return

  try {
    loading.value = true
    const data = await authRepo.resetPassword({
      token: token.value,
      password: event.data.password,
    })
    
    if (data) {
      toast.add({ title: 'Success!', description: 'Your password has been reset.', color: 'success' })
      navigateTo('/auth/login')
    }
  } catch (err: any) {
    console.error('Reset password error:', err)
    const description = getErrorMessage(err)
    toast.add({ 
      title: 'Reset failed', 
      description, 
      color: 'error' 
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Reset Password</h1>
      <p class="text-gray-400">
        Enter your new password below.
      </p>
    </div>

    <UForm
      :schema="ResetPasswordValidationSchema"
      :state="state"
      class="space-y-6"
      @submit="onSubmit"
    >
      <UFormField label="New Password" name="password">
        <UInput
          v-model="state.password"
          type="password"
          icon="i-heroicons-lock-closed"
          size="xl"
          placeholder="••••••••"
          class="w-full"
          :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
        />
      </UFormField>

      <UFormField label="Confirm New Password" name="confirmPassword">
        <UInput
          v-model="state.confirmPassword"
          type="password"
          icon="i-heroicons-check-circle"
          size="xl"
          placeholder="••••••••"
          class="w-full"
          :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
        />
      </UFormField>

      <UButton
        type="submit"
        label="Reset Password"
        :loading="loading"
        size="xl"
        block
        class="bg-emerald-500 text-black hover:bg-emerald-400 font-bold"
      />
    </UForm>
  </div>
</template>
