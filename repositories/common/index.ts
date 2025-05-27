import type { $Fetch, NitroFetchRequest } from 'nitropack'
import type { FileUploadResponse } from './response/file-upload'

export function commonRepository<T>(fetch: $Fetch<T, NitroFetchRequest>) {
  return {
    async uploadSingleFile(uploadFileDto: FormData): Promise<FileUploadResponse> {
      return fetch<FileUploadResponse>('cloudinary/upload', {
        method: 'POST',
        body: uploadFileDto,
      })
    },
  }
}
