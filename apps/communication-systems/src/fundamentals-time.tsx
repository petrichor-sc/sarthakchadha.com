import {useEffect, useState} from 'react';
import {ArrowRight} from 'lucide-react';
import {Choices, PlayButton, Readout, SignalChart, Slider, plotColors, useSamplePlayback} from './fundamentals-charts';
import {formatValue, samplePoints, shiftedBurst, sidedSignals, steps} from './fundamentals-model';

const sequenceInfo = {
  impulse: {
    label:'Unit impulse', symbol:'δ[n]',
    condition:'1 when n = 0. 0 everywhere else.',
    example:'Send a single test sample into a receiver filter. The output shows how the filter reacts to that one sample.',
  },
  step: {
    label:'Unit step', symbol:'u[n]',
    condition:'0 for n < 0. 1 for n ≥ 0.',
    example:'A transmitter turns on at a particular sample and stays on. That change in its enable signal is the shape of a step.',
  },
  ramp: {
    label:'Unit ramp', symbol:'r[n] = n u[n]',
    condition:'0 for n < 0. n for n ≥ 0.',
    example:'A digital volume fade can turn up one equal increment per sample. An actual fade stops at its target level.',
  },
};

export function BasicSequences({onOpenOctave}: {onOpenOctave: () => void}) {
  const [kind, setKind] = useState<keyof typeof steps>('impulse');
  const play = useSamplePlayback(-6, 10, 235, 0);
  const details = sequenceInfo[kind];
  const value = steps[kind](play.index);

  return <section className="sf-lab" aria-labelledby="sf-basic">
    <div className="sf-lab-heading"><h2 id="sf-basic">Three sequences to build with</h2><p>Pick a signal, then step through its integer sample indices.</p></div>
    <div className="sf-lab-grid">
      <div className="sf-workbench">
        <Choices label="Basic discrete-time signal" value={kind}
          options={[
            {value:'impulse', label:'Unit impulse'}, {value:'step', label:'Unit step'}, {value:'ramp', label:'Unit ramp'},
          ]} onChange={next => {setKind(next); play.seek(0);}}/>
        <SignalChart series={[{points:samplePoints(-6, 10, steps[kind]), kind:'stem', color:plotColors.sample, activeX:play.index}]}
          xRange={[-7, 11]} yRange={kind === 'ramp' ? [-.6, 11] : [-.2, 1.2]} integerX
          xLabel="n (sample index)" yLabel={kind === 'ramp' ? 'r[n]' : details.symbol}
          description={`${details.label}. ${details.condition} At n = ${play.index}, the value is ${value}.`}/>
        <div className="sf-controls">
          <Slider label="Inspect sample n" min={-6} max={10} value={play.index} onChange={play.seek}/>
          <PlayButton playing={play.playing} onClick={() => play.toggle(true)}>Play samples</PlayButton>
        </div>
        <Readout><span>Index <strong>n = {formatValue(play.index)}</strong></span><span>Amplitude <strong>x[n] = {value}</strong></span></Readout>
      </div>
      <div className="sf-explain">
        <h3>{details.label}</h3>
        <div className="sf-formula" aria-label={`${details.label}. ${details.condition}`}><strong>{details.symbol}</strong><span>{details.condition}</span></div>
        <p>{details.example}</p>
        <p>At <em>n</em> = 0, the impulse and step have value 1. The ramp starts at 0 and reaches 1 at <em>n</em> = 1.</p>
        <div className="sf-note"><strong>Make an impulse from two steps</strong><code>δ[n] = u[n] − u[n−1]</code><p>At zero only the first step is on. At later indices both are on, so their difference is zero.</p></div>
        <button type="button" className="sf-text-link" onClick={onOpenOctave}>Build the unit step in Octave <ArrowRight size={15}/></button>
      </div>
    </div>
  </section>;
}

