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
  } catch (err) {
    console.error('Login error:', err)
    toast.add({ title: 'An error occurred.', description: 'Please check your credentials.', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-8 py-20 backdrop-blur-3xl md:px-12 lg:px-20"
    style="background-image: url('https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/signin/signin-glass.jpg')"
  >
    <div
      class="flex w-full max-w-xl flex-col items-center gap-12 rounded-2xl border border-white/10 bg-white/10 px-8 py-12 backdrop-blur-2xl md:px-12 lg:px-20"
    >
      <div class="flex w-full flex-col items-center gap-4">
        <UIcon name="i-heroicons-cloud-arrow-up" class="size-14 text-white" />
        <div class="flex w-full flex-col gap-2">
          <div class="text-center text-3xl font-medium leading-tight text-white">
            Welcome Back
          </div>
          <div class="text-center">
            <span class="text-white/80">Don't have an account? </span>
            <NuxtLink to="/auth/signup" class="cursor-pointer text-white/80 underline hover:text-white/90">Sign up</NuxtLink>
          </div>
        </div>
      </div>

      <UForm
        :schema="LoginValidationSchema"
        :state="state"
        class="flex w-full flex-col items-center gap-8"
        @submit="onSubmit"
      >
        <div class="flex w-full flex-col gap-6">
          <UFormField name="email" class="w-full">
            <UInput
              v-model="state.email"
              icon="i-heroicons-envelope"
              size="xl"
              placeholder="Email"
              class="w-full"
              :ui="{ 
                base: 'rounded-3xl border-white/10 bg-white/10 text-white placeholder-white/70 focus:ring-white/20',
                inline: 'pl-12'
              }"
            />
          </UFormField>

          <UFormField name="password" class="w-full">
            <UInput
              v-model="state.password"
              type="password"
              icon="i-heroicons-lock-closed"
              size="xl"
              placeholder="Password"
              class="w-full"
              :ui="{ 
                base: 'rounded-3xl border-white/10 bg-white/10 text-white placeholder-white/70 focus:ring-white/20',
                inline: 'pl-12'
              }"
            />
          </UFormField>
        </div>

        <UButton
          type="submit"
          label="Sign In"
          :loading="loading"
          size="xl"
          block
          class="rounded-3xl bg-white text-black hover:bg-white/90"
        />
      </UForm>
      <NuxtLink to="/auth/forgot-password" class="cursor-pointer text-white/80 hover:text-white/90">Forgot Password?</NuxtLink>
    </div>
  </div>
</template>
