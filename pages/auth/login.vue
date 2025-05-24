

<script setup lang="ts">

import { zodResolver } from '@primevue/forms/resolvers/zod';

import { z } from 'zod';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const initialValues = ref({
    username: ''
});


const resolver = ref(zodResolver(
    z.object({
        username: z.string().min(1, { message: 'Username is required via Zod.' })
    })
));



const onFormSubmit = ({ valid }) => {
    if (valid) {
        toast.add({ severity: 'success', summary: 'Form is submitted.', life: 3000 });
    }
}
</script>


<template>
    <div class="card flex flex-col items-center gap-5">
        <Toast />


        <Form v-slot="$form" :initial-values :resolver="resolver" class="flex flex-col gap-4 w-full sm:w-56" @submit="onFormSubmit">
            <div class="flex flex-col gap-1">
                <InputText name="username" type="text" placeholder="Username" fluid />
                <Message v-if="$form.username?.invalid" severity="error" size="small" variant="simple">{{ $form.username.error.message }}</Message>
            </div>
            <Button type="submit" severity="secondary" label="Submit" />
        </Form>
    </div>
</template>
