import type { T_ACCEPTED_MIME_TYPES } from '~/zod/projects/CreateProjectValidation'

export function fileTypeRefinement(fileTypes: T_ACCEPTED_MIME_TYPES) {
  return function (arg: File): arg is File {
    return fileTypes.includes(arg.type)
  }
}

export function fileSizeRefinement(maxFileSizeInBytes: number) {
  return function (arg: File): arg is File {
    return arg.size <= maxFileSizeInBytes
  }
}
