<script setup>
import Navigation from "../components/Navigation.vue";
</script>

<template>
  <div class="max-h-screen overflow-hidden">
    <Navigation />

    <section
        class="relative flex flex-col items-center justify-center h-screen bg-[var(--bg-dark)] px-6 text-center overflow-hidden"
    >

      <div class="relative z-10 -up">
        <h1
            class="text-[var(--secondary-color)] text-5xl md:text-7xl lg:text-8xl font-extrabold pixel-perfect glow-text mb-4"
        >
          BIENVENUE
        </h1>
        
        <p
            class="text-[var(--secondary-color)] text-lg md:text-2xl font-semibold pixel-perfect mt-6 opacity-90 "
        >
          Une petite envie de jouer ?
        </p>

        <p
            class="text-[var(--secondary-color)] text-base md:text-xl mt-4 max-w-3xl leading-relaxed pixel-perfect opacity-80 -delayed"
        >
          Découvre les mini-jeux et amuse-toi autant que tu veux !
        </p>

        <router-link
            to="/jeux"
            class="group relative inline-block mt-10 bg-[var(--secondary-color)] text-[var(--bg-dark)] px-8 py-4 rounded-lg font-bold text-lg pixel-perfect shadow-2xl hover:shadow-[0_0_30px_rgba(var(--secondary-color-rgb),0.5)] transition-all duration-300 -delayed-more overflow-hidden"
        >
          <span class="relative z-10 flex items-center gap-2">
            Direction les jeux !
            <span class="inline-block transition-transform duration-300 group-hover:translate-x-1">>></span>
          </span>

        </router-link>

      </div>
    </section>
  </div>
</template>

<style scoped>


</style>