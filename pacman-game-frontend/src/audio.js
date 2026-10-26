const MUTE_KEY = 'pacman-muted';

let audioCtx = null;

const getMuted = () => {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
};

export const setMuted = (muted) => {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    /* ignore */
  }
};

export const isMuted = getMuted;

const context = () => {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

const tone = (freq, duration, type = 'square', gainValue = 0.06) => {
  if (getMuted()) return;
  const ctx = context();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(gainValue, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
};

export const sfx = {
  pellet: () => tone(880, 0.05, 'square', 0.04),
  power: () => {
    tone(220, 0.18, 'square', 0.07);
    setTimeout(() => tone(330, 0.18, 'square', 0.07), 80);
  },
  ghost: () => {
    tone(520, 0.12, 'square', 0.07);
    setTimeout(() => tone(780, 0.14, 'square', 0.06), 70);
  },
  fruit: () => {
    tone(660, 0.1, 'triangle', 0.08);
    setTimeout(() => tone(880, 0.12, 'triangle', 0.07), 90);
  },
  death: () => {
    tone(320, 0.12, 'sawtooth', 0.07);
    setTimeout(() => tone(180, 0.28, 'sawtooth', 0.06), 100);
  },
  levelClear: () => {
    tone(523, 0.12, 'square', 0.07);
    setTimeout(() => tone(659, 0.12, 'square', 0.07), 120);
    setTimeout(() => tone(784, 0.14, 'square', 0.08), 240);
    setTimeout(() => tone(1047, 0.22, 'triangle', 0.07), 380);
  },
};
