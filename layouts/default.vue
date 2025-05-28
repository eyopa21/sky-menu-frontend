<template>
  <div class="!min-h-screen">
    <div class="container mx-auto ">
      <div id="home" class="landing-wrapper overflow-hidden">
        <div class="relative flex  items-center justify-between p-6 lg:static">
          <NavHeader />
        </div>
        <slot />
        <LandingFooterWidget />
      </div>
    </div>
  </div>
</template>
