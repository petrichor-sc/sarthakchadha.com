import {useEffect, useRef, useState} from 'react';
import {Volume2, Square} from 'lucide-react';
import {Choices, PhasorChart, PlayButton, Readout, SignalChart, Slider, plotColors, useSamplePlayback} from './fundamentals-charts';
import {TAU, curvePoints, formatValue, frequencyBins, fundamentalPeriod, guitarLevels, harmonicWave, samplePoints, signedAlias} from './fundamentals-model';

export function PeriodicityLab() {
  const [type, setType] = useState<'rational'|'irrational'>('rational');
  const [p, setP] = useState(2);
  const [q, setQ] = useState(5);
  const test = useSamplePlayback(1, 18, 420, 5);
  const rational = type === 'rational';
  const fraction = rational ? p / q : Math.SQRT2 / 10;
  const n0 = rational ? fundamentalPeriod(p,q) : null;
  const passes = n0 !== null && test.index % n0 === 0;
  const value = (n: number) => Math.cos(TAU * fraction * n);

  return <section className="sf-lab" aria-labelledby="sf-period">
    <div className="sf-lab-heading"><h2 id="sf-period">When do the samples repeat?</h2><p>Compare the sequence at n and n + N. A period makes every pair match.</p></div>
    <div className="sf-lab-grid">
      <div className="sf-workbench">
        <Choices label="Normalized frequency" value={type}
          options={[{value:'rational',label:'Rational p/q'}, {value:'irrational',label:'Irrational √2/10'}]} onChange={setType}/>
        {rational && <div className="sf-control-pair">
          <Slider label="Numerator p" min={0} max={12} value={p} onChange={setP}/>
          <Slider label="Denominator q" min={2} max={18} value={q} onChange={setQ}/>
        </div>}
        <div className="sf-legend"><span><i/>Original x[n]</span><span><i className="sf-teal"/>Test x[n + N]</span></div>
        <SignalChart series={[
          {points:samplePoints(0,18,value), kind:'stem', color:plotColors.trace},
          {points:samplePoints(0,18,n => value(n + test.index)), kind:'dot', color:plotColors.sample},
        ]} xRange={[-.5, 18.5]} yRange={[-1.2,1.2]} xLabel="n (sample index)" yLabel="Amplitude" integerX
          description={`Original samples overlaid with the sequence shifted in the comparison by N = ${test.index}. ${passes ? 'The sequences match.' : 'The sequences differ.'}`}/>
        <div className="sf-controls">
          <Slider label="Test period N (samples)" value={test.index} min={1} max={18} onChange={test.seek}/>
          <PlayButton playing={test.playing} onClick={() => test.toggle(true)}>Sweep N</PlayButton>
        </div>
        <Readout>
          <span>Candidate N = {test.index} <strong>{passes ? 'Matches at every n' : 'Fails the repeat test'}</strong></span>
          <span>Fundamental period <strong>{n0 === null ? 'None' : `${n0} ${n0 === 1 ? 'sample' : 'samples'}`}</strong></span>
        </Readout>
      </div>
      <div className="sf-explain">
        <h3>Check for whole turns</h3>
        <div className="sf-formula"><strong>x[n] = cos(2π ν n)</strong><span>ν = ω / (2π), in cycles per sample</span></div>
        <p>A period is a positive integer N with <code>x[n + N] = x[n]</code> for every n. The <strong>fundamental period</strong> is the smallest such N.</p>
        <p>The cosine here starts at 1. For it to return to 1 at n = N, its phase must advance by a whole number of turns. So <code>νN</code> must be an integer. That many turns also brings every other sample back to its original phase.</p>
        {n0 !== null ? <div className="sf-note"><strong>Reduce ν = {p}/{q}</strong>
          <p>The fraction reduces to {p * n0 / q}/{n0}. Its denominator gives <code>N₀ = {n0}</code>. At the current candidate N, <code>νN = {p * test.index}/{q}</code>{passes ? ' is an integer.' : ' is fractional.'}</p>
        </div> : <div className="sf-note"><strong>ν = √2/10 is irrational</strong><p>Multiplying by a positive integer cannot give an integer. The sequence has no exact period, even if some markers nearly line up.</p></div>}
        <p>For example, ν = 2/5 gives two turns in five samples. A single turn takes 2.5 sample intervals, so the sample pattern first repeats after five. A constant sequence, including the samples of sin(πn) at integer n, has period 1.</p>
      </div>
    </div>
  </section>;
}

