(() => {
  let context = null;

  function ensure() {
    if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
    if (context.state === 'suspended') context.resume();
    return context;
  }

  function tone(frequency, duration = 0.09, offset = 0, endFrequency = frequency, type = 'sine', gainValue = 0.07) {
    const audio = ensure();
    const start = audio.currentTime + offset;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, endFrequency), start + duration);
    gain.gain.setValueAtTime(gainValue, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(start + duration);
  }

  const effects = {
    pickaxe: () => tone(950, .055, 0, 620, 'square', .035),
    blockBreak: () => tone(150, .13, 0, 55, 'sawtooth', .06),
    gem: () => { tone(740, .09); tone(1110, .12, .07); },
    chest: () => { tone(330, .1); tone(660, .16, .09); },
    correct: () => { tone(520, .1); tone(780, .15, .08); },
    wrong: () => { tone(230, .12, 0, 150, 'triangle'); tone(145, .14, .1, 90, 'triangle'); },
    ghost: () => { tone(210, .28, 0, 330, 'sine', .05); tone(310, .25, .05, 170, 'sine', .035); },
    lucky7: () => [660, 880, 1100, 1320].forEach((note, index) => tone(note, .12, index * .055, note * 1.05, 'sine', .055))
  };

  window.GoldRushSound = {
    ensure,
    play(name) { effects[name]?.(); }
  };
})();
