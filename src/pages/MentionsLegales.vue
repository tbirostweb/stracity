<script setup>
import Navigation from "../components/Navigation.vue";
import Footer from "../components/Footer.vue";
// Informations à fournir par l'exploitant : aucune valeur n'est inventée ici.
const placeholder = (label) => `[À COMPLÉTER : ${label}]`;
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[var(--bg-dark)] text-[var(--secondary-color)]">
    <Navigation />
    <main class="flex-1 px-6 py-12 max-w-3xl mx-auto w-full pixel-perfect">
      <h1 class="text-4xl font-extrabold glow-text mb-8">Mentions légales</h1>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Éditeur du site</h2>
        <ul class="space-y-1" data-testid="editeur">
          <li>Nom ou dénomination : {{ placeholder("nom de l'éditeur") }}</li>
          <li>Statut / forme juridique et numéro d'immatriculation : {{ placeholder("statut, SIREN/SIRET si applicable") }}</li>
          <li>Adresse : {{ placeholder("adresse de l'éditeur") }}</li>
          <li>Contact : {{ placeholder("e-mail ou moyen de contact de l'éditeur") }}</li>
          <li>Directeur de la publication : {{ placeholder("nom du directeur de la publication") }}</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Hébergeur</h2>
        <ul class="space-y-1" data-testid="hebergeur">
          <li>Nom : {{ placeholder("nom de l'hébergeur") }}</li>
          <li>Adresse et contact : {{ placeholder("coordonnées de l'hébergeur") }}</li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-bold mb-2">Propriété intellectuelle</h2>
        <p>{{ placeholder("conditions d'usage et de réutilisation du contenu, à définir par l'exploitant") }}</p>
      </section>
    </main>
    <Footer />
  </div>
</template>