export function PhasorLab() {
  const [increments, setIncrements] = useState(3);
  const [extraTurn, setExtraTurn] = useState(false);
  const play = useSamplePlayback(0,24,390,3);
  const units = increments + (extraTurn ? 24 : 0);
  const omega = Math.PI * units / 12;
  const index = play.index;
  const wrappedUnits = ((units * index % 24) + 24) % 24;
  const angle = Math.PI * wrappedUnits / 12;
  const phaseText = (unit: number) => `${formatValue(unit / 12)}π`;

  return <section className="sf-lab" aria-labelledby="sf-phasor">
    <div className="sf-lab-heading"><h2 id="sf-phasor">A rotating complex exponential</h2><p>Each sample takes one angular step around the unit circle.</p></div>
    <div className="sf-lab-grid">
      <div className="sf-workbench">
        <Slider label="Base angle per sample ω" min={-12} max={12} value={increments} onChange={setIncrements} display={`${phaseText(increments)} rad/sample`}/>
        <label className="sf-check"><input type="checkbox" checked={extraTurn} onChange={e => setExtraTurn(e.target.checked)}/>Add 2π radians per sample</label>
        <div className="sf-phasor-figures">
          <figure><figcaption>Complex plane</figcaption><PhasorChart omega={omega} index={index}/></figure>
          <figure><figcaption>Real and imaginary components</figcaption>
            <div className="sf-legend"><span><i/>cos(ωn)</span><span><i className="sf-teal"/>sin(ωn)</span></div>
            <SignalChart series={[
              {points:samplePoints(0, index, n => Math.cos(omega*n)), kind:'stem', color:plotColors.trace, activeX:index},
              {points:samplePoints(0, index, n => Math.sin(omega*n)), kind:'dot', color:plotColors.sample},
            ]} xRange={[-.5,24.5]} yRange={[-1.2,1.2]} integerX xLabel="n (sample index)" yLabel="Component"
              description={`At n = ${index}, cosine is ${formatValue(Math.cos(angle))} and sine is ${formatValue(Math.sin(angle))}.`}/>
          </figure>
        </div>
        <div className="sf-controls">
          <Slider label="Inspect sample n" min={0} max={24} value={index} onChange={play.seek}/>
          <PlayButton playing={play.playing} onClick={() => play.toggle(true)}>Play rotation</PlayButton>
        </div>
        <Readout>
          <span>Angle per sample <strong>{phaseText(units)} rad</strong></span>
          <span>Unwrapped phase <strong>{phaseText(units*index)} rad</strong></span>
          <span>Wrapped to [0, 2π) <strong>{phaseText(wrappedUnits)} rad</strong></span>
          <span>Position (Re, Im) <strong>({formatValue(Math.cos(angle))}, {formatValue(Math.sin(angle))})</strong></span>
        </Readout>
      </div>
      <div className="sf-explain">
        <h3>One angle, two components</h3>
        <div className="sf-formula"><strong>e<sup>jωn</sup> = cos(ωn) + j sin(ωn)</strong><span>The arrow has length 1. Its horizontal and vertical coordinates are the real and imaginary parts.</span></div>
        <p>Positive ω turns counterclockwise. Negative ω turns clockwise. After 2π radians the arrow points in the same direction as at 0 radians.</p>
        <p>The starting setting ω = π/4 reaches 2π at sample 8. Adding a full turn to <em>each</em> angular step changes the unwrapped phase and leaves every sample position exactly where it was.</p>
        <div className="sf-note"><strong>Why a receiver uses this</strong><p>A receiver can multiply its complex samples by a rotating phasor to shift a signal in frequency. The real and imaginary components are often called I and Q.</p></div>
      </div>
    </div>
  </section>;
}

