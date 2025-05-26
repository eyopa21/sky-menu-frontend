export const PageType = {

    /**
     * A page that can be viewed by anyone whether they're authenticated or not
     */
    PUBLIC: 'public',
  
    /**
     * Authenticated pages that require a regular auth session
     */
    AUTHENTICATED: 'authenticated',
  } as const
  
  export type TPageType = typeof PageType[keyof typeof PageType]
  