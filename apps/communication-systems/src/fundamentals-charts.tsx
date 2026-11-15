import {useEffect, useRef, useState, type ReactNode} from 'react';
import {Pause, Play} from 'lucide-react';
import type {Point} from './signals';
import {formatValue, TAU, wrapPhase} from './fundamentals-model';

export const plotColors = {trace:'#cbb6ff', sample:'#75e2d2', highlight:'#ffce89', grid:'#31263f', axis:'#7f6a98', ink:'#cdbedf', base:'#15101e'};

const drawTicks = (min: number, max: number, target: number, integers = false) => {
  const ideal = (max - min) / target;
  const unit = 10 ** Math.floor(Math.log10(ideal));
  const step = [1, 2, 2.5, 5, 10].map(s => s * unit).find(s => s >= ideal) ?? 10 * unit;
  const spacing = integers ? Math.max(1, Math.ceil(step)) : step;
  const first = Math.ceil(min / spacing - 1e-10);
  const last = Math.floor(max / spacing + 1e-10);
  return Array.from({length: last - first + 1}, (_, i) => (i + first) * spacing);
};

type CanvasProps = {
  description: string;
  draw: (context: CanvasRenderingContext2D, width: number, height: number) => void;
  square?: boolean;
};

function PlotCanvas({description, draw, square}: CanvasProps) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext('2d');
    if (!context) return;

    function redraw() {
      if (!element || !context) return;
      const {width, height} = element.getBoundingClientRect();
      if (!width || !height) return;
      const density = Math.min(3, window.devicePixelRatio || 1);
      element.width = Math.round(width * density);
      element.height = Math.round(height * density);
      context.setTransform(density, 0, 0, density, 0, 0);
      draw(context, width, height);
    }

    redraw();
    const observer = new ResizeObserver(redraw);
    observer.observe(element);
    return () => observer.disconnect();
  }, [draw]);

  return <canvas className={square ? 'sf-canvas sf-canvas-square' : 'sf-canvas'} ref={canvas}
    role="img" aria-label={description}>{description}</canvas>;
}

type PlotSeries = {
  points: Point[];
  kind: 'line' | 'stem' | 'dot';
  color: string;
  dashed?: boolean;
  activeX?: number;
};

type SignalChartProps = {
  series: PlotSeries[];
  xRange: [number, number];
  yRange: [number, number];
  xLabel: string;
  yLabel: string;
  description: string;
  integerX?: boolean;
  xTicks?: number[];
  yTicks?: number[];
  bounds?: number;
  markerX?: number;
};

