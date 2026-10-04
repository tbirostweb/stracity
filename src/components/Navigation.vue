<script setup>

</script>

<template>
  <nav aria-label="Navigation principale">
    <div class="flex flex-row items-center bg-[var(--bg-dark)] p-4 border-b border-[var(--border-color)] shadow-[0_0_20px_var(--glow-shadow),inset_0_0_20px_rgba(0,0,0,0.8)]">
      <div class="flex flex-row justify-between w-full items-center">
        <router-link to="/accueil" class="text-[var(--secondary-color)] text-2xl font-extrabold glow-text pixel-perfect" aria-label="Stracity, retour à l\'accueil">stracity</router-link>
        <div class="flex flex-row space-x-3 sm:space-x-8 text-[var(--secondary-color)] text-sm sm:text-lg font-extrabold glow-text pixel-perfect">

          <router-link
              to="/accueil"
              >
          <span class="relative z-10 flex items-center gap-2">
            Accueil
          </span>

          </router-link>

          <router-link
              to="/jeux"
          >
          <span class="relative z-10 flex items-center gap-2">
            Jeux
          </span>

          </router-link>

          <router-link
              to="/contact"
          >
          <span class="relative z-10 flex items-center gap-2">
            Contact
          </span>

          </router-link>

        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>