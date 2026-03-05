<script setup lang="ts">
const props = defineProps<{
  name: string
  multiple?: boolean
  accept?: string
}>()

const theFile = defineModel<File | undefined>()
const multiFiles = defineModel<File[]>('files', { default: [] })

const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Local state for previews of newly selected files
const previews = ref<{ url: string, name: string, type: string, size: number }[]>([])

function onFileChange(event: any) {
  const filesList = event instanceof Event ? (event.target as HTMLInputElement).files : event
  if (!filesList) return
  handleFiles(Array.from(filesList))
  
  // Reset input value so the same file can be selected again
  if (fileInput.value) fileInput.value.value = ''
}

function handleFiles(files: File[]) {
  if (props.multiple) {
    multiFiles.value = [...multiFiles.value, ...files]
  } else {
    // For single upload, we replace the previous one
    multiFiles.value = [files[0]]
    theFile.value = files[0]
    
    // Revoke old single preview if it exists
    if (previews.value.length > 0) {
      URL.revokeObjectURL(previews.value[0].url)
      previews.value = []
    }
  }
  generatePreviews(files)
}

function generatePreviews(files: File[]) {
  const newPreviews = files.map(file => {
    if (file.type.startsWith('image/')) {
      return {
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
        size: file.size
      }
    }
    return null
  }).filter(p => p !== null) as any[]

  if (props.multiple) {
    previews.value = [...previews.value, ...newPreviews]
  } else {
    previews.value = newPreviews
  }
}

function removeFile(index: number) {
  // Revoke object URL to prevent memory leaks
  if (previews.value[index]) {
    URL.revokeObjectURL(previews.value[index].url)
  }

  if (props.multiple) {
    multiFiles.value.splice(index, 1)
    previews.value.splice(index, 1)
  } else {
    theFile.value = undefined
    multiFiles.value = []
    previews.value = []
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files) {
    handleFiles(Array.from(e.dataTransfer.files))
  }
}

// Clean up object URLs on unmount
onUnmounted(() => {
  previews.value.forEach(p => URL.revokeObjectURL(p.url))
})
</script>

<template>
  <div class="w-full space-y-4">
    <!-- Drop Zone -->
    <div
      @click="triggerFileInput"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      :class="[
        'relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all duration-300 flex flex-col items-center justify-center gap-3',
        isDragging ? 'border-primary-500 bg-primary-500/10 scale-[1.01]' : 'border-zinc-700 bg-zinc-900/40 hover:border-zinc-500 hover:bg-zinc-900/60'
      ]"
    >
      <input
        ref="fileInput"
        type="file"
        :name="props.name"
        :multiple="props.multiple"
        :accept="props.accept"
        class="hidden"
        @change="onFileChange"
      />
      
      <div class="p-4 rounded-full bg-zinc-800/50 group-hover:bg-zinc-800 transition-colors border border-white/5">
        <UIcon name="i-heroicons-cloud-arrow-up" class="size-8 text-zinc-400 group-hover:text-primary-500 transition-colors" />
      </div>
      
      <div class="text-center">
        <p class="text-sm font-semibold text-zinc-200">
          Click to upload or drag and drop
        </p>
        <p class="text-xs text-zinc-500 mt-1">
          SVG, PNG, JPG or GIF (max. 5MB)
        </p>
      </div>
    </div>

    <!-- Previews -->
    <div v-if="previews.length > 0" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div 
        v-for="(preview, index) in previews" 
        :key="preview.url"
        class="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-zinc-900 shadow-xl"
      >
        <img :src="preview.url" class="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
        
        <!-- Overlay -->
        <div class="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <UButton
            color="error"
            variant="subtle"
            icon="i-heroicons-trash"
            size="sm"
            class="rounded-full !p-2"
            @click.stop="removeFile(index)"
          />
          <p class="text-[10px] text-zinc-300 px-2 text-center truncate w-full">{{ preview.name }}</p>
        </div>

        <!-- Size Badge -->
        <div class="absolute top-2 left-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-md rounded text-[9px] text-zinc-300 border border-white/5">
          {{ (preview.size / 1024).toFixed(0) }} KB
        </div>
      </div>
    </div>
  </div>
</template>
