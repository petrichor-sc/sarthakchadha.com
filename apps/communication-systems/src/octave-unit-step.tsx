import {useState} from 'react';
import {downloadFile} from './storage';
import {simulateUnitStep,unitStepCode,type StepSimulation} from './octave-step-model';

const format = (x:number) => Number(x.toPrecision(8)).toString();

function StemPlot({data,selected}:{data:StepSimulation;selected:number}) {
  const left=72,right=614,baseline=214,top=52;
  const start=data.times[0],end=data.times.at(-1)!;
  const x=(t:number)=>left+(t-start)/(end-start)*(right-left);
  const y=(v:number)=>baseline-v*(baseline-top);
  const ticks=Array.from({length:5},(_,i)=>start+(end-start)*i/4);
  return <svg className="step-stem-plot" viewBox="0 0 650 294" role="img" aria-label={`Stem plot of ${data.times.length} discrete samples. Each amplitude is 0 or 1. Selected time ${format(data.times[selected])} seconds has amplitude ${data.values[selected]}.`}>
    <title>Discrete-time step samples</title>
    {data.grid&&<g stroke="#314458" strokeDasharray="3 5">{ticks.map((t,i)=><line key={i} x1={x(t)} x2={x(t)} y1="32" y2={baseline}/>)}{[0,.5,1].map(v=><line key={v} x1={left} x2={right} y1={y(v)} y2={y(v)}/>)}</g>}
    <path d={`M${left} 32 V${baseline} H${right}`} fill="none" stroke="#9fb3ca"/>
    {start<0&&end>0&&<line x1={x(0)} x2={x(0)} y1="32" y2={baseline} stroke="#9fb3ca" opacity=".5"/>}
    {data.times.map((t,i)=><g key={i} stroke={i===selected?'#dcf5b5':'#8fbbff'} strokeWidth={i===selected?3:1.5}>
      <line x1={x(t)} x2={x(t)} y1={baseline} y2={y(data.values[i])}/>
      <circle cx={x(t)} cy={y(data.values[i])} r={i===selected?6:3} fill="#0b121e"/>
    </g>)}
    {ticks.map((t,i)=><text key={i} x={x(t)} y="240" textAnchor="middle">{format(t)}</text>)}
    {[0,.5,1].map(v=><text key={v} x="60" y={y(v)+4} textAnchor="end">{v}</text>)}
    <text x="344" y="276" textAnchor="middle">{data.xlabel}</text>
    <text transform="translate(19 128) rotate(-90)" textAnchor="middle">{data.ylabel}</text>
  </svg>;
}

