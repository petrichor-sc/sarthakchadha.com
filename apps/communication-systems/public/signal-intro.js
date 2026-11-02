/* Local, dependency-free introduction. Audio starts only from the sound button. */
(() => {
  'use strict';
  const DURATION = 9900;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = null;
  let replayButton = null;

  const artwork = `<svg viewBox="100 -65 840 460" role="img" aria-label="A sender on Earth uses a satellite phone. Its radio signal travels out into space to a satellite, curves around Earth, and reaches another person's phone, which plays the message.">
    <defs>
      <linearGradient id="si-wave-gradient" x1="180" y1="100" x2="820" y2="100" gradientUnits="userSpaceOnUse"><stop stop-color="#e7c284"/><stop offset=".5" stop-color="#f1d5c5"/><stop offset="1" stop-color="#c5adf2"/></linearGradient>
      <radialGradient id="si-earth-color" cx=".3" cy=".24" r=".9"><stop stop-color="#454064"/><stop offset=".55" stop-color="#24203e"/><stop offset="1" stop-color="#100e20"/></radialGradient>
      <linearGradient id="si-earth-shade"><stop stop-color="#0a071500"/><stop offset=".48" stop-color="#0a07150a"/><stop offset="1" stop-color="#08050fcf"/></linearGradient>
      <clipPath id="si-earth-clip"><circle cx="520" cy="202" r="123"/></clipPath>
      <filter id="si-point-glow" x="-500%" y="-500%" width="1100%" height="1100%"><feGaussianBlur stdDeviation="5"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="si-line-glow" x="-20%" y="-200%" width="140%" height="600%"><feGaussianBlur stdDeviation="2.5"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <g id="si-radio-art" class="si-radio-art">
        <path d="M-38 78V7"/><circle cx="-38" cy="5" r="3"/>
        <path d="M-2 78V68a8 8 0 0 1 8-8h31a8 8 0 0 1 8 8v10"/>
        <rect x="-78" y="78" width="156" height="202" rx="24"/>
        <rect x="-61" y="96" width="122" height="61" rx="7"/>
        <path d="M-47 140h9l5-7 7 11 8-14 8 10h9l6-6 6 10 7-12 7 8h16" opacity=".72"/>
        <path d="M-49 185h56m-56 9H7m-56 9H7m-56 9H7m-56 9H7m-56 9H7" opacity=".7"/>
        <circle cx="43" cy="191" r="12"/><path d="M43 179v6"/>
        <circle cx="43" cy="226" r="7"/><path d="M-48 255h44m16 0h11m15 0h11" opacity=".6"/>
        <text class="si-radio-screen" x="0" y="120" text-anchor="middle">HELLO</text>
      </g>
    </defs>
    <g class="si-stars" fill="#b6a3ce"><circle cx="349" cy="18" r="1"/><circle cx="677" cy="13" r="1.2"/><circle cx="710" cy="307" r=".8"/><circle cx="330" cy="300" r="1"/><circle cx="450" cy="-38" r=".8"/><circle cx="606" cy="-27" r=".7"/><path d="M360 65v6m-3-3h6M693 245v6m-3-3h6" fill="none" stroke="currentColor" stroke-width=".6"/></g>
    <ellipse class="si-orbit" cx="520" cy="200" rx="205" ry="149" transform="rotate(-22 520 200)"/>
    <g class="si-earth">
      <circle class="si-atmosphere" cx="520" cy="202" r="125"/>
      <circle cx="520" cy="202" r="123" fill="url(#si-earth-color)"/>
      <g clip-path="url(#si-earth-clip)">
        <g class="si-earth-land">
          <path d="M409 137 429 115 453 111 468 124 460 141 472 155 459 174 440 167 426 146Z M458 178 481 182 494 206 485 231 478 257 463 279 454 258 460 231 447 206 450 190Z M479 101 496 91 510 102 504 121 489 118Z M515 131 529 112 554 101 578 116 605 125 623 144 612 164 591 166 575 152 564 170 545 157 531 141Z M528 164 550 161 568 181 558 211 543 237 530 220 519 191 518 175Z M589 245 615 236 634 251 625 267 606 264Z"/>
        </g>
        <g class="si-earth-grid" fill="none"><ellipse cx="520" cy="202" rx="122" ry="37"/><ellipse cx="520" cy="202" rx="122" ry="83"/><ellipse cx="520" cy="202" rx="47" ry="123"/><ellipse cx="520" cy="202" rx="92" ry="123"/><path d="M397 202h246M520 79v246"/></g>
        <circle cx="520" cy="202" r="123" fill="url(#si-earth-shade)"/>
      </g>
      <circle class="si-earth-rim" cx="520" cy="202" r="123"/>
    </g>
    <path class="si-location-line" d="M261 281 414 252m325 29-112-33"/>
    <circle class="si-location si-location--send" cx="414" cy="252" r="2.7"/>
    <circle class="si-location si-location--receive" cx="627" cy="248" r="2.7"/>
    <path class="si-ground" d="M129 333h172m438 0h172"/>
    <circle class="si-ring" cx="185" cy="114" r="15"/>
    <circle class="si-ring si-ring--two" cx="185" cy="114" r="15"/>
    <circle class="si-ring si-ring--three" cx="185" cy="114" r="15"/>
    <path class="si-air-path" d="M185 114C284 12 405-29 520 3C640-11 722 37 735 126C754 161 788 152 811 114"/>
    <path class="si-beam si-beam--uplink" pathLength="1" d="M185 114C284 12 405-29 520 3"/>
    <path class="si-beam si-beam--orbit" pathLength="1" d="M520 3C640-11 722 37 735 126"/>
    <path class="si-beam si-beam--downlink" pathLength="1" d="M735 126C754 161 788 152 811 114"/>
    <path class="si-packet si-packet--uplink" pathLength="1" d="M185 114C284 12 405-29 520 3"/>
    <path class="si-packet si-packet--orbit" pathLength="1" d="M520 3C640-11 722 37 735 126"/>
    <path class="si-packet si-packet--downlink" pathLength="1" d="M735 126C754 161 788 152 811 114"/>
    <g class="si-satellite" transform="translate(520 3)">
      <g class="si-satellite-outline" transform="rotate(-18)"><path d="M-11-8h22v16h-22Z M-14-5h-33v15h33m28-15h33v15H14 M-36-5v15m-11-8h33m39-7v15m11-15v15m-22-8h33M0 8v11m-8 0h16M-6-8l-6-11m24 0L6-8"/><path d="M-18-21q6 9 12 0"/><circle cx="0" cy="0" r="2"/></g>
      <circle class="si-satellite-halo" r="23"/>
    </g>
    <g class="si-radio si-radio--transmit" transform="translate(216 110) scale(.8)">
      <use class="si-radio-base" href="#si-radio-art"/><use class="si-radio-glow" href="#si-radio-art"/>
      <text class="si-radio-label" x="0" y="312" text-anchor="middle">SENDER ON EARTH</text>
      <g class="si-person"><circle cx="-8" cy="345" r="5"/><path d="M-18 363v-3a10 10 0 0 1 20 0v3"/></g>
    </g>
    <g class="si-radio si-radio--receive" transform="translate(842 110) scale(.8)">
      <use class="si-radio-base" href="#si-radio-art"/><use class="si-radio-glow" href="#si-radio-art"/>
      <text class="si-radio-label" x="0" y="312" text-anchor="middle">RECEIVER ON EARTH</text>
      <g class="si-person"><circle cx="-8" cy="345" r="5"/><path d="M-18 363v-3a10 10 0 0 1 20 0v3"/></g>
      <g class="si-received-sound"><path d="M98 170q14 18 0 36m12-46q22 28 0 56m14-66q29 38 0 76"/></g>
    </g>
    <circle class="si-point" cx="185" cy="114" r="3.4"/>
    <circle class="si-point si-point--satellite" cx="520" cy="3" r="3.4"/>
    <circle class="si-point si-point--receive" cx="811" cy="114" r="3.4"/>
  </svg>`;

  function stopSound(state) {
    state.soundEnabled = false;
    if (state.audio) {
      state.audio.close().catch(() => {});
      state.audio = null;
    }
    state.soundButton.setAttribute('aria-pressed', 'false');
    state.soundButton.querySelector('span').textContent = 'Sound off';
  }

  function tone(context, when, frequency, duration, volume) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, when);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * .97, when + duration);
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(volume, when + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, when + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(when);
    oscillator.stop(when + duration + .02);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }

  async function toggleSound(state) {
    if (state.leaving) return;
    if (state.soundEnabled) { stopSound(state); return; }
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) {
      state.soundButton.querySelector('span').textContent = 'Sound unavailable';
      state.soundButton.disabled = true;
      return;
    }
    try {
      const context = new Audio();
      state.audio = context;
      state.soundEnabled = true;
      await context.resume();
      if (state.leaving || !state.soundEnabled || state.audio !== context) return;
      state.soundButton.setAttribute('aria-pressed', 'true');
      state.soundButton.querySelector('span').textContent = 'Sound on';
      const elapsed = (performance.now() - state.started) / 1000;
      const now = context.currentTime + .025;
      // A gentle confirmation, followed by the remaining synchronized cues.
      tone(context, now, 660, .13, .025);
      const cues = [[2.6, 660], [2.86, 880], [3.12, 740], [4.76, 1047], [7.26, 660], [7.52, 880], [7.78, 740]];
      if (!reducedMotion.matches) for (const [time, frequency] of cues) {
        if (time > elapsed + .2) tone(context, now + time - elapsed, frequency, .13, .028);
      }
    } catch {
      stopSound(state);
      state.soundButton.querySelector('span').textContent = 'Sound unavailable';
    }
  }

  function restorePage(state) {
    for (const [element, wasInert] of state.background) {
      if (element.isConnected) element.inert = wasInert;
    }
    document.body.style.overflow = state.previousOverflow;
    document.removeEventListener('keydown', state.onKey);
    window.removeEventListener('hashchange', state.onRoute);
    reducedMotion.removeEventListener('change', state.onMotion);
    state.element.remove();
    if (active === state) active = null;
    if (state.restoreFocus) {
      const previous = state.previousFocus;
      if (previous && previous !== document.body && previous.isConnected && !previous.inert) {
        previous.focus({preventScroll: true});
      } else {
        const target = document.querySelector('#root main') || document.getElementById('root');
        if (target) {
          const temporary = !target.hasAttribute('tabindex');
          if (temporary) target.setAttribute('tabindex', '-1');
          target.classList.add('signal-intro-focus-target');
          target.focus({preventScroll: true});
          target.addEventListener('blur', () => {
            if (temporary) target.removeAttribute('tabindex');
            target.classList.remove('signal-intro-focus-target');
          }, {once: true});
        }
      }
    }
  }

  function finish(state, immediate = false) {
    if (!state || state.leaving) return;
    state.leaving = true;
    state.restoreFocus = state.element.contains(document.activeElement);
    state.timers.forEach(window.clearTimeout);
    stopSound(state);
    state.element.classList.add('is-leaving');
    state.exitTimer = window.setTimeout(() => restorePage(state), immediate ? 0 : reducedMotion.matches ? 150 : 850);
  }

  function openIntro() {
    if (active) return;
    const element = document.createElement('section');
    element.className = 'signal-intro';
    element.dataset.phase = 'question';
    element.setAttribute('role', 'dialog');
    element.setAttribute('aria-modal', 'true');
    element.setAttribute('aria-labelledby', 'signal-intro-title');
    element.setAttribute('aria-describedby', 'signal-intro-description');
    element.tabIndex = -1;
    element.innerHTML = `
      <header class="signal-intro__header">
        <div class="signal-intro__brand"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" aria-hidden="true"><path d="M2 12h4l2-6 4 13 4-15 2 8h4"/></svg><span>COMMUNICATION<br>SYSTEMS</span></div>
        <div class="signal-intro__controls">
          <button class="signal-intro__sound" type="button" aria-pressed="false" aria-label="Enable or mute intro sound"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4Z"/><path class="si-sound-waves" d="M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/><path class="si-sound-slash" d="m16 9 5 6m0-6-5 6"/></svg><span>Sound off</span></button>
          <button class="signal-intro__skip" type="button">Skip intro <span aria-hidden="true">↗</span></button>
        </div>
      </header>
      <div class="signal-intro__content">
        <div class="signal-intro__aura" aria-hidden="true"></div><div class="signal-intro__aura signal-intro__aura--receive" aria-hidden="true"></div>
        <div class="signal-intro__opening">
          <p class="signal-intro__eyebrow">A LITTLE CURIOSITY GOES A LONG WAY.</p>
          <h1 class="signal-intro__title" id="signal-intro-title">Ever wondered how<br><em>radio communication<br class="si-mobile-break"> happens?</em></h1>
          <p class="signal-intro__description" id="signal-intro-description">Let’s follow one message.</p>
        </div>
        <div class="signal-intro__story">
          <p class="signal-intro__eyebrow">ONE MESSAGE. BEYOND THE HORIZON.</p>
          <figure class="signal-intro__scene">${artwork}</figure>
          <p class="signal-intro__status" aria-live="polite">IT STARTS WITH A MESSAGE.</p>
          <div class="signal-intro__final">
            <p>A message. A wave. A connection.</p>
            <button class="signal-intro__enter" type="button">Explore how it works <span aria-hidden="true">→</span></button>
          </div>
        </div>
      </div>
      <footer class="signal-intro__footer"><div class="signal-intro__steps" aria-hidden="true"><span>01 · SEND</span><span>02 · RELAY</span><span>03 · RECEIVE</span></div><div class="signal-intro__progress" aria-hidden="true"></div></footer>`;

    document.body.append(element);
    // Fail open if the stylesheet did not load: never cover the lab with an unstyled dialog.
    if (getComputedStyle(element).position !== 'fixed') { element.remove(); return; }
    const state = {
      element, started: performance.now(), timers: [], audio: null,
      leaving: false, soundEnabled: false, restoreFocus: false,
      previousFocus: document.activeElement, previousOverflow: document.body.style.overflow,
      background: [], soundButton: element.querySelector('.signal-intro__sound')
    };
    active = state;
    for (const child of document.body.children) {
      if (child !== element && !['SCRIPT', 'STYLE', 'LINK'].includes(child.tagName)) {
        state.background.push([child, child.inert]);
        child.inert = true;
      }
    }
    document.body.style.overflow = 'hidden';
    const stage = (phase, text) => {
      if (state.leaving) return;
      element.dataset.phase = phase;
      element.querySelector('.signal-intro__status').textContent = text;
    };
    const later = (fn, delay) => state.timers.push(window.setTimeout(fn, delay));
    if (reducedMotion.matches) {
      later(() => finish(state), 1800);
    } else {
      later(() => stage('send', 'A SATELLITE PHONE SENDS “HELLO”.'), 2350);
      later(() => stage('uplink', 'THE RADIO SIGNAL TRAVELS OUT INTO SPACE.'), 3200);
      later(() => stage('relay', 'A SATELLITE RELAYS THE SIGNAL AROUND EARTH.'), 4750);
      later(() => stage('downlink', 'THE SIGNAL TRAVELS BACK TO THE OTHER PERSON.'), 6150);
      later(() => stage('receive', '“HELLO” RECEIVED. THE SOUND RETURNS.'), 7250);
      later(() => finish(state), DURATION);
    }
    element.querySelector('.signal-intro__skip').addEventListener('click', () => finish(state));
    element.querySelector('.signal-intro__enter').addEventListener('click', () => finish(state));
    state.soundButton.addEventListener('click', () => toggleSound(state));
    state.onRoute = () => finish(state, true);
    state.onMotion = () => finish(state, true);
    state.onKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); finish(state); return; }
      if (event.key === 'Enter' && event.target === element) { event.preventDefault(); finish(state); return; }
      if (event.key !== 'Tab') return;
      const buttons = [...element.querySelectorAll('button:not(:disabled)')].filter(button => getComputedStyle(button).visibility !== 'hidden');
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === element)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === element)) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', state.onKey);
    window.addEventListener('hashchange', state.onRoute);
    reducedMotion.addEventListener('change', state.onMotion);
    element.focus({preventScroll: true});
  }

  function initialize() {
    const bar = document.querySelector('.portfolio-return');
    if (bar && !document.getElementById('signal-intro-replay')) {
      replayButton = document.createElement('button');
      replayButton.id = 'signal-intro-replay';
      replayButton.className = 'signal-intro-replay';
      replayButton.type = 'button';
      replayButton.textContent = '↺ Replay intro';
      replayButton.addEventListener('click', openIntro);
      bar.insertBefore(replayButton, bar.lastElementChild);
    }
    // Direct lesson / notebook links should open their requested content immediately.
    if (!window.location.hash) openIntro();
  }

  window.addEventListener('pagehide', () => {
    if (active) {
      active.timers.forEach(window.clearTimeout);
      window.clearTimeout(active.exitTimer);
      stopSound(active);
      active.restoreFocus = false;
      restorePage(active);
    }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once: true});
  else initialize();
})();
