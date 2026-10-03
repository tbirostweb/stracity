<script setup>
import { ref, defineAsyncComponent, markRaw } from 'vue';
import Navigation from "../components/Navigation.vue";
const loadGame = (loader) => markRaw(defineAsyncComponent(loader));
const TicTacToe = loadGame(() => import('../components/games/TicTacToe.vue'));
const MemoryGame = loadGame(() => import('../components/games/MemoryGame.vue'));
const Snake = loadGame(() => import('../components/games/Snake.vue'));
const Game2048 = loadGame(() => import('../components/games/Game2048.vue'));

const games = [
  { id: 1, title: "Tic Tac Toe", icon: "X O", component: TicTacToe },
  { id: 2, title: "Memory Game", icon: "? ?", component: MemoryGame },
  { id: 3, title: "Snake", icon: "~~~>", component: Snake },
  { id: 4, title: "Tetris", icon: "□■□", component: null },
  { id: 5, title: "Pong", icon: "|·|", component: null },
  { id: 6, title: "2048", icon: "2^n", component: Game2048 },
  { id: 7, title: "A venir", icon: "???", component: null },
  { id: 8, title: "A venir", icon: "???", component: null },
  { id: 9, title: "A venir ", icon: "???", component: null }

  // { id: 7, title: "Space Invaders", icon: "∧ ∨", component: null },
  //  { id: 8, title: "Breakout", icon: "_●_", component: null },
  //  { id: 9, title: "Flappy Bird", icon: "<>", component: null }
];

const currentGame = ref(null);
const isFullscreen = ref(false);

const openGame = (game) => {
  if (!game.component) return;
  currentGame.value = game;
  isFullscreen.value = false;
};

const closeGame = () => {
  currentGame.value = null;
  isFullscreen.value = false;
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};
</script>

