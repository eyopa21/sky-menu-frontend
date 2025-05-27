import type { NitroFetchRequest, $Fetch } from "nitropack";
import type { FileUploadResponse } from "./response/file-upload";


export const commonRepository =<T> (fetch: $Fetch<T, NitroFetchRequest>) => ({
    async uploadSingleFile(uploadFileDto: FormData): Promise<FileUploadResponse> {
        return fetch<FileUploadResponse>('cloudinary/upload', {
            method: 'POST', 
            body: uploadFileDto
        })
    }
})