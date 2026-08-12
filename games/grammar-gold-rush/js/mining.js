(() => {
  function createMining({ grid, mapApi, hamster, canInteract, onFinalHit, onBlockDestroyed, soundFX }) {
    let processingHit = false;
    let pointerX = -100;
    let pointerY = -100;
    const cursor = document.createElement('div');
    cursor.className = 'pickaxe-cursor';
    document.body.append(cursor);

    function isAdjacent(cell) {
      return Math.abs(cell.row - hamster.state.row) + Math.abs(cell.col - hamster.state.col) === 1;
    }

    function isMineable(cell) {
      return Boolean(
        cell
        && canInteract()
        && !processingHit
        && !hamster.state.isMoving
        && cell.state === mapApi.CELL_STATES.DISCOVERED
        && !cell.object
        && mapApi.BLOCK_CONFIG[cell.type]
        && isAdjacent(cell)
      );
    }

    function refreshMineableCells() {
      grid.querySelectorAll('.mine-cell').forEach((element) => {
        const cell = mapApi.getCell(Number(element.dataset.row), Number(element.dataset.col));
        element.classList.toggle('is-mineable', isMineable(cell));
      });
      refreshCursor();
    }

    function refreshCursor() {
      const element = document.elementFromPoint(pointerX, pointerY)?.closest('.mine-cell');
      const cell = element && grid.contains(element)
        ? mapApi.getCell(Number(element.dataset.row), Number(element.dataset.col))
        : null;
      cursor.classList.toggle('is-visible', isMineable(cell));
      cursor.style.left = `${pointerX}px`;
      cursor.style.top = `${pointerY}px`;
    }

    // Stage 5 can intercept this function before opening Stone/Gold/Hard Rock.
    function handleBlockFinalHit(cell, preserveReward) {
      if (!preserveReward) cell.reward = null;
      mapApi.setCellOpen(cell.row, cell.col);
      onBlockDestroyed?.(cell);
    }

    async function hitCell(cell) {
      if (!isMineable(cell)) return false;
      processingHit = true;
      hamster.faceTarget(cell.row, cell.col);
      soundFX?.play('pickaxe');
      cell.hp = Math.max(0, cell.hp - 1);

      if (cell.hp === 0) {
        const preserveReward = await onFinalHit(cell);
        soundFX?.play('blockBreak');
        handleBlockFinalHit(cell, preserveReward);
      } else mapApi.renderMap();

      processingHit = false;
      refreshMineableCells();
      return true;
    }

    function handleGridClick(event) {
      const element = event.target.closest('.mine-cell');
      if (!element || !grid.contains(element)) return;
      const cell = mapApi.getCell(Number(element.dataset.row), Number(element.dataset.col));
      hitCell(cell);
    }

    function handlePointerMove(event) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      refreshCursor();
    }

    grid.addEventListener('click', handleGridClick);
    document.addEventListener('pointermove', handlePointerMove);

    return {
      refresh: refreshMineableCells,
      hitCell,
      isMineable,
      isProcessing: () => processingHit,
      destroy() { grid.removeEventListener('click', handleGridClick); document.removeEventListener('pointermove', handlePointerMove); cursor.remove(); }
    };
  }

  window.GoldRushMining = { createMining };
})();
