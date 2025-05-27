import type { TPageType } from '~/utils/auth/page-type.enum'

declare module '#app' {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface PageMeta {
    /**
     * @default TPageType.PUBLIC
     */
    /**
     * @default TPagePackageType.PRE_MATCH
     */

    pageType?: TPageType

  }
}

export { }
