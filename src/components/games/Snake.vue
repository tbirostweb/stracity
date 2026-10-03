<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const gridSize = 20;
const cellSize = 20;
const initialSnake = [{ x: 10, y: 10 }];
const initialDirection = { x: 1, y: 0 };

const snake = ref([...initialSnake]);
const direction = ref({ ...initialDirection });
const nextDirection = ref({ ...initialDirection });
const foods = ref([]);
const maxFoods = 3;
const score = ref(0);
const gameOver = ref(false);
const gameStarted = ref(false);
const isPaused = ref(false);
const speed = ref(150);

let gameLoop = null;

const generateFood = () => {
  if (foods.value.length >= maxFoods) return;

  let newFood;
  let attempts = 0;
  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
    attempts++;
  } while (
      attempts < 100 &&
      (snake.value.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
          foods.value.some(food => food.x === newFood.x && food.y === newFood.y))
      );

  foods.value.push(newFood);
};

const initFoods = () => {
  foods.value = [];
  for (let i = 0; i < maxFoods; i++) {
    generateFood();
  }
};

const moveSnake = () => {
  if (gameOver.value || isPaused.value || !gameStarted.value) return;

  direction.value = { ...nextDirection.value };

  const head = { ...snake.value[0] };
  head.x += direction.value.x;
  head.y += direction.value.y;

  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    gameOver.value = true;
    return;
  }

  if (snake.value.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver.value = true;
    return;
  }

  snake.value.unshift(head);

  const foodIndex = foods.value.findIndex(food => head.x === food.x && head.y === food.y);
  if (foodIndex !== -1) {
    score.value += 10;
    foods.value.splice(foodIndex, 1);
    generateFood();
    if (speed.value > 50) {
      speed.value -= 5;
      restartGameLoop();
    }
  } else {
    snake.value.pop();
  }
};

const handleKeyPress = (event) => {
  if (!gameStarted.value && !gameOver.value) {
    startGame();
    return;
  }

  if (event.key === ' ') {
    event.preventDefault();
    togglePause();
    return;
  }

  const keyMap = {
    'ArrowUp': { x: 0, y: -1 },
    'ArrowDown': { x: 0, y: 1 },
    'ArrowLeft': { x: -1, y: 0 },
    'ArrowRight': { x: 1, y: 0 },
    'z': { x: 0, y: -1 },
    's': { x: 0, y: 1 },
    'q': { x: -1, y: 0 },
    'd': { x: 1, y: 0 }
  };

  const newDirection = keyMap[event.key];

  if (newDirection) {
    event.preventDefault();
    if (newDirection.x !== -direction.value.x || newDirection.y !== -direction.value.y) {
      nextDirection.value = newDirection;
    }
  }
};

const startGame = () => {
  gameStarted.value = true;
  gameLoop = setInterval(moveSnake, speed.value);
};

const togglePause = () => {
  if (!gameStarted.value || gameOver.value) return;
  isPaused.value = !isPaused.value;
};

const restartGameLoop = () => {
  if (gameLoop) clearInterval(gameLoop);
  if (gameStarted.value && !gameOver.value) {
    gameLoop = setInterval(moveSnake, speed.value);
  }
};

const resetGame = () => {
  snake.value = [...initialSnake];
  direction.value = { ...initialDirection };
  nextDirection.value = { ...initialDirection };
  score.value = 0;
  gameOver.value = false;
  gameStarted.value = false;
  isPaused.value = false;
  speed.value = 150;
  initFoods();
  if (gameLoop) clearInterval(gameLoop);
};

const statusMessage = computed(() => {
  if (gameOver.value) return 'GAME OVER !';
  if (isPaused.value) return 'PAUSE';
  if (!gameStarted.value) return 'APPUYEZ SUR UNE TOUCHE';
  return `SCORE : ${score.value}`;
});

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
  initFoods();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
  if (gameLoop) clearInterval(gameLoop);
});
</script>

