<script setup>
import { ref } from "vue";
import Navigation from "../components/Navigation.vue";
import Footer from "../components/Footer.vue";

// [À COMPLÉTER : destinataire et canal d'envoi (endpoint POST HTTPS ou e-mail) à fournir par l'exploitant.]
// Tant qu'aucun canal n'est configuré, le formulaire n'envoie rien (ni GET, ni POST) : aucune donnée n'est placée dans l'URL.
const CONTACT_ENABLED = false;
const status = ref("");

const onSubmit = () => {
  if (!CONTACT_ENABLED) {
    status.value = "Le formulaire de contact n'est pas encore disponible : aucun message n'a été envoyé.";
  }
};
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
          method="post"
          novalidate
          @submit.prevent="onSubmit"
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

        <p
            v-if="!CONTACT_ENABLED"
            class="text-left pixel-perfect"
            data-testid="contact-indisponible"
        >
          Le formulaire n'est pas encore actif : aucun message ne sera envoyé.
        </p>
        <p v-if="status" role="status" class="text-left pixel-perfect" data-testid="contact-status">{{ status }}</p>

        <button
            type="submit"
            :disabled="!CONTACT_ENABLED"
            :aria-disabled="!CONTACT_ENABLED"
            
            class="mt-4 py-3 rounded-xl border-2 border-[var(--secondary-color)] text-[var(--secondary-color)] font-bold pixel-perfect hover:bg-[var(--secondary-color)] hover:text-[var(--bg-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Envoyer
        </button>
      </form>
    </section>
    <Footer />
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
