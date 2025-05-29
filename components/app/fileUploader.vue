<script setup lang="ts">
import type { FileUploadUploaderEvent } from 'primevue/fileupload'

const theFile = defineModel<File>(undefined)

async function onAdvancedUpload(value: FileUploadUploaderEvent) {
  console.log('selected')
  const file: File | File[] = value.files
  if (Array.isArray(file)) {
    theFile.value = file[0]
  } else {
    theFile.value = file
  }
}
</script>

<template>
  <div class="card w-full">
    <FileUpload
      :multiple="false" accept="image/*" :max-file-size="1000000" upload-label="Update"
      @select="onAdvancedUpload"
    />
  </div>
</template>