<template>
  <div class="flex items-center justify-center min-h-full p-4 lg:p-8 gap-4 lg:gap-8 overflow-auto" style="background-color: var(--bg-dark);">

    <div class="flex flex-col gap-4 lg:gap-6 w-56 lg:w-64 flex-shrink-0">
      <div class="text-center p-3 lg:p-4 border-2 rounded-lg" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <h2 class="text-2xl lg:text-3xl font-bold glow-text pixel-perfect mb-2" style="color: var(--secondary-color);">
          {{ statusMessage }}
        </h2>
        <p class="text-xs lg:text-sm mb-2 lg:mb-3" style="color: var(--text-secondary);">
          <span v-if="!gameStarted && !gameOver">» Prêt à jouer</span>
          <span v-else-if="gameStarted && !gameOver && !isPaused">» En cours</span>
        </p>
        <div class="flex flex-col gap-1 lg:gap-2 text-xs lg:text-sm" style="color: var(--text-dim);">
          <div class="flex justify-between">
            <span>Longueur:</span>
            <span style="color: var(--text-primary);">{{ snake.length }}</span>
          </div>
          <div class="flex justify-between">
            <span>Vitesse:</span>
            <span style="color: var(--text-primary);">{{ Math.round((200 - speed) / 15) }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 lg:gap-3">
        <button
            v-if="!gameStarted"
            @click="startGame"
            class="w-full px-3 lg:px-4 py-2 lg:py-3 border-2 rounded-lg transition-all duration-300 hover:glow-box pixel-perfect font-bold text-sm lg:text-base"
            style="background-color: var(--bg-medium); border-color: var(--border-color); color: var(--text-primary);"
        >
          ▶ COMMENCER
        </button>

        <button
            v-if="gameStarted && !gameOver"
            @click="togglePause"
            class="w-full px-3 lg:px-4 py-2 lg:py-3 border-2 rounded-lg transition-all duration-300 hover:glow-box pixel-perfect font-bold text-sm lg:text-base"
            style="background-color: var(--bg-medium); border-color: var(--border-color); color: var(--text-primary);"
        >
          {{ isPaused ? '▶ REPRENDRE' : '⏸ PAUSE' }}
        </button>

        <button
            @click="resetGame"
            class="w-full px-3 lg:px-4 py-2 lg:py-3 border-2 rounded-lg transition-all duration-300 hover:glow-box pixel-perfect font-bold text-sm lg:text-base"
            style="background-color: var(--bg-medium); border-color: var(--border-color); color: var(--text-primary);"
        >
          ↻ RESET
        </button>
      </div>
    </div>

    <div
        class="relative p-3 lg:p-4 border-3 rounded-lg shadow-[0_0_20px_var(--glow-shadow),inset_0_0_20px_rgba(0,0,0,0.8)] flex-shrink-0"
        style="background-color: var(--primary-color); border-color: var(--border-color);"
    >
      <div
          class="relative border-2 rounded overflow-hidden"
          :style="{
          width: gridSize * cellSize + 'px',
          height: gridSize * cellSize + 'px',
          backgroundColor: 'var(--bg-dark)',
          borderColor: 'var(--accent-color)'
        }"
      >
        <svg class="absolute inset-0 pointer-events-none opacity-10" :width="gridSize * cellSize" :height="gridSize * cellSize">
          <defs>
            <pattern id="grid" :width="cellSize" :height="cellSize" patternUnits="userSpaceOnUse">
              <rect :width="cellSize" :height="cellSize" fill="none" stroke="var(--secondary-color)" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div
            v-for="(segment, index) in snake"
            :key="`snake-${index}`"
            class="absolute transition-all duration-100"
            :class="{ 'glow-box': index === 0 }"
            :style="{
            left: segment.x * cellSize + 1 + 'px',
            top: segment.y * cellSize + 1 + 'px',
            width: cellSize - 2 + 'px',
            height: cellSize - 2 + 'px',
            backgroundColor: index === 0 ? 'var(--secondary-color)' : 'var(--hover-color)',
            border: index === 0 ? '2px solid var(--glow-primary)' : '1px solid var(--secondary-color)',
            borderRadius: index === 0 ? '3px' : '2px',
            zIndex: snake.length - index
          }"
        ></div>

        <div
            v-for="(food, index) in foods"
            :key="`food-${index}`"
            class="absolute rounded-full glow-box animate-pulse"
            :style="{
            left: food.x * cellSize + 3 + 'px',
            top: food.y * cellSize + 3 + 'px',
            width: cellSize - 6 + 'px',
            height: cellSize - 6 + 'px',
            backgroundColor: 'var(--glow-primary)',
            boxShadow: '0 0 10px var(--glow-shadow), 0 0 20px var(--glow-shadow)',
            animationDelay: index * 0.2 + 's'
          }"
        ></div>

        <div
            v-if="gameOver || (isPaused && gameStarted)"
            class="absolute inset-0 flex items-center justify-center rounded"
            style="background-color: rgba(10, 14, 10, 0.9);"
        >
          <div class="text-center">
            <p class="text-3xl lg:text-5xl font-bold glow-text pixel-perfect mb-2 lg:mb-4" style="color: var(--glow-primary);">
              {{ gameOver ? 'GAME OVER' : '⏸ PAUSE' }}
            </p>
            <p class="text-lg lg:text-2xl" style="color: var(--text-secondary);">
              {{ gameOver ? 'Score : ' + score : 'ESPACE' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="w-56 lg:w-64 flex flex-col gap-4 flex-shrink-0">
      <div class="p-3 lg:p-4 border-2 rounded-lg" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <h3 class="text-lg lg:text-xl font-bold glow-text pixel-perfect mb-2 lg:mb-3" style="color: var(--secondary-color);">
          CONTRÔLES
        </h3>
        <div class="flex flex-col gap-1 lg:gap-2 text-xs lg:text-sm" style="color: var(--text-dim);">
          <div class="flex items-center gap-2">
            <span style="color: var(--secondary-color);">↑↓←→</span>
            <span>Flèches</span>
          </div>
          <div class="flex items-center gap-2">
            <span style="color: var(--secondary-color);">ZQSD</span>
            <span>Alternative</span>
          </div>
          <div class="flex items-center gap-2">
            <span style="color: var(--secondary-color);">ESPACE</span>
            <span>Pause</span>
          </div>
        </div>
      </div>

      <div class="p-3 lg:p-4 border-2 rounded-lg" style="background-color: var(--bg-medium); border-color: var(--border-color);">
        <h3 class="text-lg lg:text-xl font-bold glow-text pixel-perfect mb-2 lg:mb-3" style="color: var(--secondary-color);">
          RÈGLES
        </h3>
        <div class="flex flex-col gap-1 lg:gap-2 text-xs" style="color: var(--text-dim);">
          <p>• Mangez pour grandir</p>
          <p>• Évitez les murs</p>
          <p>• Ne vous mordez pas</p>
          <p>• Vitesse augmente</p>
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

.animate-blink {
  animation: blink 1s step-end infinite;
}
</style>