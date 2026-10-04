<script setup>
import Navigation from "../components/Navigation.vue";
import Footer from "../components/Footer.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[var(--bg-dark)] text-[var(--secondary-color)]">
    <Navigation />
    <main class="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
      <h1 class="text-5xl md:text-7xl font-extrabold pixel-perfect glow-text mb-4">404</h1>
      <p class="text-lg md:text-2xl pixel-perfect mt-4">Cette page n'existe pas.</p>
      <router-link
          to="/accueil"
          class="mt-10 inline-block bg-[var(--secondary-color)] text-[var(--bg-dark)] px-8 py-4 rounded-lg font-bold pixel-perfect"
      >
        Retour à l'accueil
      </router-link>
    </main>
    <Footer />
  </div>
</template>
