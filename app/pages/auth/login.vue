<script setup lang="ts">
import { ref, reactive } from 'vue'
import { authRepository } from '~/repositories/auth'
import { useAuthStore } from '~/store/auth'
import { LoginValidationSchema, type TLoginValidationSchema } from '~/zod/LoginValidation'

definePageMeta({
  layout: 'auth',
})

const { $api } = useNuxtApp()
const { updateSession } = useAuthStore()
const toast = useToast()
const loading = ref(false)

const state = reactive({
  email: '',
  password: '',
})

const authRepo = authRepository($api)

async function onSubmit(event: { data: TLoginValidationSchema }) {
  try {
    loading.value = true
    const data = await authRepo.login(event.data)
    if (data) {
      updateSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      })
      navigateTo('/')
      toast.add({ title: 'Login successful!', color: 'success' })
    }
  } catch (err: any) {
    console.error('Login error:', err)
    const description = getErrorMessage(err)
    toast.add({ 
      title: 'Login failed', 
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
      <h1 class="text-3xl font-bold tracking-tight">Welcome back</h1>
      <p class="text-gray-400">
        Enter your credentials to access your account.
      </p>
    </div>

    <UForm
      :schema="LoginValidationSchema"
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

      <UFormField label="Password" name="password">
        <template #label>
            <div class="flex items-center justify-between w-full">
                <span>Password</span>
                <NuxtLink to="/auth/forgot-password" class="text-sm text-emerald-400 hover:text-emerald-300">Forgot password?</NuxtLink>
            </div>
        </template>
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

      <UButton
        type="submit"
        label="Sign In"
        :loading="loading"
        size="xl"
        block
        class="bg-emerald-500 text-black hover:bg-emerald-400 font-bold"
      />
    </UForm>

    <div class="pt-6 border-t border-white/5 text-center">
      <p class="text-sm text-gray-500">
        Don't have an account? 
        <NuxtLink to="/auth/signup" class="text-emerald-400 hover:text-emerald-300 font-medium">Create one now</NuxtLink>
      </p>
    </div>
  </div>
</template>
