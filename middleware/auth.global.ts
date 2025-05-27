import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const { isLoggedIn } = storeToRefs(authStore)

  const pageType = to.meta.pageType ?? PageType.AUTHENTICATED

  console.log({ to })

  // if(pageType === PageType.AUTHENTICATED && !$authentication.loggedIn.value ) {

  //  return navigateTo('/auth/login')

  // }

  // if(to.name === 'auth-login' && $authentication.loggedIn.value){
  //     return navigateTo('/')
  // }
})