export function SignalChart({series, xRange, yRange, xLabel, yLabel, description, integerX, xTicks, yTicks, bounds, markerX}: SignalChartProps) {
  return <PlotCanvas description={description} draw={(ctx, width, height) => {
    const left = 48, right = width - 17, top = 23, bottom = height - 42;
    if (right <= left || bottom <= top) return;
    const x = (value: number) => left + (value - xRange[0]) / (xRange[1] - xRange[0]) * (right - left);
    const y = (value: number) => bottom - (value - yRange[0]) / (yRange[1] - yRange[0]) * (bottom - top);
    const base = y(Math.max(yRange[0], Math.min(0, yRange[1])));
    const stroke = (x1: number, y1: number, x2: number, y2: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    ctx.font = '11px system-ui, sans-serif';
    ctx.lineWidth = 1;
    ctx.fillStyle = plotColors.ink;
    ctx.textAlign = 'center';
    for (const tick of xTicks ?? drawTicks(...xRange, width > 500 ? 6 : 4, integerX)) {
      stroke(x(tick), top, x(tick), bottom, tick === 0 ? plotColors.axis : plotColors.grid);
      ctx.fillText(formatValue(tick), x(tick), bottom + 15);
    }
    ctx.textAlign = 'right';
    for (const tick of yTicks ?? drawTicks(...yRange, 4)) {
      stroke(left, y(tick), right, y(tick), tick === 0 ? plotColors.axis : plotColors.grid);
      ctx.fillText(formatValue(tick), left - 7, y(tick) + 4);
    }
    stroke(left, top, left, bottom, plotColors.axis);
    stroke(left, bottom, right, bottom, plotColors.axis);
    ctx.textAlign = 'center';
    ctx.fillText(xLabel, (left + right) / 2, height - 6, right - left);
    ctx.save();
    ctx.translate(12, (top + bottom) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLabel, 0, 0, bottom - top);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.rect(left - 5, top - 5, right - left + 10, bottom - top + 10);
    ctx.clip();

    if (bounds !== undefined) {
      ctx.fillStyle = '#75e2d215';
      ctx.fillRect(left, y(bounds), right - left, y(-bounds) - y(bounds));
      ctx.setLineDash([5, 5]);
      stroke(left, y(bounds), right, y(bounds), plotColors.sample);
      stroke(left, y(-bounds), right, y(-bounds), plotColors.sample);
      ctx.setLineDash([]);
    }
    if (markerX !== undefined) {
      ctx.setLineDash([4, 4]);
      stroke(x(markerX), top, x(markerX), bottom, plotColors.highlight);
      ctx.setLineDash([]);
    }

    for (const layer of series) {
      ctx.strokeStyle = layer.color;
      ctx.lineWidth = layer.kind === 'line' ? 2 : 1.5;
      if (layer.kind === 'line') {
        ctx.setLineDash(layer.dashed ? [6, 5] : []);
        ctx.beginPath();
        layer.points.forEach((point, i) => {
          if (i === 0) ctx.moveTo(x(point.x), y(point.y));
          else ctx.lineTo(x(point.x), y(point.y));
        });
        ctx.stroke();
        ctx.setLineDash([]);
        continue;
      }
      for (const point of layer.points) {
        const active = point.x === layer.activeX;
        const color = active ? plotColors.highlight : layer.color;
        if (layer.kind === 'stem') stroke(x(point.x), base, x(point.x), y(point.y), color);
        ctx.beginPath();
        ctx.arc(x(point.x), y(point.y), active ? 5 : layer.kind === 'dot' ? 3.1 : 3.4, 0, TAU);
        ctx.strokeStyle = color;
        ctx.fillStyle = active || layer.kind === 'dot' ? color : plotColors.base;
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();
  }}/>;
}

export function PhasorChart({omega, index}: {omega: number; index: number}) {
  const angle = wrapPhase(omega * index);
  return <PlotCanvas square description={`Unit phasor at n = ${index}, real part ${formatValue(Math.cos(angle))}, imaginary part ${formatValue(Math.sin(angle))}`}
    draw={(ctx, width, height) => {
      const cx = width / 2, cy = height / 2, radius = Math.min(width, height) * .33;
      const px = (phase: number) => cx + radius * Math.cos(phase);
      const py = (phase: number) => cy - radius * Math.sin(phase);
      const line = (x1: number, y1: number, x2: number, y2: number, c: string, w = 1) => {
        ctx.strokeStyle = c;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      };

      line(cx - radius - 12, cy, cx + radius + 12, cy, plotColors.axis);
      line(cx, cy - radius - 12, cx, cy + radius + 12, plotColors.axis);
      ctx.strokeStyle = plotColors.axis;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.stroke();
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = plotColors.ink;
      ctx.textAlign = 'center';
      ctx.fillText('Im', cx, cy - radius - 19);
      ctx.fillText('Re', cx + radius + 17, cy + 17);
      ctx.fillText('0 / 2π', cx + radius, cy - 12);
      ctx.fillText('π', cx - radius, cy - 12);

      // Draw visited sample locations, then the angle and selected phasor.
      ctx.fillStyle = plotColors.sample;
      for (let n = 0; n <= index; n++) {
        ctx.beginPath();
        ctx.arc(px(n * omega), py(n * omega), 2.5, 0, TAU);
        ctx.fill();
      }
      ctx.strokeStyle = plotColors.trace;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * .35, 0, -angle, true);
      ctx.stroke();

      line(cx, cy, px(angle), py(angle), plotColors.highlight, 3);
      const tipX = px(angle), tipY = py(angle);
      for (const offset of [-.48, .48]) {
        line(tipX, tipY, tipX - 11 * Math.cos(angle + offset), tipY + 11 * Math.sin(angle + offset), plotColors.highlight, 2.5);
      }
    }}/>;
}

export function Slider({label, value, min, max, onChange, display, step = 1}: {
  label: string; value: number; min: number; max: number; onChange: (value: number) => void; display?: string; step?: number;
}) {
  return <label className="sf-slider">
    <span>{label}<strong aria-hidden="true">{display ?? formatValue(value)}</strong></span>
    <input type="range" min={min} max={max} step={step} value={value} aria-valuetext={display} onChange={e => onChange(Number(e.target.value))}/>
  </label>;
}

export function Choices<T extends string>({label, value, options, onChange}: {
  label: string; value: T; options: {value: T; label: string}[]; onChange: (value: T) => void;
}) {
  return <div className="sf-choices" role="group" aria-label={label}>
    {options.map(option => <button key={option.value} type="button" aria-pressed={option.value === value}
      onClick={() => onChange(option.value)}>{option.label}</button>)}
  </div>;
}

export function useSamplePlayback(first: number, last: number, milliseconds: number, initial = first) {
  const [index, setIndex] = useState(initial);
  const [playing, setPlaying] = useState(false);
  const paused = useRef(false);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      const next = Math.min(index + 1, last);
      setIndex(next);
      if (next === last) setPlaying(false);
    }, milliseconds);
    return () => window.clearTimeout(timer);
  }, [index, last, milliseconds, playing]);

  function seek(next: number) {
    paused.current = false;
    setPlaying(false);
    setIndex(next);
  }

  function toggle(restart = false) {
    if (playing) {
      paused.current = true;
      setPlaying(false);
      return;
    }
    if (first === last) return;
    if ((restart && !paused.current) || index >= last) setIndex(first);
    paused.current = false;
    setPlaying(true);
  }

  return {index: Math.max(first, Math.min(last, index)), playing, seek, toggle};
}

export function PlayButton({playing, onClick, children}: {playing: boolean; onClick: () => void; children: ReactNode}) {
  return <button className="button quiet sf-play" type="button" onClick={onClick}>
    {playing ? <Pause size={15} aria-hidden="true"/> : <Play size={15} aria-hidden="true"/>}
    {playing ? 'Pause' : children}
  </button>;
}

export function Readout({children}: {children: ReactNode}) {
  return <div className="sf-readout">{children}</div>;
}
