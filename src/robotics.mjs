const external = (label,url)=>`<a class="inline-reference" href="${url}" target="_blank" rel="noopener">${label}</a>`;
const linkedIn = 'https://www.linkedin.com/in/sc-essentia/';

export const roboticsProject = {
 id:'robotics',
 categories:'software research',
 tags:'ROBOTICS / DIGITAL TWINS / INDUSTRY COLLABORATION',
 title:'Industrial Robotics',
 text:'Co-supervising an interdisciplinary student team working with the ABB IRB 1100, ROS 2 and NVIDIA Isaac Sim to connect robotics, simulation and usability research.',
 url:'/projects/industrial-robotics/',
 action:'Explore the industry project',
 media:`<img src="/assets/industrial-robotics-team.jpg" alt="The interdisciplinary project team beside an ABB industrial robot in the Usability Lab" loading="lazy" width="1280" height="854">`
};

export const roboticsHeroOptions = {
 label:'Industry collaboration / Robotics',
 title:'From simulation to<br><em>industrial robotics.</em>',
 intro:'An interdisciplinary student project connecting industrial robotics, computer vision, simulation and usability engineering. I co-supervised the team at Hochschule Rhein-Waal, in collaboration with AEVTec and facilitated by TransRegINT.',
 meta:[['My role','Project co-supervision'],['Team','Computer Science + Logistics'],['Platform','ABB IRB 1100 · ROS 2 · NVIDIA Isaac Sim']]
};

export const roboticsBody = `<div class="wrap">
 <figure class="detail-wide robotics-team-photo"><a href="/assets/industrial-robotics-team.jpg" target="_blank" rel="noopener" aria-label="Open the full-size robotics project team photo (opens in a new tab)"><img src="/assets/industrial-robotics-team.jpg" alt="The robotics project team in the Usability Lab, with the ABB robot and laboratory equipment" width="1280" height="854"></a><figcaption><span>Interdisciplinary robotics project / Hochschule Rhein-Waal</span><span>Photo: Andrea Polk</span></figcaption></figure>
 <div class="detail-body">
  <section class="detail-section"><h2>My role</h2><div><p>I co-supervised an interdisciplinary team of Computer Science and Logistics students alongside ${external('Marius Kaul','https://www.linkedin.com/in/marius-kaul-402433397/')}. The project brought laboratory teaching together with an industrial logistics scenario, using the ABB IRB 1100 platform provided through the collaboration with AEVTec.</p><p>The students developed the robotics solution. Our supervision supported a project that connected hardware, robot software, simulation and evaluation in an industrial context.</p><a class="link" href="/talks/#robotics-supervision">Explore my teaching & supervision <span class="arrow" aria-hidden="true">→</span></a></div></section>
  <section class="detail-section"><h2>From virtual to physical</h2><div><p>The team connected physics-based simulation in NVIDIA Isaac Sim with ROS 2 and real hardware. This brought development and validation into the same workflow as the physical robot and its logistics task.</p><div class="flow"><div><small>01 / PROTOTYPE</small><strong>Physical systems</strong><p>The ABB IRB 1100, 3D printing and hardware prototyping.</p></div><div><small>02 / DEVELOP</small><strong>Robot & simulation</strong><p>A ROS 2–based robot stack connected to NVIDIA Isaac Sim.</p></div><div><small>03 / EVALUATE</small><strong>Industrial context</strong><p>Perception, user studies and cost–benefit analysis for automation.</p></div></div></div></section>
  <section class="detail-section"><h2>The technical scope</h2><div><p>The project gave the student team hands-on experience across several connected areas:</p><ul class="robotics-scope"><li>3D printing and hardware prototyping.</li><li>ROS 2–based robot stack development.</li><li>High-fidelity simulation with NVIDIA Isaac Sim (Omniverse) connected to ROS 2.</li><li>Depth sensing and point cloud mapping.</li><li>Navigation, perception and manipulation pipelines.</li><li>User studies and cost–benefit analysis for automation.</li></ul><p>Combining Computer Science and Logistics placed engineering decisions alongside the practical and human considerations of introducing automation.</p></div></section>
  <section class="detail-section"><h2>A shared effort</h2><div><p>${external('AEVTec – Automation Engineering Vision GmbH','https://www.linkedin.com/company/aevtec-gmbh/')} provided the platform and industry expertise through ${external('Jörg Kolbe','https://www.linkedin.com/in/j%C3%B6rg-kolbe-industrieautomation/')}.</p><p>The cooperation was facilitated by ${external('TransRegINT','https://www.linkedin.com/showcase/transregint/')} at Hochschule Rhein-Waal, with support from ${external('René König','https://www.linkedin.com/in/ren%C3%A9-k%C3%B6nig-536507197/en/')} and ${external('Miriam Drazek','https://www.linkedin.com/in/miriamdrazek/')}.</p><p>At the Usability Lab, ${external('Prof. Dr. Kai Essig','https://www.linkedin.com/in/kai-essig-0b931989/')} provided the multidisciplinary research setting, and Marius Kaul contributed his robotics expertise as co-supervisor.</p><p>The group photograph is by Andrea Polk.</p></div></section>
  <div class="detail-next"><p>Connect research with an industrial challenge.</p><a class="button secondary" href="${linkedIn}" target="_blank" rel="noopener">Discuss a collaboration <span aria-hidden="true">↗</span></a></div>
 </div>
</div>`;