export function AliasingLab() {
  const [rate, setRate] = useState(800);
  const [length, setLength] = useState(32);
  const sweep = useSamplePlayback(0,160,64,60);
  const frequency = sweep.index * 10;
  const alias = signedAlias(frequency,rate);
  const nyquist = rate / 2;
  const displaySpan = 20;
  const samples = samplePoints(0,Math.floor(rate * displaySpan / 1000), n => Math.cos(TAU * frequency * n / rate))
    .map(point => ({x: 1000 * point.x / rate, y: point.y}));
  const bins = frequencyBins(rate,length);

  return <section className="sf-lab" aria-labelledby="sf-alias">
    <div className="sf-lab-heading"><h2 id="sf-alias">Different tones, identical samples</h2><p>Watch the source frequency cross the Nyquist limit while the dots remain consistent with a different wave.</p></div>
    <div className="sf-lab-grid">
      <div className="sf-workbench">
        <div className="sf-controls">
          <Slider label="Original analog frequency" value={frequency} min={0} max={1600} step={10} display={`${frequency} Hz`} onChange={value => sweep.seek(value / 10)}/>
          <PlayButton playing={sweep.playing} onClick={() => sweep.toggle(true)}>Sweep frequency</PlayButton>
        </div>
        <label className="sf-select">Sampling rate f<sub>s</sub><select value={rate} onChange={e => setRate(Number(e.target.value))}>
          {[400,800,1200,1600].map(value => <option key={value} value={value}>{value} samples/s</option>)}
        </select></label>
        <div className="sf-legend"><span><i/>Original cosine</span><span><i className="sf-teal sf-dash"/>Folded cosine</span><span><i className="sf-amber sf-dot"/>Shared samples</span></div>
        <SignalChart series={[
          {points:curvePoints(0, displaySpan, ms => Math.cos(TAU * frequency * ms / 1000)), kind:'line', color:plotColors.trace},
          {points:curvePoints(0, displaySpan, ms => Math.cos(TAU * alias * ms / 1000)), kind:'line', color:plotColors.sample, dashed:true},
          {points:samples, kind:'dot', color:plotColors.highlight},
        ]} xRange={[0,displaySpan]} yRange={[-1.2,1.2]} xLabel="Time (ms)" yLabel="Amplitude"
          description={`${frequency} hertz cosine and its ${Math.abs(alias)} hertz alias at a sampling rate of ${rate}. Both curves pass through the same sample markers.`}/>
        <Readout>
          <span>Nyquist limit <strong>{nyquist} Hz</strong></span>
          <span>Signed alias <strong>{formatValue(alias)} Hz</strong></span>
          <span>Frequency of the folded cosine <strong>{Math.abs(alias)} Hz</strong></span>
        </Readout>
        <p className="sf-small">The two traces coincide when the original cosine is already within the range from 0 to the Nyquist limit.</p>
      </div>
      <div className="sf-explain">
        <h3>Sampling keeps phase modulo 2π</h3>
        <div className="sf-formula"><strong>ω = 2π f / f<sub>s</sub></strong><span>One extra turn per sample gives the same discrete-time complex exponential. Analog frequencies spaced by fₛ therefore give the same samples.</span></div>
        <p>A real cosine also has the same samples for opposite frequencies. With the starting settings, a 600 Hz tone sampled at 800 samples/s has a signed alias of −200 Hz. The dots also match a 200 Hz cosine.</p>
        <p>Audio interfaces use a low-pass filter before sampling to suppress high-frequency content that would fold into the recorded band.</p>
        <h3>How low or high can it go?</h3>
        <p><strong>DC is 0 Hz.</strong> Discrete time allows arbitrarily small positive frequencies. The largest unique frequency magnitude is <strong>π rad/sample</strong>, or <strong>f<sub>s</sub>/2</strong>. At that edge +π and −π are equivalent, and a cosine alternates +1, −1.</p>
        <div className="sf-note">
          <strong>Frequency bins for a finite record</strong>
          <Slider label="Record length N (samples)" value={length} min={8} max={64} onChange={setLength}/>
          <p>A discrete Fourier transform (DFT) checks a grid of frequencies. The first positive bin is <code>fₛ/N = {formatValue(bins.spacing)} Hz</code>. The highest nonnegative bin is <code>{formatValue(bins.last)} Hz</code>{length % 2 === 0 ? ', at the Nyquist limit.' : ', just below the Nyquist limit because N is odd.'}</p>
        </div>
      </div>
    </div>
  </section>;
}

