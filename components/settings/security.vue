<template>
    <div
        class="p-6 md:p-12 rounded-2.5xl lg:rounded-4xl bg-white/16 backdrop-blur-[48px] max-w-[calc(100%-3rem)] lg:max-w-none mx-auto shadow-[0px_2px_5px_0px_rgba(255,255,255,0.06)_inset,0px_12px_20px_0px_rgba(0,0,0,0.06)]">
        <div class="py-10 border-b border-white/12 flex flex-col gap-10">
            <div class="flex flex-col sm:flex-row gap-2 items-center justify-between">
                <div class=" text-lg  font-medium">Change Password</div>
                <IconField class="w-1/2">
                    <InputIcon>
                        <Icon name="mdi:account" class="!text-white/70" />
                    </InputIcon>
                    <InputText size="large"
                        class="!appearance-none !border !border-white/10 !w-full !outline-0 !bg-white/10 !text-white placeholder:!text-white/70 !rounded-3xl !shadow-sm"
                        placeholder="Username" />
                </IconField>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 items-center justify-between">
                <div class=" text-lg  font-medium">Enter Password Again</div>
                <IconField class="w-1/2">
                    <InputIcon>
                        <Icon name="mdi:account" class="!text-white/70" />
                    </InputIcon>
                    <InputText size="large"
                        class="!appearance-none !border !border-white/10 !w-full !outline-0 !bg-white/10 !text-white placeholder:!text-white/70 !rounded-3xl !shadow-sm"
                        placeholder="Username" />
                </IconField>
            </div>
        </div>
        <div class="pt-10 flex justify-end">
            <Button label="Profile">
                <template #icon>
                    <Icon name="mdi:content-save" />

                </template>
            </Button>
        </div>
    </div>
</template>