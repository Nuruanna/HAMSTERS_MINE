(() => {
  const HAMSTER_MOVE_MS = 150;

  function createHamster({ actor, sprite, getCell, canMove, onInteractionChanged, onCellEntered }) {
    const player = {
      row: 1,
      col: 8,
      facing: 'right',
      isMoving: false
    };

    actor.style.setProperty('--hamster-move-ms', `${HAMSTER_MOVE_MS}ms`);

    function renderIdle() {
      sprite.className = 'hamster-sprite sprite-idle';
      sprite.style.setProperty('--hamster-facing', player.facing === 'left' ? -1 : 1);
    }

    function renderPosition() {
      actor.style.setProperty('--hamster-x', `${(player.col - 1) * 100}%`);
      actor.style.setProperty('--hamster-y', `${(player.row - 1) * 100}%`);
    }

    function reset(row = 1, col = 8) {
      player.row = row;
      player.col = col;
      player.facing = 'right';
      player.isMoving = false;
      actor.style.transition = 'none';
      renderPosition();
      renderIdle();
      requestAnimationFrame(() => requestAnimationFrame(() => { actor.style.transition = ''; }));
      onInteractionChanged?.();
    }

    function faceTarget(row, col) {
      if (col < player.col) player.facing = 'left';
      else if (col > player.col) player.facing = 'right';
      renderIdle();
    }

    function move(rowOffset, colOffset) {
      if (!canMove() || player.isMoving) return false;
      const targetRow = player.row + rowOffset;
      const targetCol = player.col + colOffset;
      const targetCell = getCell(targetRow, targetCol);
      const canEnter = targetCell && (targetCell.state === 'OPEN' || (targetCell.state === 'DISCOVERED' && targetCell.object === 'chest'));
      if (!canEnter) return false;

      player.isMoving = true;
      if (colOffset < 0) player.facing = 'left';
      else if (colOffset > 0) player.facing = 'right';
      renderIdle();
      onInteractionChanged?.();

      player.row = targetRow;
      player.col = targetCol;
      renderPosition();

      setTimeout(() => {
        player.isMoving = false;
        onInteractionChanged?.();
        onCellEntered?.(targetCell);
      }, HAMSTER_MOVE_MS);
      return true;
    }

    function isTypingTarget(target) {
      return target instanceof Element && Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
    }

    function handleKeydown(event) {
      if (isTypingTarget(event.target) || !canMove()) return;
      const movements = {
        arrowup: [-1, 0], w: [-1, 0],
        arrowdown: [1, 0], s: [1, 0],
        arrowleft: [0, -1], a: [0, -1],
        arrowright: [0, 1], d: [0, 1]
      };
      const direction = movements[event.key.toLowerCase()];
      if (!direction) return;
      event.preventDefault();
      move(...direction);
    }

    addEventListener('keydown', handleKeydown);
    reset();

    return {
      state: player,
      move,
      reset,
      faceTarget,
      destroy() { removeEventListener('keydown', handleKeydown); }
    };
  }

  window.GoldRushHamster = { HAMSTER_MOVE_MS, createHamster };
})();
