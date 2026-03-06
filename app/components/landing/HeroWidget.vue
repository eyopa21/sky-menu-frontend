<style>
@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.1); }
  66% { transform: translate(-20px, 10px) scale(0.95); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(-1deg); }
  50% { transform: translateY(-14px) rotate(1deg); }
}
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.blob { animation: blob 12s ease-in-out infinite; }
.blob-delay { animation-delay: 4s; }
.blob-delay-2 { animation-delay: 8s; }
.float-anim { animation: float 7s ease-in-out infinite; }
.gradient-text {
  background: linear-gradient(135deg, #ffffff 0%, #a7f3d0 30%, #34d399 60%, #10b981 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 5s linear infinite;
}
/* Light Mode Gradient */
.light .gradient-text {
  background: linear-gradient(135deg, #10b981 0%, #059669 40%, #064e3b 70%, #064e3b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.fade-in-up-1 { animation: fadeInUp 0.85s cubic-bezier(0.16,1,0.3,1) 0s both; }
.fade-in-up-2 { animation: fadeInUp 0.85s cubic-bezier(0.16,1,0.3,1) 0.12s both; }
.fade-in-up-3 { animation: fadeInUp 0.85s cubic-bezier(0.16,1,0.3,1) 0.24s both; }
.fade-in-up-4 { animation: fadeInUp 0.85s cubic-bezier(0.16,1,0.3,1) 0.36s both; }
.fade-in-up-5 { animation: fadeInUp 0.85s cubic-bezier(0.16,1,0.3,1) 0.48s both; }
.shine {
  position: relative;
  overflow: hidden;
}
.shine::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}
.shine:hover::after { transform: translateX(100%); }
.glow-btn {
  transition: box-shadow 0.3s ease, transform 0.2s ease, background-color 0.3s ease;
}
.glow-btn:hover {
  box-shadow: 0 0 40px 0 rgba(52,211,153,0.55), 0 0 80px 0 rgba(52,211,153,0.15);
  transform: scale(1.03) translateY(-1px);
}
</style>

<template>
  <div
    id="hero"
    class="relative flex flex-col overflow-hidden px-6 pt-32 pb-20 lg:px-20 min-h-screen justify-center transition-colors duration-500 bg-app-bg"
  >
    <!-- ── Background Visuals ────────────────────────────── -->
    <div class="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none opacity-60 dark:opacity-60 light:opacity-40">
      <img 
        src="/cultural-hero.png" 
        alt="Cultural Heritage" 
        class="w-full h-full object-cover transition-all duration-1000 opacity-60"
      />
      <!-- Soft gradient overlays to blend the image without hiding it -->
      <div class="absolute inset-0 bg-gradient-to-b from-[var(--color-app-bg)]/80 via-transparent to-[var(--color-app-bg)] dark:from-[var(--color-app-bg)]/80 dark:to-[var(--color-app-bg)] light:from-[var(--color-app-bg)]/60 light:to-[var(--color-app-bg)]" />
      <div class="absolute inset-0 bg-gradient-to-r from-[var(--color-app-bg)]/40 via-transparent to-[var(--color-app-bg)]/40 dark:from-[var(--color-app-bg)]/40 dark:to-[var(--color-app-bg)]/40 light:from-[var(--color-app-bg)]/20 light:to-[var(--color-app-bg)]/20" />
    </div>

    <!-- Animated background layer (Blobs & Grid) -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <!-- Blobs -->
      <div class="blob absolute -top-52 -left-52 w-[700px] h-[700px] rounded-full bg-emerald-600/10 dark:bg-emerald-600/10 light:bg-emerald-200/20 blur-3xl transition-colors duration-500" />
      <div class="blob blob-delay absolute top-1/2 -right-52 w-[550px] h-[550px] rounded-full bg-teal-500/8 dark:bg-teal-500/8 light:bg-teal-200/10 blur-3xl transition-colors duration-500" />

      <!-- Dot grid -->
      <div class="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] light:bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:28px_28px] transition-colors duration-500" />

      <!-- Radial sweep -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(16,185,129,0.14),transparent)]" />
    </div>

    <!-- ── Main content ────────────────────────────────────── -->
    <div class="relative z-10 mx-auto max-w-5xl text-center">

      <!-- Beta badge -->
      <div class="fade-in-up-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8 cursor-default light:bg-emerald-50 light:border-emerald-100 transition-colors">
        <span class="size-1.5 rounded-full bg-emerald-400 dark:bg-emerald-400 light:bg-emerald-500 animate-pulse" />
        <span class="text-xs font-semibold text-emerald-400 dark:text-emerald-400 light:text-emerald-700 tracking-widest uppercase">Tradition Meets Technology</span>
        <UIcon name="i-heroicons-sparkles" class="size-3 text-emerald-500/60" />
      </div>

      <!-- Headline -->
      <h1 class="fade-in-up-2 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
        <span class="block text-white/60 dark:text-white/60 light:text-gray-500 font-light text-2xl md:text-3xl mb-3 tracking-wide transition-colors">Elegance in Every</span>
        <span class="gradient-text">Communal Menu</span>
        <br />
        <span class="text-white dark:text-white light:text-gray-900 transition-colors">Experience</span>
      </h1>

      <p class="fade-in-up-3 mx-auto max-w-2xl text-base md:text-lg text-gray-400 dark:text-gray-400 light:text-gray-600 leading-relaxed font-normal mb-10 transition-colors">
        Elevate your restaurant with our Appetito-inspired digital menu platform. 
        Where the warmth of Ethiopian hospitality meets stunning visual presentation.
      </p>

      <!-- CTA Buttons -->
      <div class="fade-in-up-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <NuxtLink
          to="/auth/login"
          class="shine glow-btn group relative inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-black bg-emerald-400 hover:bg-emerald-300 dark:bg-emerald-400 light:bg-emerald-500 light:text-white rounded-2xl shadow-[0_0_24px_0_rgba(52,211,153,0.4)] dark:shadow-[0_0_24px_0_rgba(52,211,153,0.4)] light:shadow-[0_10px_30px_-10px_rgba(5,150,105,0.4)] transition-all"
        >
          Get Started Free
          <UIcon name="i-heroicons-arrow-right" class="size-5 group-hover:translate-x-1 transition-transform duration-200" />
        </NuxtLink>
        <button
          class="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-gray-300 dark:text-gray-300 light:text-gray-600 border border-white/10 dark:border-white/10 light:border-gray-200 rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-white dark:hover:text-white light:hover:text-emerald-700 transition-all duration-300"
          @click="scrollToFeatures"
        >
          <UIcon name="i-heroicons-play-circle" class="size-5 text-emerald-400 light:text-emerald-600" />
          See the Demo
        </button>
      </div>

      <!-- Stats row -->
      <div class="fade-in-up-5 flex flex-wrap items-center justify-center gap-5 sm:gap-10 text-sm text-gray-500 mb-20 dark:text-gray-500 light:text-gray-400">
        <div class="flex flex-col items-center gap-1 group">
          <span class="text-2xl font-extrabold text-white dark:text-white light:text-gray-900 group-hover:text-emerald-400 transition-colors">500<span class="text-emerald-400">+</span></span>
          <span class="text-xs uppercase tracking-tighter font-bold">Establishments</span>
        </div>
        <div class="w-px h-8 bg-white/10 dark:bg-white/10 light:bg-gray-200 hidden sm:block" />
        <div class="flex flex-col items-center gap-1 group">
          <span class="text-2xl font-extrabold text-white dark:text-white light:text-gray-900 group-hover:text-emerald-400 transition-colors">98<span class="text-emerald-400">%</span></span>
          <span class="text-xs uppercase tracking-tighter font-bold">Retention</span>
        </div>
        <div class="w-px h-8 bg-white/10 dark:bg-white/10 light:bg-gray-200 hidden sm:block" />
        <div class="flex flex-col items-center gap-1 group">
          <div class="flex gap-0.5 mb-1 transition-transform group-hover:scale-110">
            <UIcon v-for="i in 5" :key="i" name="i-heroicons-star-solid" class="size-3.5 text-yellow-500" />
          </div>
          <span class="text-xs uppercase tracking-tighter font-bold">User Rating</span>
        </div>
      </div>

      <!-- Preview card -->
      <div class="float-anim relative mx-auto w-full max-w-5xl">
        <!-- Outer glow -->
        <div class="absolute -inset-6 bg-emerald-500/8 dark:bg-emerald-500/8 light:bg-emerald-500/5 blur-3xl rounded-full" />
        <div class="absolute -inset-4 rounded-3xl border border-emerald-500/10 dark:border-emerald-500/10 light:border-emerald-500/5" style="animation: spin-slow 20s linear infinite;" />

        <!-- Card -->
        <div class="relative p-[1px] rounded-2xl bg-gradient-to-br from-emerald-500/25 via-white/5 to-purple-500/10 dark:from-emerald-500/25 dark:via-white/5 light:from-gray-200 light:via-white shadow-2xl shine group transition-all duration-500">
          <div class="rounded-[15px] overflow-hidden bg-app-bg/90 dark:bg-app-bg/90 light:bg-white backdrop-blur-sm transition-colors duration-500">
            <!-- Browser bar -->
            <div class="h-9 bg-app-section dark:bg-app-section light:bg-gray-50 flex items-center px-4 gap-2 border-b border-white/5 dark:border-white/5 light:border-gray-100 shrink-0">
              <div class="flex gap-1.5">
                <div class="size-2.5 rounded-full bg-red-500/40" />
                <div class="size-2.5 rounded-full bg-yellow-500/40" />
                <div class="size-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <div class="flex-1 mx-4 h-5 rounded-md bg-white/5 dark:bg-white/5 light:bg-gray-200/50 flex items-center px-3 gap-2">
                <UIcon name="i-heroicons-lock-closed" class="size-3 text-gray-700" />
                <span class="text-[11px] text-gray-700 font-medium">sky-menu.app/menu/habesha-bistro</span>
              </div>
              <UIcon name="i-heroicons-arrow-path" class="size-3.5 text-gray-700" />
            </div>
            <img
              src="/demo/images/landing/screen-1.png"
              alt="SKy Menu Dashboard Preview"
              class="w-full h-auto transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </div>
        </div>

        <!-- Floating indicators -->
        <div class="absolute -left-4 sm:-left-12 top-1/4 bg-app-section dark:bg-app-section light:bg-white border border-white/10 dark:border-white/10 light:border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md animate-bounce-slow">
          <div class="size-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <UIcon name="i-heroicons-banknotes" class="size-5 text-emerald-400 light:text-emerald-600" />
          </div>
          <div class="text-left">
            <p class="text-[10px] text-gray-500 dark:text-gray-500 light:text-gray-400 font-bold uppercase tracking-wider">Top Cuisine</p>
            <p class="text-sm font-extrabold text-white dark:text-white light:text-gray-900">Ethiopian Kitfo</p>
          </div>
        </div>

        <div class="absolute -right-4 sm:-right-12 bottom-1/3 bg-app-section dark:bg-app-section light:bg-white border border-white/10 dark:border-white/10 light:border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md animate-bounce-slow" style="animation-delay: 1.5s;">
          <div class="size-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <UIcon name="i-heroicons-qr-code" class="size-5 text-purple-400 light:text-purple-600" />
          </div>
          <div class="text-left">
            <p class="text-[10px] text-gray-500 dark:text-gray-500 light:text-gray-400 font-bold uppercase tracking-wider">Instant Scan</p>
            <p class="text-sm font-extrabold text-white dark:text-white light:text-gray-900">Fast & Seamless</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function scrollToFeatures() {
  const el = document.querySelector('#features')
  el?.scrollIntoView({ behavior: 'smooth' })
}
</script>
