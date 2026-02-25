<script setup lang="ts">
const props = defineProps<{
  name: string
  multiple?: boolean
}>()

const theFile = defineModel<File | undefined>()
const multiFiles = defineModel<File[]>('files', { default: [] })

function onFileChange(event: any) {
  const filesList = event instanceof Event ? (event.target as HTMLInputElement).files : event
  if (!filesList) return

  if (props.multiple) {
    multiFiles.value = Array.from(filesList)
  } else {
    theFile.value = filesList[0]
  }
}
</script>

<template>
  <div class="w-full">
    <UInput
      type="file"
      size="xl"
      icon="i-heroicons-cloud-arrow-up"
      :name="props.name"
      :multiple="props.multiple"
      class="w-full"
      @change="onFileChange"
      :ui="{ base: 'cursor-pointer file:rounded-full file:border-0 file:bg-primary-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-primary-400' }"
    />
  </div>
</template>
