// Replace these profile links with the individual post URLs when available.
// Labels deliberately describe the current destination.
const linkedInProfile = 'https://www.linkedin.com/in/sc-essentia/';
export const engagementSources = {
 guestLecture:{url:linkedInProfile,label:'More on LinkedIn'},
 scienceCafe:{url:linkedInProfile,label:'More on LinkedIn'},
 press:{url:'/assets/open-day-rheinische-post-clipping.jpg',label:'View the press clipping'}
};

const photos = {
 robotics:{file:'industrial-robotics-team.jpg',width:1280,height:854,alt:'The interdisciplinary student project team beside an ABB industrial robot at Hochschule Rhein-Waal',caption:'Industrial robotics / Project co-supervision · Photo: Andrea Polk'},
 lecture:{file:'ux-guest-lecture.jpg',width:1934,height:1291,alt:'Sarthak presenting the psychology of olfactory interaction during a guest lecture',caption:'Scent, mind & interaction / Psychology for UX Practitioners'},
 experiment:{file:'ux-shared-scent-experiment.jpg',width:1934,height:1291,alt:'Students smelling scent strips during a shared classroom experiment',caption:'One scent, many memories / A shared classroom experiment'},
 scienceTalk:{file:'science-cafe-extraction-talk.jpg',width:1920,height:1920,alt:'Two presenters discussing ultrasonic-assisted extraction of botanical aromas at the Science Café',caption:'Co-presenting with Raphael Komanek / Science Café, June 2025'},
 scienceSession:{file:'science-cafe-smelling-session.jpg',width:1920,height:1920,alt:'Sarthak sharing aromatic materials with a participant after the Science Café presentation',caption:'From the presentation to the materials / A shared smelling session'},
 scentDisplay:{file:'open-day-scent-display.jpg',width:1200,height:630,alt:'A young visitor exploring the Synesthesia olfactory display prototype in the Usability Lab',caption:'Synesthesia VR / Exploring scent as an interface'},
 visitors:{file:'open-day-olfactory-demo.jpg',width:1200,height:630,alt:'Two open-day visitors exploring aromatic materials and the olfactory display in the lab',caption:'Open lab demonstrations / Aromatic materials and digital control'},
 pepper:{file:'open-day-pepper-robot.jpg',width:1200,height:630,alt:'A young visitor interacting with Pepper the humanoid robot at the university open day',caption:'Pepper / A hands-on introduction to human–robot interaction'}
};

function photo(key){
 const p=photos[key];
 return `<figure><a href="/assets/${p.file}" target="_blank" rel="noopener" aria-label="Open full-size photo: ${p.alt} (opens in a new tab)"><img src="/assets/${p.file}" alt="${p.alt}" loading="lazy" width="${p.width}" height="${p.height}"></a><figcaption>${p.caption}</figcaption></figure>`;
}
function source(key){
 const ref=engagementSources[key];
 return `<a class="link" href="${ref.url}" target="_blank" rel="noopener">${ref.label} <span class="arrow" aria-hidden="true">↗</span></a>`;
}
const entries = [
 {id:'guest-lecture',role:'Guest lecture',context:'Psychology for UX Practitioners',title:'Scent, mind & interaction',photo:'lecture',summary:'A guest lecture at Hochschule Rhein-Waal exploring smell as an interaction modality through a shared scent experiment, live biometric signals and student-designed UX concepts.',action:'Explore the lecture'},
 {id:'science-cafe',role:'Public research talk',context:'Science Café · June 2025',title:'From pine forests to plant extracts',photo:'scienceTalk',summary:'Co-presenting botanical extraction research with Raphael Komanek, connecting pine-forest memories, ultrasonic-assisted extraction and a hands-on smelling session.',action:'Explore the presentation'},
 {id:'open-day',role:'Open lab demonstrations',context:'Hochschule Rhein-Waal · Usability Lab',title:'Scent, robotics & shared curiosity',photo:'scentDisplay',summary:'Welcoming visitors to explore Synesthesia VR and Pepper through hands-on demonstrations of olfactory interfaces and human–robot interaction, with coverage in Rheinische Post.',action:'Explore the demonstrations'}
];

export const engagementHomepage = `<section class="engagement-section" id="talks" aria-labelledby="talks-heading"><div class="wrap">
 <div class="section-head"><div><div class="eyebrow text-gold">Teaching & public engagement</div><h2 id="talks-heading">Research, shared.</h2></div><p class="section-aside">Guest lectures, public talks and hands-on experiences that open up the work.</p></div>
 <div class="engagement-grid">${entries.map(e=>{const p=photos[e.photo];return `<article class="engagement-card reveal"><a class="engagement-image ${e.id}" href="/talks/#${e.id}" aria-label="${e.action}: ${e.title}"><img src="/assets/${p.file}" alt="${p.alt}" loading="lazy" width="${p.width}" height="${p.height}"><span class="engagement-image-arrow" aria-hidden="true">↗</span></a><div class="engagement-copy"><div class="eyebrow text-gold">${e.role}</div><h3><a href="/talks/#${e.id}">${e.title}</a></h3><p>${e.summary}</p><div class="engagement-context">${e.context}</div><a class="link" href="/talks/#${e.id}">${e.action} <span class="arrow" aria-hidden="true">→</span></a></div></article>`;}).join('')}</div>
 <div class="work-bottom"><p>Hochschule Rhein-Waal / Classrooms, laboratories & public spaces</p><a class="link" href="/talks/">All talks & engagement <span class="arrow" aria-hidden="true">↗</span></a></div>
</div></section>`;

