<script setup>
import { ref, computed, onUnmounted } from 'vue';

const pendingTimers = new Set();
const later = (callback, delay) => {
  const timer = setTimeout(() => { pendingTimers.delete(timer); callback(); }, delay);
  pendingTimers.add(timer);
};
const clearTimers = () => { pendingTimers.forEach(clearTimeout); pendingTimers.clear(); };
onUnmounted(clearTimers);

const gridSize = 4; // Grille 4x4 = 16 cartes (8 paires)
const cards = ref([]);
const flippedCards = ref([]);
const matchedCards = ref([]);
const moves = ref(0);
const gameStarted = ref(false);
const gameWon = ref(false);
const canFlip = ref(true);

// Symboles pour les paires de cartes
const symbols = ['♠', '♣', '♥', '♦', '★', '●', '■', '▲'];

const initGame = () => {
  clearTimers();
  // Créer les paires de cartes
  const cardPairs = [];
  symbols.forEach((symbol, index) => {
    cardPairs.push({ id: index * 2, symbol, matched: false });
    cardPairs.push({ id: index * 2 + 1, symbol, matched: false });
  });

  // Mélanger les cartes
  for (let i = cardPairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
  }
  cards.value = cardPairs;
  flippedCards.value = [];
  matchedCards.value = [];
  moves.value = 0;
  gameStarted.value = false;
  gameWon.value = false;
  canFlip.value = true;
};

const flipCard = (card) => {
  if (!canFlip.value) return;
  if (flippedCards.value.includes(card.id)) return;
  if (matchedCards.value.includes(card.id)) return;

  if (!gameStarted.value) gameStarted.value = true;

  flippedCards.value.push(card.id);

  if (flippedCards.value.length === 2) {
    moves.value++;
    canFlip.value = false;

    const [firstId, secondId] = flippedCards.value;
    const firstCard = cards.value.find(c => c.id === firstId);
    const secondCard = cards.value.find(c => c.id === secondId);

    if (firstCard.symbol === secondCard.symbol) {
      // Paire trouvée
      later(() => {
        matchedCards.value.push(firstId, secondId);
        flippedCards.value = [];
        canFlip.value = true;

        // Vérifier si toutes les paires sont trouvées
        if (matchedCards.value.length === cards.value.length) {
          gameWon.value = true;
        }
      }, 500);
    } else {
      // Pas de correspondance
      later(() => {
        flippedCards.value = [];
        canFlip.value = true;
      }, 1000);
    }
  }
};

const isFlipped = (cardId) => {
  return flippedCards.value.includes(cardId) || matchedCards.value.includes(cardId);
};

const isMatched = (cardId) => {
  return matchedCards.value.includes(cardId);
};

const resetGame = () => {
  initGame();
};

const statusMessage = computed(() => {
  if (gameWon.value) return 'VICTOIRE !';
  if (!gameStarted.value) return 'PRÊT À JOUER';
  return `COUPS : ${moves.value}`;
});

const pairsFound = computed(() => {
  return matchedCards.value.length / 2;
});

// Initialiser le jeu au montage
initGame();
</script>

