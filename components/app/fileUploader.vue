<script setup lang="ts">
import type { FileUploadUploaderEvent } from "primevue/fileupload";

import { useToast } from "primevue/usetoast";
import { commonRepository } from "~/repositories/common";
const { $api } = useNuxtApp()
const toast = useToast();

const emit = defineEmits<{
    fileUploaded: [string]
}>()



const commonRepo = commonRepository($api)
const onAdvancedUpload = async (value: FileUploadUploaderEvent) => {

    let file: File | File[] = value.files;
    const formData = new FormData();
    if(Array.isArray(file)){
        formData.append("file", file[0]);
    }
    else {
        formData.append("file", file);
    }
    try {
        const data = await commonRepo.uploadSingleFile(formData);
        if (data) {
            console.log('File uploaded successfully:', data);
            emit('fileUploaded', data.url)

        }
    } catch (err) {
        console.log(err)
        toast.add({ severity: 'error', summary: 'An error occurred.', life: 3000 });
    }

};

</script>

<template>
    <div class="w-full card">
        <Toast />
        <FileUpload :multiple="false" accept="image/*" custom-upload :max-file-size="1000000"  upload-label="Update"
            @uploader="onAdvancedUpload">
        </FileUpload>
    </div>
</template>
