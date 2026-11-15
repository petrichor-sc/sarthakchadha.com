import {useEffect, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, AudioLines, Camera, ChevronDown, Radio, Waves} from 'lucide-react';
import {Choices, PlayButton, Readout, SignalChart, Slider, plotColors, useSamplePlayback} from './fundamentals-charts';
import {curvePoints, exampleSignals, formatValue, samplePoints} from './fundamentals-model';
import {BasicSequences, PropertiesLab, ShiftLab} from './fundamentals-time';
import {AliasingLab, HarmonicsLab, PeriodicityLab, PhasorLab} from './fundamentals-frequency';
import './fundamentals.css';

const topics = [
  {id:'map', label:'Signal map'},
  {id:'sequences', label:'Basic sequences'},
  {id:'shift', label:'Shift & delay'},
  {id:'properties', label:'Boundedness & sidedness'},
  {id:'period', label:'Periodicity'},
  {id:'phasor', label:'Complex exponential'},
  {id:'alias', label:'Aliasing'},
  {id:'harmonics', label:'Harmonics'},
] as const;
type Topic = typeof topics[number]['id'];
type Example = keyof typeof exampleSignals;

const exampleIcons = {audio:AudioLines, vision:Camera, radio:Radio};

function SignalMap({onSequences, onAliasing}: {onSequences: () => void; onAliasing: () => void}) {
  const [example,setExample] = useState<Example>('audio');
  const [expanded,setExpanded] = useState(false);
  const bridge = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded || !bridge.current || bridge.current.getBoundingClientRect().top < window.innerHeight - 130) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    bridge.current.scrollIntoView({block:'start', behavior:reduced ? 'instant' : 'smooth'});
  }, [expanded]);

  return <div className="sf-overview">
    <section className="sf-map-card" aria-label="Radial signal map">
      <div className="sf-map-stage">
        <div className="sf-orbit sf-orbit-outer" aria-hidden="true"/>
        <div className="sf-orbit sf-orbit-middle" aria-hidden="true"/>
        <div className="sf-orbit sf-orbit-inner" aria-hidden="true"/>
        {(Object.keys(exampleSignals) as Example[]).map(key => {
          const Icon = exampleIcons[key];
          const signal = exampleSignals[key];
          return <button className={`sf-example sf-example-${key}`} key={key} type="button" aria-pressed={example === key}
            onClick={() => setExample(key)}>
            <Icon size={20} aria-hidden="true"/><span><strong>{signal.name}</strong><small>{signal.measurement}</small></span>
          </button>;
        })}
        <button className="sf-center-node" type="button" aria-expanded={expanded} aria-controls="sf-sampling-bridge"
          onClick={() => setExpanded(!expanded)}>
          <Waves size={28} aria-hidden="true"/><strong>Signals</strong><span>{expanded ? 'Hide time branches' : 'Explore time'}</span>
          <ChevronDown size={16} aria-hidden="true"/>
        </button>
      </div>
      <div className="sf-map-description">
        <strong>{exampleSignals[example].measurement}</strong>
        <p>{exampleSignals[example].text}</p>
      </div>
    </section>
    <div id="sf-sampling-bridge" hidden={!expanded} ref={bridge}>
      {expanded && <SamplingBridge example={example} onExample={setExample} onSequences={onSequences} onAliasing={onAliasing}/>}
    </div>
  </div>;
}