export const engagementPage = `<section class="gallery-hero talks-hero"><div class="wrap"><a class="back-link" href="/">← Back to home</a><div class="eyebrow text-gold">Teaching & public engagement</div><h1>Research is better<br><em>shared.</em></h1><p>Project supervision, guest lectures, public talks and open lab demonstrations connecting robotics, scent and human–computer interaction at Hochschule Rhein-Waal.</p><nav class="talks-jump" aria-label="On this page"><a href="#robotics-supervision">Project supervision <span aria-hidden="true">↓</span></a><a href="#guest-lecture">Guest lecture <span aria-hidden="true">↓</span></a><a href="#science-cafe">Science Café <span aria-hidden="true">↓</span></a><a href="#open-day">Open day & press <span aria-hidden="true">↓</span></a></nav></div></section>
<div class="wrap engagement-details">
 <article class="talk-detail" id="robotics-supervision" aria-labelledby="robotics-supervision-title">
  <div class="talk-detail-head"><div><div class="eyebrow text-gold">Project co-supervision / Industry collaboration</div><h2 id="robotics-supervision-title">Guiding robotics<br>through <em>practice.</em></h2><p class="talk-course">Computer Science + Logistics · Usability Lab</p><div class="talk-detail-copy"><p>Alongside Marius Kaul, I co-supervised an interdisciplinary student team working with the ABB IRB 1100 in collaboration with AEVTec, facilitated by TransRegINT.</p><p>The project connected robot software, computer vision and NVIDIA Isaac Sim with real hardware, user studies and cost–benefit evaluation for an industrial logistics scenario.</p><a class="link" href="/projects/industrial-robotics/">Explore the robotics project <span class="arrow" aria-hidden="true">→</span></a></div></div><div class="robotics-talk-photo">${photo('robotics')}</div></div>
 </article>
 <article class="talk-detail" id="guest-lecture" aria-labelledby="guest-lecture-title">
  <div class="talk-detail-head"><div><div class="eyebrow text-gold">Guest lecture / Hochschule Rhein-Waal</div><h2 id="guest-lecture-title">Scent, mind<br>& <em>interaction.</em></h2><p class="talk-course">Psychology for UX Practitioners</p></div><div class="talk-detail-copy"><p>In a special lecture for the Psychology for UX Practitioners course, I introduced olfaction as an interaction modality, connecting the physiology of smell with multisensory user experience.</p><p>Students shared the memories evoked by a scent, observed a live visualization of biometric signals and developed scent-integrated UX concepts for fields including smart homes, sport, meditation and online perfumery.</p><p>The session brought theory, sensory exploration and design practice into the same room.</p>${source('guestLecture')}</div></div>
  <div class="talk-photo-grid">${photo('lecture')}${photo('experiment')}</div>
 </article>
 <article class="talk-detail" id="science-cafe" aria-labelledby="science-cafe-title">
  <div class="talk-detail-head"><div><div class="eyebrow text-gold">Public research talk / June 2025</div><h2 id="science-cafe-title">Two pine forests.<br>One shared <em>curiosity.</em></h2><p class="talk-course">Science Café · Hochschule Rhein-Waal</p></div><div class="talk-detail-copy"><p>At the Science Café, <a class="inline-reference" href="https://www.linkedin.com/in/raphael-komanek-8709a827a/" target="_blank" rel="noopener">Raphael Komanek</a> and I presented our research on ultrasonic-assisted extraction of aromatic botanicals.</p><p>Our collaboration began with a shared connection to pine: Raphael’s memories of Arolla pines in Tyrol and my own of <em>Pinus roxburghii</em> in Uttarakhand. His interest in taste and flavour met my work in perfumery and digital olfaction through botanical extraction.</p><p>We discussed our experimental work and closed with a smelling session, inviting participants to connect the research with their own scent memories.</p>${source('scienceCafe')}</div></div>
  <div class="talk-photo-grid talk-photo-grid--square">${photo('scienceTalk')}${photo('scienceSession')}</div>
 </article>
 <article class="talk-detail" id="open-day" aria-labelledby="open-day-title">
  <div class="talk-detail-head"><div><div class="eyebrow text-gold">Open lab / Public engagement</div><h2 id="open-day-title">A more human<br>way into <em>STEM.</em></h2><p class="talk-course">Tag der offenen Tür · Usability Lab</p></div><div class="talk-detail-copy"><p>For the university’s open day, we welcomed visitors into the Usability Lab to explore two projects: Synesthesia VR and Pepper the humanoid robot.</p><p>With Synesthesia, visitors experienced a digitally controlled olfactory display and explored scent as an interface. Pepper offered a friendly, hands-on introduction to human–robot interaction.</p><p>These demonstrations brought engineering and sensory experience together, inviting children and adults to discover the research through interaction.</p><a class="link" href="/projects/synesthesia/">Explore Synesthesia <span class="arrow" aria-hidden="true">→</span></a></div></div>
  <div class="talk-photo-grid talk-photo-grid--three">${photo('scentDisplay')}${photo('visitors')}${photo('pepper')}</div>
  <aside class="talk-press-note" aria-labelledby="open-day-press-title"><div><div class="eyebrow text-gold">Press coverage / Rheinische Post</div><h3 id="open-day-press-title" lang="de">Wissenschaft für Kopf und Bauch</h3><p>Coverage of the university open day · <time datetime="2025-08-15">15 August 2025</time></p></div>${source('press')}</aside>
 </article>
 <div class="detail-next"><p>Explore the research behind the conversations.</p><a class="button secondary" href="/projects/">View the projects <span aria-hidden="true">↗</span></a></div>
</div>`;
