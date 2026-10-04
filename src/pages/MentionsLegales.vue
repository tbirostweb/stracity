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
          <li>Nom ou dénomination : Théo Birost — nom commercial « Birostweb »</li>
          <li>Statut / forme juridique et numéro d'immatriculation : Entrepreneur individuel (EI) — SIREN 108 892 993 · SIRET (siège) 108 892 993 00016</li>
          <li>Adresse : 6 rue Georges Guynemer, 10450 Bréviandes</li>
          <li>Contact : contact@theo-birost.fr</li>
          <li>Directeur de la publication : Théo Birost</li>
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
        <h3 class="text-xl font-bold mt-4 mb-2">Crédits</h3>
        <p>
          Police d'affichage Silkscreen, © The Silkscreen Project Authors, licence SIL Open Font License 1.1,
          diffusée avec le site. Le site est construit avec Vue, Vue Router et Tailwind CSS (licence MIT).
        </p>
      </section>
    </main>
    <Footer />
  </div>
</template>