export function ShiftLab() {
  const [delay, setDelay] = useState(1);
  const [applied, setApplied] = useState(1);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      const next = applied + Math.sign(delay);
      setApplied(next);
      if (next === delay) setPlaying(false);
    }, 340);
    return () => window.clearTimeout(timer);
  }, [applied, delay, playing]);

  function choose(value: number) {
    setPlaying(false);
    setDelay(value);
    setApplied(value);
  }

  function animate() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (delay === 0) return;
    if (applied === delay) setApplied(0);
    setPlaying(true);
  }

  const op = applied === 0 ? '1' : <span>z<sup>{formatValue(-applied)}</sup></span>;
  const index = applied === 0 ? 'n' : `n ${applied > 0 ? '−' : '+'} ${Math.abs(applied)}`;
  const role = delay < 0 ? 'advance' : delay > 0 ? 'delay' : 'unchanged';
  const time = Math.abs(applied) / 8;
  const outputPeak = 1 + applied;

  return <section className="sf-lab" aria-labelledby="sf-shift">
    <div className="sf-lab-heading"><h2 id="sf-shift">Move a signal in time</h2><p>Follow the same pulse through a sample delay or advance.</p></div>
    <div className="sf-workbench sf-shift-workbench">
      <div className="sf-controls sf-shift-controls">
        <Slider label="Shift d (samples)" min={-5} max={5} value={delay} onChange={choose} display={`${formatValue(delay)} · ${role}`}/>
        <div className="sf-button-row">
          <button type="button" className="button quiet" onClick={() => choose(-1)}>Advance 1</button>
          <button type="button" className="button quiet" onClick={() => choose(1)}>Delay 1</button>
          {delay !== 0 && <PlayButton playing={playing} onClick={animate}>Animate shift</PlayButton>}
        </div>
      </div>
      <div className="sf-shift-flow">
        <figure><figcaption>Input x[n]</figcaption><SignalChart
          series={[{points:samplePoints(-6, 9, n => shiftedBurst(n,0)), kind:'stem', color:plotColors.trace, activeX:1}]}
          xRange={[-6.5, 9.5]} yRange={[-.2, 1.2]} integerX xLabel="n (sample index)" yLabel="x[n]"
          description="Input pulse from n = 0 to n = 3. Its peak is 1 at n = 1."/></figure>
        <div className={'sf-shift-block'+(playing ? ' is-playing' : '')}>
          <ArrowRight aria-hidden="true"/><div><small>Operator</small><strong>{op}</strong></div><ArrowRight aria-hidden="true"/>
        </div>
        <figure><figcaption>Output y[n]</figcaption><SignalChart
          series={[
            {points:samplePoints(0, 3, n => shiftedBurst(n,0)), kind:'dot', color:plotColors.axis},
            {points:samplePoints(-6, 9, n => shiftedBurst(n, applied)), kind:'stem', color:plotColors.sample, activeX:outputPeak},
          ]}
          xRange={[-6.5, 9.5]} yRange={[-.2, 1.2]} integerX xLabel="n (sample index)" yLabel="y[n]"
          description={`Output shifted by ${applied} samples. Its peak is 1 at n = ${outputPeak}. Faint reference dots mark the input pulse.`}/></figure>
      </div>
      <p className="sf-small">Faint dots on the output plot mark the input’s original positions.</p>
      <Readout>
        <span>Operator notation <strong>y = {op} x</strong></span>
        <span>Element notation <strong>y[n] = x[{index}]</strong></span>
        <span>Peak moves <strong>n = 1 → {formatValue(outputPeak)}</strong></span>
      </Readout>
    </div>
    <div className="sf-lesson-pair">
      <div className="sf-explain">
        <h3>Which way does it go?</h3>
        <p><code>z⁻¹</code> reads the previous input, so <code>y[n] = x[n−1]</code>. The value from input index 1 appears at output index 2. That is a right shift.</p>
        <p><code>z</code> reads one index ahead, so <code>y[n] = x[n+1]</code>. The value from index 1 appears at index 0. That is a left shift.</p>
      </div>
      <div className="sf-note"><strong>Example · an audio buffer</strong><p>At 8,000 samples per second, one delay sample is 0.125 ms. A buffer can pass an earlier sample to the output as later samples arrive. An advance can be explored on a recording, where future samples are already available.</p>
        <p>Applied shift in this example <code>{formatValue(time)} ms {applied > 0 ? 'later' : applied < 0 ? 'earlier' : ''}</code>.</p>
      </div>
    </div>
  </section>;
}

const sides = {
  finite: {label:'Finite burst', formula:'x[n] = u[n−k] − u[n−k−4]', description:'Four nonzero samples from k through k+3. The tails are zero in both directions.'},
  right: {label:'Right-sided', formula:'x[n] = u[n−k]', description:'Zero for every n < k, then 1 from k onward. The right tail continues.'},
  left: {label:'Left-sided', formula:'x[n] = u[k−n]', description:'1 for n ≤ k, then zero. The left tail continues.'},
  both: {label:'Both-sided', formula:'x[n] = 0.8^|n−k|', description:'The sequence decays away from k in both directions and stays nonzero at every finite index.'},
};

