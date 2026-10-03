<script setup>
import { ref, computed } from 'vue';

const board = ref(Array(9).fill(null));
const currentPlayer = ref('X');
const winner = ref(null);
const isDraw = ref(false);
const winningLine = ref(null);
const scoreX = ref(0);
const scoreO = ref(0);

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const makeMove = (index) => {
  if (board.value[index] || winner.value || isDraw.value) return;

  board.value[index] = currentPlayer.value;

  checkWinner();

  if (!winner.value && !isDraw.value) {
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';
  }
};

const checkWinner = () => {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board.value[a] &&
        board.value[a] === board.value[b] &&
        board.value[a] === board.value[c]) {
      winner.value = board.value[a];
      winningLine.value = combo;
      if (winner.value === 'X') scoreX.value++;
      else scoreO.value++;
      return;
    }
  }

  if (board.value.every(cell => cell !== null)) {
    isDraw.value = true;
  }
};

const resetGame = () => {
  board.value = Array(9).fill(null);
  currentPlayer.value = 'X';
  winner.value = null;
  isDraw.value = false;
  winningLine.value = null;
};

const resetScores = () => {
  scoreX.value = 0;
  scoreO.value = 0;
  resetGame();
};

const statusMessage = computed(() => {
  if (winner.value) return `Joueur ${winner.value} gagne !`;
  if (isDraw.value) return 'Match nul !';
  return `Tour de ${currentPlayer.value}`;
});
</script>

<template>
  <div class="flex items-center justify-center h-full p-8 gap-8" style="background-color: var(--bg-dark);">

    <!-- Panneau gauche - Scores -->
    <div class="flex flex-col gap-6 w-64">
      <div class="text-center p-4 border-2 rounded-lg" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <h2 class="text-3xl font-bold glow-text pixel-perfect mb-3" style="color: var(--secondary-color);">
          {{ statusMessage }}
        </h2>
        <p class="text-sm mb-4" style="color: var(--text-secondary);">
          <span v-if="!winner && !isDraw">» À vous de jouer</span>
          <span v-else>» Partie terminée</span>
        </p>
      </div>

      <div class="p-4 border-2 rounded-lg" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <h3 class="text-xl font-bold glow-text pixel-perfect mb-3 text-center" style="color: var(--secondary-color);">
          SCORES
        </h3>
        <div class="flex flex-col gap-3">
          <div class="flex justify-between items-center p-2 border rounded"
               :style="{
                 borderColor: currentPlayer === 'X' ? 'var(--secondary-color)' : 'var(--border-color)',
                 backgroundColor: currentPlayer === 'X' ? 'var(--bg-dark)' : 'transparent'
               }">
            <span class="text-2xl font-bold" style="color: var(--secondary-color);">X</span>
            <span class="text-xl font-bold" style="color: var(--text-primary);">{{ scoreX }}</span>
          </div>
          <div class="flex justify-between items-center p-2 border rounded"
               :style="{
                 borderColor: currentPlayer === 'O' ? 'var(--glow-primary)' : 'var(--border-color)',
                 backgroundColor: currentPlayer === 'O' ? 'var(--bg-dark)' : 'transparent'
               }">
            <span class="text-2xl font-bold" style="color: var(--glow-primary);">O</span>
            <span class="text-xl font-bold" style="color: var(--text-primary);">{{ scoreO }}</span>
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

        <button
            @click="resetScores"
            class="w-full px-4 py-2 border-2 rounded-lg transition-all duration-300 hover:glow-box pixel-perfect font-bold text-sm"
            style="background-color: var(--bg-medium); border-color: var(--border-color); color: var(--text-dim);"
        >
          ✕ RESET SCORES
        </button>
      </div>
    </div>

    <!-- Grille de jeu (centre) -->
    <div class="p-6 border-3 rounded-lg shadow-[0_0_20px_var(--glow-shadow),inset_0_0_20px_rgba(0,0,0,0.8)]" style="background-color: var(--primary-color); border-color: var(--border-color);">
      <div class="grid grid-cols-3 gap-4">
        <button
            v-for="(cell, index) in board"
            :key="index"
            @click="makeMove(index)"
            class="w-28 h-28 border-2 rounded-lg text-6xl font-bold pixel-perfect transition-all duration-300 hover:shadow-[0_0_20px_var(--glow-shadow),inset_0_0_20px_rgba(165,199,89,0.1)] disabled:cursor-not-allowed relative"
            :style="{
              backgroundColor: 'var(--bg-dark)',
              borderColor: winningLine && winningLine.includes(index) ? 'var(--glow-primary)' : 'var(--accent-color)',
              color: cell === 'X' ? 'var(--secondary-color)' : 'var(--glow-primary)',
              boxShadow: winningLine && winningLine.includes(index) ? '0 0 20px var(--glow-shadow), inset 0 0 20px rgba(165,199,89,0.2)' : ''
            }"
            :disabled="cell !== null || winner || isDraw"
            :class="{ 'glow-text': cell !== null }"
        >
          {{ cell || '' }}
        </button>
      </div>
    </div>

    <!-- Panneau droite - Instructions -->
    <div class="w-64 flex flex-col gap-4">
      <div class="p-4 border-2 rounded-lg" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <h3 class="text-xl font-bold glow-text pixel-perfect mb-3" style="color: var(--secondary-color);">
          COMMENT JOUER
        </h3>
        <div class="flex flex-col gap-2 text-xs" style="color: var(--text-dim);">
          <p>• Cliquez sur une case vide</p>
          <p>• Alignez 3 symboles</p>
          <p>• Horizontal, vertical ou diagonal</p>
          <p>• Le premier à aligner gagne</p>
        </div>
      </div>

      <div class="p-4 border-2 rounded-lg" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <h3 class="text-xl font-bold glow-text pixel-perfect mb-3" style="color: var(--secondary-color);">
          SYMBOLES
        </h3>
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3 p-2 border rounded" style="border-color: var(--border-color);">
            <span class="text-3xl font-bold" style="color: var(--secondary-color);">X</span>
            <span class="text-xs" style="color: var(--text-dim);">Joueur 1</span>
          </div>
          <div class="flex items-center gap-3 p-2 border rounded" style="border-color: var(--border-color);">
            <span class="text-3xl font-bold" style="color: var(--glow-primary);">O</span>
            <span class="text-xs" style="color: var(--text-dim);">Joueur 2</span>
          </div>
        </div>
      </div>

      <div class="flex justify-center p-3 border-2 rounded-lg text-center" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <p class="text-xs" style="color: var(--secondary-color);">
          <router-link
              to="/Contact"
          >
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