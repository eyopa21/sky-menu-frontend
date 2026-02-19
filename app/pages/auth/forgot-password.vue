<script setup lang="ts">
import { ref, reactive } from 'vue'
import { authRepository } from '~/repositories/auth'
import { ForgotPasswordValidationSchema, type TForgotPasswordValidationSchema } from '~/zod/ForgotPasswordValidation'

definePageMeta({
  layout: 'auth',
})

const { $api } = useNuxtApp()
const toast = useToast()
const loading = ref(false)
const submitted = ref(false)

const state = reactive({
  email: '',
})

const authRepo = authRepository($api)

async function onSubmit(event: { data: TForgotPasswordValidationSchema }) {
  try {
    loading.value = true
    const data = await authRepo.forgotPassword(event.data)
    if (data) {
      toast.add({ title: 'Request sent!', description: data.message, color: 'success' })
      submitted.value = true
    }
  } catch (err: any) {
    console.error('Forgot password error:', err)
    const description = getErrorMessage(err)
    toast.add({ 
      title: 'Request failed', 
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
      <h1 class="text-3xl font-bold tracking-tight">Forgot password?</h1>
      <p class="text-gray-400">
        Enter your email and we'll send you a link to reset your password.
      </p>
    </div>

    <div v-if="submitted" class="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 animate-in fade-in duration-500">
        <div class="flex gap-3">
            <UIcon name="i-heroicons-check-circle" class="size-6 text-emerald-400 shrink-0" />
            <div>
                <p class="font-medium text-emerald-400">Check your inbox</p>
                <p class="text-sm text-gray-400 mt-1">If an account exists for {{ state.email }}, you will receive a reset link shortly.</p>
            </div>
        </div>
        <UButton
            variant="ghost"
            label="Back to Login"
            color="emerald"
            class="mt-6 font-medium"
            block
            @click="navigateTo('/auth/login')"
        />
    </div>

    <UForm
      v-else
      :schema="ForgotPasswordValidationSchema"
      :state="state"
      class="space-y-6"
      @submit="onSubmit"
    >
      <UFormField label="Email" name="email">
        <UInput
          v-model="state.email"
          icon="i-heroicons-envelope"
          size="xl"
          placeholder="name@example.com"
          class="w-full"
          :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
        />
      </UFormField>

      <div class="space-y-3">
        <UButton
            type="submit"
            label="Send Reset Link"
            :loading="loading"
            size="xl"
            block
            class="bg-emerald-500 text-black hover:bg-emerald-400 font-bold"
        />
        <UButton
            variant="ghost"
            label="Back to Login"
            color="gray"
            size="xl"
            block
            @click="navigateTo('/auth/login')"
        />
      </div>
    </UForm>
  </div>
</template>
