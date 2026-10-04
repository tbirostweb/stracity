<script setup>
import Navigation from "../components/Navigation.vue";
import Footer from "../components/Footer.vue";
const placeholder = (label) => `[À COMPLÉTER : ${label}]`;
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[var(--bg-dark)] text-[var(--secondary-color)]">
    <Navigation />
    <main class="flex-1 px-6 py-12 max-w-3xl mx-auto w-full pixel-perfect">
      <h1 class="text-4xl font-extrabold glow-text mb-8">Confidentialité</h1>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Responsable du traitement</h2>
        <p>{{ placeholder("identité et contact du responsable, voir mentions légales") }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Ce que fait le site</h2>
        <p>
          Le site est composé de pages statiques et de mini-jeux exécutés dans le navigateur.
          Il ne crée pas de compte, n'utilise ni cookie ni stockage local de suivi et n'intègre
          aucun outil de mesure d'audience. La police d'affichage est servie par le site lui-même :
          aucune requête vers un service de polices tiers n'est émise par les pages.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Journaux du serveur</h2>
        <p>
          Comme tout serveur web, l'hébergement peut enregistrer l'adresse IP, la date, la page
          demandée et le navigateur des visiteurs à des fins de sécurité et de bon fonctionnement.
          Les adresses de page enregistrées ne contiennent pas les paramètres de requête.
          Durée de conservation : {{ placeholder("durée de conservation des journaux, à confirmer côté hébergement") }}.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Formulaire de contact</h2>
        <p>
          Le formulaire de contact n'est pas actif : aucune donnée saisie n'est transmise ni conservée.
          Avant son activation, cette page devra préciser : finalité, base légale, destinataires,
          durée de conservation {{ placeholder("à définir par l'exploitant au moment de l'activation") }}.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold mb-2">Vos droits</h2>
        <p>
          Conformément au RGPD, vous pouvez demander l'accès, la rectification ou l'effacement de
          vos données, et introduire une réclamation auprès de la CNIL (cnil.fr).
          Pour exercer vos droits : {{ placeholder("adresse de contact de l'exploitant") }}.
        </p>
      </section>
    </main>
    <Footer />
  </div>
</template>
