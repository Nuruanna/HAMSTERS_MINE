(() => {
  const GRID_COLS = 13;
  const GRID_ROWS = 6;
  const START_SHAFT_COLUMN = 8;
  const START_SHAFT_ROW = 1;

  const CELL_STATES = Object.freeze({
    HIDDEN: 'HIDDEN',
    DISCOVERED: 'DISCOVERED',
    OPEN: 'OPEN'
  });

  const BLOCK_TYPES = Object.freeze({
    DIRT: 'DIRT',
    STONE: 'STONE',
    GOLD: 'GOLD',
    HARD_ROCK: 'HARD_ROCK'
  });

  const LEVEL_1_CONFIG = Object.freeze({
    geology: Object.freeze({
      DIRT: 0.40,
      STONE: 0.35,
      GOLD: 0.17,
      HARD_ROCK: 0.08
    }),
    startSafetyGeology: Object.freeze({
      DIRT: 0.60,
      STONE: 0.40
    }),
    rewards: Object.freeze({
      STONE: Object.freeze({ none: 0.60, gem_blue: 0.20, gem_green_red: 0.15, gem_purple_pink_yellow: 0.05 }),
      GOLD: Object.freeze({ none: 0.25, gem_blue: 0.25, gem_green_red: 0.30, gem_purple_pink_yellow: 0.20 }),
      HARD_ROCK: Object.freeze({ none: 0.25, gem_blue: 0.25, gem_green_red: 0.30, gem_purple_pink_yellow: 0.20 })
    }),
    chestCount: 2,
    chestOutcomes: Object.freeze({ treasure: 0.75, ghost: 0.25 })
  });

  const BLOCK_CONFIG = Object.freeze({
    DIRT: Object.freeze({ maxHp: 1, asset: 'assets/blocks/block_dirt.png' }),
    STONE: Object.freeze({ maxHp: 3, asset: 'assets/blocks/block_stone.png' }),
    GOLD: Object.freeze({ maxHp: 3, asset: 'assets/blocks/block_gold_ore.png' }),
    HARD_ROCK: Object.freeze({ maxHp: 5, asset: 'assets/blocks/block_hard_rock.png' })
  });

  const HIDDEN_ASSET = 'assets/background/tile_dark_hidden.png';
  const OBJECT_ASSETS = Object.freeze({ chest: 'assets/objects/chest_closed_tile.png' });
  const REWARD_ASSETS = Object.freeze({
    gem_blue: 'assets/rewards/gem_blue.png',
    gem_green_red: 'assets/rewards/gem_green_red.png',
    gem_purple_pink_yellow: 'assets/rewards/gem_purple_pink_yellow.png',
    lucky7: 'assets/rewards/lucky7_reward.png'
  });
  const ORTHOGONAL_DIRECTIONS = Object.freeze([
    Object.freeze([-1, 0]),
    Object.freeze([1, 0]),
    Object.freeze([0, -1]),
    Object.freeze([0, 1])
  ]);

  let levelMap = [];
  let gridElement = null;

  function weightedType(weights) {
    const roll = Math.random();
    let boundary = 0;
    for (const [type, weight] of Object.entries(weights)) {
      boundary += weight;
      if (roll < boundary) return type;
    }
    return Object.keys(weights).at(-1);
  }

  function weightedReward(type) {
    const weights = LEVEL_1_CONFIG.rewards[type];
    if (!weights) return null;
    const selected = weightedType(weights);
    return selected === 'none' ? null : selected;
  }

  function isStartNeighbour(row, col) {
    return Math.abs(row - START_SHAFT_ROW) + Math.abs(col - START_SHAFT_COLUMN) === 1;
  }

  function createCell(row, col) {
    const type = weightedType(
      isStartNeighbour(row, col) ? LEVEL_1_CONFIG.startSafetyGeology : LEVEL_1_CONFIG.geology
    );
    const maxHp = BLOCK_CONFIG[type].maxHp;
    return {
      row,
      col,
      type,
      state: CELL_STATES.HIDDEN,
      hp: maxHp,
      maxHp,
      reward: weightedReward(type),
      object: null
    };
  }

  function getCell(row, col) {
    if (row < 1 || row > GRID_ROWS || col < 1 || col > GRID_COLS) return null;
    return levelMap[row - 1]?.[col - 1] ?? null;
  }

  function discoverOrthogonalNeighbours(row, col) {
    ORTHOGONAL_DIRECTIONS.forEach(([rowOffset, colOffset]) => {
      const neighbour = getCell(row + rowOffset, col + colOffset);
      if (neighbour?.state === CELL_STATES.HIDDEN) {
        neighbour.state = CELL_STATES.DISCOVERED;
      }
    });
  }

  function setCellOpen(row, col) {
    const cell = getCell(row, col);
    if (!cell) return false;
    cell.state = CELL_STATES.OPEN;
    cell.hp = 0;
    discoverOrthogonalNeighbours(row, col);
    renderMap();
    return true;
  }

  function generateLevel1() {
    levelMap = Array.from({ length: GRID_ROWS }, (_, rowIndex) =>
      Array.from({ length: GRID_COLS }, (_, colIndex) => createCell(rowIndex + 1, colIndex + 1))
    );

    const startCell = getCell(START_SHAFT_ROW, START_SHAFT_COLUMN);
    startCell.reward = null;
    startCell.state = CELL_STATES.OPEN;
    startCell.hp = 0;
    discoverOrthogonalNeighbours(START_SHAFT_ROW, START_SHAFT_COLUMN);
    placeSpecials();
    renderMap();
    return levelMap;
  }

  function shuffled(cells) {
    return [...cells].sort(() => Math.random() - 0.5);
  }

  function placeSpecials() {
    const cells = levelMap.flat();
    const luckyCandidates = cells.filter((cell) =>
      cell.type !== BLOCK_TYPES.DIRT
      && !(cell.row === START_SHAFT_ROW && cell.col === START_SHAFT_COLUMN)
    );
    const luckyCell = shuffled(luckyCandidates)[0]
      || cells.find((cell) => !(cell.row === START_SHAFT_ROW && cell.col === START_SHAFT_COLUMN));
    if (luckyCell && luckyCell.type === BLOCK_TYPES.DIRT) {
      luckyCell.type = BLOCK_TYPES.STONE;
      luckyCell.maxHp = BLOCK_CONFIG.STONE.maxHp;
      luckyCell.hp = luckyCell.maxHp;
    }
    if (luckyCell) luckyCell.reward = 'lucky7';

    const chestCandidates = shuffled(cells.filter((cell) =>
      cell !== luckyCell
      && cell.row > 1
      && !isStartNeighbour(cell.row, cell.col)
      && !(cell.row === START_SHAFT_ROW && cell.col === START_SHAFT_COLUMN)
    ));
    chestCandidates.slice(0, LEVEL_1_CONFIG.chestCount).forEach((cell) => {
      cell.object = 'chest';
      cell.reward = null;
    });
  }

  function createCellElement(cell) {
    const element = document.createElement('div');
    element.className = `mine-cell state-${cell.state.toLowerCase()}`;
    element.dataset.row = cell.row;
    element.dataset.col = cell.col;
    element.dataset.state = cell.state;

    if (cell.state !== CELL_STATES.OPEN) {
      const image = document.createElement('img');
      image.className = 'cell-visual';
      image.alt = '';
      image.draggable = false;
      image.src = cell.state === CELL_STATES.HIDDEN
        ? HIDDEN_ASSET
        : cell.object === 'chest'
          ? OBJECT_ASSETS.chest
          : BLOCK_CONFIG[cell.type].asset;
      if (cell.object === 'chest' && cell.state === CELL_STATES.DISCOVERED) image.classList.add('object-visual');
      element.append(image);

      const damage = cell.maxHp - cell.hp;
      if (cell.state === CELL_STATES.DISCOVERED && damage > 0 && cell.hp > 0 && cell.maxHp > 1) {
        const crackStage = Math.max(1, Math.min(5, Math.round((damage / (cell.maxHp - 1)) * 5)));
        const crack = document.createElement('img');
        crack.className = 'crack-visual';
        crack.alt = '';
        crack.draggable = false;
        crack.src = `assets/effects/crack_overlay_${crackStage}.png`;
        element.append(crack);
      }
    } else if (cell.reward && REWARD_ASSETS[cell.reward]) {
      const reward = document.createElement('img');
      reward.className = 'reward-visual';
      reward.alt = '';
      reward.draggable = false;
      reward.src = REWARD_ASSETS[cell.reward];
      element.append(reward);
    }
    return element;
  }

  function renderMap() {
    if (!gridElement || levelMap.length === 0) return;
    const fragment = document.createDocumentFragment();
    levelMap.forEach((row) => row.forEach((cell) => fragment.append(createCellElement(cell))));
    gridElement.replaceChildren(fragment);
  }

  function initializeMap(grid) {
    gridElement = grid;
    generateLevel1();
  }

  function getMap() {
    return levelMap;
  }

  window.GoldRushMap = {
    GRID_COLS,
    GRID_ROWS,
    START_SHAFT_COLUMN,
    START_SHAFT_ROW,
    CELL_STATES,
    BLOCK_TYPES,
    BLOCK_CONFIG,
    LEVEL_1_CONFIG,
    initializeMap,
    generateLevel1,
    getMap,
    getCell,
    setCellOpen,
    discoverOrthogonalNeighbours,
    renderMap
  };
})();
