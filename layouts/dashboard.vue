<template>
  <div class="flex h-screen flex-col">
    <div class=" flex grow  items-stretch">
      <DashboardSidebar />
      <div class="ml-80 min-h-screen grow">
        <div class=" flex h-screen grow flex-col overflow-y-auto pl-0 pt-0    ">
          <div class="bg-surface-0  dark:bg-surface-950">
            <div
              class="flex flex-wrap items-center justify-between bg-red-700 px-6 py-0 text-surface-100 lg:px-20"
            >
              <div class="font-bold">
                🔥 Hot Deals!
              </div>
              <div class="inline-flex items-center gap-1">
                <span class="hidden leading-normal lg:flex">Libero voluptatum atque exercitationem
                  praesentium provident odit.</span>
                <a class="font-bold text-surface-0 underline" href="#">Learn More</a>
              </div>
              <Button
                icon="pi pi-times" text rounded severity="secondary"
                class="!text-surface-0 hover:!bg-surface-500/20"
              />
            </div>
          </div>
          <div class="m-4 h-full  bg-surface-800 p-4">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