export function HarmonicsLab() {
  const [fundamental, setFundamental] = useState(110);
  const [levels, setLevels] = useState([1,0,0,0,0,0]);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState('');
  const audio = useRef<AudioContext|null>(null);
  const active = useRef<AudioBufferSourceNode|null>(null);
  const cycleMs = 1000 / fundamental;

  useEffect(() => () => {
    if (active.current) {
      active.current.onended = null;
      active.current.stop();
      active.current = null;
    }
    void audio.current?.close().catch(() => undefined);
    audio.current = null;
  }, []);

  function toggleAudio() {
    if (active.current) {
      active.current.stop();
      return;
    }

    setAudioError('');
    try {
      const ctx = audio.current ?? new AudioContext();
      audio.current = ctx;
      const buffer = ctx.createBuffer(1, Math.floor(1.4 * ctx.sampleRate), ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < output.length; i++) {
        const t = i / ctx.sampleRate;
        const attack = Math.min(t / .008, 1);
        const release = Math.min((output.length - i) / (.04 * ctx.sampleRate),1);
        const tone = levels.reduce((sum,a,j) => a === 0 ? sum : sum + a * Math.exp(-(2.1+.78*j)*t) * Math.sin(TAU * fundamental * (j+1) * t),0);
        output[i] = .25 * attack * release * tone;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      active.current = source;
      source.onended = () => {
        source.disconnect();
        if (active.current === source) {
          active.current = null;
          setPlaying(false);
        }
      };
      source.start();
      setPlaying(true);
      void ctx.resume().catch(() => {
        if (active.current === source) {
          source.stop();
          setAudioError('Audio playback is unavailable here.');
        }
      });
    } catch {
      setAudioError('Audio playback is unavailable here.');
    }
  }

  const peaks = levels.flatMap((level,i) => level > 0 ? [{x: fundamental * (i+1), y:level}] : []);
  return <section className="sf-lab" aria-labelledby="sf-harmonics">
    <div className="sf-lab-heading"><h2 id="sf-harmonics">Build a plucked string from harmonics</h2><p>Start with the open A string. Add its overtones and hear how the waveform and tone change.</p></div>
    <div className="sf-lab-grid">
      <div className="sf-workbench">
        <div className="sf-controls sf-harmonic-controls">
          <label className="sf-select">String<select value={fundamental} onChange={e => setFundamental(Number(e.target.value))}>
            <option value={82.41}>Low E · E2 (82.41 Hz)</option>
            <option value={110}>A · A2 (110 Hz)</option>
            <option value={329.63}>High E · E4 (329.63 Hz)</option>
          </select></label>
          <button className="button primary sf-play" type="button" onClick={toggleAudio}>{playing ? <Square size={15}/> : <Volume2 size={15}/>}
            {playing ? 'Stop sound' : 'Listen to pluck'}</button>
        </div>
        {(audioError || playing) && <p className="sf-small" role="status">{audioError || 'Playing the current harmonic settings.'}</p>}
        <div className="sf-button-row">
          <button className="button quiet" type="button" onClick={() => setLevels([1,0,0,0,0,0])}>Fundamental only</button>
          <button className="button quiet" type="button" onClick={() => setLevels(guitarLevels)}>All harmonics</button>
        </div>
        <div className="sf-harmonic-picker">
          <div className="sf-harmonic-chip"><strong>1st</strong><span>{fundamental} Hz</span><small>Fundamental</small></div>
          {levels.slice(1).map((level, i) => <label key={i} className="sf-harmonic-chip">
            <input type="checkbox" checked={level > 0} onChange={e => {
              const next = [...levels];
              next[i+1] = e.target.checked ? guitarLevels[i+1] : 0;
              setLevels(next);
            }}/>
            <strong>H{i+2}</strong><span>{formatValue((i+2)*fundamental,2)} Hz</span>
          </label>)}
        </div>
        <figure><figcaption>Frequency spectrum</figcaption>
          <SignalChart series={[{points:peaks, kind:'stem', color:plotColors.sample, activeX:fundamental}]}
            xRange={[0,6.4*fundamental]} yRange={[-.08,1.18]} xLabel="Frequency (Hz)" yLabel="Relative level"
            description={`Spectrum with ${peaks.length} active harmonic frequencies at ${peaks.map(peak => formatValue(peak.x,2)).join(', ')} hertz.`}/></figure>
        <figure><figcaption>Waveform over two periods</figcaption>
          <SignalChart series={[{points:curvePoints(0,2*cycleMs, ms => harmonicWave(ms/1000,fundamental,levels)), kind:'line', color:plotColors.trace}]}
            xRange={[0,2*cycleMs]} yRange={[-2.2,2.2]} xLabel="Time (ms)" yLabel="Amplitude" xTicks={[0,cycleMs,2*cycleMs]} markerX={cycleMs}
            description={`Sum of ${peaks.length} harmonics over two periods of ${formatValue(cycleMs)} milliseconds each.`}/></figure>
      </div>
      <div className="sf-explain">
        <h3>Multiples of the same note</h3>
        <div className="sf-formula"><strong>f<sub>k</sub> = k f<sub>0</sub></strong><span>Harmonic k has frequency k times the fundamental.</span></div>
        <p>The frequency slots are spaced by {fundamental} Hz for this string. Its motion contains several vibration modes. Adding more of them changes the waveform and timbre while the fundamental stays fixed.</p>
        <p>The dashed line marks one period, <code>T₀ = 1/f₀ ≈ {formatValue(cycleMs)} ms</code>. In that time the fundamental makes one turn, the second harmonic makes two, and the third makes three.</p>
        <p>The sound uses the same frequencies with falling amplitudes to model a pluck. The higher harmonics fade faster.</p>
        <div className="sf-note"><strong>Harmonics and aliasing</strong><p>Harmonics are components already present in a waveform. Aliasing happens when sampling maps different frequencies to the same sequence. A low sample rate can make upper string harmonics show up in the wrong place.</p></div>
      </div>
    </div>
  </section>;
}
