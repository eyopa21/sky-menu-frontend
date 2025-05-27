<script setup lang="ts">

import type { FetchResult, NuxtError } from '#app';
import type { FormSubmitEvent } from '@primevue/forms/form';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { userRepository } from '~/repositories/users';
import { UpdateAccountValidationSchema, type TUpdateAccountValidationSchema } from '~/zod/AccountUpdate';


const { $authentication, $api } = useNuxtApp();
const toast = useToast();
const userRepo = userRepository($api)
const currentUser = $authentication.session.value?.user

const initialValues = ref({

    full_name: currentUser?.full_name,
    phone_number: currentUser?.phone_number, 
    birth_date: currentUser?.date_of_birth, 
    sex: currentUser?.sex

});

const resolver = zodResolver(
    UpdateAccountValidationSchema
);

async function onFormSubmit(e: FormSubmitEvent<TUpdateAccountValidationSchema>) {
    if (e.valid && currentUser?.id) {
        try {
            const data = await userRepo.updateMyAccount(currentUser?.id, e.values);
            if (data) {
                console.log('Update successful:', data);
                $authentication.updateSession({
                    accessToken: $authentication.session.value?.accessToken!, 
                    refreshToken: $authentication.session.value?.refreshToken!,
                    user: data
                })
                toast.add({ severity: 'success', summary: 'Profile updated successfully!', life: 3000 });
            }
        } catch (err: unknown) {
            console.log('Update error:', err);
            toast.add({ severity: 'error', summary: err!.message || 'An error occurred while updating profile.', life: 3000 });
        }
    }
}

</script>

<template>
    <Form v-slot="$form" :initial-values :resolver @submit="onFormSubmit"
        class="p-6 md:p-12 rounded-2.5xl lg:rounded-4xl bg-white/16 backdrop-blur-[48px] max-w-[calc(100%-3rem)] lg:max-w-none mx-auto shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)]">
        <div class="pb-10 border-b border-white/12 flex flex-col items-start gap-4">
            <div class="md:flex-[0.45] flex flex-col gap-1"><span class="text-xl font-medium ">Your
                    Photo</span><span class="text-white/64">This
                    will be displayed on your profile.</span></div>
            <!-- <div class="md:flex-[0.55] flex items-center gap-4  w-full">
                 <AppFileUploader @file-uploaded="" />
            </div> -->
        </div>
        <div class="py-10   flex flex-col gap-10">
            <div class="flex -col sm:flex-row justify-between gap-2 items-center">
                <div class=" text-lg  font-medium">Username</div>
                <IconField class="w-1/2">
                    <InputIcon>
                        <Icon name="mdi:account" class="!text-white/70" />
                    </InputIcon>
                    <InputText name="full_name" size="large"
                        class="!appearance-none !border !border-white/10 !w-full !outline-0 !bg-white/10 !text-white placeholder:!text-white/70 !rounded-3xl !shadow-sm"
                        placeholder="Full name" />
                <Message v-if="$form.full_name?.invalid" severity="error" size="small" variant="simple">{{
                        $form.full_name.error.message }}</Message>
                </IconField>
            </div>
            <div class="flex flex-col justify-between sm:flex-row gap-2 items-center">
                <div class=" text-lg  font-medium">Phone number</div>
                <IconField class="w-1/2">
                    <InputIcon>
                        <Icon name="mdi:phone" class="!text-white/70" />
                    </InputIcon>
                    <InputText  name="phone_number" size="large"
                        class="!appearance-none !border !border-white/10 !w-full !outline-0 !bg-white/10 !text-white placeholder:!text-white/70 !rounded-3xl !shadow-sm"
                        placeholder="Phone number" />
                        
                <Message v-if="$form.phone_number?.invalid" severity="error" size="small" variant="simple">{{
                        $form.phone_number.error.message }}</Message>
                </IconField>
            </div>
            <div class="flex flex-col justify-between sm:flex-row gap-2 items-center">
                <div class=" text-lg  font-medium">Date of Birth</div>
                <IconField class="w-1/2">
                    <InputIcon>
                        <Icon name="mdi:calendar" class="!text-white/70" />
                    </InputIcon>
                    <!-- <InputText  name="date_of_birth" size="large"
                        class="!appearance-none !border !border-white/10 !w-full !outline-0 !bg-white/10 !text-white placeholder:!text-white/70 !rounded-3xl !shadow-sm"
                        placeholder="Date of birth" /> -->
                        <DatePicker name="date_of_birth" showIcon fluid iconDisplay="input" />
                <Message v-if="$form.date_of_birth?.invalid" severity="error" size="small" variant="simple">{{
                        $form.date_of_birth.error.message }}</Message>
                </IconField>
            </div>

            <div class="flex flex-col justify-between sm:flex-row gap-2 items-center">
                <div class=" text-lg  font-medium">Gender</div>
               
                   
                    <SelectButton name="sex"  :options="['male', 'female']" size="large" />
                <Message v-if="$form.sex?.invalid" severity="error" size="small" variant="simple">{{
                        $form.sex.error.message }}</Message>
               
            </div>


        </div>
        <div class="py-10   flex flex-col gap-10">
            <div class="flex flex-col sm:flex-row gap-2 items-center justify-between">
                <div class=" text-lg  font-medium">Email</div>
                <IconField class="w-1/2">
                    <InputIcon>
                        <Icon name="mdi:gmail" class="!text-white/70" />
                    </InputIcon>
                    <InputText :value="currentUser?.email" size="large" :disabled="true"
                        class="  !w-full   !rounded-3xl !shadow-sm disabled:cursor-not-allowed"
                        placeholder="Email address" />
                </IconField>
            </div>
            
        </div>
        <div class="pt-10 flex justify-end">
            <Button type="submit" label="Profile">
                <template #icon>
                    <Icon name="mdi:content-save" />

                </template>
            </Button>
        </div>
    </Form>
</template>