import { FetchError } from 'ofetch'
import { commonRepository } from '~/repositories/common'

export function useFileUploader() {
  const { $api } = useNuxtApp()

  const commonRepo = commonRepository($api)

  async function uploadFile(inputFile: File | File[]) {
    const file: File | File[] = inputFile
    const formData = new FormData()
    if (Array.isArray(file)) {
      formData.append('file', file[0])
    } else {
      formData.append('file', file)
    }
    try {
      const data = await commonRepo.uploadSingleFile(formData)
      if (data) {
        console.log('File uploaded successfully:', data)
        return data
      }
    } catch (error) {
      if (error instanceof FetchError) {
        console.error('Error uploading file:', error)
        throw error.data ?? error.message
      } else {
        console.error('Unexpected error:', error)
        throw error
      }
    }
  }
  return {
    uploadFile,
  }
}
