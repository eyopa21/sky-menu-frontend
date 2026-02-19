<template>
  <div class="flex h-screen flex-col bg-[#09090b]">
    <div class="flex grow items-stretch">
      <DashboardSidebar />
      <div class="ml-80 min-h-screen grow">
        <div class="flex h-screen grow flex-col overflow-y-auto pl-0 pt-0">
          <div class="bg-gray-900">
            <div
              class="flex flex-wrap items-center justify-between bg-emerald-600 px-6 py-2 text-white lg:px-20"
            >
              <div class="text-sm font-bold">
                🚀 New Feature: Appetito integration is here!
              </div>
              <div class="inline-flex items-center gap-2">
                <span class="hidden text-xs leading-normal lg:flex opacity-90">
                  Easily manage your digital menu with our new tools.
                </span>
                <NuxtLink class="text-xs font-bold underline" to="#">Learn More</NuxtLink>
              </div>
              <UButton
                icon="i-heroicons-x-mark"
                variant="ghost"
                color="white"
                size="xs"
              />
            </div>
          </div>
          <div class="grow bg-zinc-950 p-6">
            <div class="h-full rounded-xl border border-white/5 bg-white/[0.02] p-6 shadow-2xl">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
