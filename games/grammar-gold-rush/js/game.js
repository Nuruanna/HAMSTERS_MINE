(() => {
const {
  initializeMap,
  generateLevel1,
  getMap,
  setCellOpen,
  GRID_COLS,
  GRID_ROWS,
  START_SHAFT_COLUMN,
  START_SHAFT_ROW
} = window.GoldRushMap;
const { createUi } = window.GoldRushUi;
const { createHamster } = window.GoldRushHamster;
const { createMining } = window.GoldRushMining;
const { createGameplay } = window.GoldRushGameplay;

const STAGE_WIDTH = 1672;
const STAGE_HEIGHT = 941;
const stage = document.querySelector('#gameStage');
const state = { phase: 'start', topic: null, musicOn: true, paused: false };
const backgroundMusic = new Audio('assets/audio/Gold_Rush_Background.mp3');
backgroundMusic.loop = true;
backgroundMusic.preload = 'auto';
backgroundMusic.volume = 0.35;

function syncBackgroundMusic() {
  if (state.musicOn && state.phase === 'mine') {
    backgroundMusic.play().catch(() => {
      // A later click on the music button can retry if the browser blocked autoplay.
    });
  } else {
    backgroundMusic.pause();
  }
}

initializeMap(document.querySelector('#mineGrid'));

let mining = null;
let gameplay = null;
let ui = null;
const hamster = createHamster({
  actor: document.querySelector('#hamsterActor'),
  sprite: document.querySelector('#hamsterSprite'),
  getCell: window.GoldRushMap.getCell,
  canMove: () => gameplay?.canPlay()
    && !mining?.isProcessing()
    && !document.querySelector('.modal:not([hidden])'),
  onInteractionChanged: () => mining?.refresh(),
  onCellEntered: (cell) => gameplay?.handleCellEntered(cell)
});

gameplay = createGameplay({
  sessionState: state,
  mapApi: window.GoldRushMap,
  hamster,
  questions: window.GoldRushQuestions,
  soundFX: window.GoldRushSound,
  onPlayAgain: () => {
    state.phase = 'start';
    state.topic = null;
    syncBackgroundMusic();
    manualPaused = false;
    generateLevel1();
    hamster.reset(START_SHAFT_ROW, START_SHAFT_COLUMN);
    stage.classList.remove('is-playing');
    mining.refresh();
    ui.openTopic();
  },
  onPauseChanged: () => {
    state.paused = gameplay?.isPaused() ?? false;
    renderPauseState();
  }
});

mining = createMining({
  grid: document.querySelector('#mineGrid'),
  mapApi: window.GoldRushMap,
  hamster,
  canInteract: () => gameplay.canPlay()
    && !document.querySelector('.modal:not([hidden])'),
  onFinalHit: gameplay.resolveFinalBlockHit,
  onBlockDestroyed: gameplay.blockDestroyed,
  soundFX: window.GoldRushSound
});

const pauseButton = document.querySelector('#pauseButton');
let manualPaused = false;

function renderPauseState() {
  pauseButton.classList.toggle('is-paused', state.paused);
  pauseButton.setAttribute('aria-pressed', String(state.paused));
  mining?.refresh();
}

ui = createUi({
  onTopicConfirmed(topic) {
    state.topic = topic;
    state.phase = 'mine';
    manualPaused = false;
    generateLevel1();
    hamster.reset(START_SHAFT_ROW, START_SHAFT_COLUMN);
    stage.classList.add('is-playing');
    gameplay.start(topic);
    syncBackgroundMusic();
    mining.refresh();
  },
  onHelpOpened() {
    if (state.phase === 'mine') gameplay.setPaused('help', true);
  },
  onHelpClosed() {
    if (state.phase === 'mine') gameplay.setPaused('help', false);
  }
});

function fitStage() {
  const scale = Math.min(innerWidth / STAGE_WIDTH, innerHeight / STAGE_HEIGHT);
  stage.style.transform = `scale(${scale})`;
}

const musicButton = document.querySelector('#musicButton');
musicButton.addEventListener('click', () => {
  state.musicOn = !state.musicOn;
  musicButton.setAttribute('aria-pressed', String(state.musicOn));
  musicButton.setAttribute('aria-label', state.musicOn ? 'Turn music off' : 'Turn music on');
  musicButton.querySelector('img').src = `assets/ui/hud/button_music_${state.musicOn ? 'on' : 'off'}.png`;
  syncBackgroundMusic();
});

pauseButton.addEventListener('click', () => {
  if (state.phase !== 'mine') return;
  manualPaused = !manualPaused;
  gameplay.setPaused('manual', manualPaused);
});

addEventListener('resize', fitStage);
fitStage();

window.grammarGoldRush = Object.freeze({
  regenerateMap() {
    const map = generateLevel1();
    hamster.reset(START_SHAFT_ROW, START_SHAFT_COLUMN);
    mining.refresh();
    return map;
  },
  openCell(row, col) {
    const opened = setCellOpen(row, col);
    mining.refresh();
    return opened;
  },
  getMap,
  getState: () => ({ ...state }),
  getHamster: () => ({ ...hamster.state }),
  getStats: gameplay.getStats,
  endGame: gameplay.endGame,
  startCell: Object.freeze({ row: START_SHAFT_ROW, col: START_SHAFT_COLUMN })
});

console.info(`Grammar Gold Rush shell: ${GRID_COLS}×${GRID_ROWS}, shaft column ${START_SHAFT_COLUMN}`);
})();
