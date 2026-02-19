<script setup lang="ts">
const props = defineProps<{
  name: string
}>()

const theFile = defineModel<File | undefined>()

function onFileChange(event: any) {
  const file = event?.[0]
  if (file) {
    theFile.value = file
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
      class="w-full"
      @change="onFileChange"
      :ui="{ base: 'cursor-pointer file:rounded-full file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-emerald-400' }"
    />
  </div>
</template>
