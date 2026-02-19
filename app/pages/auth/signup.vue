<script setup lang="ts">
import { ref, reactive } from 'vue'
import { authRepository } from '~/repositories/auth'
import { useAuthStore } from '~/store/auth'
import { SignupValidationSchema, type TSignupValidationSchema } from '~/zod/SignupValidation'

definePageMeta({
  layout: 'auth',
})

const { $api } = useNuxtApp()
const { updateSession } = useAuthStore()
const toast = useToast()
const loading = ref(false)

const state = reactive({
  full_name: '',
  email: '',
  phone_number: '',
  password: '',
  confirmPassword: '',
  date_of_birth: new Date().toISOString().split('T')[0],
  sex: 'male' as const,
})

const authRepo = authRepository($api)

async function onSubmit(event: { data: TSignupValidationSchema }) {
  try {
    loading.value = true
    // Pass everything except confirmPassword to the backend
    const { confirmPassword, ...signupData } = event.data
    const data = await authRepo.signup(signupData)
    
    if (data) {
      updateSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      })
      navigateTo('/')
      toast.add({ title: 'Account created successfully!', color: 'success' })
    }
  } catch (err: any) {
    console.error('Signup error:', err)
    const description = getErrorMessage(err)
    toast.add({ 
      title: 'Signup failed', 
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
      <h1 class="text-3xl font-bold tracking-tight">Create an account</h1>
      <p class="text-gray-400">
        Fill in your details to get started with SKy Menu.
      </p>
    </div>

    <UForm
      :schema="SignupValidationSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField label="Full Name" name="full_name">
        <UInput
          v-model="state.full_name"
          icon="i-heroicons-user"
          size="lg"
          placeholder="John Doe"
          class="w-full"
          :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
        />
      </UFormField>

      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            icon="i-heroicons-envelope"
            size="lg"
            placeholder="name@example.com"
            class="w-full"
            :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
          />
        </UFormField>

        <UFormField label="Phone Number" name="phone_number">
          <UInput
            v-model="state.phone_number"
            icon="i-heroicons-phone"
            size="lg"
            placeholder="0911..."
            class="w-full"
            :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
          />
        </UFormField>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UFormField label="Birthday" name="date_of_birth">
          <UInput
            v-model="state.date_of_birth"
            type="date"
            size="lg"
            class="w-full"
            :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
          />
        </UFormField>

        <UFormField label="Gender" name="sex">
          <USelect
            v-model="state.sex"
            :options="[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]"
            size="lg"
            class="w-full"
            :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
          />
        </UFormField>
      </div>

      <UFormField label="Password" name="password">
        <UInput
          v-model="state.password"
          type="password"
          icon="i-heroicons-lock-closed"
          size="lg"
          placeholder="••••••••"
          class="w-full"
          :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
        />
      </UFormField>

      <UFormField label="Confirm Password" name="confirmPassword">
        <UInput
          v-model="state.confirmPassword"
          type="password"
          icon="i-heroicons-check-circle"
          size="lg"
          placeholder="••••••••"
          class="w-full"
          :ui="{ base: 'bg-white/5 border-white/10 focus:ring-emerald-500/50' }"
        />
      </UFormField>

      <UButton
        type="submit"
        label="Create Account"
        :loading="loading"
        size="xl"
        block
        class="bg-emerald-500 text-black hover:bg-emerald-400 font-bold mt-4"
      />
    </UForm>

    <div class="pt-6 border-t border-white/5 text-center">
      <p class="text-sm text-gray-500">
        Already have an account? 
        <NuxtLink to="/auth/login" class="text-emerald-400 hover:text-emerald-300 font-medium">Sign in instead</NuxtLink>
      </p>
    </div>
  </div>
</template>
