<template>
  <div
    id="hero"
    class="relative flex flex-col overflow-hidden px-6 pt-24 lg:px-20 min-h-[80vh] justify-center"
  >
    <!-- Background Gradient -->
    <div class="absolute inset-0 bg-[#09090b]">
        <div class="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.1),transparent_50%)]" />
    </div>

    <div class="relative z-10 mx-auto max-w-7xl text-center">
      <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
        <span class="block text-gray-400 font-light">Elegance in every</span>
        Digital Menu Experience
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-gray-400 leading-relaxed font-normal">
        Elevate your restaurant with our Appetito-inspired digital menu platform. 
        Intuitive design, real-time updates, and stunning visual presentation.
      </p>
      
      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <UButton 
            label="Get Started" 
            size="xl" 
            color="emerald" 
            class="px-8 font-bold rounded-full"
            to="/auth/login"
        />
        <UButton 
            label="View Demo" 
            size="xl" 
            variant="ghost" 
            color="neutral" 
            class="px-8 font-bold rounded-full border border-white/10"
            to="/demo"
        />
      </div>
    </div>

    <!-- Hero Image / Preview Section -->
    <div class="relative z-10 mt-16 flex justify-center">
      <div class="relative w-full max-w-4xl p-2 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm">
        <img 
            src="/demo/images/landing/screen-1.png" 
            alt="Hero Image" 
            class="w-full h-auto rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
        />
      </div>
    </div>
  </div>
</template>
