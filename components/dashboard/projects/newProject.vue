<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms/form'

import type { TCreateProjectValidationSchema } from '~/zod/projects/CreateProjectValidation'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import { projectsRepository } from '~/repositories/projects'
import { CreateProjectValidationSchema } from '~/zod/projects/CreateProjectValidation'

definePageMeta({
  layout: 'auth',
})

const { $api } = useNuxtApp()
const { uploadFile } = useFileUploader()
const toast = useToast()
const loading = ref(false)
const initialValues = ref<Partial<TCreateProjectValidationSchema>>({
  title: 'hello',
  description: undefined,
  logo: undefined,
  coverImage: undefined,
})
const visible = ref(false)

const resolver = zodResolver(
  CreateProjectValidationSchema,
)

const projectRepo = projectsRepository($api)
async function onFormSubmit(e: FormSubmitEvent<TCreateProjectValidationSchema>) {
  if (e.valid) {
    console.log(e.values)

    try {
      loading.value = true

      console.log(e)
      const results = await Promise.allSettled([
        uploadFile(e.values.logo!),
        uploadFile(e.values.coverImage!),
      ])

      console.log(results)
      const [logoUpload, coverImageUpload] = results

      if (logoUpload.status === 'rejected' || coverImageUpload.status === 'rejected') {
        throw new Error('One or more of your image uploads failed', {
          cause: {
            results,
            uploadType: 'manager',
          },
        })
      }

      const data = await projectRepo.createProject({
        description: e.values.description,
        title: e.values.title,
        logo: logoUpload.value!,
        coverImage: coverImageUpload.value,
      })
      if (data) {
        visible.value = false
        toast.add({ severity: 'success', summary: 'Project created successfully!', life: 3000 })
      }
    } catch (err) {
      console.error('Create project:', err)
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
            <label>Title</label>
            {{ initialValues }}
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
            <label>Description</label>
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
          <!-- <div class="flex flex-col gap-2">
            <label for="name1">Logo</label>
            <div class="flex flex-col gap-1">
              <AppFileUploader v-model="initialValues.logo" name="logo" />
              <Message v-if="$form?.logo?.invalid" severity="error" size="small" variant="simple">
                {{ $form.logo?.error?.message }}
              </Message>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label for="name1">Cover Picture</label>
            <div>
              <div class="flex flex-col gap-1">
                <AppFileUploader v-model="initialValues.coverImage" name="coverImage" />
                <Message v-if="$form.coverImage?.invalid" severity="error" size="small" variant="simple">
                  {{ $form.coverImage?.error?.message }}
                </Message>
              </div>
            </div>
          </div> -->
        </div>
        <Button
          type="submit" label="Sign In" :loading
          class="!w-full !rounded-lg !border !border-surface-950 !bg-surface-950 !text-white hover:!bg-surface-800/90"
        />
      </Form>
    </Dialog>
  </div>
</template>
