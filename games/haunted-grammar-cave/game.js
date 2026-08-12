(() => {
  "use strict";

  const TOTAL_ROUNDS = 5;
  const HUB_FALLBACK = "../../index.html";

  const TOPICS = {
    present_simple: {
      label: "Present Simple",
      sentences: [
        "The hamster works in the mine.",
        "Ghosts love dark caves.",
        "My hamster likes blue crystals.",
        "The ghost hides behind the rocks.",
        "Do you hear a spooky sound?",
        "Where does the hamster sleep?",
        "The bats fly over the tunnel.",
        "Our teacher checks the sentence.",
        "The miner carries a small lantern.",
        "Does the ghost follow the hamster?",
        "The cave looks cold at night.",
        "Hamsters collect shiny gems.",
        "Why do the ghosts glow green?",
        "The spider sits near the web.",
        "We play grammar games every day."
      ]
    },
    present_continuous: {
      label: "Present Continuous",
      sentences: [
        "The hamster is holding a lantern.",
        "The ghost is floating near the wall.",
        "We are looking for hidden words.",
        "The bats are flying above the cave.",
        "I am building a spooky sentence.",
        "Are the hamsters carrying crystals?",
        "The children are watching the ghost.",
        "My friend is moving the flashlight.",
        "The spider is hanging in the corner.",
        "They are not opening the chest.",
        "Is the blue ghost smiling now?",
        "The miner is walking through the tunnel.",
        "The crystals are glowing in the dark.",
        "We are not touching the green slime.",
        "Who is hiding behind the rock?"
      ]
    },
    there_is_are: {
      label: "There is / There are",
      sentences: [
        "There is a ghost behind the lantern.",
        "There are purple crystals on the wall.",
        "There is a hamster in the cave.",
        "There are two bats above the tunnel.",
        "Is there a map near the chest?",
        "Are there spiders in the corner?",
        "There is not a door in this tunnel.",
        "There are five gems in the cart.",
        "There is a cold wind in the cave.",
        "There are shiny rocks by the river.",
        "Is there a ghost under the bridge?",
        "There are not many lanterns here.",
        "There is a web above the crystals.",
        "Are there hamsters near the mine?",
        "There is a clue on the stone."
      ]
    },
    past_simple_was_were: {
      label: "Past Simple (was / were)",
      sentences: [
        "The cave was dark and spooky.",
        "The crystals were bright last night.",
        "The hamster was in the old tunnel.",
        "The ghosts were near the treasure chest.",
        "Was the lantern on the table?",
        "Were the bats in the cave?",
        "The walls were cold and wet.",
        "My answer was correct yesterday.",
        "The word stones were under the bridge.",
        "The blue ghost was friendly.",
        "Were the hamsters at the camp?",
        "The miner was very brave.",
        "There were green lights in the cave.",
        "The questions were easy today.",
        "Was the spider on the rock?"
      ]
    }
  };

  const spots = [
    [15, 25], [39, 20], [66, 25], [84, 36],
    [22, 50], [50, 46], [73, 57], [37, 67]
  ];
  const rotations = [-4, 3, -2, 4, 2, -3, 4, -2];

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const gameScreen = $("#gameScreen");
  const startScreen = $("#startScreen");
  const playfield = $("#playfield");
  const wordLayer = $("#wordLayer");
  const darkness = $("#darkness");
  const flashlight = $("#flashlight");
  const ghostScare = $("#ghostScare");
  const roundMessage = $("#roundMessage");
  const sentenceText = $("#sentenceText");
  const gemCount = $("#gemCount");
  const taskCount = $("#taskCount");
  const helpModal = $("#helpModal");
  const topicModal = $("#topicModal");
  const topicGoBtn = $("#topicGoBtn");
  const resultsModal = $("#resultsModal");
  const pauseOverlay = $("#pauseOverlay");
  const musicIcon = $("#musicIcon");
  const topicButtons = $$(".topic-btn");

  let roundIndex = 0;
  let nextWordIndex = 0;
  let gems = 0;
  let ghostScares = 0;
  let gameActive = false;
  let paused = false;
  let musicOn = true;
  let roundLocked = false;
  let audioCtx = null;
  let selectedTopic = null;
  let currentRounds = [];
  const ghostAudio = new Audio("assets/ghost-effect.mp3");
  ghostAudio.preload = "auto";
  ghostAudio.volume = 0.82;
  const backgroundMusic = new Audio("assets/background-music.mp3");
  backgroundMusic.preload = "auto";
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.22;

  function shuffle(array) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function setScreen(which) {
    startScreen.classList.toggle("is-active", which === "start");
    gameScreen.classList.toggle("is-active", which === "game");
  }

  function resetGame() {
    roundIndex = 0;
    nextWordIndex = 0;
    gems = 0;
    ghostScares = 0;
    paused = false;
    roundLocked = false;
    gemCount.textContent = "0";
    taskCount.textContent = `1/${TOTAL_ROUNDS}`;
    sentenceText.innerHTML = "";
  }

  function openTopicModal() {
    topicModal.classList.add("open");
    topicGoBtn.disabled = !selectedTopic;
    topicGoBtn.classList.toggle("is-disabled", !selectedTopic);
    topicButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.topic === selectedTopic));
  }

  function closeTopicModal() {
    topicModal.classList.remove("open");
  }

  function selectTopic(topicKey) {
    selectedTopic = topicKey;
    topicButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.topic === topicKey));
    topicGoBtn.disabled = false;
    topicGoBtn.classList.remove("is-disabled");
  }

  function prepareRounds() {
    const bank = TOPICS[selectedTopic].sentences;
    currentRounds = shuffle(bank).slice(0, TOTAL_ROUNDS).map(sentence => sentence.split(" "));
  }

  function startGame() {
    if (!selectedTopic) return;
    prepareRounds();
    resetGame();
    ensureAudio();
    startBackgroundMusic();
    setScreen("game");
    closeTopicModal();
    resultsModal.classList.remove("open");
    helpModal.classList.remove("open");
    gameActive = true;
    renderRound();
    requestAnimationFrame(() => centerFlashlight());
  }

  function renderRound() {
    roundLocked = false;
    nextWordIndex = 0;
    sentenceText.innerHTML = "";
    wordLayer.innerHTML = "";
    taskCount.textContent = `${roundIndex + 1}/${TOTAL_ROUNDS}`;

    const words = currentRounds[roundIndex];
    const shuffledWords = shuffle(words.map((word, correctIndex) => ({ word, correctIndex })));
    const shuffledSpots = shuffle(spots).slice(0, words.length);

    shuffledWords.forEach((item, i) => {
      const btn = document.createElement("button");
      btn.className = "word-rock";
      btn.type = "button";
      btn.dataset.correctIndex = String(item.correctIndex);
      btn.style.left = `${shuffledSpots[i][0]}%`;
      btn.style.top = `${shuffledSpots[i][1]}%`;
      btn.style.setProperty("--rot", `${rotations[i % rotations.length]}deg`);
      btn.innerHTML = `<span>${escapeHtml(item.word)}</span>`;
      btn.setAttribute("aria-label", item.word);
      btn.addEventListener("click", () => handleWordClick(btn, item));
      wordLayer.appendChild(btn);
    });
  }

  function handleWordClick(btn, item) {
    if (!gameActive || paused || roundLocked || btn.classList.contains("correct")) return;

    if (item.correctIndex === nextWordIndex) {
      btn.classList.add("correct");
      addSentenceWord(item.word);
      playWordSound();
      nextWordIndex += 1;

      if (nextWordIndex === currentRounds[roundIndex].length) {
        roundLocked = true;
        window.setTimeout(completeRound, 420);
      }
    } else {
      btn.classList.remove("wrong");
      void btn.offsetWidth;
      btn.classList.add("wrong");
      ghostScares += 1;
      playGhostSound();
      showGhostNear(btn);
    }
  }

  function addSentenceWord(word) {
    const span = document.createElement("span");
    span.className = "sentence-word";
    span.textContent = word;
    sentenceText.appendChild(span);
  }

  function completeRound() {
    gems += 1;
    gemCount.textContent = String(gems);
    flashMessage("GREAT!  +1 GEM");

    if (roundIndex >= TOTAL_ROUNDS - 1) {
      window.setTimeout(finishGame, 900);
      return;
    }

    roundIndex += 1;
    window.setTimeout(renderRound, 850);
  }

  function showGhostNear(btn) {
    const gameRect = gameScreen.getBoundingClientRect();
    const rect = btn.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2 - gameRect.left) / gameRect.width) * 100;
    const y = ((rect.top + rect.height / 2 - gameRect.top) / gameRect.height) * 100;
    ghostScare.style.left = `${Math.min(83, Math.max(17, x + (x < 50 ? 10 : -10)))}%`;
    ghostScare.style.top = `${Math.min(78, Math.max(24, y))}%`;
    ghostScare.classList.remove("show");
    void ghostScare.offsetWidth;
    ghostScare.classList.add("show");
  }

  function flashMessage(text) {
    roundMessage.textContent = text;
    roundMessage.classList.remove("show");
    void roundMessage.offsetWidth;
    roundMessage.classList.add("show");
  }

  function finishGame() {
    gameActive = false;
    saveSession();
    $("#resultsText").innerHTML = `
      <div class="big">${TOPICS[selectedTopic].label}</div>
      <div>${TOTAL_ROUNDS} / ${TOTAL_ROUNDS} sentences completed</div>
      <div class="gem-line">💎 ${gems} Gems earned</div>
      <div>👻 Ghost scares: ${ghostScares}</div>
    `;
    resultsModal.classList.add("open");
  }

  function saveSession() {
    const result = {
      sessionId: `haunted-grammar-cave-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      gameId: "haunted-grammar-cave",
      gameName: "Haunted Grammar Cave",
      topic: TOPICS[selectedTopic].label,
      gemsEarned: gems,
      stats: {
        correctAnswers: TOTAL_ROUNDS,
        attemptedAnswers: TOTAL_ROUNDS + ghostScares,
        ghostsDefeated: 0,
        blocksMined: 0
      },
      completedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem("hgm_haunted_cave_last_result", JSON.stringify(result));
      localStorage.setItem("hgm_pending_minigame_result", JSON.stringify(result));
    } catch (_) {}
  }

  function openHelp() { helpModal.classList.add("open"); }
  function closeHelp() { helpModal.classList.remove("open"); }

  function togglePause(force) {
    if (!gameScreen.classList.contains("is-active") || !gameActive) return;
    paused = typeof force === "boolean" ? force : !paused;
    gameScreen.classList.toggle("paused", paused);
    pauseOverlay.classList.toggle("open", paused);
    if (paused) {
      backgroundMusic.pause();
    } else if (musicOn) {
      startBackgroundMusic();
    }
  }

  function startBackgroundMusic() {
    if (!musicOn) return;
    backgroundMusic.muted = false;
    backgroundMusic.play().catch(() => {});
  }

  function toggleMusic() {
    musicOn = !musicOn;
    musicIcon.src = musicOn ? "assets/music-on.png" : "assets/music-off.png";
    $("#musicBtn").setAttribute("aria-label", musicOn ? "Music on" : "Music off");
    if (musicOn && !paused && gameActive) {
      startBackgroundMusic();
    } else {
      backgroundMusic.pause();
    }
  }

  function goBackToCamp() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    window.location.href = HUB_FALLBACK;
  }

  function centerFlashlight() {
    const r = gameScreen.getBoundingClientRect();
    const x = r.width * .50;
    const y = r.height * .48;
    setFlashlight(x, y);
  }

  function setFlashlight(clientXInGame, clientYInGame) {
    const r = gameScreen.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, clientXInGame));
    const y = Math.max(0, Math.min(r.height, clientYInGame));
    const px = `${x}px`;
    const py = `${y}px`;
    darkness.style.setProperty("--x", px);
    darkness.style.setProperty("--y", py);
    flashlight.style.left = px;
    flashlight.style.top = py;
  }

  function ensureAudio() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function tone({ frequency = 440, frequencyEnd = null, duration = 0.15, type = "sine", volume = 0.03, delay = 0 } = {}) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const start = ctx.currentTime + delay;
    const end = start + duration;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    if (frequencyEnd !== null) osc.frequency.exponentialRampToValueAtTime(Math.max(40, frequencyEnd), end);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(end + 0.02);
  }

  function playWordSound() {
    tone({ frequency: 660, frequencyEnd: 760, duration: 0.08, type: "triangle", volume: 0.03, delay: 0 });
    tone({ frequency: 880, frequencyEnd: 980, duration: 0.11, type: "sine", volume: 0.028, delay: 0.07 });
  }

  function playGhostSound() {
    try {
      ghostAudio.pause();
      ghostAudio.currentTime = 0;
      ghostAudio.play().catch(() => {});
    } catch (_) {}
  }

  gameScreen.addEventListener("pointermove", (e) => {
    if (!gameActive || paused) return;
    const r = gameScreen.getBoundingClientRect();
    setFlashlight(e.clientX - r.left, e.clientY - r.top);
  });

  gameScreen.addEventListener("pointerenter", (e) => {
    const r = gameScreen.getBoundingClientRect();
    setFlashlight(e.clientX - r.left, e.clientY - r.top);
  });

  $("#startBtn").addEventListener("click", openTopicModal);
  $("#startBackBtn").addEventListener("click", goBackToCamp);
  $("#startHelpBtn").addEventListener("click", openHelp);
  $("#topicClose").addEventListener("click", closeTopicModal);
  $("#topicGoBtn").addEventListener("click", startGame);
  $("#helpBtn").addEventListener("click", openHelp);
  $("#helpClose").addEventListener("click", closeHelp);
  $("#musicBtn").addEventListener("click", toggleMusic);
  $("#pauseBtn").addEventListener("click", () => togglePause());
  $("#resumeBtn").addEventListener("click", () => togglePause(false));
  $("#closeBtn").addEventListener("click", goBackToCamp);
  $("#playAgainBtn").addEventListener("click", startGame);
  $("#resultsBackBtn").addEventListener("click", goBackToCamp);
  topicButtons.forEach(btn => btn.addEventListener("click", () => selectTopic(btn.dataset.topic)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (helpModal.classList.contains("open")) closeHelp();
      else if (topicModal.classList.contains("open")) closeTopicModal();
      else if (paused) togglePause(false);
    }
  });

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
  }
})();
