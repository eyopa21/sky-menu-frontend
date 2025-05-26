export default defineNuxtRouteMiddleware((to, from) => {
const  {$authentication} = useNuxtApp()

const pageType = to.meta.pageType ?? PageType.AUTHENTICATED

console.log({to })

// if(pageType === PageType.AUTHENTICATED && !$authentication.loggedIn.value ) {

//  return navigateTo('/auth/login')
    
// }
  
// if(to.name === 'auth-login' && $authentication.loggedIn.value){
//     return navigateTo('/')
// }


})