export default function OctaveUnitStep(){
  const [code,setCode]=useState(unitStepCode),[data,setData]=useState<StepSimulation|null>(null),[error,setError]=useState(''),[selected,setSelected]=useState(0),[stale,setStale]=useState(false),[copied,setCopied]=useState('');
  function run(source=code){
    setError('');setData(null);setStale(false);
    try{const next=simulateUnitStep(source);setData(next);const firstOn=next.values.indexOf(1);setSelected(firstOn<0?0:firstOn);}
    catch(e){setError(e instanceof Error?e.message:'Check the code and try again.');}
  }
  function reset(){setCode(unitStepCode);setData(null);setError('');setStale(false);setCopied('');}
  return <div className="sampling-tutorial unit-step-tutorial">
    <div className="page-heading"><span className="eyebrow">OCTAVE TUTORIALS / 02</span><h1>Give each time a signal value.</h1><p>Build a discrete-time unit step: 0 before the switch, 1 from the switch onward.</p></div>
    <div className="sampling-split">
      <section className="octave-card sampling-lab unit-step-lab">
        <span className="eyebrow">TIME VECTOR → AMPLITUDE VECTOR → STEM PLOT</span><h2>Your first discrete-time signal.</h2>
        <p className="small">The setup repeats Tutorial 1’s <code>Ts</code> and <code>t</code>, so this script also works on its own.</p>
        <label htmlFor="unit-step-code">Octave code · edit and run</label>
        <textarea id="unit-step-code" spellCheck={false} value={code} onChange={e=>{setCode(e.target.value);setStale(true);setCopied('');}}/>
        <div className="octave-actions"><button className="button primary" onClick={()=>run()}>▶ Run simulation</button><button className="button quiet" onClick={reset}>Reset code</button></div>
        <p className="muted small">Browser simulation of these commands. This is a lesson simulator; the .m download runs in installed Octave.</p>
        <div className="step-run-status" role="status" aria-live="polite">{error|| (stale&&data?'Code changed. Run again to update the figure and sample values.':data?`Figure updated: ${data.times.length} samples, ${data.values.filter(v=>v===0).length} zeros and ${data.values.filter(v=>v===1).length} ones.`:'Predict the amplitude at t = 0, then run the code.')}</div>
        {data&&<><div className={stale?'step-figure is-stale':'step-figure'}><span className="eyebrow">FIGURE 1 · STEM(T, U)</span><StemPlot data={data} selected={selected}/></div>
          <div className="step-inspector"><label htmlFor="step-sample">Inspect sample <strong>{selected+1} of {data.times.length}</strong></label><input id="step-sample" type="range" min={1} max={data.times.length} value={selected+1} onChange={e=>setSelected(+e.target.value-1)}/>
            <div className="step-value-chain"><span><small>t({selected+1})</small><strong>{format(data.times[selected])} s</strong></span><span><small>t {data.operator} {format(data.threshold)}?</small><strong>{data.values[selected]?'true':'false'}</strong></span><span><small>u({selected+1})</small><strong>{data.values[selected]}</strong></span></div>
            <p className="small">The highlighted marker shows this stored time–amplitude pair. Move the slider to inspect the next or previous sample.</p>
          </div>
          <details><summary>Inspect the stored vectors side by side</summary><div className="sampling-table"><table><caption>Each row is one stored sample.</caption><thead><tr><th>Position</th><th>t (seconds)</th><th>Comparison</th><th>u</th></tr></thead><tbody>{data.times.map((t,i)=><tr key={i} className={i===selected?'step-selected-row':''}><td>{i+1}</td><td>{format(t)}</td><td>{data.values[i]?'true':'false'}</td><td>{data.values[i]}</td></tr>)}</tbody></table></div></details>
        </>}
        <div className="octave-actions"><button className="text-button" onClick={()=>downloadFile('tutorial_02_unit_step.m',code,'text/plain;charset=utf-8')}>Download .m script</button><button className="text-button" onClick={async()=>{try{await navigator.clipboard.writeText(code);setCopied('Code copied.');}catch{setCopied('Select the code and copy it manually.');}}}>Copy code</button><span role="status">{copied}</span></div>
      </section>
      <article className="octave-card sampling-explanation">
        <span className="eyebrow">THE IDEA + EACH LINE EXPLAINED</span><h2>What is a DT unit step?</h2>
        <p><strong>DT means discrete time.</strong> A sequence has a value at each integer sample index n. The unit step is defined as <strong>u[n] = 0 for n &lt; 0</strong>, and <strong>u[n] = 1 for n ≥ 0</strong>. “Unit” refers to its height of 1.</p>
        <p>Here we attach a time in seconds to every sample: t = nTs. With Ts = 0.1, our window runs from n = −10 to n = 20. The sample at t = 0 corresponds to n = 0, but sits at <strong>position 11</strong> in Octave’s vector. Octave array positions start at 1.</p>
        <div className="octave-callout"><strong>The step includes zero.</strong><p>We use <code>&gt;=</code>, so the amplitude at t = 0 is 1. The mathematical step continues beyond the displayed window; the code stores only the 31 samples from −1 to 2 seconds.</p></div>
        <section><h3>Setup · reuse Tutorial 1</h3><p><code>clear;</code> removes workspace variables and <code>clc;</code> clears the Command Window. <code>Ts = 0.1;</code> chooses a 0.1-second sample interval. <code>t = -1:Ts:2;</code> creates the 31 sample times.</p></section>
        <section><h3>1 · <code>u = double(t &gt;= 0);</code></h3><p><code>t &gt;= 0</code> checks <strong>every entry</strong> of t. A negative time produces false; zero or a positive time produces true. The result is a logical vector with the same size as t.</p><p><code>double(...)</code> converts false to the numeric value <strong>0</strong> and true to <strong>1</strong>, stored as double-precision numbers. It changes the data type; it does not multiply anything by two.</p><p><code>u =</code> stores that amplitude vector. Now <code>t</code> holds the times and <code>u</code> holds their signal amplitudes. No loop is needed.</p><div className="sampling-table"><table><caption>Three neighboring samples in the starting code</caption><thead><tr><th>Time t</th><th>t ≥ 0</th><th>double(...)</th></tr></thead><tbody><tr><td>−0.1 s</td><td>false</td><td>0</td></tr><tr><td>0 s</td><td>true</td><td>1</td></tr><tr><td>0.1 s</td><td>true</td><td>1</td></tr></tbody></table></div></section>
        <section><h3>2 · <code>stem(t, u);</code></h3><p>Draws a marker at each pair <code>(t(k), u(k))</code> and a vertical stem from the zero baseline to that marker. The first argument supplies the horizontal positions; the second supplies the heights.</p><p>At amplitude 0 the stem has zero height, so you see a marker on the baseline. At amplitude 1 the stem rises to 1. The stems emphasize separate samples; they do not specify signal values between sample times.</p><p>A regular <code>plot(t, u)</code> would connect adjacent points with lines. <code>stem</code> makes the discrete samples easier to see. It displays the data already stored in u.</p></section>
        <section><h3>3 · <code>xlabel('Time (seconds)');</code></h3><p>Labels the horizontal axis. The quoted words are text. The label describes the units we chose for t; it does not convert the data into seconds.</p></section>
        <section><h3>4 · <code>ylabel('Signal amplitude');</code></h3><p>Labels the vertical axis, which shows the numeric amplitude stored in u: 0 or 1.</p></section>
        <section><h3>5 · <code>grid on;</code></h3><p>Turns on grid lines to help read time and amplitude. The grid does not change t or u. Semicolons suppress text output, while the plotting commands still create the figure.</p></section>
        <div className="octave-callout"><strong>Predict → edit → run</strong><p>Change <code>t &gt;= 0</code> to <code>t &gt; 0</code>. What happens to the sample at zero?</p><details><summary>Reveal the reasoning</summary><p>Only the sample at t = 0 changes from 1 to 0. With a strict greater-than test, zero does not pass. This differs from the standard unit step defined above.</p></details><p>Then reset and try <code>t &gt;= 0.5</code>. The step starts at 0.5 seconds instead. Change Ts to 0.2 to see fewer, more widely spaced samples.</p></div>
        <section><h3>Why this matters for a receiver</h3><p>A step models a signal switching on. Combining shifted steps lets you construct finite pulses, such as a transmitted symbol that starts at one sample and ends at another.</p></section>
        <p className="muted small">These explanations use the starting code. The figure and stored values follow your edits.</p>
        <details><summary>Official Octave references</summary><p><a href="https://docs.octave.org/latest/Logical-Values.html" target="_blank" rel="noreferrer">Logical values and numeric conversion ↗</a></p><p><a href="https://docs.octave.org/latest/Two_002dDimensional-Plots.html#index-stem" target="_blank" rel="noreferrer">Stem plots and axis labels ↗</a></p></details>
      </article>
    </div>
  </div>;
}
