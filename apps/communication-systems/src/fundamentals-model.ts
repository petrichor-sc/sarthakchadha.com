import type {Point} from './signals';

export const TAU = 2 * Math.PI;

export function formatValue(value: number, precision = 3) {
  const rounded = Number(value.toFixed(precision));
  return String(rounded).replace('-', '−');
}

export function samplePoints(start: number, end: number, value: (n: number) => number): Point[] {
  return Array.from({length: end - start + 1}, (_, i) => {
    const x = start + i;
    return {x, y: value(x)};
  });
}

export function curvePoints(start: number, end: number, value: (t: number) => number, segments = 480): Point[] {
  return Array.from({length: segments + 1}, (_, i) => {
    const x = start + (end - start) * i / segments;
    return {x, y: value(x)};
  });
}

export const steps = {
  impulse: (n: number) => Number(n === 0),
  step: (n: number) => Number(n >= 0),
  ramp: (n: number) => Math.max(0, n),
};

export const exampleSignals = {
  audio: {
    name: 'Audio',
    measurement: 'Microphone voltage',
    text: 'A microphone turns changes in air pressure into a voltage. A recorder measures that voltage at regular times and stores the readings as samples.',
    unit: 'Relative voltage',
    value: (t: number) => .72 * Math.sin(TAU * 2 * t) + .2 * Math.sin(TAU * 4 * t + .4),
  },
  vision: {
    name: 'Visual',
    measurement: 'Pixel brightness',
    text: 'Follow the light at one pixel as an object passes a camera. A smooth trace models the changing light. The sequence takes one brightness reading at each frame.',
    unit: 'Relative brightness',
    value: (t: number) => .2 + .64 * Math.exp(-28 * (t - .52) ** 2) + .1 * Math.cos(TAU * 2 * t),
  },
  radio: {
    name: 'Radio',
    measurement: 'Receiver voltage',
    text: 'An antenna picks up a changing voltage. After the receiver moves the signal to a suitable frequency, its sampler takes readings so software can process it.',
    unit: 'Relative voltage',
    value: (t: number) => (.53 + .28 * Math.sin(TAU * t)) * Math.cos(TAU * 5 * t),
  },
};

export const burst = (n: number) => [0.25, 1, 0.6, 0.3][n] ?? 0;
export const shiftedBurst = (n: number, delay: number) => burst(n - delay);

export const sidedSignals = {
  right: (n: number, k: number) => steps.step(n - k),
  left: (n: number, k: number) => steps.step(k - n),
  both: (n: number, k: number) => .8 ** Math.abs(n - k),
  finite: (n: number, k: number) => steps.step(n - k) - steps.step(n - k - 4),
};

export function fundamentalPeriod(numerator: number, denominator: number) {
  let a = Math.abs(numerator);
  let b = denominator;
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return denominator / a;
}

export function wrapPhase(phase: number) {
  const wrapped = ((phase % TAU) + TAU) % TAU;
  return TAU - wrapped < 1e-12 ? 0 : wrapped;
}

export function signedAlias(frequency: number, rate: number) {
  return ((frequency + rate / 2) % rate + rate) % rate - rate / 2;
}

export function frequencyBins(rate: number, length: number) {
  return {spacing: rate / length, last: Math.floor(length / 2) * rate / length};
}

export const guitarLevels = [1, .52, .29, .18, .11, .06];

export function harmonicWave(time: number, fundamental: number, levels: number[]) {
  return levels.reduce((sum, level, i) => sum + level * Math.sin(TAU * fundamental * (i + 1) * time), 0);
}