function SamplingBridge({example,onExample,onSequences,onAliasing}: {example: Example; onExample: (example: Example) => void; onSequences: () => void; onAliasing: () => void}) {
  const [rate,setRate] = useState(16);
  const play = useSamplePlayback(0,rate,165,16);
  const signal = exampleSignals[example];
  const n = play.index;
  const t = n/rate;
  const amplitude = signal.value(t);
  const samples = samplePoints(0,n,index => signal.value(index/rate)).map(p => ({x:p.x/rate,y:p.y}));
  const yRange: [number,number] = example === 'vision' ? [-.08,1.05] : [-1.05,1.05];
  return <section className="sf-lab sf-sampling-bridge" aria-labelledby="sf-sampling">
    <div className="sf-lab-heading"><h2 id="sf-sampling">From continuous time to discrete time</h2>
      <p>Take one reading every T<sub>s</sub> seconds. Each reading becomes one entry of the new sequence.</p></div>
    <div className="sf-bridge-flow">
      <div className="sf-flow-node"><small>Continuous time</small><strong>x<sub>c</sub>(t)</strong><span>A value at every time t</span></div>
      <ArrowRight aria-hidden="true"/>
      <div className="sf-flow-node sf-flow-sampler"><small>Sampling</small><strong>t = nT<sub>s</sub></strong><span>Read the input at these times</span></div>
      <ArrowRight aria-hidden="true"/>
      <button className="sf-flow-node" type="button" onClick={onSequences}><small>Discrete time</small><strong>x[n]</strong><span>Explore discrete sequences <ArrowRight size={14} aria-hidden="true"/></span></button>
    </div>
    <div className="sf-lab-grid">
      <div className="sf-workbench">
        <Choices label="Select a signal to sample" value={example}
          options={(Object.keys(exampleSignals) as Example[]).map(value => ({value,label:exampleSignals[value].name}))}
          onChange={onExample}/>
        <figure><figcaption>Continuous trace x<sub>c</sub>(t)</figcaption>
          <SignalChart series={[
            {points:curvePoints(0,1,signal.value),kind:'line',color:plotColors.trace},
            {points:samples,kind:'dot',color:plotColors.sample,activeX:t},
          ]} xRange={[0,1]} yRange={yRange} xLabel="Time t (s)" yLabel={signal.unit} markerX={t}
            description={`Continuous ${signal.measurement.toLowerCase()} with ${samples.length} sampling instants marked.`}/></figure>
        <figure><figcaption>Stored samples x[n]</figcaption>
          <SignalChart series={[{points:samples,kind:'stem',color:plotColors.sample,activeX:t}]}
            xRange={[0,1]} yRange={yRange} xLabel="Sample time nTs (s)" yLabel={signal.unit} markerX={t}
            description={`Discrete samples shown through index ${n}. The current sample is ${formatValue(amplitude)}.`}/></figure>
        <Slider label="Sampling rate fₛ" min={4} max={32} value={rate} display={`${rate} samples/s`} onChange={next => {
          play.seek(n === rate ? next : Math.min(n, next));
          setRate(next);
        }}/>
        <div className="sf-controls">
          <Slider label="Take samples through n" min={0} max={rate} value={n} onChange={play.seek}/>
          <PlayButton playing={play.playing} onClick={() => play.toggle(true)}>Animate sampling</PlayButton>
        </div>
        <Readout><span>Interval T<sub>s</sub> <strong>{formatValue(1/rate,4)} s</strong></span>
          <span>Sample n = {n} <strong>t = {formatValue(t,4)} s</strong></span>
          <span>Stored value <strong>x[{n}] = {formatValue(amplitude)}</strong></span></Readout>
      </div>
      <div className="sf-explain">
        <h3>One reading per index</h3>
        <div className="sf-formula"><strong>x[n] = x<sub>c</sub>(nT<sub>s</sub>)</strong><span>n is an integer. Tₛ is the elapsed time between readings. The sample rate is fₛ = 1/Tₛ.</span></div>
        <p>Move the rate slider and watch the spacing change. Increasing f<sub>s</sub> reduces T<sub>s</sub> and gives you more readings in a second.</p>
        <p>The dots sit on the original trace. The stems below show the readings that the computer stores. Sampling discretizes <em>time</em>. An analog-to-digital converter also quantizes each reading to one of its available amplitude levels.</p>
        <div className="sf-note"><strong>What if the readings are too far apart?</strong><p>Different input waves can hit the same sample values. Change the sampling rate in the aliasing lab to see when this happens.</p></div>
        <button className="sf-text-link" type="button" onClick={onAliasing}>Explore aliasing <ArrowRight size={15}/></button>
      </div>
    </div>
  </section>;
}

export default function SignalFundamentals({onOpenOctave}: {onOpenOctave: () => void}) {
  const [topic,setTopic] = useState<Topic>('map');
  const nav = useRef<HTMLElement>(null);
  const index = topics.findIndex(item => item.id === topic);

  function select(next: Topic, scroll = false) {
    setTopic(next);
    if (scroll) {
      nav.current?.focus({preventScroll:true});
      nav.current?.scrollIntoView({block:'start'});
    }
  }

  return <div className="signal-fundamentals">
    <header className="sf-heading">
      <h1>Signal <em>fundamentals</em></h1>
      <p>Start with a measurement. Follow it into samples, then explore what those samples can tell you.</p>
    </header>
    <nav className="sf-topic-nav" aria-label="Signal fundamentals topics" ref={nav} tabIndex={-1}>
      {topics.map(item => <button key={item.id} type="button" aria-current={item.id === topic ? 'page' : undefined}
        onClick={() => select(item.id)}>{item.label}</button>)}
    </nav>
    {topic === 'map' && <SignalMap onSequences={() => select('sequences',true)} onAliasing={() => select('alias',true)}/>}
    {topic === 'sequences' && <BasicSequences onOpenOctave={onOpenOctave}/>}
    {topic === 'shift' && <ShiftLab/>}
    {topic === 'properties' && <PropertiesLab/>}
    {topic === 'period' && <PeriodicityLab/>}
    {topic === 'phasor' && <PhasorLab/>}
    {topic === 'alias' && <AliasingLab/>}
    {topic === 'harmonics' && <HarmonicsLab/>}
    <div className="sf-topic-footer">
      {index > 0 && <button className="button quiet" type="button" onClick={() => select(topics[index-1].id,true)}><ArrowLeft size={15}/>{topics[index-1].label}</button>}
      {index < topics.length-1 && topic !== 'map' && <button className="button primary" type="button" onClick={() => select(topics[index+1].id,true)}>{topics[index+1].label}<ArrowRight size={15}/></button>}
    </div>
    <details className="sf-references"><summary>Course references</summary><ul>
      <li><a href="https://ocw.mit.edu/courses/res-6-008-digital-signal-processing-spring-2011/resources/lecture-2-discrete-time-signals-and-systems-part-1/" target="_blank" rel="noreferrer">MIT OpenCourseWare · Discrete-Time Signals and Systems</a></li>
      <li><a href="https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/resources/lecture-16-sampling/" target="_blank" rel="noreferrer">MIT OpenCourseWare · Sampling</a></li>
      <li><a href="https://ocw.mit.edu/courses/6-011-introduction-to-communication-control-and-signal-processing-spring-2010/4599f6cff8a3890477f4c4986db032a2_MIT6_011S10_chap02.pdf" target="_blank" rel="noreferrer">Oppenheim and Verghese · Signals and Systems</a></li>
    </ul></details>
  </div>;
}
