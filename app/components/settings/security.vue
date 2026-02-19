<template>
  <UCard
    class="bg-white/5 border-white/10 backdrop-blur-xl"
    :ui="{ body: { padding: 'p-6 md:p-12' } }"
  >
    <div class="border-b border-white/10 pb-10 mb-10">
      <h2 class="text-xl font-bold text-white">Security</h2>
      <p class="text-sm text-gray-400">Change your password and manage your account security.</p>
    </div>

    <div class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
        <label class="text-lg font-medium text-white">New Password</label>
        <UInput
          type="password"
          icon="i-heroicons-lock-closed"
          placeholder="Enter new password"
          class="w-full"
          variant="ghost"
          :ui="{ base: 'bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl' }"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
        <label class="text-lg font-medium text-white">Confirm Password</label>
        <UInput
          type="password"
          icon="i-heroicons-lock-closed"
          placeholder="Repeat new password"
          class="w-full"
          variant="ghost"
          :ui="{ base: 'bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-xl' }"
        />
      </div>
    </div>

    <div class="flex justify-end pt-10 mt-10 border-t border-white/10">
      <UButton
        label="Update Password"
        icon="i-heroicons-shield-check"
        size="lg"
        class="rounded-xl px-8"
      />
    </div>
  </UCard>
</template>
