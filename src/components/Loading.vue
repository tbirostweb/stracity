<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const progress = ref(0);

onMounted(() => {

  const interval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += Math.random() * 15;
      if (progress.value > 100) progress.value = 100;

      if (progress.value >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          router.push('/accueil');
        }, 300);
      }
    }
  }, 350);
});
</script>

<template>
  <div class="bg-[var(--bg-dark)] min-h-screen flex flex-col justify-center items-center gap-12 p-8">

    <div class="text-center">
      <h1 class="text-[var(--secondary-color)] text-7xl font-extrabold glow-text pixel-perfect mb-4 animate-pulse">
        CHARGEMENT
      </h1>
      <h1 class="text-[var(--secondary-color)] text-4xl font-extrabold glow-text pixel-perfect mb-4 animate-pulse">DE</h1>
      <h1 class="text-[var(--secondary-color)] text-7xl font-extrabold glow-text pixel-perfect mb-4 animate-pulse">STRACITY</h1>
      <p class="text-[var(--text-secondary)] text-xl glow-text">
        {{ Math.floor(progress) }}%
      </p>
    </div>

    <div class="relative w-full max-w-[600px] p-1">
      <div class="relative bg-[var(--primary-color)] border-3 border-[var(--border-color)] rounded-lg p-2 shadow-[0_0_20px_var(--glow-shadow),inset_0_0_20px_rgba(0,0,0,0.8)] overflow-hidden">
        <div class="relative w-full h-10 bg-[var(--bg-dark)] border-2 border-[var(--accent-color)] rounded overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.9)]">
          <div
              class="relative h-full transition-all duration-300 ease-out border-r-2 border-[var(--glow-primary)]"
              :style="{
                width: progress + '%',
                background: 'linear-gradient(90deg, var(--accent-color) 0%, var(--secondary-color) 50%, var(--glow-primary) 100%)',
                boxShadow: '0 0 20px var(--glow-shadow), 0 0 40px var(--glow-shadow), inset 0 0 10px rgba(255, 255, 255, 0.2)',
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0, 0, 0, 0.1) 10px, rgba(0, 0, 0, 0.1) 20px)'
              }"
          >
            <div class="absolute inset-0 animate-scan bg-gradient-to-r from-transparent via-[var(--glow-primary)] to-transparent opacity-40"></div>
          </div>
        </div>

        <div class="absolute inset-0 pointer-events-none opacity-30" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(165, 199, 89, 0.1) 2px, rgba(165, 199, 89, 0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(165, 199, 89, 0.1) 2px, rgba(165, 199, 89, 0.1) 4px)"></div>
      </div>

      <div class="absolute -top-0.5 -left-0.5 w-4 h-4 border-2 border-[var(--secondary-color)] border-r-0 border-b-0 rounded-tl "></div>
      <div class="absolute -top-0.5 -right-0.5 w-4 h-4 border-2 border-[var(--secondary-color)] border-l-0 border-b-0 rounded-tr "></div>
      <div class="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-2 border-[var(--secondary-color)] border-r-0 border-t-0 rounded-bl "></div>
      <div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-2 border-[var(--secondary-color)] border-l-0 border-t-0 rounded-br "></div>
    </div>

    <div class="text-center">
      <span class="text-[var(--text-dim)] text-lg ">
        <span v-if="progress < 30">» Initialisation des systèmes...</span>
        <span v-else-if="progress < 60">» Chargement des ressources...</span>
        <span v-else-if="progress < 90">» Finalisation...</span>
        <span v-else>» Redirection...</span>
        <span class="inline-block animate-blink">_</span>
      </span>
    </div>

  </div>
</template>

<style scoped>
@keyframes scan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-scan {
  animation: scan 3s linear infinite;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.animate-blink {
  animation: blink 1s step-end infinite;
}
</style>