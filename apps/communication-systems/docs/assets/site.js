document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.mobile-nav');
if (toggle && navigation) {
  const close = () => { toggle.setAttribute('aria-expanded','false'); navigation.classList.remove('open'); document.body.classList.remove('menu-open'); };
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded',String(open)); navigation.classList.toggle('open',open); document.body.classList.toggle('menu-open',open); });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') {close(); toggle.focus();} });
}
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-categories]')];
const count = document.querySelector('[data-project-count]');
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filters.forEach(filter => { const active = filter === button; filter.classList.toggle('active',active); filter.setAttribute('aria-pressed',String(active)); });
  let visible = 0;
  cards.forEach(card => { const show = category === 'all' || card.dataset.categories.split(' ').includes(category); card.hidden = !show; if(show)visible++; });
  if(count)count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
}));
const motionButton = document.querySelector('.motion-toggle');
motionButton?.addEventListener('click', () => {
  const paused = document.documentElement.classList.toggle('motion-paused');
  motionButton.setAttribute('aria-pressed',String(paused));
  motionButton.textContent = paused ? 'Resume motion' : 'Pause motion';
});
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) {entry.target.classList.remove('pending');observer.unobserve(entry.target);} }), {threshold:.06});
  document.querySelectorAll('.reveal').forEach(element => { if(element.getBoundingClientRect().top > innerHeight){element.classList.add('pending');observer.observe(element);} });
}
