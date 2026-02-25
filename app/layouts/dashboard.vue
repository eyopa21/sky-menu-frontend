<template>
  <div class="flex h-screen flex-col bg-[#09090b] dark:bg-[#09090b] light:bg-[#fcfdfd] transition-colors duration-500 overflow-hidden relative">
    <!-- Premium Background Decor (Consistent with Landing/Settings) -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
      <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full" />
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] light:bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
    </div>

    <div class="flex grow items-stretch relative z-10 overflow-hidden">
      <!-- Sidebar with improved design -->
      <DashboardSidebar />
      
      <!-- Main Content Area -->
      <div class="ml-80 grow overflow-hidden h-screen flex flex-col">
        <!-- New Feature / Announcement Bar (Refined) -->
        <div class="shrink-0 bg-[#0d0d0f] dark:bg-[#0d0d0f] light:bg-emerald-50 border-b border-white/5 dark:border-white/5 light:border-emerald-100/50 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div class="flex items-center justify-between px-8 py-3 relative z-10">
            <div class="flex items-center gap-3">
              <div class="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20">
                <UIcon name="i-heroicons-sparkles" class="size-3.5 text-emerald-400" />
              </div>
              <span class="text-xs font-black tracking-wide text-white dark:text-white light:text-emerald-900">
                LATEST UPDATE: <span class="font-medium text-gray-400 dark:text-gray-400 light:text-emerald-700/80">Appetito integration is now live for all digital menus!</span>
              </span>
            </div>
            <div class="flex items-center gap-4">
              <NuxtLink class="text-[10px] uppercase font-black tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors" to="#">Learn More</NuxtLink>
              <div class="h-4 w-px bg-white/10 dark:bg-white/10 light:bg-emerald-200" />
              <button class="text-gray-500 hover:text-white dark:hover:text-white light:hover:text-emerald-900 transition-colors">
                <UIcon name="i-heroicons-x-mark" class="size-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Dashboard Content Scroll Area -->
        <div class="grow overflow-y-auto custom-scrollbar p-8">
          <div class="min-h-full rounded-[3px] p-[1px] bg-gradient-to-br from-white/5 via-transparent to-white/5 dark:from-white/5 light:from-gray-200 shadow-2xl">
            <div class="min-h-full bg-[#0d0d0f]/60 dark:bg-[#0d0d0f]/60 light:bg-white/80 backdrop-blur-2xl rounded-sm p-4 md:p-10 transition-colors duration-500 relative">
              <!-- Content Glow -->
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03),transparent)] pointer-events-none" />
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Custom Scrollbar for Dashboard */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.light .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.2);
}
</style>
