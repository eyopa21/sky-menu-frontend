<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms/form'
import type { TUpdateAccountValidationSchema } from '~/zod/AccountUpdate'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { userRepository } from '~/repositories/users'
import { useAuthStore } from '~/store/auth'
import { UpdateAccountValidationSchema } from '~/zod/AccountUpdate'

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const { session } = storeToRefs(authStore)
const toast = useToast()
const userRepo = userRepository($api)
const currentUser = session.value?.user
const loading = ref(false)
const initialValues = ref<Partial<TUpdateAccountValidationSchema>>({

  full_name: currentUser?.full_name,
  phone_number: currentUser?.phone_number,
  date_of_birth: currentUser?.date_of_birth,
  sex: currentUser?.sex,

})

const resolver = zodResolver(
  UpdateAccountValidationSchema,
)

async function onFormSubmit(e: FormSubmitEvent<TUpdateAccountValidationSchema>) {
  if (e.valid && currentUser?.id) {
    try {
      loading.value = true
      const data = await userRepo.updateMyAccount(currentUser?.id, e.values)
      if (data) {
        console.log('Update successful:', data)
        authStore.updateSession({
          accessToken: session.value?.accessToken!,
          refreshToken: session.value?.refreshToken!,
          user: data,
        })
        toast.add({ severity: 'success', summary: 'Profile updated successfully!', life: 3000 })
      }
    } catch (err: unknown) {
      console.log('Update error:', err)
      toast.add({ severity: 'error', summary: err!.message || 'An error occurred while updating profile.', life: 3000 })
    } finally {
      loading.value = false
    }
  }
}
</script>

<template>
  <Form
    v-slot="$form" :initial-values :resolver class="rounded-2.5xl lg:rounded-4xl bg-white/16 mx-auto max-w-[calc(100%-3rem)] p-6 shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)] backdrop-blur-[48px] md:p-12 lg:max-w-none"
    @submit="onFormSubmit"
  >
    <div class="border-white/12 flex flex-col items-start gap-4 border-b pb-10">
      <div class="flex flex-col gap-1 md:flex-[0.45]">
        <span class="text-xl font-medium ">Your
          Account</span><span class="text-white/64">This
          will be displayed on your profile.</span>
      </div>
      <!-- <div class="md:flex-[0.55] flex items-center gap-4  w-full">
                 <AppFileUploader @file-uploaded="" />
            </div> -->
    </div>
    <div class="flex   flex-col gap-10 py-10">
      <div class="-col flex items-center justify-between gap-2 sm:flex-row">
        <div class=" text-lg  font-medium">
          Username
        </div>
        <IconField class="w-1/2">
          <InputIcon>
            <Icon name="mdi:account" class="!text-white/70" />
          </InputIcon>
          <InputText
            name="full_name" size="large"
            class="!w-full !appearance-none !rounded-3xl !border !border-white/10 !bg-white/10 !text-white !shadow-sm !outline-0 placeholder:!text-white/70"
            placeholder="Full name"
          />
          <Message v-if="$form.full_name?.invalid" severity="error" size="small" variant="simple">
            {{
              $form.full_name.error.message }}
          </Message>
        </IconField>
      </div>
      <div class="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div class=" text-lg  font-medium">
          Phone number
        </div>
        <IconField class="w-1/2">
          <InputIcon>
            <Icon name="mdi:phone" class="!text-white/70" />
          </InputIcon>
          <InputText
            name="phone_number" size="large"
            class="!w-full !appearance-none !rounded-3xl !border !border-white/10 !bg-white/10 !text-white !shadow-sm !outline-0 placeholder:!text-white/70"
            placeholder="Phone number"
          />

          <Message v-if="$form.phone_number?.invalid" severity="error" size="small" variant="simple">
            {{
              $form.phone_number.error.message }}
          </Message>
        </IconField>
      </div>
      <div class="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div class=" text-lg  font-medium">
          Date of Birth
        </div>
        <IconField class="w-1/2">
          <InputIcon>
            <Icon name="mdi:calendar" class="!text-white/70" />
          </InputIcon>

          <DatePicker v-model="initialValues.date_of_birth" name="date_of_birth" show-icon fluid icon-display="input" input-class="!appearance-none !border !border-white/10 !w-full !outline-0 !bg-white/10 !text-white placeholder:!text-white/70 !rounded-3xl !shadow-sm" />
          <Message v-if="$form.date_of_birth?.invalid" severity="error" size="small" variant="simple">
            {{
              $form.date_of_birth.error.message }}
          </Message>
        </IconField>
      </div>

      <div class="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div class=" text-lg  font-medium">
          Gender
        </div>
        <SelectButton name="sex" :options="['male', 'female']" size="large" class="!rounded-full bg-red-500" />
        <Message v-if="$form.sex?.invalid" severity="error" size="small" variant="simple">
          {{
            $form.sex.error.message }}
        </Message>
      </div>
    </div>
    <div class="flex   flex-col gap-10 py-10">
      <div class="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div class=" text-lg  font-medium">
          Email
        </div>
        <IconField class="w-1/2">
          <InputIcon>
            <Icon name="mdi:gmail" class="!text-white/70" />
          </InputIcon>
          <InputText
            :value="currentUser?.email" size="large" :disabled="true"
            class="  !w-full   !rounded-3xl !shadow-sm disabled:cursor-not-allowed"
            placeholder="Email address"
          />
        </IconField>
      </div>
    </div>
    <div class="flex justify-end pt-10">
      <Button type="submit" label="Save" :loading>
        <template #icon>
          <Icon name="mdi:content-save" />
        </template>
      </Button>
    </div>
  </Form>
</template>