export function PropertiesLab() {
  const [shape, setShape] = useState<'cosine'|'ramp'>('cosine');
  const [bound, setBound] = useState(1);
  const reveal = useSamplePlayback(0, 18, 175, 8);
  const [side, setSide] = useState<keyof typeof sidedSignals>('finite');
  const [shift, setShift] = useState(-2);
  const samples = samplePoints(0, reveal.index, n => shape === 'cosine' ? Math.cos(Math.PI * n / 4) : steps.ramp(n));
  const peak = Math.max(...samples.map(point => Math.abs(point.y)));
  const cosineLimit = Math.max(1, bound) + .35;
  const sided = sidedSignals[side];
  const negative = side === 'both' || side === 'left' || shift < 0;
  const nonnegative = side === 'both' || side === 'right' || (side === 'finite' ? shift + 3 >= 0 : shift >= 0);
  const occupied = negative && nonnegative ? 'Negative and nonnegative indices' : negative ? 'Negative indices only' : 'Nonnegative indices only';

  return <section className="sf-lab" aria-labelledby="sf-properties">
    <div className="sf-lab-heading"><h2 id="sf-properties">Amplitude limits and where signals live</h2><p>Grow the time window to test a limit, then slide a sequence across n = 0.</p></div>
    <div className="sf-lab-grid">
      <div className="sf-workbench">
        <h3>Boundedness</h3>
        <Choices label="Sequence for the amplitude limit" value={shape} options={[
          {value:'cosine', label:'Bounded cosine'}, {value:'ramp', label:'Unbounded ramp'},
        ]} onChange={next => {setShape(next); reveal.seek(8);}}/>
        <SignalChart series={[{points:samples, kind:'stem', color:plotColors.trace, activeX:reveal.index}]}
          xRange={[-.5,18.5]} yRange={shape === 'cosine' ? [-cosineLimit,cosineLimit] : [-bound-.5,19.5]}
          integerX xLabel="n (sample index)" yLabel="Amplitude"
          bounds={bound} description={`Samples through n = ${reveal.index}. Test limit plus or minus ${bound}. Largest visible magnitude is ${formatValue(peak)}.`}/>
        <Slider label="Test limit B" value={bound} min={.5} max={6} step={.5} onChange={setBound}/>
        <div className="sf-controls">
          <Slider label="Show samples through n" value={reveal.index} min={0} max={18} onChange={reveal.seek}/>
          <PlayButton playing={reveal.playing} onClick={() => reveal.toggle(true)}>Grow window</PlayButton>
        </div>
        <Readout><span>Largest visible |x[n]| <strong>{formatValue(peak)}</strong></span><span><strong>{peak > bound ? 'Exceeds B' : 'Within B in this window'}</strong></span></Readout>
      </div>
      <div className="sf-explain">
        <h3>One limit for the whole sequence</h3>
        <div className="sf-formula"><strong>|x[n]| ≤ B</strong><span>for every integer n, with some finite B</span></div>
        <p>The cosine stays between −1 and +1 for every n. Try B = 0.5, then B = 1. To call a signal bounded, you only need one finite B that works. The ramp eventually exceeds any finite B. A short view can hide that growth.</p>
        <p>Clipping is what happens if an amplifier or converter forces samples above its allowed level down to that level. Here the shaded band is a test, so the sample values remain visible when they exceed B.</p>
      </div>
    </div>
    <div className="sf-lab-grid sf-lab-divider">
      <div className="sf-workbench">
        <h3>Sidedness</h3>
        <Choices label="Sidedness example" value={side} options={[
          {value:'finite', label:'Finite burst'}, {value:'right', label:'Right-sided'}, {value:'left', label:'Left-sided'}, {value:'both', label:'Both-sided'},
        ]} onChange={setSide}/>
        <SignalChart series={[{points:samplePoints(-12,12,n => sided(n,shift)), kind:'stem', color:plotColors.sample, activeX:shift}]}
          xRange={[-12.5,12.5]} yRange={[-.22,1.23]} integerX xLabel="n (sample index)" yLabel="Amplitude"
          description={`${sides[side].label} example with k = ${shift}. ${occupied}. Peak magnitude is 1.`} bounds={1} markerX={0}/>
        <Slider label="Slide the sequence (k)" value={shift} min={-7} max={7} onChange={setShift}/>
        <Readout><span>Nonzero samples <strong>{occupied}</strong></span><span>Peak magnitude <strong>1</strong></span></Readout>
      </div>
      <div className="sf-explain">
        <h3>Look beyond the edges</h3>
        <div className="sf-formula"><strong>{sides[side].formula}</strong><span>{sides[side].description}</span></div>
        <p>The dashed vertical line marks n = 0. Move the finite burst across it to see how the nonzero samples move relative to the start of a recording.</p>
        <p>A time shift changes sample indices and preserves every amplitude, so <strong>boundedness stays the same</strong>. A shifted right-sided or left-sided sequence keeps its tail direction.</p>
        <p>A finite burst has a cutoff at each end. It can straddle zero while still having finite support. The both-sided example has nonzero tails extending to both infinities.</p>
      </div>
    </div>
  </section>;
}
