export const unitStepCode = `clear;
clc;

Ts = 0.1;
t = -1:Ts:2;

u = double(t >= 0);

stem(t, u);
xlabel('Time (seconds)');
ylabel('Signal amplitude');
grid on;`;

export type StepSimulation = {
  times: number[];
  values: number[];
  ts: number;
  threshold: number;
  operator: '>=' | '>';
  xlabel: string;
  ylabel: string;
  grid: boolean;
};

// This is a bounded lesson simulator, not an evaluator for Octave or JavaScript.
export function simulateUnitStep(code: string): StepSimulation {
  const numeric = '([+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?)';
  const pattern = new RegExp('^clear\\s*;\\s*clc\\s*;\\s*Ts\\s*=\\s*'+numeric+'\\s*;\\s*t\\s*=\\s*'+numeric+'\\s*:\\s*Ts\\s*:\\s*'+numeric+'\\s*;\\s*u\\s*=\\s*double\\s*\\(\\s*t\\s*(>=|>)\\s*'+numeric+'\\s*\\)\\s*;\\s*stem\\s*\\(\\s*t\\s*,\\s*u\\s*\\)\\s*;\\s*xlabel\\s*\\(\\s*\'([^\'\\r\\n]{0,60})\'\\s*\\)\\s*;\\s*ylabel\\s*\\(\\s*\'([^\'\\r\\n]{0,60})\'\\s*\\)\\s*;\\s*grid\\s+(on|off)\\s*;?\\s*$');
  // Remove comments outside quoted axis labels.
  const clean = code.replace(/'[^'\r\n]*'|%[^\n]*/g, token => token.startsWith('%') ? '' : token).trim();
  const match = clean.match(pattern);
  if (!match) throw new Error('Keep this lesson’s command structure. You can edit Ts, the time limits, the comparison (>= or >), the threshold, axis labels, and grid on/off. Reset code restores the example.');
  const ts = Number(match[1]), start = Number(match[2]), end = Number(match[3]);
  const operator = match[4] as '>=' | '>', threshold = Number(match[5]);
  if (![ts,start,end,threshold].every(Number.isFinite) || ts <= 0 || end <= start)
    throw new Error('Use a positive Ts and an end time greater than the start time.');
  const count = Math.floor((end-start)/ts + 1e-10) + 1;
  if (!Number.isFinite(count) || count < 2 || count > 301)
    throw new Error('Choose a range and Ts that create between 2 and 301 samples so you can inspect every stem.');
  const times = Array.from({length:count}, (_,i) => Number((start+i*ts).toPrecision(14)));
  if (times.some((v,i) => !Number.isFinite(v) || (i > 0 && v <= times[i-1])))
    throw new Error('Use a larger Ts or smaller time limits so each sample time is distinct.');
  const values = times.map(t => Number(operator === '>=' ? t >= threshold : t > threshold));
  return {times, values, ts, threshold, operator, xlabel:match[6], ylabel:match[7], grid:match[8]==='on'};
}
