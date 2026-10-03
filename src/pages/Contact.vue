<script setup>
import Navigation from "../components/Navigation.vue";
</script>

<template>
  <div class="min-h-screen bg-[var(--bg-dark)] text-[var(--secondary-color)]">
    <Navigation />

    <section
        class="flex flex-col items-center justify-center  px-6 text-center relative overflow-hidden"
    >
      <div class="relative z-10 animate-fade-in">
        <h1
            class="text-5xl md:text-7xl lg:text-8xl font-extrabold pixel-perfect glow-text mb-4"
        >
          Contact
        </h1>

        <p
            class="text-lg md:text-2xl font-semibold pixel-perfect mt-6 opacity-90"
        >
          Une idée de jeu en tête ?
        </p>

        <p
            class="text-base md:text-xl mt-4 max-w-3xl leading-relaxed pixel-perfect opacity-80"
        >
          Fais-le moi savoir en m'envoyant un petit message.
        </p>
      </div>
    </section>

    <section class="flex justify-center py-16 px-6">
      <form
          class="w-full max-w-xl bg-[var(--bg-light)] p-8 rounded-2xl shadow-xl flex flex-col gap-6"
      >
        <div class="flex flex-col text-left">
          <label for="email" class="font-bold mb-1 pixel-perfect">Email :</label>
          <input
              type="email"
              id="email"
              name="email"
              required
              class="p-3 rounded-lg bg-[var(--bg-dark)] border border-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] pixel-perfect"
          />
        </div>

        <div class="flex flex-col text-left">
          <label for="message" class="font-bold mb-1 pixel-perfect">Message :</label>
          <textarea
              id="message"
              name="message"
              rows="6"
              required
              class="p-3 rounded-lg bg-[var(--bg-dark)] border border-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] pixel-perfect"
          ></textarea>
        </div>

        <button
            type="submit"
            class="mt-4 py-3 rounded-xl border-2 border-[var(--secondary-color)] text-[var(--secondary-color)] font-bold pixel-perfect hover:bg-[var(--secondary-color)] hover:text-[var(--bg-dark)] transition-all duration-300"
        >
          Envoyer
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease forwards;
}
</style>
