import {useState} from 'react';
import Introduction from './octave-introduction';
import OctaveUnitStep from './octave-unit-step';
import './octave.css';
const initial=`clear;
clc;

Ts = 0.1;
t = -1:Ts:2;

t(1:5)`;
function SamplingTutorial(){
 const [intro,setIntro]=useState(false),[code,setCode]=useState(initial),[result,setResult]=useState<{values:number[],first:number[],ts:number}|null>(null),[error,setError]=useState(''),[stale,setStale]=useState(false);
 function run(){
  setError('');setResult(null);setStale(false);
  // Deliberately parse only this lesson's commands; never evaluate user code as JavaScript.
  const clean=code.replace(/%[^\n]*/g,'').trim();
  const numeric='([+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?)';
  const pattern=new RegExp('^clear\\s*;\\s*clc\\s*;\\s*Ts\\s*=\\s*'+numeric+'\\s*;\\s*t\\s*=\\s*'+numeric+'\\s*:\\s*Ts\\s*:\\s*'+numeric+'\\s*;\\s*t\\s*\\(\\s*1\\s*:\\s*(\\d+)\\s*\\)\\s*;?\\s*$');
  const match=clean.match(pattern);
  if(!match){setError('This lesson simulator supports the commands shown here. Keep the structure and edit Ts, the start/end times, or the number in t(1:5). Use Reset code to start again.');return;}
  const ts=Number(match[1]),start=Number(match[2]),end=Number(match[3]),count=Number(match[4]);
  if(![ts,start,end].every(Number.isFinite)||ts<=0||end<start){setError('For this exercise, use a positive Ts and an end time at or after the start time.');return;}
  const n=Math.floor((end-start)/ts+1e-10)+1;
  if(n>10000||!Number.isFinite(n)){setError('Use at most 10,000 samples in this simulation. Increase Ts or shorten the time range.');return;}
  if(count<1||count>n){setError(`t contains ${n} entries. Request between 1 and ${n} entries.`);return;}
  const values=Array.from({length:n},(_,i)=>start+i*ts);setResult({values,first:values.slice(0,count),ts});
 }
 const format=(v:number)=>(Math.abs(v)<1e-12?0:v).toFixed(4);
 if(intro)return <><button className="button quiet" onClick={()=>setIntro(false)}>← Tutorial 1: Sampling time</button><Introduction/></>;
 return <div className="sampling-tutorial"><div className="page-heading"><span className="eyebrow">OCTAVE TUTORIALS / 01</span><h1>What does the computer store?</h1><p>First goal: understand the numbers in memory before we draw anything.</p><button className="text-button" onClick={()=>setIntro(true)}>New to Octave? Read the introduction →</button></div><div className="sampling-split"><section className="octave-card sampling-lab"><span className="eyebrow">STEP 1 · CREATE SAMPLING TIMES</span><h2>Run it. Inspect the numbers.</h2><label htmlFor="sampling-code">Octave code</label><textarea id="sampling-code" spellCheck={false} value={code} onChange={e=>{setCode(e.target.value);setStale(true);}}/><div className="octave-actions"><button className="button primary" onClick={run}>▶ Run simulation</button><button className="button quiet" onClick={()=>{setCode(initial);setResult(null);setError('');setStale(false)}}>Reset code</button></div><p className="muted small">Browser simulation of this lesson’s Octave commands. Edit the numeric values and run again. A full Octave interpreter is not loaded.</p><div className="sampling-output" role="status" aria-live="polite"><span className="eyebrow">COMMAND WINDOW</span>{error?<p>{error}</p>:result?<><pre>{'ans =\n\n'+result.first.map(format).join('   ')}</pre><p>{stale?'Code changed — run again to update this output.':`t stores ${result.values.length} time values. The interval between consecutive values is ${result.ts} seconds.`}</p></>:<p>Press Run simulation to display the first five entries.</p>}</div>{result&&!error&&<details><summary>Inspect the stored vector t</summary><p>Indices identify positions; values are times in seconds. Octave indexing starts at 1.</p><div className="sampling-table"><table><thead><tr><th>Index</th><th>Time (s)</th></tr></thead><tbody>{result.values.slice(0,100).map((v,i)=><tr key={i}><td>{i+1}</td><td>{format(v)}</td></tr>)}</tbody></table></div>{result.values.length>100&&<p>Showing the first 100 of {result.values.length} entries.</p>}</details>}</section><article className="octave-card sampling-explanation"><span className="eyebrow">WHAT EACH LINE MEANS</span><h2>Time first. Signal later.</h2><section><h3><code>clear; clc;</code></h3><p><code>clear</code> removes variables from the workspace. <code>clc</code> clears the Command Window display. They help you start fresh.</p></section><section><h3><code>Ts = 0.1;</code></h3><p><strong>Ts is the sampling interval:</strong> the time between consecutive samples. Here we choose seconds as our unit, so each step is 0.1 seconds. That corresponds to a sampling rate of <strong>1/Ts = 10 samples per second (10 Hz)</strong>.</p><p>The semicolon suppresses printed output. The value is still stored.</p></section><section><h3><code>t = -1:Ts:2;</code></h3><p>The colon syntax means <strong>start : step : end</strong>. It creates a row vector of times: start at −1, add 0.1 each time, and stop at 2.</p><p>With these values, <code>t</code> contains <strong>31 entries</strong>, including both endpoints. Negative times are simply times before the reference instant t = 0.</p></section><section><h3><code>t(1:5)</code></h3><p>Displays entries at positions <strong>1 through 5</strong>. The expected values are <strong>−1, −0.9, −0.8, −0.7, −0.6</strong>.</p><p>The indices 1 to 5 are positions, not seconds. These stored values are <strong>times, not signal amplitudes</strong>. We have not created a signal yet.</p></section><div className="octave-callout"><strong>Predict, then change one thing.</strong><p>Set <code>Ts = 0.2;</code> and run again. Will there be more time entries or fewer?</p><details><summary>Reveal the reasoning</summary><p>The interval doubles, so the vector has fewer entries: 16. The first five times become −1, −0.8, −0.6, −0.4, −0.2 seconds.</p></details></div><p className="muted small">Explanations describe the starting code; simulation output follows your edits.</p></article></div></div>
}

export default function OctaveTutorials({unitStep=false,onNavigate}:{unitStep?:boolean;onNavigate:(id:string)=>void}){
 return <><nav className="octave-lesson-nav" aria-label="Octave tutorials"><button aria-current={!unitStep?'page':undefined} onClick={()=>onNavigate('octave')}><span>01</span> Sampling time</button><button aria-current={unitStep?'page':undefined} onClick={()=>onNavigate('octave-step')}><span>02</span> DT unit step</button></nav>{unitStep?<OctaveUnitStep/>:<SamplingTutorial/>}<div className="octave-lesson-footer"><button className="button primary" onClick={()=>onNavigate(unitStep?'octave':'octave-step')}>{unitStep?'← Tutorial 1: Sampling time':'Next · Tutorial 2: DT unit step →'}</button></div></>;
}
