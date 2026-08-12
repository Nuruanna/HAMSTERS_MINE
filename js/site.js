(() => {
  "use strict";

  const PLAYER_STORAGE_KEY = "hamstersGrammarMine.player.v1";
  const PENDING_SESSION_KEY = "hgm_pending_minigame_result";
  const ASSET_ROOT = "assets/shared/showcase";

  const RANKS = [
    { id: "rookie_miner", name: "ROOKIE MINER", threshold: 0, badge: `${ASSET_ROOT}/badges/badge_rookie_miner.png` },
    { id: "cave_explorer", name: "CAVE EXPLORER", threshold: 50, badge: `${ASSET_ROOT}/badges/badge_cave_explorer.png` },
    { id: "gem_hunter", name: "GEM HUNTER", threshold: 110, badge: `${ASSET_ROOT}/badges/badge_gem_hunter.png` },
    { id: "gold_digger", name: "GOLD DIGGER", threshold: 180, badge: `${ASSET_ROOT}/badges/badge_gold_digger.png` },
    { id: "mine_expert", name: "MINE EXPERT", threshold: 260, badge: `${ASSET_ROOT}/badges/badge_mine_expert.png` },
    { id: "grammar_mine_master", name: "GRAMMAR MINE MASTER", threshold: 350, badge: `${ASSET_ROOT}/badges/badge_grammar_mine_master.png` }
  ];

  const AVATARS = {
    rapper: `${ASSET_ROOT}/avatars/avatar_rapper.png`,
    old_timer: `${ASSET_ROOT}/avatars/avatar_old_timer.png`,
    fashion_girl: `${ASSET_ROOT}/avatars/avatar_fashion_girl.png`,
    explorer_girl: `${ASSET_ROOT}/avatars/avatar_explorer_girl.png`,
    miner: `${ASSET_ROOT}/avatars/avatar_miner.png`,
    extreme: `${ASSET_ROOT}/avatars/avatar_extreme.png`
  };

  const SESSION_GAMES = {
    "grammar-gold-rush": {
      name: "Grammar Gold Rush",
      icon: `${ASSET_ROOT}/ui/session_icon_gold_rush.png`
    },
    "mine-cart-express": {
      name: "Mine Cart Express",
      icon: `${ASSET_ROOT}/ui/session_icon_mine_cart.png`
    },
    "haunted-grammar-cave": {
      name: "Haunted Grammar Cave",
      icon: `${ASSET_ROOT}/ui/session_icon_haunted_cave.png`
    }
  };
  const AVATAR_IDS = new Set([
    "rapper",
    "old_timer",
    "fashion_girl",
    "explorer_girl",
    "miner",
    "extreme"
  ]);

  const hub = document.querySelector(".showcase__stage");
  const welcomeLayer = document.querySelector("#welcome-layer");
  const welcomeForm = document.querySelector("#welcome-form");
  const nameInput = document.querySelector("#player-name");
  const avatarChoices = [...document.querySelectorAll(".avatar-choice")];
  const startButton = document.querySelector("#start-mining");
  const profileTrigger = document.querySelector(".showcase__profile");
  const profileLayer = document.querySelector("#profile-layer");
  const profileCloseButton = document.querySelector("#profile-modal-close");
  const profileBackButton = document.querySelector("#profile-modal-back");
  const profileResetButton = document.querySelector("#profile-reset");
  const sessionRows = document.querySelector("#recent-sessions-rows");
  const emptySessions = document.querySelector("#recent-sessions-empty");
  const hubReward = document.querySelector("#hub-reward");
  const hubRewardAmount = document.querySelector("#hub-reward-amount");
  const compactGemGroup = document.querySelector(".compact-profile__gems");
  const rankUpLayer = document.querySelector("#rank-up-layer");
  const rankUpBadge = document.querySelector("#rank-up-badge");
  const rankUpName = document.querySelector("#rank-up-name");
  const rankUpContinue = document.querySelector("#rank-up-continue");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let selectedAvatarId = null;
  let currentPlayer = null;

  function readStoredPlayer() {
    try {
      const storedValue = localStorage.getItem(PLAYER_STORAGE_KEY);
      if (!storedValue) return null;

      const player = JSON.parse(storedValue);
      const hasValidName = typeof player?.name === "string" && player.name.trim().length > 0;
      const hasValidAvatar = AVATAR_IDS.has(player?.avatarId);

      return hasValidName && hasValidAvatar ? player : null;
    } catch {
      return null;
    }
  }

  function writePlayer(player) {
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(player));
  }

  function applyPendingGameSession(player) {
    let session;
    try {
      session = JSON.parse(localStorage.getItem(PENDING_SESSION_KEY) || "null");
    } catch {
      localStorage.removeItem(PENDING_SESSION_KEY);
      return player;
    }

    const validGameIds = new Set(["grammar-gold-rush", "mine-cart-express", "haunted-grammar-cave"]);
    if (!session?.sessionId || !validGameIds.has(session.gameId)) return player;

    const processedIds = Array.isArray(player.processedSessionIds) ? player.processedSessionIds : [];
    if (processedIds.includes(session.sessionId)) {
      localStorage.removeItem(PENDING_SESSION_KEY);
      return player;
    }

    const sessionStats = session.stats ?? {};
    const profileStats = player.stats ?? {};
    const gemsEarned = safeNumber(session.gemsEarned);
    player.gems = safeNumber(player.gems) + gemsEarned;
    player.stats = {
      ...profileStats,
      gamesPlayed: safeNumber(profileStats.gamesPlayed) + 1,
      correctAnswers: safeNumber(profileStats.correctAnswers) + safeNumber(sessionStats.correctAnswers),
      ghostsDefeated: safeNumber(profileStats.ghostsDefeated) + safeNumber(sessionStats.ghostsDefeated),
      bestGoldRushGems: session.gameId === "grammar-gold-rush"
        ? Math.max(safeNumber(profileStats.bestGoldRushGems), gemsEarned)
        : safeNumber(profileStats.bestGoldRushGems)
    };
    player.sessions = [
      ...(Array.isArray(player.sessions) ? player.sessions : []),
      {
        sessionId: session.sessionId,
        gameId: session.gameId,
        gameName: session.gameName || SESSION_GAMES[session.gameId]?.name,
        topic: session.topic || "Completed",
        gemsEarned,
        stats: sessionStats,
        completedAt: session.completedAt,
        timestamp: session.completedAt
      }
    ].slice(-20);
    player.processedSessionIds = [...processedIds, session.sessionId].slice(-100);

    try {
      writePlayer(player);
      localStorage.removeItem(PENDING_SESSION_KEY);
    } catch {
      return player;
    }
    return player;
  }

  function trimmedPlayerName() {
    return nameInput.value.trim();
  }

  function safeNumber(value) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? Math.max(0, numericValue) : 0;
  }

  function getRankState(gemValue) {
    const gems = safeNumber(gemValue);
    let currentIndex = 0;

    RANKS.forEach((rank, index) => {
      if (gems >= rank.threshold) currentIndex = index;
    });

    const current = RANKS[currentIndex];
    const next = RANKS[currentIndex + 1] ?? null;

    if (!next) {
      return {
        current,
        next: null,
        progressText: "MASTER RANK",
        progressPercent: 100
      };
    }

    const segmentProgress = Math.max(0, gems - current.threshold);
    const segmentSize = next.threshold - current.threshold;
    const progressPercent = Math.min(100, Math.max(0, (segmentProgress / segmentSize) * 100));

    return {
      current,
      next,
      progressText: `${segmentProgress} / ${segmentSize} to ${next.name}`,
      progressPercent
    };
  }

  function renderSharedProfile(player) {
    const gems = safeNumber(player.gems);
    const avatarPath = AVATARS[player.avatarId];
    const rankState = getRankState(gems);

    document.querySelector("#compact-avatar").src = avatarPath;
    document.querySelector("#compact-name").textContent = player.name;
    document.querySelector("#compact-gems").textContent = gems.toLocaleString();
    document.querySelector("#compact-badge").src = rankState.current.badge;
    document.querySelector("#compact-progress-text").textContent = rankState.progressText;
    document.querySelector("#compact-progress-fill").style.width = `${rankState.progressPercent}%`;

    document.querySelector("#modal-avatar").src = avatarPath;
    document.querySelector("#modal-name").textContent = player.name;
    document.querySelector("#modal-gems").textContent = gems.toLocaleString();
    document.querySelector("#modal-badge").src = rankState.current.badge;
    document.querySelector("#modal-progress-text").textContent = rankState.progressText;
    document.querySelector("#modal-progress-fill").style.width = `${rankState.progressPercent}%`;

    profileTrigger.setAttribute("aria-label", `Open ${player.name}'s player profile`);
  }

  function renderStatistics(player) {
    const stats = player.stats ?? {};
    document.querySelector("#stat-games-played").textContent = safeNumber(stats.gamesPlayed).toLocaleString();
    document.querySelector("#stat-correct-answers").textContent = safeNumber(stats.correctAnswers).toLocaleString();
    document.querySelector("#stat-ghosts-defeated").textContent = safeNumber(stats.ghostsDefeated).toLocaleString();
    document.querySelector("#stat-best-gold-rush").textContent = safeNumber(stats.bestGoldRushGems).toLocaleString();
  }

  function sessionTimestamp(session) {
    const timestamp = Date.parse(session?.timestamp ?? "");
    return Number.isFinite(timestamp) ? timestamp : 0;
  }

  function renderSessions(player) {
    const sessions = Array.isArray(player.sessions) ? [...player.sessions] : [];
    sessions.sort((first, second) => sessionTimestamp(second) - sessionTimestamp(first));
    const recentSessions = sessions.slice(0, 3);

    sessionRows.replaceChildren();
    emptySessions.hidden = recentSessions.length > 0;

    recentSessions.forEach((session) => {
      const game = SESSION_GAMES[session.gameId];
      const row = document.createElement("div");
      row.className = "session-row";

      if (game) {
        const icon = document.createElement("img");
        icon.className = "session-row__icon";
        icon.src = game.icon;
        icon.alt = "";
        row.append(icon);
      } else {
        row.append(document.createElement("span"));
      }

      const gameName = document.createElement("span");
      gameName.className = "session-row__game";
      gameName.textContent = session.gameName || game?.name || "Mining Game";

      const topic = document.createElement("span");
      topic.className = "session-row__topic";
      topic.textContent = session.topic || session.activity || "—";

      const gems = document.createElement("span");
      gems.className = "session-row__gems";
      gems.textContent = `+${safeNumber(session.gemsEarned).toLocaleString()} gems`;

      row.append(gameName, topic, gems);
      sessionRows.append(row);
    });
  }

  function renderPlayer(player) {
    renderSharedProfile(player);
    renderStatistics(player);
    renderSessions(player);
  }

  function delay(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  }

  function animateFrame(duration, update) {
    if (reducedMotion.matches || duration <= 0) {
      update(1);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const startedAt = performance.now();

      function frame(now) {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        update(eased);

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          resolve();
        }
      }

      requestAnimationFrame(frame);
    });
  }

  function setCompactRankState(rankState, percent = rankState.progressPercent) {
    document.querySelector("#compact-badge").src = rankState.current.badge;
    document.querySelector("#compact-progress-text").textContent = rankState.progressText;
    document.querySelector("#compact-progress-fill").style.width = `${percent}%`;
  }

  function animateGemCounter(fromValue, toValue, duration) {
    const counter = document.querySelector("#compact-gems");
    return animateFrame(duration, (progress) => {
      const value = Math.round(fromValue + ((toValue - fromValue) * progress));
      counter.textContent = value.toLocaleString();
    });
  }

  function animateProgressPart(rankState, fromPercent, toPercent, duration) {
    const fill = document.querySelector("#compact-progress-fill");
    const label = document.querySelector("#compact-progress-text");

    return animateFrame(duration, (progress) => {
      const percent = fromPercent + ((toPercent - fromPercent) * progress);
      fill.style.width = `${Math.min(100, Math.max(0, percent))}%`;

      if (!rankState.next) {
        label.textContent = "MASTER RANK";
        return;
      }

      const segmentSize = rankState.next.threshold - rankState.current.threshold;
      const segmentValue = Math.round((percent / 100) * segmentSize);
      label.textContent = `${segmentValue} / ${segmentSize} to ${rankState.next.name}`;
    });
  }

  async function animateSegmentedProgress(previousGems, newGems) {
    const crossedRanks = RANKS.filter((rank) => (
      rank.threshold > previousGems && rank.threshold <= newGems
    ));
    const partCount = Math.max(1, crossedRanks.length + 1);
    const partDuration = reducedMotion.matches ? 0 : Math.max(150, 900 / partCount);
    let cursor = previousGems;

    setCompactRankState(getRankState(cursor));

    for (const crossedRank of crossedRanks) {
      const oldState = getRankState(cursor);
      await animateProgressPart(oldState, oldState.progressPercent, 100, partDuration);

      cursor = crossedRank.threshold;
      const promotedState = getRankState(cursor);
      setCompactRankState(promotedState, promotedState.next ? 0 : 100);
      if (!reducedMotion.matches) await delay(90);
    }

    const finalState = getRankState(newGems);
    const cursorState = getRankState(cursor);
    await animateProgressPart(
      finalState,
      cursorState.current.id === finalState.current.id ? cursorState.progressPercent : 0,
      finalState.progressPercent,
      partDuration
    );
  }

  function clearPendingReward() {
    if (!currentPlayer) return;
    currentPlayer.pendingHubReward = null;
    try {
      writePlayer(currentPlayer);
    } catch {
      // Keep the completed UI state even if storage is temporarily unavailable.
    }
  }

  function openRankUp(rank) {
    rankUpBadge.src = rank.badge;
    rankUpBadge.alt = rank.name;
    rankUpName.textContent = rank.name;
    rankUpLayer.hidden = false;
    rankUpLayer.classList.remove("is-active");
    requestAnimationFrame(() => {
      rankUpLayer.classList.add("is-active");
      rankUpContinue.focus();
    });
  }

  function closeRankUp() {
    rankUpLayer.classList.remove("is-active");
    rankUpLayer.hidden = true;
    clearPendingReward();
    renderPlayer(currentPlayer);
    hub.inert = false;
    profileTrigger.focus();
  }

  async function processPendingReward(reward) {
    const previousGems = safeNumber(reward.previousGemTotal);
    const newGems = safeNumber(reward.newGemTotal);
    const earnedGems = safeNumber(reward.gemsEarned || (newGems - previousGems));
    const previousRank = getRankState(previousGems).current;
    const newRank = getRankState(newGems).current;
    const rankChanged = previousRank.id !== newRank.id;

    reward.acknowledged = true;
    try {
      writePlayer(currentPlayer);
    } catch {
      return;
    }

    hub.inert = true;
    hub.setAttribute("aria-busy", "true");
    hubRewardAmount.textContent = `+${earnedGems.toLocaleString()}`;
    hubReward.setAttribute("aria-hidden", "false");
    hubReward.classList.add("is-visible");

    await delay(reducedMotion.matches ? 100 : 220);
    await Promise.all([
      animateGemCounter(previousGems, newGems, reducedMotion.matches ? 0 : 900),
      animateSegmentedProgress(previousGems, newGems)
    ]);

    compactGemGroup.classList.add("is-pulsing");
    await delay(reducedMotion.matches ? 120 : 420);
    compactGemGroup.classList.remove("is-pulsing");
    hubReward.classList.add("is-leaving");
    await delay(reducedMotion.matches ? 120 : 260);
    hubReward.classList.remove("is-visible", "is-leaving");
    hubReward.setAttribute("aria-hidden", "true");

    renderPlayer(currentPlayer);
    hub.removeAttribute("aria-busy");

    if (rankChanged) {
      openRankUp(newRank);
    } else {
      clearPendingReward();
      hub.inert = false;
    }
  }

  function updateStartButton() {
    startButton.disabled = !(trimmedPlayerName() && selectedAvatarId);
  }

  function showWelcome() {
    welcomeLayer.hidden = false;
    hub.inert = true;
    document.body.classList.add("onboarding-open");
    requestAnimationFrame(() => nameInput.focus());
  }

  function closeWelcome() {
    welcomeLayer.hidden = true;
    hub.inert = false;
    document.body.classList.remove("onboarding-open");
  }

  function openProfile() {
    if (!currentPlayer || !profileLayer.hidden) return;
    renderPlayer(currentPlayer);
    profileLayer.hidden = false;
    hub.inert = true;
    requestAnimationFrame(() => profileCloseButton.focus());
  }

  function closeProfile() {
    if (profileLayer.hidden) return;
    profileLayer.hidden = true;
    hub.inert = false;
    profileTrigger.focus();
  }

  function resetPlayerProfile() {
    try {
      localStorage.removeItem(PLAYER_STORAGE_KEY);
      localStorage.removeItem(PENDING_SESSION_KEY);
    } catch {
      return;
    }

    currentPlayer = null;
    selectedAvatarId = null;
    welcomeForm.reset();
    avatarChoices.forEach((choice) => choice.setAttribute("aria-pressed", "false"));
    updateStartButton();

    profileLayer.hidden = true;
    hub.inert = false;
    showWelcome();
  }

  function selectAvatar(choice) {
    selectedAvatarId = choice.dataset.avatarId;

    avatarChoices.forEach((avatarChoice) => {
      avatarChoice.setAttribute(
        "aria-pressed",
        String(avatarChoice === choice)
      );
    });

    updateStartButton();
  }

  function createPlayer(name, avatarId) {
    return {
      name,
      avatarId,
      gems: 0,
      sessions: [],
      stats: {
        gamesPlayed: 0,
        correctAnswers: 0,
        ghostsDefeated: 0,
        bestGoldRushGems: 0
      },
      pendingHubReward: null,
      processedSessionIds: []
    };
  }

  nameInput.addEventListener("input", updateStartButton);

  nameInput.addEventListener("blur", () => {
    nameInput.value = trimmedPlayerName();
    updateStartButton();
  });

  avatarChoices.forEach((choice) => {
    choice.addEventListener("click", () => selectAvatar(choice));
  });

  welcomeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = trimmedPlayerName();
    if (!name || !selectedAvatarId) {
      updateStartButton();
      return;
    }

    const player = createPlayer(name, selectedAvatarId);

    try {
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(player));
    } catch {
      return;
    }

    currentPlayer = player;
    renderPlayer(currentPlayer);
    closeWelcome();
  });

  profileTrigger.addEventListener("click", openProfile);
  profileCloseButton.addEventListener("click", closeProfile);
  profileBackButton.addEventListener("click", closeProfile);
  profileResetButton.addEventListener("click", resetPlayerProfile);
  rankUpContinue.addEventListener("click", closeRankUp);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !profileLayer.hidden && welcomeLayer.hidden) {
      event.preventDefault();
      closeProfile();
    }
  });

  currentPlayer = readStoredPlayer();
  if (currentPlayer) currentPlayer = applyPendingGameSession(currentPlayer);

  if (currentPlayer) {
    const pendingReward = currentPlayer.pendingHubReward;
    const shouldPlayReward = pendingReward && pendingReward.acknowledged !== true;
    const initialPlayer = shouldPlayReward
      ? { ...currentPlayer, gems: safeNumber(pendingReward.previousGemTotal) }
      : currentPlayer;

    renderPlayer(initialPlayer);
    closeWelcome();

    if (shouldPlayReward) {
      requestAnimationFrame(() => processPendingReward(pendingReward));
    }
  } else {
    showWelcome();
  }

  window.__HGM_DEV__ = Object.freeze({
    setPendingReward(previousGemTotal, newGemTotal, gameId = "grammar-gold-rush") {
      if (!currentPlayer) throw new Error("Create a player profile first.");

      const previous = safeNumber(previousGemTotal);
      const next = safeNumber(newGemTotal);
      if (next < previous) throw new Error("newGemTotal must be greater than or equal to previousGemTotal.");

      currentPlayer.gems = next;
      currentPlayer.pendingHubReward = {
        gameId,
        gemsEarned: next - previous,
        previousGemTotal: previous,
        newGemTotal: next,
        previousRankId: getRankState(previous).current.id,
        newRankId: getRankState(next).current.id,
        acknowledged: false
      };

      writePlayer(currentPlayer);
      location.reload();
    }
  });
})();
