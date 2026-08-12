(() => {
  const SESSION_MS = 120000;
  const REWARD_VALUES = Object.freeze({ gem_blue: 1, gem_green_red: 2, gem_purple_pink_yellow: 3, lucky7: 7 });

  function createGameplay({ sessionState, mapApi, hamster, questions, soundFX, onPauseChanged, onPlayAgain }) {
    const timerText = document.querySelector('.timer span');
    const gemsText = document.querySelector('.gems span');
    const grammarModal = document.querySelector('#grammarModal');
    const ghostModal = document.querySelector('#ghostModal');
    const eventModal = document.querySelector('#eventModal');
    const endModal = document.querySelector('#endModal');
    const pauseReasons = new Set();
    const stats = { gems: 0, blocksMined: 0, grammarCorrect: 0, grammarAttempted: 0, ghostsDefeated: 0 };
    let remainingMs = SESSION_MS;
    let lastTick = performance.now();
    let active = false;
    let chestBusy = false;

    function updateHud() {
      const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
      timerText.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
      gemsText.textContent = stats.gems;
    }

    function setPaused(reason, paused) {
      if (paused) pauseReasons.add(reason); else pauseReasons.delete(reason);
      lastTick = performance.now();
      onPauseChanged?.();
    }

    function isPaused() { return pauseReasons.size > 0; }
    function canPlay() { return active && !isPaused(); }

    function endGame() {
      if (!active) return;
      active = false;
      remainingMs = 0;
      pauseReasons.add('ended');
      updateHud();
      grammarModal.hidden = true;
      ghostModal.hidden = true;
      eventModal.hidden = true;
      document.querySelector('#resultGems').textContent = stats.gems;
      document.querySelector('#resultBlocks').textContent = stats.blocksMined;
      document.querySelector('#resultGrammar').textContent = `${stats.grammarCorrect} / ${stats.grammarAttempted}`;
      document.querySelector('#resultGhosts').textContent = stats.ghostsDefeated;
      try {
        localStorage.setItem('hgm_pending_minigame_result', JSON.stringify({
          sessionId: `grammar-gold-rush-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          gameId: 'grammar-gold-rush',
          gameName: 'Grammar Gold Rush',
          topic: sessionState.topic,
          gemsEarned: stats.gems,
          stats: {
            correctAnswers: stats.grammarCorrect,
            attemptedAnswers: stats.grammarAttempted,
            ghostsDefeated: stats.ghostsDefeated,
            blocksMined: stats.blocksMined
          },
          completedAt: new Date().toISOString()
        }));
      } catch (_) {}
      endModal.hidden = false;
      onPauseChanged?.();
    }

    setInterval(() => {
      const now = performance.now();
      if (active && !isPaused()) {
        remainingMs -= now - lastTick;
        if (remainingMs <= 0) endGame(); else updateHud();
      }
      lastTick = now;
    }, 200);

    function start(topic) {
      sessionState.topic = topic;
      Object.keys(stats).forEach((key) => { stats[key] = 0; });
      remainingMs = SESSION_MS;
      pauseReasons.clear();
      active = true;
      chestBusy = false;
      endModal.hidden = true;
      lastTick = performance.now();
      soundFX.ensure();
      updateHud();
      onPauseChanged?.();
    }

    function normalize(value) { return value.trim().toLowerCase().replace(/[.!?]$/, ''); }

    function runQuestion({ ghost = false, typed = false, seconds = 10 }) {
      const modal = ghost ? ghostModal : grammarModal;
      const timeElement = document.querySelector(ghost ? '#ghostTime' : '#grammarTime');
      const questionElement = document.querySelector(ghost ? '#ghostQuestion' : '#grammarQuestion');
      const optionsElement = document.querySelector(ghost ? '#ghostOptions' : '#grammarOptions');
      const typedForm = document.querySelector('#typedAnswer');
      const typedInput = document.querySelector('#grammarInput');
      const question = questions.getQuestion(sessionState.topic, typed && !ghost ? 'typed' : 'multipleChoice');
      let resolved = false;
      let remaining = seconds;

      questionElement.textContent = question.prompt;
      timeElement.textContent = remaining;
      optionsElement.replaceChildren();
      typedForm.hidden = ghost || !typed;
      optionsElement.hidden = !ghost && typed;
      modal.hidden = false;

      return new Promise((resolve) => {
        const finish = (correct) => {
          if (resolved) return;
          resolved = true;
          clearInterval(challengeTimer);
          modal.hidden = true;
          stats.grammarAttempted += 1;
          if (correct) stats.grammarCorrect += 1;
          soundFX.play(correct ? 'correct' : 'wrong');
          resolve(correct);
        };

        if (typed && !ghost) {
          typedInput.value = '';
          typedForm.onsubmit = (event) => {
            event.preventDefault();
            const acceptedAnswers = question.answers || [question.answer];
            finish(acceptedAnswers.some((answer) => normalize(typedInput.value) === normalize(answer)));
          };
          setTimeout(() => typedInput.focus(), 0);
        } else {
          question.options.forEach((option) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = option;
            button.onclick = () => finish(option === question.answer);
            optionsElement.append(button);
          });
          optionsElement.querySelector('button')?.focus();
        }

        const challengeTimer = setInterval(() => {
          remaining -= 1;
          timeElement.textContent = remaining;
          if (remaining <= 0) finish(false);
        }, 1000);
      });
    }

    async function resolveFinalBlockHit(cell) {
      if (cell.type === mapApi.BLOCK_TYPES.DIRT) return true;
      setPaused('grammar', true);
      const correct = await runQuestion({ typed: cell.type === mapApi.BLOCK_TYPES.HARD_ROCK, seconds: 10 });
      setPaused('grammar', false);
      return correct;
    }

    function addGems(amount, row, col, soundName = 'gem') {
      stats.gems += amount;
      updateHud();
      soundFX.play(soundName);
      const label = document.createElement('div');
      const cell = 1672 / 13;
      label.className = 'reward-float';
      label.textContent = `+${amount}`;
      label.style.left = `${(col - 1) * cell}px`;
      label.style.top = `${(row - 1) * cell + 35}px`;
      document.querySelector('.hamster-layer').append(label);
      setTimeout(() => label.remove(), 850);
    }

    function collectReward(cell) {
      if (!cell.reward) return;
      const reward = cell.reward;
      const value = REWARD_VALUES[reward];
      cell.reward = null;
      mapApi.renderMap();
      addGems(value, cell.row, cell.col, reward === 'lucky7' ? 'lucky7' : 'gem');
    }

    function showEvent(asset, copy) {
      document.querySelector('#eventArt').src = asset;
      document.querySelector('#eventCopy').textContent = copy;
      document.querySelector('#eventCopy').hidden = !copy;
      eventModal.hidden = false;
      return new Promise((resolve) => {
        document.querySelector('#eventClose').onclick = () => { eventModal.hidden = true; resolve(); };
      });
    }

    async function resolveChest(cell) {
      if (chestBusy || !cell.object) return;
      chestBusy = true;
      setPaused('chest', true);
      mapApi.setCellOpen(cell.row, cell.col);
      soundFX.play('chest');

      if (Math.random() < mapApi.LEVEL_1_CONFIG.chestOutcomes.treasure) {
        const awards = [2, 3, 5];
        const amount = awards[Math.floor(Math.random() * awards.length)];
        addGems(amount, cell.row, cell.col, 'gem');
        await showEvent('assets/ui/popups/popup_treasure_bg.png', `+${amount} gems`);
      } else {
        soundFX.play('ghost');
        const correct = await runQuestion({ ghost: true, seconds: 5 });
        if (correct) {
          stats.ghostsDefeated += 1;
          addGems(2, cell.row, cell.col, 'gem');
          await showEvent('assets/ui/popups/popup_ghost_defeated_bg.png', '+2 GEMS');
        } else {
          stats.gems = Math.max(0, stats.gems - 2);
          updateHud();
          await showEvent('assets/ui/popups/popup_ghost_stole_bg.png', '');
        }
      }

      cell.object = null;
      mapApi.renderMap();
      chestBusy = false;
      setPaused('chest', false);
    }

    function handleCellEntered(cell) {
      if (!active) return;
      if (cell.object === 'chest') resolveChest(cell);
      else collectReward(cell);
    }

    function blockDestroyed() { stats.blocksMined += 1; }

    function prepareReplay() {
      active = false;
      remainingMs = SESSION_MS;
      pauseReasons.clear();
      Object.keys(stats).forEach((key) => { stats[key] = 0; });
      endModal.hidden = true;
      updateHud();
      onPauseChanged?.();
      onPlayAgain?.();
    }

    document.querySelector('#resultsPlayAgain').addEventListener('click', prepareReplay);

    return {
      start,
      setPaused,
      isPaused,
      canPlay,
      resolveFinalBlockHit,
      handleCellEntered,
      blockDestroyed,
      getStats: () => ({ ...stats }),
      getRemainingMs: () => remainingMs,
      endGame
    };
  }

  window.GoldRushGameplay = { createGameplay };
})();
