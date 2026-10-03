<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const gridSize = 4;
const grid = ref([]);
const score = ref(0);
const bestScore = ref(0);
const gameOver = ref(false);
const gameWon = ref(false);
const gameStarted = ref(false);

const initGrid = () => {
  grid.value = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
  score.value = 0;
  gameOver.value = false;
  gameWon.value = false;
  gameStarted.value = false;
  addRandomTile();
  addRandomTile();
};

const addRandomTile = () => {
  const emptyCells = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid.value[i][j] === 0) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }

  if (emptyCells.length > 0) {
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid.value[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
};

const move = (direction) => {
  if (gameOver.value || gameWon.value) return;

  if (!gameStarted.value) gameStarted.value = true;

  let moved = false;
  const newGrid = grid.value.map(row => [...row]);

  if (direction === 'left') {
    for (let i = 0; i < gridSize; i++) {
      const row = newGrid[i].filter(cell => cell !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          score.value += row[j];
          if (row[j] === 2048) gameWon.value = true;
          row.splice(j + 1, 1);
        }
      }
      while (row.length < gridSize) row.push(0);
      if (JSON.stringify(newGrid[i]) !== JSON.stringify(row)) moved = true;
      newGrid[i] = row;
    }
  } else if (direction === 'right') {
    for (let i = 0; i < gridSize; i++) {
      const row = newGrid[i].filter(cell => cell !== 0);
      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          score.value += row[j];
          if (row[j] === 2048) gameWon.value = true;
          row.splice(j - 1, 1);
          j--;
        }
      }
      while (row.length < gridSize) row.unshift(0);
      if (JSON.stringify(newGrid[i]) !== JSON.stringify(row)) moved = true;
      newGrid[i] = row;
    }
  } else if (direction === 'up') {
    for (let j = 0; j < gridSize; j++) {
      const col = newGrid.map(row => row[j]).filter(cell => cell !== 0);
      for (let i = 0; i < col.length - 1; i++) {
        if (col[i] === col[i + 1]) {
          col[i] *= 2;
          score.value += col[i];
          if (col[i] === 2048) gameWon.value = true;
          col.splice(i + 1, 1);
        }
      }
      while (col.length < gridSize) col.push(0);
      const oldCol = newGrid.map(row => row[j]);
      if (JSON.stringify(oldCol) !== JSON.stringify(col)) moved = true;
      col.forEach((val, i) => newGrid[i][j] = val);
    }
  } else if (direction === 'down') {
    for (let j = 0; j < gridSize; j++) {
      const col = newGrid.map(row => row[j]).filter(cell => cell !== 0);
      for (let i = col.length - 1; i > 0; i--) {
        if (col[i] === col[i - 1]) {
          col[i] *= 2;
          score.value += col[i];
          if (col[i] === 2048) gameWon.value = true;
          col.splice(i - 1, 1);
          i--;
        }
      }
      while (col.length < gridSize) col.unshift(0);
      const oldCol = newGrid.map(row => row[j]);
      if (JSON.stringify(oldCol) !== JSON.stringify(col)) moved = true;
      col.forEach((val, i) => newGrid[i][j] = val);
    }
  }

  if (moved) {
    grid.value = newGrid;
    addRandomTile();
    checkGameOver();
    if (score.value > bestScore.value) {
      bestScore.value = score.value;
    }
  }
};

const checkGameOver = () => {
  // Vérifier s'il reste des cases vides
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid.value[i][j] === 0) return;
    }
  }

  // Vérifier s'il reste des mouvements possibles
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const current = grid.value[i][j];
      if (
          (i < gridSize - 1 && grid.value[i + 1][j] === current) ||
          (j < gridSize - 1 && grid.value[i][j + 1] === current)
      ) {
        return;
      }
    }
  }

  gameOver.value = true;
};

const handleKeyPress = (event) => {
  const keyMap = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'z': 'up',
    's': 'down',
    'q': 'left',
    'd': 'right'
  };

  const direction = keyMap[event.key];
  if (direction) {
    event.preventDefault();
    move(direction);
  }
};

const getTileColor = (value) => {
  const colors = {
    0: 'var(--bg-dark)',
    2: '#1A2418',
    4: '#253420',
    8: '#3D4A2F',
    16: '#4A5C38',
    32: '#5C7340',
    64: '#6D8449',
    128: '#8BA84E',
    256: '#A5C759',
    512: '#BFD96B',
    1024: '#C5E86C',
    2048: '#D4E89E'
  };
  return colors[value] || 'var(--glow-primary)';
};

const getTileTextColor = (value) => {
  if (value === 0) return 'transparent';
  if (value <= 4) return 'var(--text-primary)';
  if (value <= 16) return 'var(--glow-primary)';
  return 'var(--bg-dark)';
};

const getTileSize = (value) => {
  if (value >= 1000) return 'text-2xl lg:text-3xl';
  if (value >= 100) return 'text-3xl lg:text-4xl';
  return 'text-4xl lg:text-5xl';
};

const statusMessage = computed(() => {
  if (gameWon.value) return 'VICTOIRE !';
  if (gameOver.value) return 'GAME OVER !';
  if (!gameStarted.value) return 'PRÊT À JOUER';
  return `SCORE : ${score.value}`;
});