<template>
  <div class="flex items-center justify-center h-full p-8 gap-8" style="background-color: var(--bg-dark);">

    <!-- Panneau gauche - Statut -->
    <div class="flex flex-col gap-6 w-64">
      <div class="text-center p-4 border-2 rounded-lg" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <h2 class="text-3xl font-bold glow-text pixel-perfect mb-2" style="color: var(--secondary-color);">
          {{ statusMessage }}
        </h2>
        <p class="text-sm mb-3" style="color: var(--text-secondary);">
          <span v-if="!gameStarted">» Cliquez pour commencer</span>
          <span v-else-if="gameStarted && !gameWon">» Trouvez les paires</span>
          <span v-else>» Bien joué !</span>

        </p>
        <div class="flex flex-col gap-2 text-sm" style="color: var(--text-dim);">
          <div class="flex justify-between">
            <span>Coups:</span>
            <span style="color: var(--text-primary);">{{ moves }}</span>
          </div>
          <div class="flex justify-between">
            <span>Paires:</span>
            <span style="color: var(--text-primary);">{{ pairsFound }}/8</span>
          </div>
          <div class="flex justify-between">
            <span>Restantes:</span>
            <span style="color: var(--text-primary);">{{ 8 - pairsFound }}</span>
          </div>
        </div>
      </div>

      <!-- Contrôles -->
      <div class="flex flex-col gap-3">
        <button
            @click="resetGame"
            class="w-full px-4 py-3 border-2 rounded-lg transition-all duration-300 hover:glow-box pixel-perfect font-bold"
            style="background-color: var(--bg-medium); border-color: var(--border-color); color: var(--text-primary);"
        >
          ↻ NOUVELLE PARTIE
        </button>
      </div>
    </div>

    <!-- Grille de jeu (centre) -->
    <div
        class="relative p-4 border-3 rounded-lg shadow-[0_0_20px_var(--glow-shadow),inset_0_0_20px_rgba(0,0,0,0.8)]"
        style="background-color: var(--primary-color); border-color: var(--border-color);"
    >
      <div class="grid grid-cols-4 gap-3" style="width: 424px; height: 424px;">
        <button
            v-for="card in cards"
            :key="card.id"
            @click="flipCard(card)"
            class="border-2 rounded-lg text-5xl font-bold pixel-perfect transition-all duration-300 hover:shadow-[0_0_20px_var(--glow-shadow),inset_0_0_20px_rgba(165,199,89,0.1)] relative overflow-hidden"
            style="width: 100px; height: 100px;"
            :style="{
              backgroundColor: isFlipped(card.id) ? 'var(--bg-dark)' : 'var(--bg-medium)',
              borderColor: isMatched(card.id) ? 'var(--glow-primary)' : 'var(--accent-color)',
              color: 'var(--secondary-color)',
              cursor: isMatched(card.id) || flippedCards.includes(card.id) ? 'default' : 'pointer'
            }"
            :class="{ 'glow-text': isFlipped(card.id) }"
            :disabled="!canFlip && !isFlipped(card.id)"
        >
          <!-- Face cachée -->
          <div
              v-if="!isFlipped(card.id)"
              class="absolute inset-0 flex items-center justify-center"
              style="color: var(--text-dim);"
          >
            ?
          </div>

          <!-- Face visible -->
          <div
              v-else
              class="absolute inset-0 flex items-center justify-center"
              :class="{ 'glow-box': isMatched(card.id) }"
          >
            {{ card.symbol }}
          </div>
        </button>
      </div>

      <!-- Overlay Victoire -->
      <div
          v-if="gameWon"
          class="absolute inset-0 flex items-center justify-center rounded-lg"
          style="background-color: rgba(10, 14, 10, 0.95);"
      >
        <div class="text-center p-8">
          <p class="text-5xl font-bold glow-text pixel-perfect mb-4" style="color: var(--glow-primary);">
            🎉 BRAVO !
          </p>
          <p class="text-2xl mb-2" style="color: var(--text-secondary);">
            Partie terminée en {{ moves }} coups
          </p>
          <p class="text-lg" style="color: var(--text-dim);">
            Toutes les paires trouvées !
          </p>
        </div>
      </div>
    </div>

    <!-- Panneau droite - Instructions -->
    <div class="w-64 flex flex-col gap-4">
      <div class="p-4 border-2 rounded-lg" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <h3 class="text-xl font-bold glow-text pixel-perfect mb-3" style="color: var(--secondary-color);">
          COMMENT JOUER
        </h3>
        <div class="flex flex-col gap-2 text-xs" style="color: var(--text-dim);">
          <p>• Cliquez sur une carte</p>
          <p>• Cliquez sur une seconde</p>
          <p>• Trouvez les paires</p>
          <p>• Mémorisez les positions</p>
        </div>
      </div>

      <div class="p-4 border-2 rounded-lg" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <h3 class="text-xl font-bold glow-text pixel-perfect mb-3" style="color: var(--secondary-color);">
          OBJECTIF
        </h3>
        <div class="flex flex-col gap-2 text-xs" style="color: var(--text-dim);">
          <p>• 8 paires à trouver</p>
          <p>• 16 cartes au total</p>
          <p>• Moins de coups = mieux</p>
          <p>• Testez votre mémoire !</p>
        </div>
      </div>

      <div class="flex justify-center p-3 border-2 rounded-lg text-center" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <p class="text-xs" style="color: var(--secondary-color);">
          <router-link to="/Contact">
            <span class="relative z-10 flex items-center gap-2">
              Contact >>
            </span>
          </router-link>
        </p>
      </div>
    </div>

  </div>
</template>

<style scoped>
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.animate-blink {
  animation: blink 1s step-end infinite;
}
</style>