<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms/form'
import type { TLoginValidationSchema } from '~/zod/LoginValidation'

import type { TCreateProjectValidationSchema } from '~/zod/projects/CreateProjectValidation'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import { authRepository } from '~/repositories/auth'
import { useAuthStore } from '~/store/auth'
import { CreateProjectValidationSchema } from '~/zod/projects/CreateProjectValidation'

definePageMeta({
  layout: 'auth',
})

const { $api } = useNuxtApp()
const { updateSession } = useAuthStore()
const toast = useToast()
const loading = ref(false)
const initialValues = ref<Partial<TCreateProjectValidationSchema>>({
  title: undefined,
  description: undefined,
  logo: undefined,
  coverImage: undefined,
})
const visible = ref(false)

const resolver = zodResolver(
  CreateProjectValidationSchema,
)

const authRepo = authRepository($api)
async function onFormSubmit(e: FormSubmitEvent<TCreateProjectValidationSchema>) {
  if (e.valid) {
    try {
      loading.value = true
      const data = await authRepo.login(e.v)
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
  <div class="card flex justify-center">
    <Button label="Show" @click="visible = true" />
    <Dialog
      v-model:visible="visible" modal header="New project" :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <Form
        v-slot="$form" :initial-values :resolver class="flex w-full flex-col items-center gap-8"
        @submit="onFormSubmit"
      >
        <div class="flex w-full flex-col gap-6 p-4">
          <div class="flex flex-col gap-2">
            <label for="name1">Title</label>
            <div>
              <IconField>
                <InputIcon>
                  <Icon name="mdi:account" class="!text-white/70" />
                </InputIcon>
                <InputText
                  name="title" class="!w-full !shadow-sm !outline-0 placeholder:!text-white/70"
                  placeholder="Project title"
                />
              </IconField>
              <Message v-if="$form.title?.invalid" severity="error" size="small" variant="simple">
                {{
                  $form.title.error.message }}
              </Message>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label for="name1">Description</label>
            <div>
              <Textarea
                name="description" rows="5" cols="30"
                style="resize: none"
                class="!w-full !shadow-sm !outline-0 placeholder:!text-white/70"
                placeholder="Project descriptions"
              />

              <Message v-if="$form.description?.invalid" severity="error" size="small" variant="simple">
                {{
                  $form.description.error.message }}
              </Message>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label for="name1">Logo</label>
            <div>
              <FormField v-slot="$field" name="logo" :initial-value="initialValues.logo" class="flex flex-col gap-1">
                <AppFileUploader v-model="initialValues.logo" name="logo" />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                  {{ $field.error?.message }}
                </Message>
              </FormField>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label for="name1">Cover Picture</label>
            <div>
              <FormField v-slot="$field" name="coverImage" :initial-value="initialValues.coverImage" class="flex flex-col gap-1">
                <AppFileUploader v-model="initialValues.coverImage" />
                <Message v-if="$field?.invalid" severity="error" size="small" variant="simple">
                  {{ $field.error?.message }}
                </Message>
              </FormField>
            </div>
          </div>
        </div>
        <Button
          type="submit" label="Sign In" :loading
          class="!w-full !rounded-lg !border !border-surface-950 !bg-surface-950 !text-white hover:!bg-surface-800/90"
        />
      </Form>
    </Dialog>
  </div>
</template>