<template>
  <div class="max-h-screen">
    <Navigation />
    <section
        class="flex flex-col items-center justify-center min-h-screen px-6 py-20"
        style="background-color: var(--bg-dark);"
    >
      <div class="text-center mb-12">
        <h1 class="text-6xl font-extrabold glow-text pixel-perfect mb-2 animate-pulse" style="color: var(--secondary-color);">
          LISTE DES JEUX
        </h1>
        <br>
        <p class="text-lg glow-text" style="color: var(--text-secondary);">
           Sélectionnez votre jeu favoris et amuse(z)-toi (vous) !
        </p>
        <div class="text-center mt-8">
        <span class="text-lg" style="color: var(--text-dim);">
           {{ games.filter(game => game.component).length }} jeux actuellement disponibles
        </span>
        </div>
      </div>

      <div class="relative w-full max-w-6xl p-1">
        <div class="absolute -top-1 -left-1 w-6 h-6 border-2 border-r-0 border-b-0 rounded-tl" style="border-color: var(--secondary-color);"></div>
        <div class="absolute -top-1 -right-1 w-6 h-6 border-2 border-l-0 border-b-0 rounded-tr" style="border-color: var(--secondary-color);"></div>
        <div class="absolute -bottom-1 -left-1 w-6 h-6 border-2 border-r-0 border-t-0 rounded-bl" style="border-color: var(--secondary-color);"></div>
        <div class="absolute -bottom-1 -right-1 w-6 h-6 border-2 border-l-0 border-t-0 rounded-br" style="border-color: var(--secondary-color);"></div>

        <div class="relative border-3 rounded-lg p-6 shadow-[0_0_20px_var(--glow-shadow),inset_0_0_20px_rgba(0,0,0,0.8)]" style="background-color: var(--primary-color); border-color: var(--border-color);">

          <div class="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
            <div
                v-for="game in games"
                :key="game.id"
                @click="openGame(game)"
                @keydown.enter="openGame(game)"
                @keydown.space.prevent="openGame(game)"
                role="button"
                :tabindex="game.component ? 0 : -1"
                :aria-disabled="!game.component"
                :aria-label="game.component ? `Jouer à ${game.title}` : `${game.title}, bientôt disponible`"
                :class="{ 'opacity-50 cursor-not-allowed': !game.component }"
                class="aspect-square rounded-lg border-2 hover:shadow-[0_0_20px_var(--glow-shadow),inset_0_0_20px_rgba(165,199,89,0.1)] transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group relative overflow-hidden pixel-perfect"
                style="background-color: var(--bg-dark); border-color: var(--accent-color);"
            >
              <div class="absolute inset-0 opacity-0 group-hover:opacity-40 animate-scan bg-gradient-to-r from-transparent via-[var(--glow-primary)] to-transparent pointer-events-none"></div>

              <div class="absolute inset-0 pointer-events-none opacity-20" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(165, 199, 89, 0.1) 2px, rgba(165, 199, 89, 0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(165, 199, 89, 0.1) 2px, rgba(165, 199, 89, 0.1) 4px)"></div>

              <div class="relative z-10 text-center p-4">
                <div
                    class="text-5xl mb-3 group-hover:glow-text transition-all duration-300 group-hover:scale-110"
                    style="color: var(--secondary-color);"
                >
                  {{ game.icon }}
                </div>
                <h2
                    class="text-lg font-bold mb-1 group-hover:glow-text transition-all duration-300"
                    style="color: var(--text-primary);"
                >
                  {{ game.title }}
                </h2>
                <p
                    class="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style="color: var(--text-secondary);"
                >
                  {{ game.component ? '» JOUER' : '» BIENTÔT DISPONIBLE' }}
                </p>
              </div>

              <div class="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2" style="border-color: var(--border-color);"></div>
              <div class="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2" style="border-color: var(--border-color);"></div>
              <div class="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2" style="border-color: var(--border-color);"></div>
              <div class="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2" style="border-color: var(--border-color);"></div>
            </div>
          </div>

          <div class="absolute inset-0 pointer-events-none opacity-10 rounded-lg" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(165, 199, 89, 0.1) 2px, rgba(165, 199, 89, 0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(165, 199, 89, 0.1) 2px, rgba(165, 199, 89, 0.1) 4px)"></div>
        </div>
      </div>


    </section>

    <div
        v-if="currentGame"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background-color: rgba(10, 14, 10, 0.95);"
        @click.self="closeGame"
    >
      <div
          class="relative w-full transition-all duration-300"
          :class="isFullscreen ? 'h-full max-w-full' : 'max-w-4xl max-h-[90vh]'"
      >
        <div class="relative border-3 rounded-t-lg p-4 flex items-center justify-between shadow-[0_0_20px_var(--glow-shadow)]" style="background-color: var(--primary-color); border-color: var(--border-color);">
          <div class="flex items-center gap-3">
            <span class="text-3xl glow-text" style="color: var(--secondary-color);">{{ currentGame.icon }}</span>
            <h2 class="text-2xl font-bold glow-text pixel-perfect" style="color: var(--text-primary);">
              {{ currentGame.title }}
            </h2>
          </div>

          <div class="flex gap-2">
            <button
                @click="toggleFullscreen"
                class="px-4 py-2 border-2 rounded transition-all duration-300 hover:glow-box pixel-perfect font-bold"
                style="background-color: var(--bg-medium); border-color: var(--border-color); color: var(--text-primary);"
            >
              {{ isFullscreen ? '□' : '▢' }}
            </button>


            <button
                @click="closeGame"
                class="px-4 py-2 border-2 rounded transition-all duration-300 hover:glow-box pixel-perfect font-bold"
                style="background-color: var(--bg-medium); border-color: var(--border-color); color: var(--text-primary);"
            >
              ✕ QUITTER
            </button>
          </div>
        </div>


        <div
            class="relative border-3 border-t-0 rounded-b-lg overflow-hidden"
            :class="isFullscreen ? 'h-[calc(100%-4rem)]' : 'h-[600px]'"
            style="background-color: var(--bg-dark); border-color: var(--border-color);"
        >
          <component :is="currentGame.component" />


          <div class="absolute inset-0 pointer-events-none opacity-5" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(165, 199, 89, 0.1) 2px, rgba(165, 199, 89, 0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(165, 199, 89, 0.1) 2px, rgba(165, 199, 89, 0.1) 4px)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-scan {
  animation: scan 3s linear infinite;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.animate-blink {
  animation: blink 1s step-end infinite;
}
</style>