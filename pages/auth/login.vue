<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms/form'
import type { TLoginValidationSchema } from '~/zod/LoginValidation'

import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import { authRepository } from '~/repositories/auth'
import { useAuthStore } from '~/store/auth'
import { LoginValidationSchema } from '~/zod/LoginValidation'

const { $api } = useNuxtApp()
const { updateSession } = useAuthStore()
const toast = useToast()
const loading = ref(false)
const initialValues = ref({
  email: undefined,
  password: undefined,
})

const resolver = zodResolver(
  LoginValidationSchema,
)

const authRepo = authRepository($api)
async function onFormSubmit(e: FormSubmitEvent<TLoginValidationSchema>) {
  if (e.valid) {
    try {
      loading.value = true
      const data = await authRepo.login(e.values)
      if (data) {
        updateSession({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          user: data.user,
        })
        navigateTo('/')
        toast.add({ severity: 'success', summary: 'Login successful!', life: 3000 })
      }
    } catch (err) {
      console.error('Login error:', err)
      toast.add({ severity: 'error', summary: 'An error occurred.', life: 3000 })
    } finally {
      loading.value = false
    }
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center !bg-cover !bg-center !bg-no-repeat px-8 py-20 backdrop-blur-3xl md:px-12 lg:px-20"
    style="background-image: url('https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/signin/signin-glass.jpg')"
  >
    <Toast />
    <div
      class="flex w-full max-w-xl flex-col items-center gap-12 rounded-2xl border border-white/10 bg-white/10 px-8 py-12 backdrop-blur-2xl md:px-12 lg:px-20"
    >
      <div class="flex w-full flex-col items-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg" class="size-14" width="33" height="32" viewBox="0 0 33 32"
          fill="none"
        >
          <path
            fill-rule="evenodd" clip-rule="evenodd"
            d="M7.09219 2.87829C5.94766 3.67858 4.9127 4.62478 4.01426 5.68992C7.6857 5.34906 12.3501 5.90564 17.7655 8.61335C23.5484 11.5047 28.205 11.6025 31.4458 10.9773C31.1517 10.087 30.7815 9.23135 30.343 8.41791C26.6332 8.80919 21.8772 8.29127 16.3345 5.51998C12.8148 3.76014 9.71221 3.03521 7.09219 2.87829ZM28.1759 5.33332C25.2462 2.06 20.9887 0 16.25 0C14.8584 0 13.5081 0.177686 12.2209 0.511584C13.9643 0.987269 15.8163 1.68319 17.7655 2.65781C21.8236 4.68682 25.3271 5.34013 28.1759 5.33332ZM32.1387 14.1025C28.2235 14.8756 22.817 14.7168 16.3345 11.4755C10.274 8.44527 5.45035 8.48343 2.19712 9.20639C2.0292 9.24367 1.86523 9.28287 1.70522 9.32367C1.2793 10.25 0.939308 11.2241 0.695362 12.2356C0.955909 12.166 1.22514 12.0998 1.50293 12.0381C5.44966 11.161 11.0261 11.1991 17.7655 14.5689C23.8261 17.5991 28.6497 17.561 31.9029 16.838C32.0144 16.8133 32.1242 16.7877 32.2322 16.7613C32.2441 16.509 32.25 16.2552 32.25 16C32.25 15.358 32.2122 14.7248 32.1387 14.1025ZM31.7098 20.1378C27.8326 20.8157 22.5836 20.5555 16.3345 17.431C10.274 14.4008 5.45035 14.439 2.19712 15.1619C1.475 15.3223 0.825392 15.5178 0.252344 15.7241C0.250782 15.8158 0.25 15.9078 0.25 16C0.25 24.8366 7.41344 32 16.25 32C23.6557 32 29.8862 26.9687 31.7098 20.1378Z"
            class="fill-surface-0"
          />
        </svg>
        <div class="flex w-full flex-col gap-2">
          <div class="text-center text-3xl font-medium leading-tight text-white">
            Welcome Back
          </div>
          <div class="text-center">
            <span class="text-white/80">Don't have an account? </span>
            <a class="cursor-pointer text-white/80 underline hover:text-white/90">Sign up</a>
          </div>
        </div>
      </div>
      <Form v-slot="$form" :initial-values :resolver class="flex w-full flex-col items-center gap-8" @submit="onFormSubmit">
        <div class="flex w-full flex-col gap-6">
          <IconField>
            <InputIcon>
              <Icon name="mdi:account" class="!text-white/70" />
            </InputIcon>
            <InputText
              name="email"
              class="!w-full !appearance-none !rounded-3xl !border !border-white/10 !bg-white/10 !text-white !shadow-sm !outline-0 placeholder:!text-white/70"
              placeholder="Username"
            />
          </IconField>
          <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
            {{
              $form.email.error.message }}
          </Message>
          <IconField>
            <InputIcon>
              <Icon name="mdi:lock" class="!text-white/70" />
            </InputIcon>
            <InputText
              name="password" type="password"
              class="!w-full !appearance-none !rounded-3xl !border !border-white/10 !bg-white/10 !text-white !shadow-sm !outline-0 placeholder:!text-white/70"
              placeholder="Password" :toggle-mask="true"
            />
          </IconField>
          <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
            <ul class="my-0 flex flex-col gap-1 px-4">
              <li v-for="(error, index) of $form.password.errors" :key="index">
                {{ error.message }}
              </li>
            </ul>
          </Message>
        </div>
        <Button
          type="submit" label="Sign In" :loading
          class="!w-full !rounded-3xl !border !border-surface-950 !bg-surface-950 !text-white hover:!bg-surface-950/80"
        />
      </Form>
      <a class="cursor-pointer text-white/80 hover:text-white/90">Forgot Password?</a>
    </div>
  </div>
</template>
