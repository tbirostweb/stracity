<script setup>
import { ref, nextTick, onBeforeUnmount, defineAsyncComponent, defineComponent, h, markRaw } from 'vue';
import Navigation from "../components/Navigation.vue";
import Footer from "../components/Footer.vue";

const GameLoading = defineComponent({
  render: () => h('p', { role: 'status', class: 'p-6 text-center pixel-perfect', style: 'color: var(--text-secondary);' }, 'Chargement du jeu…'),
});
const GameError = defineComponent({
  render: () => h('p', { role: 'alert', class: 'p-6 text-center pixel-perfect', style: 'color: var(--text-primary);' }, 'Impossible de charger ce jeu. Vérifie ta connexion puis ferme et rouvre le jeu.'),
});
const loadGame = (loader) => markRaw(defineAsyncComponent({
  loader,
  loadingComponent: GameLoading,
  errorComponent: GameError,
  delay: 100,
  timeout: 15000,
}));
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
const dialogRef = ref(null);
let lastTrigger = null;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const openGame = async (game, event) => {
  if (!game.component) return;
  lastTrigger = event?.currentTarget ?? document.activeElement;
  currentGame.value = game;
  isFullscreen.value = false;
  await nextTick();
  const first = dialogRef.value?.querySelector(FOCUSABLE);
  (first ?? dialogRef.value)?.focus();
};

const closeGame = () => {
  currentGame.value = null;
  isFullscreen.value = false;
  const target = lastTrigger;
  lastTrigger = null;
  nextTick(() => target?.focus?.());
};

const onDialogKeydown = (event) => {
  if (event.key === 'Escape') {
    event.stopPropagation();
    closeGame();
    return;
  }
  if (event.key !== 'Tab' || !dialogRef.value) return;
  const items = [...dialogRef.value.querySelectorAll(FOCUSABLE)];
  if (!items.length) {
    event.preventDefault();
    dialogRef.value.focus();
    return;
  }
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.value)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};

onBeforeUnmount(() => { lastTrigger = null; });

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};
</script>

<template>
  <div>
    <Navigation />
    <main>
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
            <button
                v-for="game in games"
                :key="game.id"
                type="button"
                @click="openGame(game, $event)"
                :disabled="!game.component"
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
                    class="text-xs transition-opacity duration-300"
                    :class="game.component ? 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100' : 'opacity-100'"
                    style="color: var(--text-secondary);"
                >
                  {{ game.component ? '» JOUER' : '» BIENTÔT DISPONIBLE' }}
                </p>
              </div>

              <div class="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2" style="border-color: var(--border-color);"></div>
              <div class="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2" style="border-color: var(--border-color);"></div>
              <div class="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2" style="border-color: var(--border-color);"></div>
              <div class="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2" style="border-color: var(--border-color);"></div>
            </button>
          </div>

          <div class="absolute inset-0 pointer-events-none opacity-10 rounded-lg" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(165, 199, 89, 0.1) 2px, rgba(165, 199, 89, 0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(165, 199, 89, 0.1) 2px, rgba(165, 199, 89, 0.1) 4px)"></div>
        </div>
      </div>


    </section>
    </main>
    <Footer />

    <div
        v-if="currentGame"
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-dialog-title"
        tabindex="-1"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background-color: rgba(10, 14, 10, 0.95);"
        @click.self="closeGame"
        @keydown="onDialogKeydown"
    >
      <div
          class="relative w-full transition-all duration-300"
          :class="isFullscreen ? 'h-full max-w-full' : 'max-w-4xl max-h-[90vh]'"
      >
        <div class="relative border-3 rounded-t-lg p-4 flex items-center justify-between shadow-[0_0_20px_var(--glow-shadow)]" style="background-color: var(--primary-color); border-color: var(--border-color);">
          <div class="flex items-center gap-3">
            <span class="text-3xl glow-text" aria-hidden="true" style="color: var(--secondary-color);">{{ currentGame.icon }}</span>
            <h2 id="game-dialog-title" class="text-2xl font-bold glow-text pixel-perfect" style="color: var(--text-primary);">
              {{ currentGame.title }}
            </h2>
          </div>

          <div class="flex gap-2">
            <button
                type="button"
                @click="toggleFullscreen"
                :aria-label="isFullscreen ? 'Quitter le plein écran' : 'Passer en plein écran'"
                :aria-pressed="isFullscreen"
                class="px-4 py-2 border-2 rounded transition-all duration-300 hover:glow-box pixel-perfect font-bold"
                style="background-color: var(--bg-medium); border-color: var(--border-color); color: var(--text-primary);"
            >
              <span aria-hidden="true">{{ isFullscreen ? '□' : '▢' }}</span>
            </button>


            <button
                type="button"
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