const resetGame = () => {
  initGrid();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
  initGrid();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<template>
  <div class="flex items-center justify-center min-h-full p-4 lg:p-8 gap-4 lg:gap-8 overflow-auto" style="background-color: var(--bg-dark);">

    <!-- Panneau gauche - Statut -->
    <div class="flex flex-col gap-4 lg:gap-6 w-56 lg:w-64 flex-shrink-0">
      <div class="text-center p-3 lg:p-4 border-2 rounded-lg" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <h2 class="text-2xl lg:text-3xl font-bold glow-text pixel-perfect mb-2" style="color: var(--secondary-color);">
          {{ statusMessage }}
        </h2>
        <p class="text-xs lg:text-sm mb-2 lg:mb-3" style="color: var(--text-secondary);">
          <span v-if="!gameStarted">» Utilisez les flèches</span>
          <span v-else-if="gameStarted && !gameOver && !gameWon">» Combinez les tuiles</span>
          <span v-else-if="gameWon">» Vous avez gagné !</span>
        </p>
        <div class="flex flex-col gap-1 lg:gap-2 text-xs lg:text-sm" style="color: var(--text-dim);">
          <div class="flex justify-between">
            <span>Score:</span>
            <span style="color: var(--text-primary);">{{ score }}</span>
          </div>
          <div class="flex justify-between">
            <span>Meilleur:</span>
            <span style="color: var(--text-primary);">{{ bestScore }}</span>
          </div>
        </div>
      </div>


      <div class="flex flex-col gap-2 lg:gap-3">
        <button
            @click="resetGame"
            class="w-full px-3 lg:px-4 py-2 lg:py-3 border-2 rounded-lg transition-all duration-300 hover:glow-box pixel-perfect font-bold text-sm lg:text-base"
            style="background-color: var(--bg-medium); border-color: var(--border-color); color: var(--text-primary);"
        >
          ↻ NOUVELLE PARTIE
        </button>
      </div>
    </div>


    <div
        class="relative p-3 lg:p-4 border-3 rounded-lg shadow-[0_0_20px_var(--glow-shadow),inset_0_0_20px_rgba(0,0,0,0.8)] flex-shrink-0"
        style="background-color: var(--primary-color); border-color: var(--border-color);"
    >
      <div class="grid grid-cols-4 gap-2 lg:gap-3" style="width: 336px; height: 336px;">
        <template v-for="(row, i) in grid" :key="i">
          <div
              v-for="(cell, j) in row"
              :key="`${i}-${j}`"
              class="flex items-center justify-center border-2 rounded-lg font-bold pixel-perfect transition-all duration-200"
              style="width: 76px; height: 76px;"
              :style="{
                backgroundColor: getTileColor(cell),
                borderColor: cell > 0 ? 'var(--border-color)' : 'var(--accent-color)',
                color: getTileTextColor(cell)
              }"
              :class="[getTileSize(cell), { 'glow-box': cell >= 128 }]"
          >
            {{ cell > 0 ? cell : '' }}
          </div>
        </template>
      </div>

      <div
          v-if="gameWon || gameOver"
          class="absolute inset-0 flex items-center justify-center rounded-lg"
          style="background-color: rgba(10, 14, 10, 0.95);"
      >
        <div class="text-center p-8">
          <p class="text-3xl lg:text-5xl font-bold glow-text pixel-perfect mb-2 lg:mb-4" style="color: var(--glow-primary);">
            {{ gameWon ? ' VICTOIRE !' : ' GAME OVER' }}
          </p>
          <p class="text-lg lg:text-2xl mb-2" style="color: var(--text-secondary);">
            Score final : {{ score }}
          </p>
          <p class="text-sm lg:text-lg" style="color: var(--text-dim);">
            {{ gameWon ? 'Vous avez atteint 2048 !' : 'Plus de mouvements possibles' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Panneau droite - Instructions -->
    <div class="w-56 lg:w-64 flex flex-col gap-4 flex-shrink-0">
      <div class="p-3 lg:p-4 border-2 rounded-lg" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <h3 class="text-lg lg:text-xl font-bold glow-text pixel-perfect mb-2 lg:mb-3" style="color: var(--secondary-color);">
          CONTRÔLES
        </h3>
        <div class="flex flex-col gap-1 lg:gap-2 text-xs lg:text-sm" style="color: var(--text-dim);">
          <div class="flex items-center gap-2">
            <span style="color: var(--secondary-color);">↑ ↓ ← →</span>
            <span>Flèches</span>
          </div>
          <div class="flex items-center gap-2">
            <span style="color: var(--secondary-color);">Z Q S D</span>
            <span>Alternative</span>
          </div>
        </div>
      </div>

      <div class="p-3 lg:p-4 border-2 rounded-lg" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <h3 class="text-lg lg:text-xl font-bold glow-text pixel-perfect mb-2 lg:mb-3" style="color: var(--secondary-color);">
          RÈGLES
        </h3>
        <div class="flex flex-col gap-1 lg:gap-2 text-xs" style="color: var(--text-dim);">
          <p>• Déplacez les tuiles</p>
          <p>• Combinez les nombres identiques</p>
          <p>• Atteignez 2048 pour gagner</p>
          <p>• Ne bloquez pas la grille</p>
        </div>
      </div>

      <div class="flex justify-center p-2 lg:p-3 border-2 rounded-lg text-center" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <p class="text-xs" style="color: var(--secondary-color);">
          <router-link to="/Contact">
            <span class="flex items-center gap-1">
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

</style>