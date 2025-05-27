<template>
  <div
    class="rounded-2.5xl lg:rounded-4xl bg-white/16 mx-auto max-w-[calc(100%-3rem)] p-6 shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)] backdrop-blur-[48px] md:p-12 lg:max-w-none"
  >
    <div class="border-white/12 flex flex-col items-start gap-4 border-b pb-10">
      <div class="flex flex-col gap-1 md:flex-[0.45]">
        <span class="text-xl font-medium ">Security</span><span class="text-white/64">Change your password here</span>
      </div>
    </div>
    <div class="border-white/12 flex flex-col gap-10 border-b py-10">
      <div class="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div class=" text-lg  font-medium">
          Change Password
        </div>
        <IconField class="w-1/2">
          <InputIcon>
            <Icon name="mdi:account" class="!text-white/70" />
          </InputIcon>
          <InputText
            size="large"
            class="!w-full !appearance-none !rounded-3xl !border !border-white/10 !bg-white/10 !text-white !shadow-sm !outline-0 placeholder:!text-white/70"
            placeholder="Username"
          />
        </IconField>
      </div>
      <div class="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div class=" text-lg  font-medium">
          Enter Password Again
        </div>
        <IconField class="w-1/2">
          <InputIcon>
            <Icon name="mdi:account" class="!text-white/70" />
          </InputIcon>
          <InputText
            size="large"
            class="!w-full !appearance-none !rounded-3xl !border !border-white/10 !bg-white/10 !text-white !shadow-sm !outline-0 placeholder:!text-white/70"
            placeholder="Username"
          />
        </IconField>
      </div>
    </div>
    <div class="flex justify-end pt-10">
      <Button label="Profile">
        <template #icon>
          <Icon name="mdi:content-save" />
        </template>
      </Button>
    </div>
  </div>
</template>
